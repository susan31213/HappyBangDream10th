import { BaseLevelScene } from './BaseLevelScene.js';
import { HandGrabStoneAnimation } from '../components/HandGrabStoneAnimation.js';

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

    init(data) {
        this.roundNum = 0;
        this.roundNum = data && data.roundNum ? data.roundNum : 0;
    }

    preload() {
        super.preload();
        this.load.font('futehodo', 'assets/Futehodo-MaruGothic.otf', 'opentype');
        this.load.image('showing_bg', 'assets/mygo/showing_bg.png');
        this.load.image('hand_grab', 'assets/mygo/hand_grab.png');
        this.load.image('hand_release', 'assets/mygo/hand_release.png');
        this.load.image('selecting_bg', 'assets/mygo/selecting_bg.png');
        this.load.image('clear0', 'assets/mygo/clear0.png');
        this.load.image('clear1', 'assets/mygo/clear1.png');
        this.load.image('clear2', 'assets/mygo/clear2.png');
        this.load.image('clear3', 'assets/mygo/clear3.png');
        this.load.image('clear_sp', 'assets/mygo/clear_sp.png');
        for (let i = 1; i <= MyGoScene.STONE_TYPE_COUNT; i++) {
            this.load.image(`stone${i}`, `assets/mygo/stones/stone${i}.png`);
        }
        for (let i = 1; i <= MyGoScene.STAR_TYPE_COUNT; i++) {
            this.load.image(`star${i}`, `assets/mygo/stones/star${i}.png`);
        }
    }

    create() {
        super.create();

        // round text
        this.add.text(
            this.cameras.main.width - 30,
            this.cameras.main.height - 50,
            `レベル ${this.roundNum + 1}`,
            { fontFamily: 'futehodo', fontSize: '36px', color: '#28282840' }
        ).setOrigin(1.0, 0.5);

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

        // add showing background
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'showing_bg').setDepth(-1);

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
        this.time.delayedCall(MyGoScene.STONE_COUNT * 3500 + (MyGoScene.STONE_COUNT + 1) * 500, () => {
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'selecting_bg').setDepth(-1);
            this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                `${MyGoScene.STONE_NAMES[answerStoneKey]}はどれ？`,
                { fontFamily: 'futehodo', fontSize: '24px', color: '#282828' }
            ).setOrigin(0.5);
        });

        // show all stones in random order at the center for selection
        this.time.delayedCall(MyGoScene.STONE_COUNT * 3500 + (MyGoScene.STONE_COUNT + 1) * 500, () => {
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
                if (this.isDebug && stoneKey === answerStoneKey) {
                    this.add.text(
                        this.cameras.main.centerX - 150 + index * 150,
                        470,
                        "↓",
                        { fontSize: '50px', color: '#ff0000' }
                    ).setOrigin(0.5);
                }
            });
        });
    }

    showResult(isCorrect) {
        // hide all children except TitleButton
        this.children.each((child) => {
            if (child.constructor.name === 'TitleButton') {
                return;
            }
            child.setVisible(false);
        });

        var resultText = '';
        if (this.roundNum === MyGoScene.ROUND_COUNT - 1 && isCorrect) {
            resultText = `おめでとう！あなたは燈の石検定${this.roundNum + 1}級です！`
            if (this.stoneType === 'star') {
                this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'clear_sp').setDepth(-1);
            } else {
                this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'clear3').setDepth(-1);
            }
        }
        if (!isCorrect) {
            resultText = this.roundNum === 0 ? '残念！あなたは燈の石検定不合格です！' : `間違えた！あなたは燈の石検定${this.roundNum}級です！`;
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, this.roundNum === 0 ? 'clear0' : `clear${this.roundNum}`).setDepth(-1);
            this.createRetryButton();
        } else if (this.roundNum !== MyGoScene.ROUND_COUNT - 1) {
            this.createNextRoundButton();
        } else {
            this.createBackButton();
        }
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 550,
            resultText,
            { fontSize: '30px', color: '#ff0000' }
        ).setOrigin(0.5);
    }

    createRetryButton() {
        const retryText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 600,
            'もう一度挑戦',
            { fontSize: '24px', color: '#0000ff' }
        ).setOrigin(0.5).setInteractive();
        retryText.on('pointerdown', () => {
            this.scene.restart({roundNum: 0});
        });

        // set all objects interactive false but retry button
        this.children.each((child) => {
            if (child !== retryText) {
                child.disableInteractive();
            }
        });
    }

    createNextRoundButton() {
        const nextText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'おめでとう！次のレベルへ',
            { fontSize: '24px', color: '#0000ff' }
        ).setOrigin(0.5).setInteractive();
        nextText.on('pointerdown', () => {
            this.scene.restart({roundNum: this.roundNum + 1});
        });

        // set all objects interactive false but next button
        this.children.each((child) => {
            if (child !== nextText) {
                child.disableInteractive();
            }
        });
    }

    createBackButton() {
        const backText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 600,
            'タイトルへ戻る',
            { fontSize: '24px', color: '#0000ff' }
        ).setOrigin(0.5).setInteractive();
        backText.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });
    }

    onBackButtonClicked() {
        this.roundNum = 0;
        super.onBackButtonClicked();
    }

    update() {
        super.update();
    }
}