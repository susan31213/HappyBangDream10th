import { TitleButton } from '../components/TitleButton.js';

export class BaseLevelScene extends Phaser.Scene {

    constructor(key) {
        super(key);
        this.isDebug = false;
    }

    preload() {
        this.scene.launch('PreloaderScene');
        this.load.image('back_btn', 'assets/back.png');
        this.load.image('audio_btn', 'assets/audio_icon.png');
        this.load.image('debug_tool', 'assets/debug_tool.png');
    }

    create() {
        this.scene.stop('PreloaderScene');

        this.debugLayer = this.add.layer();
        this.debugLayer.setVisible(this.isDebug);

        const titleButton = new TitleButton(this, 40, 40, 0.25, 'back_btn');
        titleButton.on('clicked', () => {
            this.onBackButtonClicked();
        }).setName('backButton');

        const audioButton = new TitleButton(this, 120, 40, this.sound.mute ? 0.25 : 1.0, 'audio_btn');
        audioButton.on('clicked', () => {
            if (this.sound.mute) {
                this.sound.setMute(false);
                audioButton.buttonImage.setAlpha(1.0);
            } else {
                this.sound.setMute(true);
                audioButton.buttonImage.setAlpha(0.25);
            }
        }).setName('audioButton');
        
        const debugToolButton = new TitleButton(this, 680, 40, this.isDebug ? 1.0 : 0.25, 'debug_tool');
        debugToolButton.on('clicked', () => {
            this.isDebug = !this.isDebug;
            debugToolButton.buttonImage.setAlpha(this.isDebug ? 1.0 : 0.25);
            this.debugLayer.setVisible(this.isDebug);
        }).setName('debugToolButton');
    }

    onBackButtonClicked() {
        this.scene.start('TitleScene');
    }

    update() {

    }
}