import starBackgroundImage from "../assets/stars-background.png";
import cursorTexture from '../assets/cursor-Sheet.png';
import { ScrollingBackground } from "../systems/Background/background";

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
        this.load.spritesheet('cursor', cursorTexture, { frameWidth: 16, frameWidth: 16 });
        this.load.image('starsBackground', starBackgroundImage);
        this.load.bitmapFont('main', require('../assets/font_0.png'), require('../assets/font.xml'));
        this.load.audio('startPressedSound', require('../assets/Pickup_Coin.ogg'));
        this.load.audio('menu-bgm', require('../assets/intro-bgm-simplified.mp3'));
    }

    create()
    {
        this.input.mouse.disableContextMenu();
        this.sys.canvas.style.cursor = 'none';

        this.scrollingBackground = new ScrollingBackground({
            tileSprites: [
                this.add.tileSprite(0, 0,  this.cameras.main.width, this.cameras.main.height, 'starsBackground').setAlpha(0.3).setScale(1).setOrigin(0, 0),
                this.add.tileSprite(0, 0,  this.cameras.main.width * 2, this.cameras.main.height * 2, 'starsBackground').setOrigin(0, 0).setScale(1.5).setAlpha(0.7)
            ],
            scrollSpeed: [
                0.1, 
                0.15]
        });
        
        this.add.bitmapText(this.cameras.main.width / 2, 300, 'main', 'Salvage', -64).setOrigin(0.5, 0.5);
        this.buttonBorderRenderer = this.add.graphics({ lineStyle: { width: 2, color: 0x666666 }, fillStyle: { color: 0x666666 }});
        this.buttonRect = new Phaser.Geom.Rectangle((this.cameras.main.width / 2)-105, 387.5, 210, 30);
        this.pressStartText = this.add.bitmapText(this.cameras.main.width / 2, 400, 'main', 'Click to Start', -24).setOrigin(0.5, 0.5);
        this.pressStartText.setInteractive();
        this.pressStartText.on('pointerdown', () => {
            this.bgm.stop();
            this.startGameSound.play({volume: 0.1});
            this.textFlashTimer.delay = 100;
            this.pressStartText.disableInteractive();
            
            this.cameras.main.fade(2000, 1, 1, 1);

            this.cameras.main.on('camerafadeoutcomplete', () => {
                this.scene.start('Gameplay', { level: 1 });
              }, this);
        });

        this.creditsText = this.add.bitmapText(768/5, 470, 'main', "Art, Programming, Music and Sound by Dominic Sabatier", -8).setOrigin(0, 0.5);
        this.creditsText.setTintFill(0xffffff);
        this.creditsText.setScale(2);
        this.creditsText.setDepth(51);

        this.textFlashTimer = this.time.addEvent({
            delay: 600,
            callback: () => { this.pressStartText.setAlpha(this.pressStartText.alpha === 1 ? 0.1 : 1)},
            callbackScope: this,
            loop: true
        })

        this.startGameSound = this.sound.add('startPressedSound');
        this.customCursor = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'cursor', 0);
        this.customCursor.setScale(2);
        this.bgm = this.sound.add('menu-bgm');
        this.bgm.play({loop: true, volume: 0.4});
    }

    update(time, delta)
    {
        this.buttonBorderRenderer.clear();
        this.buttonBorderRenderer.strokeRectShape(this.buttonRect);
        this.customCursor.x = this.input.activePointer.x;
        this.customCursor.y = this.input.activePointer.y;
        this.scrollingBackground.update(time, delta);
    }
}