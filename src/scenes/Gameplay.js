import { PlayerShip } from "../entities/PlayerShip";
import { Star } from "../entities/Star";
import { Comet } from "../entities/Comet";
import { Bullet } from "../entities/Bullet";
import { EnemyShip } from "../entities/EnemyShip";
import { Explosion } from "../entities/Explosion";

import shipImage from "../assets/ship2-Sheet.png";
import bulletImage from "../assets/basic_bullet-Sheet.png";
import explosionImage from "../assets/explosion-Sheet.png";
import starImage from '../assets/star.png';
import greenGemImage from '../assets/green-gem.png';
import cometImage from '../assets/asteroid-med.png';
import cometSmallImage from '../assets/asteroid-sm.png';
import enemy2Texture from '../assets/enemy-ship2.png'

import starBackgroundImage from "../assets/stars-background.png";


export class Gameplay extends Phaser.Scene
{
    constructor()
    {
        super({ key: "Gameplay" });
        this.bulletGroupCount = 0;
        this.bg1ScrollSpeed = 0.1;
        this.bg2ScrollSpeed = 0.15;
    }

    startGame()
    {
        this.playerShip = new PlayerShip({scene: this, position:{ x: 150, y: 150 }, image: 'ship'});
        this.playerShip.playIntroSequence();

        this.time.addEvent({
            delay: 4000,
            callback: function(){
                this.physics.add.overlap(this.playerShip, this.starGroup, this.collectStar, null, this);
                this.physics.add.overlap(this.playerShip, this.cometGroup, this.handleCometCollision, null, this);   
                this.physics.add.overlap(this.bulletGroup, this.cometGroup, this.handleBulletCometCollision, null, this);
                this.physics.add.overlap(this.bulletGroup, this.enemyShip2Group, this.handleBulletCometCollision, null, this);  
                this.physics.add.overlap(this.bulletGroup, this.debrisGroup, this.handleBulletCometCollision, null, this);
                this.physics.add.overlap(this.playerShip, this.debrisGroup, this.handleCometCollision, null, this);
                this.physics.add.overlap(this.playerShip, this.enemyShip2Group, this.handleCometCollision, null, this);  
        
                // this.time.addEvent({
                //     delay: 1000 + (3000 * (Math.random())),
                //     callback: this.addStar,
                //     callbackScope: this,
                //     loop: false
                // });

                this.time.addEvent({
                    delay:  800 + (4000 * Math.random()),
                    callback: this.addComet,
                    callbackScope: this,
                    loop: false
                });
        
                this.time.addEvent({
                    delay:  200 + (4000 * Math.random()),
                    callback: this.addEnemyShip2,
                    args: [{type: "straight"}],
                    callbackScope: this,
                    loop: false
                });

                this.time.addEvent({
                    delay:  800 + (4000 * Math.random()),
                    callback: this.addEnemyShip2,
                    args: [{type: "sin"}],
                    callbackScope: this,
                    loop: false
                });
            },
            callbackScope: this,
            loop: false
        });

        if(!this.bgm.isPlaying)
            this.bgm.play({loop: true, volume: 0.5});
        
    }

    collectStar(player, star)
    {
        this.starsCollected++;
        star.collect();
        this.pickupSound.play({volume: 0.6})
    }

    handleCometCollision(player, comet)
    {
        comet.takeDamage();
        const scene = this.scene;

        this.cameras.main.shake(100, new Phaser.Math.Vector2(0.05, 0.05), true);
        this.cameras.main.flash(5, 255, 255, 255);
        const explosion = new Explosion(this, player.x, player.y, 'explosion');
        explosion.play();

        player.destroy();
        this.explosionSound.play();
        this.bgm.stop();
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                scene.restart();
            },
            callbackScope: this
        })

    }

    handleBulletCometCollision(bullet, comet)
    {
        bullet.die();
        comet.takeDamage();
    }

    addStar()
    {
        let newStar = this.starGroup.getFirstDead({key: 'star', x: 0, y: 0});
        if(newStar)
        {
            newStar.init();
            newStar.setActive(true).setVisible(true);
        }
        else
        {
            console.warn("no available star to spawn")
        }

        this.time.addEvent({
            delay: 1000 + (3000 * (Math.random())),
            callback: this.addStar,
            callbackScope: this,
            loop: false
        });
    }

    addBullet(position, direction)
    {
        //this.cameras.main.shake(50, new Phaser.Math.Vector2(0.005, 0.005));

        let newBullet = this.bulletGroup.getFirstDead({key: 'bullet', x: 0, y: 0});
        if(!newBullet)
        {
            console.warn("no available bullet");
            return;
        }
        newBullet.init(position, direction);
        newBullet.setActive(true).setVisible(true);
    }

    addComet()
    {
        if(this.starsCollected < 25)
        {
            const newComet = this.cometGroup.getFirstDead({key: 'comet', x: 0, y: 0});
            if(newComet)
            {
                newComet.group = this.cometGroup;
                newComet.init();
                newComet.setActive(true).setVisible(true);
            }
            else
            {
                console.warn("no available comet");
            }
        }

        this.time.delayedCall(
            2000 + (1000 * Math.random()),
            this.addComet,
            null,
            this
        );
    }

    addDebris()
    {
        const newComet = this.cometGroup.getFirstDead({key: 'comet', x: 0, y: 0});
        if(newComet)
        {
            newComet.group = this.cometGroup;
            newComet.init();
            newComet.setActive(true).setVisible(true);
        }
        else
        {
            console.warn("no available comet");
        }

        this.time.delayedCall(
            2000 + (1000 * Math.random()),
            this.addComet,
            null,
            this
        );
    }

    addEnemyShip2(config)
    {
        if((this.starsCollected >= 10 && config.type === "straight") || this.starsCollected >= 25)
        {
            const newEnemyShip2 = this.enemyShip2Group.getFirstDead({key: 'enemy-ship2', x: 0, y: 0});
            if(newEnemyShip2)
            {
                newEnemyShip2.init(config);
            }
            else
            {
                console.warn("no available enemy-ship2");
            }
        }

        this.time.delayedCall(
            1000 + (2000 * Math.random()),
            this.addEnemyShip2,
            [config],
            this
        );
    }


    init() {
        this.timer = 0;
        this.playerShip = null;
        this.playerInput = {};
        this.starsCollected = 0;
        this.playerInput.up = this.input.keyboard.addKey('W');
        this.playerInput.down = this.input.keyboard.addKey('S');
        this.playerInput.left = this.input.keyboard.addKey('A');
        this.playerInput.right = this.input.keyboard.addKey('D');
    }
    
    preload() {
        this.load.spritesheet('ship', shipImage, { frameWidth: 24, frameHeight: 16 });
        this.load.image('star', starImage);
        this.load.image('green-gem', greenGemImage);
        this.load.spritesheet('bullet', bulletImage, { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('explosion', explosionImage, { frameWidth: 32, frameHeight: 32 });

        this.load.image('comet', cometImage);
        this.load.image('comet-small', cometSmallImage);
        this.load.image('enemy-ship-2', enemy2Texture);

        this.load.audio('explosionSfx', require('../assets/Explosion.ogg'));
        this.load.audio('hitSfx', require('../assets/Hit_Hurt.ogg'));
        this.load.audio('laserSfx', require('../assets/Laser_Shoot4.mp3'));
        this.load.audio('pickupSfx', require('../assets/Pickup_Coin.ogg'));
        this.load.audio('bgm', require('../assets/bgm.mp3'));

        this.load.image('starsBackground', starBackgroundImage);

    }
    
    create() {
        this.input.mouse.disableContextMenu();

        this.anims.create({ 
            key: 'bullet',
            frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({ 
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7}),
            frameRate: 14
        });

        this.anims.create({ 
            key: 'ship',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 3}),
            frameRate: 14,
            repeat: -1
        });

        this.background1 = this.add.tileSprite(0, 0, 512, 512, 'starsBackground').setOrigin(0, 0);
        this.background2 = this.add.tileSprite(0, 0, 512, 512, 'starsBackground').setOrigin(0, 0);
        this.background2.setScale(1.5);
        this.background1.setAlpha(0.3);
        this.background2.setAlpha(0.7);
        this.starInfoText = this.add.text(8, 8, '$' + this.starsCollected);

        this.bulletGroup = this.physics.add.group(
            {
                defaultKey: 'bullet',
                classType: Bullet,
                maxSize: 10
            });

        this.starGroup = this.physics.add.group(
            {
                defaultKey: 'green-gem', 
                classType: Star,
                maxSize: 25,
                createCallback: function(star)
                {
                    star.init();
                }
            });

        this.cometGroup = this.physics.add.group(
            {
                defaultKey: 'comet', 
                classType: Comet,
                maxSize: 5,
                createCallback: function(comet)
                {
                    comet.init();
                }
            });

        this.debrisGroup = this.physics.add.group(
            {
                defaultKey: 'comet-small',
                classType: Comet,
                maxSize: 50,
                createCallback: function(debris)
                {
                    //debris.init();
                }
            }
        );
        
        this.enemyShip2Group = this.physics.add.group(
            {
                defaultKey: 'enemy-ship-2',
                classType: EnemyShip,
                maxSize: 10,
                createCallback: function(enemyShip)
                {
                    //enemyShip.init();
                }
            });
        
        
        this.bgm = this.sound.add('bgm');
        this.laserSound = this.sound.add('laserSfx');
        this.hitSound = this.sound.add('hitSfx');
        this.explosionSound = this.sound.add('explosionSfx');
        this.pickupSound = this.sound.add('pickupSfx');

        this.startGame();

    }

    update(time, delta) {
        this.background1.tilePositionX += delta * this.bg1ScrollSpeed;
        this.background2.tilePositionX += delta * this.bg1ScrollSpeed;

        if(true === true)
        {   
            const text = `$${this.starsCollected}`;
    
            this.starInfoText.setText(text)
        }

        if(this.bulletGroup && this.bulletInfoText)
        {   
            const size = this.bulletGroup.getLength()
            const used = this.bulletGroup.getTotalUsed()
            const text = `bullets: ${size}, used: ${used}`;
    
            this.bulletInfoText.setText(text)
        }

        if(this.playerShip && this.playerShip.active)
            this.playerShip.update(time, delta);

        const bulletGroup = this.bulletGroup;
        const starGroup = this.starGroup;
        const cometGroup = this.cometGroup;
        const enemyShip2Group = this.enemyShip2Group;


        bulletGroup.children.iterate(function(bullet) {
            if(!bullet.active)
                return;

            if((bullet.x + bullet.width) < 0 || bullet.x > 512 || bullet.y > 512 || (bullet.y + bullet.height < 0))
            {
                bulletGroup.killAndHide(bullet);
            }
        });

        starGroup.children.iterate(function(star) {
            if(!star.active)
                return;

            star.update(time, delta);
        });
        
        cometGroup.children.iterate(function(comet) {
            if(!comet.active)
                return;

            comet.update(time, delta);
        });

        this.debrisGroup.children.iterate(function(debris){
            if(!debris.active)
                return;

            debris.update(time, delta);
        });

        enemyShip2Group.children.iterate(function(enemyShip) {
            if(!enemyShip.active)
                return;

            enemyShip.update(time, delta);
        });


        
    }
}