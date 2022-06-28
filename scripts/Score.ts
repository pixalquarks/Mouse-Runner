import NativeUI from 'NativeUI';
import Time from 'Time';
import D from 'Diagnostics';

const scoreText = 'Score';
const gameOverText = 'GameOver';

class Score {
    _score: number;
    incrementScoreInvervalTimer : number;
    incrementScoreInterval;
    cheeseHitScoreIncrement: number;
    intervalScoreIncrement: number;

    constructor() {
        this._score = 0;
        this.incrementScoreInvervalTimer = 500;
        this.cheeseHitScoreIncrement = 8;
        this.intervalScoreIncrement = 1;
        this.SetScore();
    }

    SetScore() {
        NativeUI.setText(scoreText, `Score: ${this._score}`);
    }

    StartScoreIncrement() {
        this.incrementScoreInterval = Time.setInterval(() => {
            this._score += this.intervalScoreIncrement;
            this.SetScore();
        }, this.incrementScoreInvervalTimer);
    }

    StopScoreIncrement() {
        Time.clearInterval(this.incrementScoreInterval);
        NativeUI.setText(gameOverText, "Game Over");
    }

    OnCheeseHit() {
        this._score += this.cheeseHitScoreIncrement;
        this.SetScore();
    }
}

export const score = new Score();


// https://www.instagram.com/ar/417782320007985/

// https://www.instagram.com/ar/582787773220352/