import { TitleButton } from '../components/TitleButton.js';

export class BaseLevelScene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    preload() {
        this.load.image('back_btn', 'assets/back.png');
    }

    create() {
        const titleButton = new TitleButton(this, 40, 40, 'back_btn');
        titleButton.on('clicked', () => {
            this.onBackButtonClicked();
        });
    }

    onBackButtonClicked() {
        this.scene.start('TitleScene');
    }

    update() {

    }
}