export interface IGamepadButton {
  pressed: boolean;
}

export enum GamepadMappingType {
  Standard = 'standard',
  Unknown = '',
  '' = '',
}

/**
 * [Gamepad Spec](https://w3c.github.io/gamepad/#gamepad-interface)
 */
export interface IGamepad {
  /**
   * An identification string for the gamepad. This string identifies the brand or style of connected gamepad device.
   * Typically, this will include the USB vendor and a product ID.
   */
  readonly id: string;

  /**
   * Index of the gamepad in the Navigator. Zero based.
   */
  readonly index: number;

  readonly connected: boolean;

  /**
   * Last time the data for this gamepad was updated.
   */
  readonly timestamp: number;

  /**
   * [mapping attribute](https://w3c.github.io/gamepad/#dom-gamepad-mapping)
   */
  readonly mapping: string;

  /**
   * [axes attribute](https://w3c.github.io/gamepad/#dom-gamepad-axes)
   *
   * Array of values for all axes of the gamepad. Axis values are lineraly normalized to the range
   * [-1.0 .. 1.0].
   */
  readonly axes: ReadonlyArray<number>;

  /**
   * Array of button states for all buttons of the gamepad.
   */
  readonly buttons: ReadonlyArray<IGamepadButton>;
}

export interface IControl<T> {
  label: string;

  fromGamepad?: boolean;

  query(): T;

  /* Required for utility function in `or.spec.ts` to work. */
  [key: string]: any;
}
