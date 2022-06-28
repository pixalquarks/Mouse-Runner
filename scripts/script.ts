import S from 'Scene';
import R from 'Reactive';
import M from 'Materials';
import D from 'Diagnostics';
import FaceTracking from 'FaceTracking';
import FaceGesture from 'FaceGestures';

import { audioPlayback } from './AudioPlaybackController';


const Character = "Character";
const GroundRunMaterial = "CharacterRunGround";
const CeilRunMaterial = "CharacterRunCeil";
const GroundHitMaterial = "CharacterHitGround";
const CeilHitMaterial = "CharacterHitCeil";


class CharacterMaterialManager {
    character : SceneObjectBase;
    characterSprite : SceneObjectBase;
    face: Face;
    groundRunMaterial: MaterialBase;
    ceilRunMaterial: MaterialBase;
    groundHitMaterial: MaterialBase;
    ceilHitMaterial: MaterialBase;
    isActive : boolean;
    private products: SceneObjectBase[];

    async getMaretials() {
        [this.groundRunMaterial, this.groundHitMaterial, this.ceilRunMaterial, this.ceilHitMaterial, this.character, this.face] = await Promise.all([
            M.findFirst(GroundRunMaterial),
            M.findFirst(GroundHitMaterial),
            M.findFirst(CeilRunMaterial),
            M.findFirst(CeilHitMaterial),
            S.root.findFirst(Character),
            FaceTracking.face(0)
        ]);
        this.characterSprite = await this.character.findFirst("character");
        this.products = await this.character.findByPath("product*");
        D.log(this.products.length);
        this.products.forEach(product => {
            product.hidden = R.val(true);
        })
        this.isActive = false;
        FaceGesture.onBlink(this.face).subscribe(() => {
            if (!this.isActive) return;
            this.flipCharacter();
        })
    }

    flipCharacter() {
        let lastVal = this.character.transform.y.pinLastValue();
        this.character.transform.y = R.val(-lastVal);
        this.character.transform.rotationX = R.val(lastVal < 0? 3.14: 0);
        this.characterSprite.material = lastVal > 0 ? this.groundRunMaterial : this.ceilRunMaterial;
        audioPlayback.PlayJump();
    }

    onCharacterHitObstacle() {
        let lastVal = this.character.transform.y.pinLastValue();
        this.characterSprite.material = lastVal < 0 ? this.groundHitMaterial : this.ceilHitMaterial;
        this.isActive = false;
    }

    onCheeseHit(name: string) {
        const p = this.products.filter(product => product.name === name);
        p[0].hidden = R.val(false);

    }

    start() {
        this.isActive = true;
    }

}

export const charMaterialManager = new CharacterMaterialManager();
charMaterialManager.getMaretials();