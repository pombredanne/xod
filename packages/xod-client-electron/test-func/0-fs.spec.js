import R from 'ramda';
import fse from 'fs-extra';
import { assert } from 'chai';

import prepareSuite from './prepare';

import { TRIGGER_MAIN_MENU_ITEM } from '../src/testUtils/triggerMainMenu';

// :: PatchFileContents -> [NodeType]
const extractListOfUsedNodeTypes = R.compose(
  R.pluck('type'),
  R.prop('nodes')
);

describe('Test FS things', () => {
  const ide = prepareSuite();

  it('IDE loaded and rendered', () => ide.page.rendered());

  describe('Add library in the IDE', () => {
    it('opens an "Add Library" suggester', () =>
      ide.app.electron.ipcRenderer.emit(TRIGGER_MAIN_MENU_ITEM, ['File', 'Add Library...'])
        .then(() => ide.page.assertLibSuggesterShown())
    );

    it('searches for nonexistent library', () =>
      ide.page.findLibSuggester().setValue('input', 'xod/nonexisting-library')
        .then(ide.page.assertLibsNotFound)
    );

    it('searches for existing library', () =>
      ide.page.findLibSuggester().setValue('input', 'xod/core@0.11.0')
        .then(ide.page.assertLibraryFound)
    );

    it('double clicks on found library to install', () =>
      ide.page.installLibrary()
        .then(() => Promise.all([
          ide.page.assertLibSuggesterHidden(),
          ide.page.assertProjectBrowserHasInstallingLib('xod/core'),
        ]))
    );

    it('checks that installed xod/core have not `concat-4` node', () =>
      ide.page.waitUntilLibraryInstalled()
        .then(() => ide.page.expandPatchGroup('xod/core'))
        .then(() => ide.page.assertNodeUnavailableInProjectBrowser('concat-4'))
    );

    it('checks that library installed on the FS', () =>
      assert.eventually.isTrue(
        fse.pathExists(ide.libPath('xod/core'))
      )
    );

    it('checks that library is on version 0.11.0', () =>
      assert.eventually.equal(
        fse.readJSON(ide.libPath('xod/core', 'project.xod'))
        .then(proj => proj.version),
        '0.11.0'
      )
    );
  });

  describe('Save all (project and libraries)', () => {
    let userCustomFileInLibPath;
    let userCustomFileInProject;

    before(() => {
      userCustomFileInLibPath = ide.libPath('xod/core/add/accounting.txt');
      userCustomFileInProject = ide.wsPath('welcome-to-xod/02-deploy/note.txt');
    });

    // Prepare local project changes
    it('create new empty patch', () =>
      ide.page.clickAddPatch()
        .then(() => ide.page.findPopup().setValue('input', 'my-patch'))
        .then(() => ide.page.confirmPopup())
        .then(() => ide.page.assertActiveTabHasTitle('my-patch'))
    );

    it('delete another patch (`01-hello`)', () =>
      ide.page.expandPatchGroup('welcome-to-xod')
        .then(() => ide.page.deletePatch('01-hello'))
        .then(() => ide.page.assertNodeUnavailableInProjectBrowser('01-hello'))
    );

    it('modify another patch (`04-pwm`)', () =>
      ide.page.expandPatchGroup('welcome-to-xod')
        .then(() => ide.page.scrollToPatchInProjectBrowser('04-pwm'))
        .then(() => ide.page.openPatchFromProjectBrowser('04-pwm'))
        .then(() => ide.page.expandPatchGroup('xod/patch-nodes'))
        .then(() => ide.page.scrollToPatchInProjectBrowser('input-string'))
        .then(() => ide.page.selectPatchInProjectBrowser('input-string'))
        .then(() => ide.page.clickAddNodeButton('input-string'))
        .then(() => ide.page.expandPatchGroup('xod/patch-nodes'))
    );

    it('put user file to the patch directory of the project', () =>
      fse.writeFile(
        userCustomFileInProject,
        'My awesome note, that should not been deleted on project save!',
        'utf8'
      )
    );

    // Prepare changes for already saved library (by installing lib)
    it('open library patch `xod/core/clock`', () =>
      ide.page.expandPatchGroup('xod/core')
        .then(() => ide.page.scrollToPatchInProjectBrowser('clock'))
        .then(() => ide.page.openPatchFromProjectBrowser('clock'))
        .then(() => ide.page.assertActiveTabHasTitle('clock'))
    );

    it('add terminal node into patch of already saved library', () =>
      ide.page.expandPatchGroup('xod/patch-nodes')
        .then(() => ide.page.scrollToPatchInProjectBrowser('input-string'))
        .then(() => ide.page.selectPatchInProjectBrowser('input-string'))
        .then(() => ide.page.clickAddNodeButton('input-string'))
        .then(() => assert.eventually.isTrue(
          ide.page.findNode('input-string').isVisible()
        ))
    );

    it('put user file to the patch directory of already saved library', () =>
      fse.writeFile(
        userCustomFileInLibPath,
        'Better keep your accounting in safe place, dude',
        'utf8'
      )
    );

    // Prepare changes for unsaved library (bundled)
    it('add terminal node into patch of not saved yet library', () =>
      ide.page.expandPatchGroup('xod/units')
        .then(() => ide.page.assertPatchGroupExpanded('xod/units'))
        .then(() => ide.page.scrollToPatchInProjectBrowser('c-to-f'))
        .then(() => ide.page.openPatchFromProjectBrowser('c-to-f'))
        .then(() => ide.page.assertActiveTabHasTitle('c-to-f'))
        .then(() => ide.page.expandPatchGroup('xod/patch-nodes'))
        .then(() => ide.page.assertPatchGroupExpanded('xod/patch-nodes'))
        .then(() => ide.page.scrollToPatchInProjectBrowser('input-string'))
        .then(() => ide.page.selectPatchInProjectBrowser('input-string'))
        .then(() => ide.page.clickAddNodeButton('input-string'))
        .then(() => assert.eventually.isTrue(
          ide.page.findNode('input-string').isVisible()
        ))
    );

    // Calling Save Project and check all cases...
    it('call Save All', () =>
      ide.app.electron.ipcRenderer.emit(TRIGGER_MAIN_MENU_ITEM, ['File', 'Save All'])
        .then(ide.page.waitUntilProjectSaved)
    );

    it('checks that saved only changes in the local project', () => Promise.all([
      assert.eventually.isTrue(
        fse.pathExists(ide.wsPath('welcome-to-xod/my-patch/patch.xodp')),
        'Expected to `my-patch` be saved in the `welcome-to-xod` project, actually did not.'
      ),
      assert.eventually.isTrue(
        fse.pathExists(userCustomFileInProject),
        'Expected to keep user file in the patch, that was not changed.'
      ),
    ]));

    it('checks that saved only changed in the already saved library', () => Promise.all([
      assert.eventually.sameMembers(
        fse.readJson(ide.libPath('xod/core/clock/patch.xodp'))
          .then(extractListOfUsedNodeTypes),
        [
          'xod/patch-nodes/input-number',
          'xod/patch-nodes/input-pulse',
          'xod/patch-nodes/not-implemented-in-xod',
          'xod/patch-nodes/output-pulse',
          'xod/patch-nodes/input-string', // new one
        ],
        'Expected to find edited `xod/core/clock`.'
      ),
      assert.eventually.isTrue(
        fse.pathExists(userCustomFileInLibPath),
        'Expected to keep accounting.txt in the same place, actually it was deleted.'
      ),
    ]));

    it('checks that saved entire library, cause it has changes but it haven\'t been saved yet', () => Promise.all([
      assert.eventually.sameMembers(
        fse.readJson(ide.libPath('xod/units/c-to-f/patch.xodp'))
          .then(extractListOfUsedNodeTypes),
        [
          'xod/patch-nodes/input-number',
          'xod/core/map-range',
          'xod/patch-nodes/output-number',
          'xod/patch-nodes/input-string', // new one
        ],
        'Expected to find edited `xod/units/c-to-f`.'
      ),
      assert.eventually.isTrue(
        fse.pathExists(ide.libPath('xod/units/project.xod')),
        'Expected to save entire library.'
      ),
    ]));
  });
});
