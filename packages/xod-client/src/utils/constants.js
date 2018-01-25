export const COMMAND = {
  DELETE_SELECTION: 'deleteSelection',

  DESELECT: 'deselect',

  NEW_PROJECT: 'newProject',
  OPEN_PROJECT: 'openProject',
  RENAME_PROJECT: 'renameProject',

  HIDE_HELPBOX: 'hideHelpbox',
  TOGGLE_HELP: 'toggleHelp',
  TOGGLE_DEBUGGER: 'toggleDebugger',

  PAN_TO_ORIGIN: 'panToOrigin',
  PAN_TO_CENTER: 'panToCenter',

  ADD_PATCH: 'addPatch',
  RENAME: 'rename',
  DELETE: 'delete',

  UNDO: 'undo',
  REDO: 'redo',

  CUT: 'cut',
  COPY: 'copy',
  PASTE: 'paste',
  SELECT_ALL: 'selectall',

  SAVE_ALL: 'saveAll',

  INSERT_NODE: 'insertNode',
};

export const HOTKEY = {
  [COMMAND.DELETE_SELECTION]: ['del', 'backspace'],

  [COMMAND.DESELECT]: 'escape',
  [COMMAND.SELECT_ALL]: ['ctrl+a', 'command+a'],

  [COMMAND.UNDO]: 'ctrl+z',
  [COMMAND.REDO]: ['ctrl+y', 'ctrl+shift+z'],

  [COMMAND.NEW_PROJECT]: 'ctrl+shift+n',
  [COMMAND.RENAME_PROJECT]: 'ctrl+shift+r',

  [COMMAND.ADD_PATCH]: 'ctrl+n',
  [COMMAND.RENAME]: 'ctrl+r',
  [COMMAND.DELETE]: ['ctrl+del', 'ctrl+backspace'],

  [COMMAND.SAVE_ALL]: ['ctrl+s'],

  [COMMAND.HIDE_HELPBOX]: 'escape',
  [COMMAND.TOGGLE_HELP]: ['h'],
  [COMMAND.TOGGLE_DEBUGGER]: ['ctrl+shift+u'],
  [COMMAND.INSERT_NODE]: ['i'],

  [COMMAND.PAN_TO_ORIGIN]: ['home'],
  [COMMAND.PAN_TO_CENTER]: ['ctrl+home', 'command+home'],
};

export const ELECTRON_ACCELERATOR = {
  [COMMAND.DELETE_SELECTION]: 'Backspace',

  [COMMAND.DESELECT]: 'Escape',

  [COMMAND.UNDO]: 'CmdOrCtrl+Z',
  [COMMAND.REDO]: 'CmdOrCtrl+Shift+Z',

  [COMMAND.NEW_PROJECT]: 'CmdOrCtrl+Shift+N',
  [COMMAND.OPEN_PROJECT]: 'CmdOrCtrl+O',
  [COMMAND.RENAME_PROJECT]: 'CmdOrCtrl+Shift+R',

  [COMMAND.ADD_PATCH]: 'CmdOrCtrl+N',
  [COMMAND.RENAME]: 'CmdOrCtrl+R',
  [COMMAND.DELETE]: 'CmdOrCtrl+Backspace',

  [COMMAND.CUT]: 'CmdOrCtrl+X',
  [COMMAND.COPY]: 'CmdOrCtrl+C',
  [COMMAND.PASTE]: 'CmdOrCtrl+V',
  [COMMAND.SELECT_ALL]: 'CmdOrCtrl+A',

  [COMMAND.SAVE_ALL]: 'CmdOrCtrl+S',

  [COMMAND.HIDE_HELPBOX]: 'Escape',
  [COMMAND.TOGGLE_DEBUGGER]: 'CmdOrCtrl+Shift+U',

  [COMMAND.PAN_TO_ORIGIN]: 'Home',
  [COMMAND.PAN_TO_CENTER]: 'CmdOrCtrl+Home',
};

export const KEYCODE = {
  UP: 38,
  DOWN: 40,
  DELETE: 46,
  BACKSPACE: 8,
  ESCAPE: 27,
  ENTER: 13,
  DOT: 190,
  COMMA: 188,
  N: 78,
  Z: 90,
  Y: 89,
  R: 82,
};

export const STATUS = {
  STARTED: 'started',
  PROGRESSED: 'progressed',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  DELETED: 'deleted',
};
