import { IControl, IGamepad } from '../interfaces';
import { findButtonNumber, getButtonLabel } from '../maps/gamepad';
import { Vector2 } from '../math/vector2';

export interface IGamepadStick {
  label: string;
  xAxis: number;
  yAxis: number;
}

const GamepadSticks: { [id: string]: IGamepadStick } = {
  left: { label: 'Left stick', xAxis: 0, yAxis: 1 },
  right: { label: 'Right stick', xAxis: 2, yAxis: 3 },
};

export enum ButtonType {
  Standard,
  Trigger,
}

export class Gamepad {
  public static button(
    button: string | number,
    trigger: ButtonType = ButtonType.Trigger,
  ): (gamepad: Gamepad) => IControl<boolean> {
    const buttonNumber = findButtonNumber(button);

    return (gamepad: Gamepad) => ({
      label: getButtonLabel(buttonNumber),
      fromGamepad: true,

      query() {
        if (!gamepad.connected) {
          return false;
        }

        if (trigger === ButtonType.Trigger) {
          if (gamepad.latestState.buttons[buttonNumber].pressed) {
            if (!gamepad.pressedButtons.has(buttonNumber)) {
              gamepad.pressedButtons.add(buttonNumber);

              return true;
            }
          } else {
            gamepad.pressedButtons.delete(buttonNumber);
          }

          return false;
        } else {
          return gamepad.latestState.buttons[buttonNumber].pressed;
        }
      },
    });
  }

  public static stick(
    stick: string | IGamepadStick,
  ): (gamepad: Gamepad) => IControl<Vector2> {
    let gpStick: IGamepadStick;

    if (typeof stick === 'string') {
      if (stick in GamepadSticks) {
        gpStick = GamepadSticks[stick];
      } else {
        throw new Error(`Gamepad stick "${stick}" not found!`);
      }
    } else {
      gpStick = stick;
    }

    return (gamepad: Gamepad) => ({
      label: gpStick.label,

      query() {
        return new Vector2(
          gamepad.latestState.axes[gpStick.xAxis],
          gamepad.latestState.axes[gpStick.yAxis],
        );
      },
    });
  }

  private navigator: Navigator;
  private native: IGamepad;
  private pressedButtons: Set<number> = new Set();
  private gamepadTimestamp = 0;
  public readonly gamepadIndex: number;

  constructor(gamepad: IGamepad, navigator: Navigator) {
    this.native = gamepad;
    this.navigator = navigator;
    this.gamepadIndex = gamepad.index;
  }

  public get latestState(): globalThis.Gamepad {
    const gamepad = this.navigator.getGamepads()[this.native.index];

    if (gamepad == null) {
      throw new Error(`Gamepad: ${this.native.id} not found!`);
    }

    this.gamepadTimestamp = gamepad.timestamp;

    return gamepad;
  }

  public get connected() {
    return this.latestState.connected;
  }
}
