import starBackgroundImage from "../assets/stars-background.png";

export class MainMenu extends Phaser.Scene
{
    constructor()
    {
        super({key: 'MainMenu'})
    }

    init()
    {
        this.textFlashDelay = 600;
    }

    preload()
    {
        this.load.image('starsBackground', starBackgroundImage);
        this.load.bitmapFont('main', require('../assets/font_0.png'), require('../assets/font.xml'));
        this.load.audio('startPressedSound', require('../assets/Pickup_Coin.ogg'));
    }

    create()
    {
        this.background1 = this.add.tileSprite(0, 0, 512, 512, 'starsBackground').setOrigin(0, 0);
        this.background2 = this.add.tileSprite(0, 0, 512, 512, 'starsBackground').setOrigin(0, 0);
        this.background2.setScale(1.5);
        this.background1.setAlpha(0.3);
        this.background2.setAlpha(0.7);

        this.add.bitmapText(256, 300, 'main', 'Salvage', -64).setOrigin(0.5, 0.5);
        this.pressStartText = this.add.bitmapText(256, 400, 'main', 'Start', -24).setOrigin(0.5, 0.5);
        this.pressStartText.setInteractive();
        this.pressStartText.on('pointerdown', () => {
            this.startGameSound.play({volume: 0.5});
            this.textFlashTimer.delay = 100;
            this.pressStartText.disableInteractive();
            this.cameras.main.fade(2000, 1, 1, 1);

            this.cameras.main.on('camerafadeoutcomplete', () => {
                this.scene.start('Gameplay');
              }, this);
        });

        this.textFlashTimer = this.time.addEvent({
            delay: 600,
            callback: () => { this.pressStartText.setAlpha(this.pressStartText.alpha === 1 ? 0.1 : 1)},
            callbackScope: this,
            loop: true
        })

        this.startGameSound = this.sound.add('startPressedSound');
    }

    update(time, delta)
    {
        this.background1.tilePositionX += delta * 0.1;
        this.background2.tilePositionX += delta * 0.15;
    }
}