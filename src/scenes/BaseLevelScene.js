import { TitleButton } from '../components/TitleButton.js';

export class BaseLevelScene extends Phaser.Scene {

    constructor(key) {
        super(key);
        this.isDebug = false;
    }

    preload() {
        this.load.image('back_btn', 'assets/back.png');
        this.load.image('debug_tool', 'assets/debug_tool.png');
    }

    create() {
        this.debugLayer = this.add.layer();
        this.debugLayer.setVisible(this.isDebug);

        const titleButton = new TitleButton(this, 40, 40, 0.25, 'back_btn');
        titleButton.on('clicked', () => {
            this.onBackButtonClicked();
        });
        
        const debugToolButton = new TitleButton(this, 120, 40, this.isDebug ? 1.0 : 0.25, 'debug_tool');
        debugToolButton.on('clicked', () => {
            this.isDebug = !this.isDebug;
            debugToolButton.buttonImage.setAlpha(this.isDebug ? 1.0 : 0.25);
            this.debugLayer.setVisible(this.isDebug);
        });
    }

    onBackButtonClicked() {
        this.scene.start('TitleScene');
    }

    update() {

    }
}