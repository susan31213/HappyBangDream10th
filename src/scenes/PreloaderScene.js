export class PreloaderScene extends Phaser.Scene {

    constructor() {
        super('PreloaderScene');
    }

    preload() {
        this.load.font('futehodo', 'assets/Futehodo-MaruGothic.otf', 'opentype');
    }

    create() {
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Loading...',
            { fontFamily: 'futehodo', fontSize: '36px', color: '#282828' }
        ).setOrigin(0.5);
    }   
}