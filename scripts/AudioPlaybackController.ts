import D from 'Diagnostics';

import Audio from 'Audio';



class AudioPlaybackController {
    private cheeseBitePlayback;
    private TrapHitPlayback;

    async getAudioPlayback() {
        [this.TrapHitPlayback, this.cheeseBitePlayback] = await Promise.all([
            Audio.getAudioPlaybackController('MouseTrap'),
            Audio.getAudioPlaybackController('CheeseBite')
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

}

export const audioPlayback = new AudioPlaybackController();
audioPlayback.getAudioPlayback();