import { BaseLevelScene } from './BaseLevelScene.js';
import { HandGrabStoneAnimation } from '../components/HandGrabStoneAnimation.js';
import { SnsShareButtons } from '../components/SnsShareButtons.js';

export class MyGoScene extends BaseLevelScene {

    constructor() {
        super('MyGoScene');
        this.roundNum = 0;
    }

    static ROUND_COUNT = 3;
    static STONE_TYPE_COUNT = 5;
    static STAR_TYPE_COUNT = 3;
    static STONE_COUNT = 3;
    static STONE_TYPE = [
        'stone',
        'star',
    ];
    static STONE_NAMES = {
        'stone1': '今日つまづいた石',
        'stone2': '公園の砂場を3m掘ったところで出た石',
        'stone3': '修学旅行先で出会った石',
        'stone4': 'アリの巣の入口を塞いでいた石',
        'stone5': '河原で見つけた石',
        'star1': '夜空に輝く星',
        'star2': '宇宙から届いた星',
        'star3': 'ガルパをより楽しめる星',
    };
    static ROUND_NUM_SNS_TEXTS = {
        'stone0-lose': 'ともりんの石検定をクリアできなかった...！',
        'stone1-lose': 'ともりんの石検定3級を取りました！',
        'stone2-lose': 'ともりんの石検定2級を取りました！',
        'stone2-win': 'ともりんの石検定1級を取りました！',
        'star2-lose': 'ともりんの石検定2級を取りました！',
        'star2-win': 'ともりんの石検定1級を取りました！',
    };
    static ROUND_NUM_SNS_URLS = {
        'stone0-lose': 'https://bit.ly/4uEIiDY',  // TOMORI
        'stone1-lose': 'https://bit.ly/4uEIiDY',  // ANON
        'stone2-lose': 'https://bit.ly/4uEIiDY',  // TAKI
        'stone2-win': 'https://bit.ly/4uEIiDY',   // RANA
        'star2-lose': 'https://bit.ly/4uEIiDY',   // TAKI
        'star2-win': 'https://bit.ly/4uEIiDY',    // SOYO
    };

    init(data) {
        this.roundNum = data && data.roundNum ? data.roundNum : 0;
    }

    preload() {
        super.preload();
        this.load.image('mygo_back_btn', 'assets/mygo/back_btn.png');
        this.load.image('title', 'assets/mygo/title.png');
        this.load.image('start_button', 'assets/mygo/start_button.png');
        this.load.image('showing_bg', 'assets/mygo/showing_bg.png');
        this.load.image('hand_grab', 'assets/mygo/hand_grab.png');
        this.load.image('hand_release', 'assets/mygo/hand_release.png');
        this.load.image('selecting_bg', 'assets/mygo/selecting_bg.png');
        this.load.image('level1', 'assets/mygo/level1.png');
        this.load.image('level2', 'assets/mygo/level2.png');
        this.load.image('level3', 'assets/mygo/level3.png');
        this.load.image('clear0', 'assets/mygo/clear0.png');
        this.load.image('clear1', 'assets/mygo/clear1.png');
        this.load.image('clear2', 'assets/mygo/clear2.png');
        this.load.image('clear3', 'assets/mygo/clear3.png');
        this.load.image('clear_sp', 'assets/mygo/clear_sp.png');
        this.load.image('title_btn', 'assets/mygo/title_btn.png');
        this.load.image('share_btn', 'assets/mygo/share_btn.png');
        for (let i = 1; i <= MyGoScene.STONE_TYPE_COUNT; i++) {
            this.load.image(`stone${i}`, `assets/mygo/stones/stone${i}.png`);
        }
        for (let i = 1; i <= MyGoScene.STAR_TYPE_COUNT; i++) {
            this.load.image(`star${i}`, `assets/mygo/stones/star${i}.png`);
        }
        this.load.audio('mygo_bgm', 'assets/sound/midorinokouen.mp3');
        this.load.audio('taiko_dodo', 'assets/sound/se/taiko_dodo.mp3');
        this.load.audio('put_stone_se', 'assets/sound/se/put_stone.mp3');
        this.load.audio('quiz_show_se', 'assets/sound/se/quiz_show.mp3');
        this.load.audio('quiz_correct', 'assets/sound/se/quiz_correct.mp3');
        this.load.audio('success', 'assets/sound/se/success.mp3');
        this.load.audio('failure', 'assets/sound/se/failure.mp3');
        SnsShareButtons.preload(this);
    }

    create() {
        super.create();

        // set mygo back button texture
        const backButton = this.children.getByName('backButton');
        if (backButton) {
            backButton.buttonImage.setTexture('mygo_back_btn');
            backButton.buttonImage.setAlpha(1.0);
        }

        if (this.roundNum === 0) {
            this.showTitle();
        } else {
            this.startGame();
        }
    }

    showTitle() {
        const title = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'title').setDepth(-1);
        // create start button for starting game
        // when press down start button, make button darker
        // when press down and hold start button but move cursor out of button, make button normal
        // when release start button, play taiko_dodo se, make button normal and start game
        const startButton = this.add.image(360, 1105, 'start_button');
        startButton.setInteractive();
        startButton.on('pointerover', () => {
            startButton.setScale(1.2);
        });
        startButton.on('pointerdown', () => {
            startButton.setTint(0xaaaaaa);
        });
        startButton.on('pointerout', () => {
            startButton.setScale(1.0);
            startButton.clearTint();
        });
        startButton.on('pointerup', () => {
            this.sound.play('taiko_dodo', { volume: 1.0 });

            // black out effect for 0.5, black in effect for 0.5 second and start game
            const blackOut = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width, this.cameras.main.height, 0x000000, 1.0);
            blackOut.setDepth(1);
            this.tweens.add({
                targets: blackOut,
                alpha: { from: 0, to: 1 },
                duration: 1000,
                onComplete: () => {
                    title.destroy();
                    startButton.destroy();
                    this.addBg();
                    this.addRoundText();

                    this.tweens.add({
                        targets: blackOut,
                        alpha: { from: 1, to: 0 },
                        duration: 1000,
                        onComplete: () => {
                            blackOut.destroy();
                            this.startGame();
                        }
                    });
                }
            });
        });
    }

    addBg() {
        if (!this.children.getByName('showing_bg')) {
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'showing_bg').setDepth(-1);
        }
    }

    addRoundText() {
        if (!this.children.getByName('levelImage')) {
            this.add.image(this.cameras.main.width - 302, this.cameras.main.height - 110, `level${this.roundNum + 1}`).setOrigin(0.0, 0.5).setName('levelImage');
        }
    }

    startGame() {
        // play bgm if no bgm is playing
        let isBgmPlaying = false;
        const currentPlaying = this.sound.getAllPlaying();
        for (let i = 0; i < currentPlaying.length; i++) {
            if (currentPlaying[i].key === 'mygo_bgm') {
                isBgmPlaying = true;
                break;
            }
        }
        if (!isBgmPlaying) {
            this.sound.play('mygo_bgm', { loop: true, volume: 0.5 });
        }

        this.addBg();
        this.addRoundText();

        // only last round, 50% chance to select 'star', 50% chance to select 'stone'
        this.stoneType = this.roundNum === MyGoScene.ROUND_COUNT - 1 && Phaser.Math.Between(1, 100) >= 50 ? 'star' : 'stone';
        this.createStones();
    }

    createStones() {
        // select 3 random stones
        const selectedStones = [];
        const selectedStoneNames = [];
        while (selectedStones.length < MyGoScene.STONE_COUNT) {
            const randIndex = Phaser.Math.Between(1, this.stoneType === 'stone' ? MyGoScene.STONE_TYPE_COUNT : MyGoScene.STAR_TYPE_COUNT);
            const stoneKey = `${this.stoneType}${randIndex}`;
            if (!selectedStones.includes(stoneKey)) {
                selectedStones.push(stoneKey);
                selectedStoneNames.push(MyGoScene.STONE_NAMES[stoneKey]);
            }
        }

        // show each stone with hand animation
        selectedStones.forEach((stoneKey, index) => {
            this.time.delayedCall(index * 3500, () => {
                const handGrabStoneAnimation = new HandGrabStoneAnimation(this, 360, -280, stoneKey, MyGoScene.STONE_NAMES[stoneKey]);
                this.add.existing(handGrabStoneAnimation);
                handGrabStoneAnimation.playAnimation();
            });
        });

        // after showing all stones, show random one stone from selected stones
        const answerStoneKey = this.stoneType === 'star' ? 'star3' : selectedStones[Phaser.Math.Between(0, MyGoScene.STONE_COUNT - 1)];
        this.time.delayedCall(MyGoScene.STONE_COUNT * 3500 + 500, () => {
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'selecting_bg').setDepth(-1);
            this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                `${MyGoScene.STONE_NAMES[answerStoneKey]}はどれ？`,
                { fontFamily: 'futehodo', fontSize: '24px', color: '#282828' }
            ).setOrigin(0.5);
        });

        // show all stones in random order at the center for selection
        this.time.delayedCall(MyGoScene.STONE_COUNT * 3500 + 500, () => {
            Phaser.Utils.Array.Shuffle(selectedStones);
            selectedStones.forEach((stoneKey, index) => {
                const stone = this.add.image(this.cameras.main.centerX - 150 + index * 150, this.cameras.main.centerY - 100, stoneKey).setInteractive();
                stone.scale = 0.5;
                stone.on('pointerdown', () => {
                    if (stoneKey === answerStoneKey) {
                        this.showResult(true);
                    } else {
                        this.showResult(false);
                    }
                });
                if (stoneKey === answerStoneKey) {
                    this.debugLayer.add(
                        this.add.text(
                            this.cameras.main.centerX - 150 + index * 150,
                            470,
                            "↓",
                            { fontSize: '50px', color: '#ff0000' }
                        ).setOrigin(0.5)
                    );
                }
            });
            this.sound.play('quiz_show_se', { volume: 1.0 });
            
            let levelImage = this.children.getByName('levelImage');
            if (levelImage) {
                this.children.getByName('levelImage').setVisible(false);
            }
        });
    }

    showResult(isCorrect) {
        // hide all children except TitleButton and showing bg
        this.children.each((child) => {
            if (child.constructor.name === 'TitleButton' ||
                child.texture && child.texture.key === 'showing_bg') {
                return;
            }
            child.setVisible(false);
        });

        if (this.roundNum === MyGoScene.ROUND_COUNT - 1 && isCorrect) {
            if (this.stoneType === 'star') {
                this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'clear_sp').setDepth(-1);
            } else {
                this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'clear3').setDepth(-1);
            }
            this.sound.play('success', { volume: 1.0 });
        }
        if (!isCorrect) {
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, this.roundNum === 0 ? 'clear0' : `clear${this.roundNum}`).setDepth(-1);
            this.createBackButton(isCorrect);
        } else if (this.roundNum !== MyGoScene.ROUND_COUNT - 1) {
            this.createNextRoundButton();
        } else {
            this.createBackButton(isCorrect);
        }
    }

    createNextRoundButton() {
        const nextText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'おめでとう！タップして次のレベルへ',
            { fontFamily: 'futehodo', fontSize: '36px', color: '#282828' }
        ).setOrigin(0.5).setInteractive();

        // after 0.5 seconds, user can tap anywhere to go to next round
        this.time.delayedCall(500, () => {
            this.input.once('pointerdown', () => {
                this.scene.restart({roundNum: this.roundNum + 1});
            });
        });

        // set all objects interactive false but next button
        this.children.each((child) => {
            if (child !== nextText) {
                child.disableInteractive();
            }
        });

        this.sound.play('quiz_correct', { volume: 1.0 });
    }

    createBackButton(isCorrect) {
        const backbtn = this.add.image(
            this.cameras.main.centerX + 160,
            this.cameras.main.centerY + 525,
            'title_btn'
        ).setOrigin(0.5).setInteractive();
        backbtn.on('pointerover', () => {
            backbtn.setScale(1.1);
        });
        backbtn.on('pointerdown', () => {
            backbtn.setTint(0xaaaaaa);
            this.scene.restart({roundNum: 0});
        });
        backbtn.on('pointerout', () => {
            backbtn.setScale(1.0);
            backbtn.clearTint();
        });

        const sharebtn = this.add.image(
            this.cameras.main.centerX - 160,
            this.cameras.main.centerY + 525,
            'share_btn'
        ).setOrigin(0.5).setInteractive();
        sharebtn.on('pointerover', () => {
            sharebtn.setScale(1.1);
        });
        sharebtn.on('pointerdown', () => {
            sharebtn.setTint(0xaaaaaa);
            const keyStr = this.stoneType + this.roundNum + (isCorrect ? '-win' : '-lose');
            const url = MyGoScene.ROUND_NUM_SNS_URLS[keyStr] || 'https://bit.ly/4uEIiDY';
            const text = MyGoScene.ROUND_NUM_SNS_TEXTS[keyStr] + 'あなたは何級？ともりの石検定に挑戦してみてね！';
            const shareLink = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            window.open(shareLink, '_blank', 'width=600,height=500');
        });
        sharebtn.on('pointerout', () => {
            sharebtn.setScale(1.0);
            sharebtn.clearTint();
        });
    }

    onBackButtonClicked() {
        this.roundNum = 0;
        this.sound.stopAll();
        super.onBackButtonClicked();
    }

    update() {
        super.update();
    }
}