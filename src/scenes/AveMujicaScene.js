
import { BaseLevelScene } from './BaseLevelScene.js';
import { Note } from '../components/note.js';

export class AveMujicaScene extends BaseLevelScene {

    constructor() {
        super('AveMujicaScene');
    }

    preload() {
        super.preload();
        this.load.image('uika', 'assets/uika.png');
        this.load.image('uika_shitauchi', 'assets/uika_shitauchi.png');
        this.load.spritesheet('note_umiri', 'assets/notes/note_umiri.png', {
            frameWidth: 162,
            frameHeight: 130
        });
        this.load.audio('shitaichi_se', 'assets/sound/notanomori_201206111001450001.wav');
    }

    create() {
        super.create();

        // Uika character
        const uika = this.add.image(600, 900, 'uika');
        this.input.on('pointerdown', () => {
            uika.setTexture('uika_shitauchi');
            // shake effect
            this.tweens.add({
                targets: uika,
                scale: 1.2,
                duration: 100,
                yoyo: true,
                ease: 'Power1'
            });
            // play sound effect
            this.sound.play('shitaichi_se');
        });
        this.input.on('pointerup', () => {
            uika.setTexture('uika');
        });

        // Notes falling
        this.time.addEvent({
            delay: 800,
            callback: () => {
                const note = new Note(this, Phaser.Math.Between(160, 560), -50, 2);
            },
            loop: true
        });
    }

    onBackButtonClicked() {
        this.sound.stopAll();
        this.scene.start('TitleScene');
    }

    update() {
        super.update();
    }
}
