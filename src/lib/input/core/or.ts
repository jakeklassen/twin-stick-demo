import { IControl } from '../interfaces';

export function or(...controls: Array<IControl<any>>): IControl<any> {
  if (controls.length < 2) {
    throw new Error('Less than two controls specified!');
  }

  return {
    get label() {
      return 'Not implemented';
    },

    query() {
      let sampleQueryValue;
      for (const control of controls) {
        const queryValue = control.query();
        sampleQueryValue = queryValue;

        if (queryValue) {
          return queryValue;
        }
      }

      if (typeof sampleQueryValue === 'boolean') {
        return false;
      }
    },
  };
}
