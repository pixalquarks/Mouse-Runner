import S from 'Scene';
import R from 'Reactive';
import Random from 'Random';
import Animation from 'Animation';

const GasEmitterGround = 'GasEmitterGround';
const GasEmitterCeil = 'GasEmitterCeil';


const AnimPos = {
    start: 0.2,
    end: -0.2
}

const Duration = 3;
let duration = Duration;
const speedUpFactor = 0.95;
const minDuration = 0.8;

class ObstacleAnimation {
    timeDriver: TimeDriver
    linSamp: ScalarSampler
    gasEmitterCeil: SceneObjectBase
    gasEmitterGround: SceneObjectBase
    isAnimating : boolean

    constructor() {
        this.timeDriver = Animation.timeDriver({ durationMilliseconds: duration * 1000, loopCount: 1, mirror: false });
        this.linSamp = Animation.samplers.linear(AnimPos.start, AnimPos.end);
        this.isAnimating = true;
    }

    async getGasEmitter() {
        [this.gasEmitterGround, this.gasEmitterCeil] = await Promise.all([
            S.root.findFirst(GasEmitterGround),
            S.root.findFirst(GasEmitterCeil)
        ])
    }

    animate() {
        if (!this.isAnimating) return;
        duration = duration * speedUpFactor < minDuration ? minDuration : duration * speedUpFactor;
        this.timeDriver = Animation.timeDriver({ durationMilliseconds: duration * 1000, loopCount: 1, mirror: false });
        const rand = Random.random();
        if (rand < 0.5) {
            this.gasEmitterCeil.hidden = R.val(true);
            this.gasEmitterGround.hidden = R.val(false);
            this.gasEmitterGround.transform.x = Animation.animate(this.timeDriver, this.linSamp);
        }
        else {
            this.gasEmitterCeil.hidden = R.val(false);
            this.gasEmitterGround.hidden = R.val(true);
            this.gasEmitterCeil.transform.x = Animation.animate(this.timeDriver, this.linSamp);
        }
        this.timeDriver.reset();
        this.timeDriver.start();
        this.timeDriver.onCompleted().subscribe(() => {
            this.animate();
        })
    }
    stop() {
        this.timeDriver.stop();
        this.isAnimating = false;
    }

}

export const obstacleAnimation = new ObstacleAnimation();
obstacleAnimation.getGasEmitter();


