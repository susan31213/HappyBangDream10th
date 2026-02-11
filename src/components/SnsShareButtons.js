export class SnsShareButtons extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.xButton = scene.add.image(x - 108, y, 'x_btn').setInteractive();
        this.facebookButton = scene.add.image(x - 36, y, 'facebook_btn').setInteractive();
        this.plurkButton = scene.add.image(x + 36, y, 'plurk_btn').setInteractive();
        this.weiboButton = scene.add.image(x + 108, y, 'weibo_btn').setInteractive();

        this.setButtonHandlers(this.xButton, 'x');
        this.setButtonHandlers(this.facebookButton, 'facebook');
        this.setButtonHandlers(this.plurkButton, 'plurk');
        this.setButtonHandlers(this.weiboButton, 'weibo');

        scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image('x_btn', 'assets/sns/x.jpg');
        scene.load.image('plurk_btn', 'assets/sns/plurk.png');
        scene.load.image('weibo_btn', 'assets/sns/weibo.png');
        scene.load.image('facebook_btn', 'assets/sns/facebook.png');
    }

    setButtonHandlers(button, platform) {
        const gameUrl = 'https://susan31213.itch.io/happybangdream10th';
        const gameTitle = 'Happy Bang Dream 10th';
        const shareLinks = {
            x: `https://x.com/intent/tweet?url=${encodeURIComponent(gameUrl)}&text=${encodeURIComponent(gameTitle)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`,
            plurk: `https://www.plurk.com/?qualifier=shares&status=${encodeURIComponent(gameTitle)}%20${encodeURIComponent(gameUrl)}`,
            weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(gameUrl)}&title=${encodeURIComponent(gameTitle)}`
        };
        const handleShare = (platform) => {
            window.open(shareLinks[platform], '_blank', 'width=600,height=400');
        };

        button.on('pointerdown', () => {
            button.setScale(1.25);
        });

        button.on('pointerup', () => {
            button.setScale(1.0);
            handleShare(platform);
        });

        button.on('pointerout', () => {
            button.setScale(1.0);
        });
    }
}
