const Scene = require('Scene');
const Patches = require('Patches');
const Material = require('Materials');
const Reactive = require('Reactive');

export const Diagnostics = require('Diagnostics');
export let isAlive = true;
export let hasGameStarted = false;

export function MakeDead() {
  isAlive = false;
  Diagnostics.log("Death");
}

(async function () {

  const character = await Scene.root.findFirst('character');
  const characterRunGround = await Material.findFirst('CharacterRunGround');
  const startTheGame = await Patches.outputs.getPulse('startTheGame');
  // const onGameStart = startTheGame.monitor();

  startTheGame.subscribe(function(event, snapshot) {
    Diagnostics.log("Starting The Game");
    character.material = characterRunGround;
    isAlive = true;
    hasGameStarted = true;
    Patches.inputs.setBoolean('isGameRunning', hasGameStarted);
    Patches.inputs.setPulse('mouseJump', Reactive.once());
  })

})();
