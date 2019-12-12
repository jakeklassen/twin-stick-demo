globalThis.addEventListener('gamepadconnected', ((event: GamepadEvent) => {
  if (event.gamepad.mapping !== 'standard') {
    console.warn('Gamepad has a nonstandard mapping');
  }

  console.log(event.gamepad);
  console.log(navigator.getGamepads());
}) as EventListener);

globalThis.addEventListener('gamepaddisconnected', ((event: GamepadEvent) => {
  console.log(event.gamepad);
  console.log(navigator.getGamepads());
}) as EventListener);
