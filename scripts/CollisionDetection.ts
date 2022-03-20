import S from 'Scene';
import R from 'Reactive';
import { onObstacleHit, onCheeseHit } from './GameManager';
import Time from 'Time';

let colliders = [];
let cheeseColliders = [];
const Collider = 'ObjectCollider';
const CheeseCollider = 'CheeseCollider';
let detectCollision = true;
let detectCheeseCollision = true;
let cheeseCollisionDelay = 100;
let nextCollisionDetectionDelay = 10;
let canCollide = true;

function GetCollisionThreshold(obj1 : SceneObjectBase, obj2 : SceneObjectBase) {
    let scale1 = obj1.transform.scaleX;
    let scale2 = obj2.transform.scaleX;
    return scale1.add(scale2).div(2).mul(0.1);
}

function resetCollision() {
    canCollide = true;
}

async function main() {
    colliders = await S.root.findAll(Collider);
    cheeseColliders = await S.root.findAll(CheeseCollider);
    const character = await S.root.findFirst('Character');
    colliders.forEach(collider => {
        let x = collider.worldTransform.x.monitor();
        x.subscribe(() => {
            let lastVal = collider.worldTransform.x.pinLastValue();
            let dif = Math.abs(lastVal - character.worldTransform.x.pinLastValue());
            let side = collider.worldTransform.y.mul(character.worldTransform.y).ge(0).pinLastValue();
            if (dif < GetCollisionThreshold(collider, character).pinLastValue() && side && detectCollision) {
                onObstacleHit();
            }
        });
    cheeseColliders.forEach(collider => {
        let x = collider.worldTransform.x.monitor();
        x.subscribe(() => {
            let lastVal = collider.worldTransform.x.pinLastValue();
            let dif = Math.abs(lastVal - character.worldTransform.x.pinLastValue());
            let side = collider.worldTransform.y.mul(character.worldTransform.y).ge(0).pinLastValue();
            let hasCollided = dif < GetCollisionThreshold(collider, character).pinLastValue() && side;
            if (hasCollided && detectCheeseCollision && canCollide) {
                canCollide = false;
                collider.getParent()
                .then(parent => {
                    parent.transform.x = R.val(1);
                    onCheeseHit(parent);
                })
                Time.setTimeout(resetCollision, cheeseCollisionDelay);
            }
        });
    })
});
}

main();