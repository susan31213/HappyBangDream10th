export class HandGrabStoneAnimation extends Phaser.GameObjects.Container {
    constructor(scene, x, y, stoneTexture, stoneName) {
        const easeInContainer = new Phaser.GameObjects.Container(scene, 0, 0);
        const easeOutContainer = new Phaser.GameObjects.Container(scene, 0, 0);
        const children = [];
        const handImage = scene.add.image(60, 0, 'hand_grab').setDepth(1);
        children.push(handImage);
        const stoneImage = scene.add.image(0, 200, stoneTexture);
        stoneImage.setScale(0.66);
        children.push(stoneImage);
        easeInContainer.add(children);

        super(scene, x, y, [easeInContainer, easeOutContainer]);
        this.easeInContainer = easeInContainer;
        this.easeOutContainer = easeOutContainer;
        this.handImage = handImage;
        this.stoneImage = stoneImage;
        this.stoneName = stoneName;

        easeInContainer.bringToTop(this.handImage);
        this.bringToTop(easeInContainer);
    }

    playAnimation() {
        this.scene.tweens.add({
            targets: this.easeInContainer,
            y: this.scene.cameras.main.centerY + 40,
            duration: 1000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.handImage.setTexture('hand_release');
                this.easeInContainer.remove(this.handImage, false);
                this.easeOutContainer.add(this.handImage);
                this.easeOutContainer.x = this.easeInContainer.x;
                this.easeOutContainer.y = this.easeInContainer.y;


                const stoneNameText = new Phaser.GameObjects.Text(
                    this.scene,
                    0,
                    300,
                    this.stoneName,
                    { fontFamily: 'futehodo', fontSize: '36px', color: '#282828' }
                );
                stoneNameText.setOrigin(0.5);
                this.easeInContainer.add(stoneNameText);

                this.scene.tweens.add({
                    targets: this.easeOutContainer,
                    y: 0,
                    duration: 1000,
                    delay: 500,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this.easeInContainer,
                            x: -800,
                            duration: 500,
                            delay: 500,
                            ease: 'Sine.easeIn',
                            onComplete: () => {
                                this.emit('animationComplete');
                                this.destroy();
                            }
                        });
                    }
                });
            }
        });
    }
}