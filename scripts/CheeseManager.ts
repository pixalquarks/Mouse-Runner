import S from 'Scene';
import R from 'Reactive';
import Random from 'Random';
import Animation from 'Animation';

const CheeseGround1 = 'CheeseGround1';
const CheeseGround2 = 'CheeseGround2';
const CheeseCeil1 = 'CheeseCeil1';
const CheeseCeil2 = 'CheeseCeil2';


const Cheese = {
    ground1 : null,
    ground2 : null,
    ceil1 : null,
    ceil2 : null
}

const AnimPos = {
    start1: 0.2,
    end1: -0.4,
    start2: 0.4,
    end2: -0.2,
}

const Duration = 4.732;
let duration = Duration;

const speedUpFactor = 0.95;

const minDuration = 1;

class CheeseAnimation {
    private timeDriver: TimeDriver
    private linSamp1: ScalarSampler
    private linSamp2: ScalarSampler
    private ground1: SceneObjectBase
    private ground2: SceneObjectBase
    private ceil1: SceneObjectBase
    private ceil2: SceneObjectBase
    private isAnimating : boolean

    constructor() {
        this.timeDriver = Animation.timeDriver({ durationMilliseconds: duration * 1000, loopCount: 1, mirror: false });
        this.linSamp1 = Animation.samplers.linear(AnimPos.start1, AnimPos.end1);
        this.linSamp2 = Animation.samplers.linear(AnimPos.start2, AnimPos.end2);
        this.isAnimating = true;
    }

    async getCheese() {
        [this.ground1, this.ground2, this.ceil1, this.ceil2] = await Promise.all([
            S.root.findFirst(CheeseGround1),
            S.root.findFirst(CheeseGround2),
            S.root.findFirst(CheeseCeil1),
            S.root.findFirst(CheeseCeil2)
        ]);
    }

    animate() {
        if (!this.isAnimating) return;
        duration = duration * speedUpFactor < minDuration ? minDuration : duration * speedUpFactor;
        this.timeDriver = Animation.timeDriver({ durationMilliseconds: duration * 1000, loopCount: 1, mirror: false });
        const rand1 = Random.random();
        const rand2 = Random.random();
        if (rand1 < 0.5) {
            this.ceil1.hidden = R.val(true);
            this.ceil2.hidden = R.val(true);
            if (rand2 < 0.5) {
                this.ground1.hidden = R.val(false);
                this.ground2.hidden = R.val(true);
                this.ground1.transform.x = Animation.animate(this.timeDriver, this.linSamp1);
            }
            else {
                this.ground1.hidden = R.val(true);
                this.ground2.hidden = R.val(false);
                this.ground2.transform.x = Animation.animate(this.timeDriver, this.linSamp2);
            }
        }
        else {
            this.ground1.hidden = R.val(true);
            this.ground2.hidden = R.val(true);
            if (rand2 < 0.5) {
                this.ceil1.hidden = R.val(false);
                this.ceil2.hidden = R.val(true);
                this.ceil1.transform.x = Animation.animate(this.timeDriver, this.linSamp1);
            }
            else {
                this.ceil1.hidden = R.val(true);
                this.ceil2.hidden = R.val(false);
                this.ceil2.transform.x = Animation.animate(this.timeDriver, this.linSamp2);
            }
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

export const cheeseAnimation = new CheeseAnimation();
cheeseAnimation.getCheese();
