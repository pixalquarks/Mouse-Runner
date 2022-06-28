import S from 'Scene';
import R from 'Reactive';
import D from 'Diagnostics';
import Time from 'Time';

import FaceTracking from 'FaceTracking';
import FaceGesture from 'FaceGestures';

import { obstacleAnimation } from './ObstacleManager';
import { cheeseAnimation } from './CheeseManager';
import { charMaterialManager } from './script';
import { score } from './Score';
import { audioPlayback } from './AudioPlaybackController';

export let hasStarted = R.val(false);
export let isAlive = R.val(true);

let onCheeseHitDelay = 100;
let canCheeseHit = true;

let obstacleStartDelay = 4000;
let cheeseStartDelay = 1000;

async function main() {
    const [character, face, startTip] = await Promise.all([
        S.root.findFirst("Character"),
        FaceTracking.face(0),
        S.root.findFirst("StartTip")
    ]);
    FaceGesture.onBlink(face).subscribe(() => {
        if (hasStarted.pinLastValue()) return;
        Time.setTimeout(() => {
            obstacleAnimation.animate();
        }, obstacleStartDelay);
        Time.setTimeout(() => {
            cheeseAnimation.animate();
        }, cheeseStartDelay);

        charMaterialManager.start();
        score.StartScoreIncrement();
        hasStarted = R.val(true);
        startTip.hidden = R.val(true);
        audioPlayback.BackgroundPlay(true);
    });

}

export function onObstacleHit() {
    isAlive = R.val(false);
    obstacleAnimation.stop();
    cheeseAnimation.stop();
    score.StopScoreIncrement();
    charMaterialManager.onCharacterHitObstacle();
    audioPlayback.PlayTrapHit();
    audioPlayback.BackgroundPlay(false);
}

export function onCheeseHit(hitObj : SceneObjectBase) {
    if (!canCheeseHit) return;
    canCheeseHit = false;
    Time.setTimeout(() => {
        canCheeseHit = true;
    }, onCheeseHitDelay);
    hitObj.hidden = R.val(true);
    hitObj.transform.x = R.val(1);
    const name = cheeseAnimation.getProductName(hitObj);
    charMaterialManager.onCheeseHit(name);
    score.OnCheeseHit();
    audioPlayback.PlayCheeseBite();
}

main();