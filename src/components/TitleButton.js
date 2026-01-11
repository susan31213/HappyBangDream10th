export class TitleButton extends Phaser.GameObjects.Container {

    constructor(scene, x, y, alpha, texture) {
        super(scene, x, y);

        this.buttonImage = scene.add.image(0, 0, texture).setInteractive();
        this.buttonImage.setAlpha(alpha);
        this.add(this.buttonImage);

        this.buttonImage.on('pointerdown', () => {
            this.buttonImage.setScale(1.25);
        });

        this.buttonImage.on('pointerup', () => {
            this.buttonImage.setScale(1.0);
            this.emit('clicked');
        });

        this.buttonImage.on('pointerout', () => {
            this.buttonImage.setScale(1.0);
        });

        scene.add.existing(this);
    }
}