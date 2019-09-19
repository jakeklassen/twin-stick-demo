import { Keyboard, Gamepad } from 'contro';
// @ts-ignore
import Vector from 'vectory';

const DEG_TO_RAD = Math.PI / 180;

const keyboard = new Keyboard();
const gamepad = new Gamepad();

const controls = {
  forward: keyboard.key('W'),
  left: keyboard.key('Left'),
  right: keyboard.key('Right'),
  // leftStick: gamepad.stick('left'),
  // rightStick: gamepad.stick('right'),
};

const canvas = document.createElement('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

(document.querySelector('#container') as Element).appendChild(canvas);

const radius = 10;
const fillStyle = '#fff';
const x = canvas.width / 2;
const y = canvas.height / 2;
// let direction = 0;
let direction = new Vector(1, 0);
let pos = new Vector(canvas.width / 2, canvas.height / 2);

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

function frame(hrt: DOMHighResTimeStamp) {
  requestAnimationFrame(frame);

  dt = (hrt - last) / 1000;

  if (gamepad.isConnected()) {
    const leftstick = gamepad.stick('left').query();
    const rightstick = gamepad.stick('right').query();

    const deadzone = 0.3;

    if (leftstick.y <= -0.5 && leftstick.y >= -1) {
      pos = pos.add(direction.mul(300 * dt));
    }

    if (Math.abs(rightstick.x) >= deadzone) {
      if (Math.sign(rightstick.x) === 1) {
        direction = direction.rotate(180 * dt * DEG_TO_RAD);
      } else if (Math.sign(rightstick.x) === -1) {
        direction = direction.rotate(-180 * dt * DEG_TO_RAD);
      }
    }
  } else if (controls.forward.query()) {
    pos = pos.add(direction.mul(300 * dt));
  }

  if (controls.right.query()) {
    direction = direction.rotate(180 * dt * DEG_TO_RAD);
  } else if (controls.left.query()) {
    direction = direction.rotate(-180 * dt * DEG_TO_RAD);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(pos.x, pos.y);

  ctx.rotate(Vector.angleOf(direction));

  ctx.drawImage(
    bufferCanvas,
    -(bufferCanvas.width / 2),
    -(bufferCanvas.height / 2),
  );

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  last = hrt;
}

requestAnimationFrame(frame);
