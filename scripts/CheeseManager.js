const Scene = require('Scene');
const Patches = require('Patches');
const Reactive = require('Reactive');
import { isAlive, hasGameStarted } from './GameManager';

export const Diagnostics = require('Diagnostics');


export function cheese1() {
  let c = Math.random();
  // if (c > 0.5) {
      Patches.inputs.setPulse('runCheeseG1', Reactive.once());
  // }
}

export function cheese2() {

}

export function cheeseStart() {
    cheese1();
    cheese2();
}

(async function () {

})();
