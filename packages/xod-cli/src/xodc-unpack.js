// unpack <xodball> <workspace>   Unpack xodball into new project directory in the workspace

import path from 'path';
import { loadProject, saveProjectEntirely } from 'xod-fs';
import { setProjectName } from 'xod-project';
import * as msg from './messageUtils';

export default (xodball, dist) => {
  const xodballPath = path.resolve(xodball);
  const newProjectName = path.basename(dist);
  const distPath = path.resolve(dist, '..');

  msg.notice(`Unpacking ${xodballPath}`);
  msg.notice(`into ${distPath} ...`);

  loadProject([], xodballPath)
    .then(setProjectName(newProjectName))
    .then(saveProjectEntirely(distPath))
    .then(() => {
      msg.success('Done!');
      process.exit(0);
    })
    .catch((err) => {
      msg.error(err);
      process.exit(1);
    });
};
