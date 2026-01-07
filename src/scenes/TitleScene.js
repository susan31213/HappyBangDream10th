export class TitleScene extends Phaser.Scene {

    constructor() {
        super('TitleScene');
    }

    preload() {
        this.load.audio('bgm', 'assets/sound/shimtone-raburizu.mp3');

        this.load.image('poppinparty', 'assets/logo/Poppin\'Party_logo.png');
        this.load.image('afterglow', 'assets/logo/Afterglow_logo.png');
        this.load.image('pastelpalettes', 'assets/logo/Pastel_Palettes_logo.png');
        this.load.image('roselia', 'assets/logo/Roselia_logo.png');
        this.load.image('hellowhappyworld', 'assets/logo/Hello,_Happy_World!_logo.png');
        this.load.image('morfonica', 'assets/logo/Morfonica_logo.png');
        this.load.image('raiseasuilen', 'assets/logo/RAISE_A_SUILEN_logo.png');
        this.load.image('mygo', 'assets/logo/MyGO!!!!!_logo.png');
        this.load.image('avemujica', 'assets/logo/Ave_Mujica_logo.webp');
    }

    create() {
        this.sound.play('bgm', { loop: true });

        this.addButton(190, 200, 'poppinparty', 'PoppinPartyScene');
        this.addButton(530, 200, 'afterglow', 'AfterglowScene');
        this.addButton(190, 400, 'pastelpalettes', 'PastelPalettesScene');
        this.addButton(530, 400, 'roselia', 'RoseliaScene');
        this.addButton(190, 600, 'hellowhappyworld', 'HelloHappyWorldScene');
        this.addButton(530, 600, 'morfonica', 'MorfonicaScene');
        this.addButton(190, 800, 'raiseasuilen', 'RaiseASuilenScene');
        this.addButton(530, 800, 'mygo', 'MyGoScene');
        this.addButton(190, 1000, 'avemujica', 'AveMujicaScene');
    }

    update() {


    }

    exit

    addButton(x, y, imageKey, sceneToStart) {
        const button = this.add.image(x, y, imageKey);
        button.setInteractive();

        button.on('pointerdown', () => {
            this.scene.start(sceneToStart);
            this.sound.stopAll();
        });

        return button;
    }
}