import { Gamepad } from './lib/input/inputs/gamepad';

const controls = {
  jump: Gamepad.button('A', true),
};

let gamepads: Gamepad[] = [];

globalThis.addEventListener('gamepadconnected', ((event: GamepadEvent) => {
  if (event.gamepad.mapping !== 'standard') {
    console.warn('Gamepad has a nonstandard mapping');
  }

  console.log(event.gamepad);

  gamepads.push(new Gamepad(event.gamepad, navigator));
}) as EventListener);

globalThis.addEventListener('gamepaddisconnected', ((event: GamepadEvent) => {
  console.log(event.gamepad);
}) as EventListener);

function frame() {
  requestAnimationFrame(frame);

  for (const gamepad of gamepads) {
    if (controls.jump(gamepad).query()) {
      console.log('jump');
    }
  }
}

requestAnimationFrame(frame);
