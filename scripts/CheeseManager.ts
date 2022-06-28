import S from 'Scene';
import R from 'Reactive';
import D from 'Diagnostics';
import Random from 'Random';
import Animation from 'Animation';
import Materials from 'Materials';

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
    private materials : MaterialBase[]
    private textures: SceneObjectBase[]
    private objMatMap: string[]

    constructor() {
        this.timeDriver = Animation.timeDriver({ durationMilliseconds: duration * 1000, loopCount: 1, mirror: false });
        this.linSamp1 = Animation.samplers.linear(AnimPos.start1, AnimPos.end1);
        this.linSamp2 = Animation.samplers.linear(AnimPos.start2, AnimPos.end2);
        this.isAnimating = true;
        this.textures = [null, null, null, null];
        this.objMatMap = ["", "", "", ""];
    }

    async getCheese() {
        [this.ground1, this.ground2, this.ceil1, this.ceil2] = await Promise.all([
            S.root.findFirst(CheeseGround1),
            S.root.findFirst(CheeseGround2),
            S.root.findFirst(CheeseCeil1),
            S.root.findFirst(CheeseCeil2)
        ]);

        this.textures[0] = await this.ground1.findFirst('CheeseTexture');
        this.textures[1] = await this.ground2.findFirst('CheeseTexture');
        this.textures[2] = await this.ceil1.findFirst('CheeseTexture');
        this.textures[3] = await this.ceil2.findFirst('CheeseTexture');
    }

    async getMaterials() {
        this.materials = await Materials.findUsingPattern('product*');
    }

    getRandomMaterial() {
        return this.materials[Math.floor(Random.random() * this.materials.length)];
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
                const mat = this.getRandomMaterial();
                this.textures[0].material = mat;
                this.objMatMap[0] = mat.name;
            }
            else {
                this.ground1.hidden = R.val(true);
                this.ground2.hidden = R.val(false);
                this.ground2.transform.x = Animation.animate(this.timeDriver, this.linSamp2);
                const mat = this.getRandomMaterial();
                this.textures[1].material = mat;
                this.objMatMap[1] = mat.name;
            }
        }
        else {
            this.ground1.hidden = R.val(true);
            this.ground2.hidden = R.val(true);
            if (rand2 < 0.5) {
                this.ceil1.hidden = R.val(false);
                this.ceil2.hidden = R.val(true);
                this.ceil1.transform.x = Animation.animate(this.timeDriver, this.linSamp1);
                const mat = this.getRandomMaterial();
                this.textures[2].material = mat;
                this.objMatMap[2] = mat.name;
            }
            else {
                this.ceil1.hidden = R.val(true);
                this.ceil2.hidden = R.val(false);
                this.ceil2.transform.x = Animation.animate(this.timeDriver, this.linSamp2);
                const mat = this.getRandomMaterial();
                this.textures[3].material = mat;
                this.objMatMap[3] = mat.name;
            }
        }
        this.timeDriver.reset();
        this.timeDriver.start();
        this.timeDriver.onCompleted().subscribe(() => {
            this.animate();
        })
    }

    getProductName(obj: SceneObjectBase) {
        if (obj.name === CheeseGround1) return this.objMatMap[0];
        if (obj.name === CheeseGround2) return this.objMatMap[1];
        if (obj.name === CheeseCeil1) return this.objMatMap[2];
        if (obj.name === CheeseCeil2) return this.objMatMap[3];
    }

    stop() {
        this.timeDriver.stop();
        this.isAnimating = false;
    }
}

export const cheeseAnimation = new CheeseAnimation();
cheeseAnimation.getCheese();
cheeseAnimation.getMaterials();
