import { IControl } from '../interfaces';

export function and(...controls: Array<IControl<boolean>>): IControl<boolean> {
  if (controls.length < 2) {
    throw new Error('Less than two controls specified!');
  }

  return {
    label: controls.map(control => control.label).join(' + '),

    query() {
      for (const control of controls) {
        if (!control.query()) {
          return false;
        }
      }

      return true;
    },
  };
}
