import { Vector2 } from 'contro/dist/utils/math';
// @ts-ignore
import Vector from 'vectory';
import { IControl } from './lib/input/interfaces';
import { Gamepad } from './lib/input/inputs/gamepad';

interface Controls {
  leftStick: (gamepad: Gamepad) => IControl<Vector2>;
  rightStick: (gamepad: Gamepad) => IControl<Vector2>;
}

class Player {
  public readonly controls: Controls;
  public direction = new Vector(1, 0);
  public pos = new Vector(canvas.width / 2, canvas.height / 2);

  constructor(
    public readonly gamepad: Gamepad,
    public readonly sprite: HTMLImageElement,
  ) {
    this.controls = {
      leftStick: Gamepad.stick('left'),
      rightStick: Gamepad.stick('right'),
    };
  }
}

let players: Player[] = [];
let playersToAdd: Player[] = [];
let playersToRemove: Player[] = [];

const DEG_TO_RAD = Math.PI / 180;

const canvas = document.createElement('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

(document.querySelector('#container') as Element).appendChild(canvas);

const radius = 10;
const fillStyle = '#fff';

let dt = 0;
let last = performance.now();

const bufferCanvas = document.createElement('canvas');
bufferCanvas.width = 32;
bufferCanvas.height = 32;
const buffer = bufferCanvas.getContext('2d') as CanvasRenderingContext2D;

buffer.save();
buffer.translate(bufferCanvas.width / 2, bufferCanvas.height / 2);
buffer.rotate(0 - Math.PI / 4);
buffer.fillStyle = 'green';
buffer.fillRect(0, 0, radius, radius);
buffer.restore();

buffer.save();
buffer.translate(bufferCanvas.width / 2, bufferCanvas.height / 2);
buffer.rotate(0 - Math.PI / 4 + (Math.PI * 2) / 3);
buffer.fillStyle = fillStyle;
buffer.fillRect(0, 0, radius, radius);
buffer.restore();

buffer.save();
buffer.translate(bufferCanvas.width / 2, bufferCanvas.height / 2);
buffer.rotate(0 - Math.PI / 4 - (Math.PI * 2) / 3);
buffer.fillStyle = fillStyle;
buffer.fillRect(0, 0, radius, radius);
buffer.restore();

buffer.beginPath();
buffer.arc(
  bufferCanvas.width / 2,
  bufferCanvas.height / 2,
  radius - 3,
  0,
  Math.PI * 2,
  false,
);
buffer.fillStyle = fillStyle;
buffer.fill();

const img = new Image();
img.src = bufferCanvas.toDataURL();

globalThis.addEventListener('gamepadconnected', ((event: GamepadEvent) => {
  if (event.gamepad.mapping !== 'standard') {
    console.warn('Gamepad has a nonstandard mapping');
  }
  console.log(event.gamepad);

  playersToAdd.push(new Player(new Gamepad(event.gamepad, navigator), img));
}) as EventListener);

globalThis.addEventListener('gamepaddisconnected', ((event: GamepadEvent) => {
  console.log(event.gamepad);

  playersToRemove.push(
    players.find(
      player => player.gamepad.gamepadIndex === event.gamepad.index,
    )!,
  );
}) as EventListener);

function frame(hrt: DOMHighResTimeStamp) {
  dt = (hrt - last) / 1000;

  requestAnimationFrame(frame);

  while (playersToAdd.length > 0) {
    players.push(playersToAdd.pop()!);
  }

  while (playersToRemove.length > 0) {
    const playerToRemove = playersToRemove.pop()!;

    players = players.filter(
      player =>
        player.gamepad.gamepadIndex !== playerToRemove.gamepad.gamepadIndex,
    );
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const player of players) {
    if (player.gamepad.connected) {
      const leftstick = player.controls.leftStick(player.gamepad).query();
      const rightstick = player.controls.rightStick(player.gamepad).query();

      const deadzone = 0.3;

      if (leftstick.y <= -0.5 && leftstick.y >= -1) {
        player.pos = player.pos.add(player.direction.mul(300 * dt));
      }

      if (Math.abs(rightstick.x) >= deadzone) {
        if (Math.sign(rightstick.x) === 1) {
          player.direction = player.direction.rotate(180 * dt * DEG_TO_RAD);
        } else if (Math.sign(rightstick.x) === -1) {
          player.direction = player.direction.rotate(-180 * dt * DEG_TO_RAD);
        }
      }
    }

    ctx.translate(player.pos.x, player.pos.y);

    ctx.rotate(Vector.angleOf(player.direction));

    ctx.drawImage(
      player.sprite,
      -(bufferCanvas.width / 2),
      -(bufferCanvas.height / 2),
    );

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  last = hrt;
}

requestAnimationFrame(frame);
