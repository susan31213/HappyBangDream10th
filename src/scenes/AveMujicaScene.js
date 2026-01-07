
import { BaseLevelScene } from './BaseLevelScene.js';

export class AveMujicaScene extends BaseLevelScene {

    constructor() {
        super('AveMujicaScene');
    }

    preload() {
        super.preload();this.load.image('uika', 'assets/uika.png');
        this.load.image('uika_shitauchi', 'assets/uika_shitauchi.png');
        this.load.audio('shitaichi_se', 'assets/sound/notanomori_201206111001450001.wav');
    }

    create() {
        super.create();
        const uika = this.add.image(600, 900, 'uika');

        uika.setInteractive();
        this.input.on('pointerdown', () => {
            uika.setTexture('uika_shitauchi');
            this.sound.play('shitaichi_se');
        });
        this.input.on('pointerup', () => {
            uika.setTexture('uika');
        });
    }

    update() {
        super.update();
    }
}
