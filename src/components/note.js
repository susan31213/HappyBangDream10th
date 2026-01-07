export class Note extends Phaser.GameObjects.Sprite {
    static spritesheets = [
        'note_umiri'
    ];

    constructor(scene, x, y, speed) {
        const texture = Phaser.Math.RND.pick(Note.spritesheets);
        super(scene, x, y, texture);
        this.texture = texture;
        this.speed = speed;
        scene.add.existing(this);

        // move down
        scene.tweens.add({
            targets: this,
            y: 1200,
            duration: 4000,
            ease: 'Linear',
            onComplete: () => {
                this.destroy();
            }
        });

        this.setInteractive();
        this.on('pointerdown', () => {
            // disable further interaction and change frame to pressed state
            this.disableInteractive();
            this.setTexture(this.texture, 1);

            // shake, rotate, become bigger and disappear
            scene.tweens.add({
                targets: this,
                scale: 1.2,
                duration: 100,
                yoyo: true,
                ease: 'Power1'
            });
            scene.tweens.add({
                targets: this,
                angle: Phaser.Math.Between(15, 30) * Phaser.Math.RND.sign(),  // radom rotation (always rotate more than 15 degrees)
                duration: 50,
                yoyo: true,
                ease: 'Power1'
            });
            scene.time.delayedCall(250, () => {
                this.destroy();
            });
        });
    }
}
