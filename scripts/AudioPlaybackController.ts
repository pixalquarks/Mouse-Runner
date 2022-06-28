import D from 'Diagnostics';

import Audio from 'Audio';



class AudioPlaybackController {
    private cheeseBitePlayback;
    private TrapHitPlayback;
    private jumpPlayback;
    private background;

    async getAudioPlayback() {
        [this.TrapHitPlayback, this.cheeseBitePlayback, this.jumpPlayback, this.background] = await Promise.all([
            Audio.getAudioPlaybackController('MouseTrap'),
            Audio.getAudioPlaybackController('CheeseBite'),
            Audio.getAudioPlaybackController('Jump'),
            Audio.getAudioPlaybackController('Background'),
        ]);
    }

    PlayCheeseBite() {
        this.cheeseBitePlayback.reset();
        this.cheeseBitePlayback.setPlaying(true);
    }

    PlayTrapHit() {
        this.TrapHitPlayback.reset();
        this.TrapHitPlayback.setPlaying(true);
    }

    PlayJump() {
        this.jumpPlayback.reset();
        this.jumpPlayback.setPlaying(true);
    }

    BackgroundPlay(play: boolean) {
        this.background.reset();
        this.background.setPlaying(play);
    }

}

export const audioPlayback = new AudioPlaybackController();
audioPlayback.getAudioPlayback();