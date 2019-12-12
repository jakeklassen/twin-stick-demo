// tslint:disable: object-literal-key-quotes

/**
 * A map of all the supported key values (property names) and their respective
 * aliases (property values)  that can be used with the `Keyboard` class. The
 * first alias for each key value will be used as a label.
 */
export const KeyMap: { [value: string]: string[] } = {
  ' ': ['Space', 'Spacebar', 'Space Bar'],
  AltGraph: ['Alt Gr'],
  ArrowDown: ['Down'],
  ArrowLeft: ['Left'],
  ArrowRight: ['Right'],
  ArrowUp: ['Up'],
  Backspace: ['Backspace'],
  Control: ['Ctrl', 'Ctl'],
  Delete: ['Delete', 'Del'],
  Enter: ['Enter', 'Return'],
  Escape: ['Escape', 'Esc'],
  Insert: ['Insert', 'Ins'],
  PageDown: ['Page Down', 'PgDown'],
  PageUp: ['Page Up', 'PgUp'],
  Tab: ['Tab'],
};

export function findKeyValue(keyString: string): string {
  if (keyString.length === 1) {
    return keyString.toLowerCase();
  }

  Object.keys(KeyMap).forEach(keyValue => {
    KeyMap[keyValue].forEach(key => {
      if (keyString.toLowerCase() === key.toLowerCase()) {
        keyString = keyValue;
      }
    });
  });

  return keyString;
}

export function getKeyLabel(key: string): string {
  return key in KeyMap
    ? KeyMap[key][0]
    : key.length === 1
    ? key.toUpperCase()
    : key;
}
