import S from 'Scene';
import R from 'Reactive';
import M from 'Materials';
import FaceTracking from 'FaceTracking';
import FaceGesture from 'FaceGestures';


const Character = "Character";
const GroundRunMaterial = "CharacterRunGround";
const CeilRunMaterial = "CharacterRunCeil";
const GroundHitMaterial = "CharacterHitGround";
const CeilHitMaterial = "CharacterHitCeil";


class CharacterMaterialManager {
    character : SceneObjectBase;
    characterSprite : SceneObjectBase;
    face;
    groundRunMaterial;
    ceilRunMaterial;
    groundHitMaterial;
    ceilHitMaterial;
    isActive : boolean;

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
    }

    onCharacterHitObstacle() {
        let lastVal = this.character.transform.y.pinLastValue();
        this.characterSprite.material = lastVal < 0 ? this.groundHitMaterial : this.ceilHitMaterial;
        this.isActive = false;
    }

    start() {
        this.isActive = true;
    }

}

export const charMaterialManager = new CharacterMaterialManager();
charMaterialManager.getMaretials();