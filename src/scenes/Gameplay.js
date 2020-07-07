import { PlayerShip } from "../entities/PlayerShip";
import { Star } from "../entities/Star";
import { Comet } from "../entities/Comet";
import { Bullet } from "../entities/Bullet";
import { EnemyShip } from "../entities/EnemyShip";
import { Explosion } from "../entities/Explosion";

import { Sequence_1 } from "../systems/Sequence_1";

import shipImage from "../assets/ship2-Sheet.png";
import bulletImage from "../assets/basic_bullet-Sheet.png";
import explosionImage from "../assets/explosion-Sheet.png";
import bulletMuzzleFlash from "../assets/bullet-muzzle-flash-Sheet.png";
import gemCollectFlash from '../assets/gem-collect-Sheet.png';
import starImage from '../assets/star.png';
import greenGemImage from '../assets/green-gem.png';
import asteroidGiantImage from '../assets/asteroid-giant.png';
import cometImage from '../assets/asteroid-med.png';
import cometSmallImage from '../assets/asteroid-sm-Sheet.png';
import oreSmallImage from '../assets/ore-small-Sheet.png';
import enemy2Texture from '../assets/enemy-ship2.png';
import cursorTexture from '../assets/cursor.png';
import bulletImpactTexture from '../assets/bullet-impact-Sheet.png';

import starBackgroundImage from "../assets/stars-background.png";
import { flash } from "../utils/ImageEffects";


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
        this.playerShip.init();

        this.playerShip.playIntroSequence();

        this.time.addEvent({
            delay: 4000,
            callback: function(){
                this.physics.add.overlap(this.playerShip, this.oreGroup, this.collectStar, null, this);
                this.physics.add.overlap(this.playerShip, this.cometGroup, this.handleCometCollision, null, this);   
                this.physics.add.overlap(this.bulletGroup, this.cometGroup, this.handleBulletCometCollision, null, this);
                this.physics.add.overlap(this.bulletGroup, this.enemyShipGroup, this.handleBulletCometCollision, null, this);  
                this.physics.add.overlap(this.bulletGroup, this.debrisGroup, this.handleBulletCometCollision, null, this);
                this.physics.add.overlap(this.playerShip, this.debrisGroup, this.handleCometCollision, null, this);
                this.physics.add.overlap(this.playerShip, this.enemyShipGroup, this.handleCometCollision, null, this);
                this.physics.add.overlap(this.bulletGroup, this.giantAsteroid, this.handleBulletCometCollision, null, this);
                

                // start first sequence
                this.time.addEvent({
                    delay: 1000,
                    callback: function()
                    {
                        const sequence = new Sequence_1(this);
                        sequence.play();
                    },
                    callbackScope: this,
                    loop: false
                });
            },
            callbackScope: this,
            loop: false
        });

        if(!this.bgm.isPlaying)
            this.bgm.play({loop: true, volume: 0.4});
        
    }

    endLevel()
    {
        if(this.cometGroup.countActive() === 0 && this.debrisGroup.countActive() === 0 && this.oreGroup.countActive() === 0 && this.giantAsteroid.active === false)
        {
            this.time.addEvent({
                callback:function()
                {
                    this.customCursor.setActive(false).setVisible(false);
                    this.playerShip.setPlayerControlsEnabled(false);
                    this.playerShip.playExitSequence();
                },
                callbackScope: this,
                delay: 2500
            });
        }
        else
        {
            this.time.addEvent({
                callback:this.endLevel,
                callbackScope: this,
                delay: 500
            });
        }

    }

    collectStar(player, star)
    {
        const gemCollectFlash = this.add.sprite(star.x, star.y, 'gem-collect').play('gem-collect');
        gemCollectFlash.setScale(3);
        gemCollectFlash.setDepth(this.playerShip.depth+1);

        this.oreGroup.killAndHide(star);
        star.setActive(false).setVisible(false);
        this.physics.world.disable(star);
        this.pickupSound.play({volume: 0.2})
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
        this.explosionSound.play({volume: 0.4});
        this.bgm.stop();
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                scene.start('MainMenu');
            },
            callbackScope: this
        })
    }

    handleBulletCometCollision(bullet, comet)
    {
        const bulletImpact = this.add.sprite(bullet.x, bullet.y, 'bullet-impact').play('bullet-impact');
        bulletImpact.setScale(2);

        bullet.die();
        comet.takeDamage();
    }

    addBullet(position, direction)
    {
        let newBullet = this.bulletGroup.getFirstDead({key: 'bullet', x: 0, y: 0});
        if(!newBullet)
        {
            console.warn("no available bullet");
            return;
        }
        newBullet.init(position, direction);
        newBullet.setActive(true).setVisible(true);
        newBullet.setDepth(this.playerShip.depth-1);

        const muzzleFlash = this.add.sprite(position.x, position.y, 'bullet-muzzle-flash').play('bullet-muzzle-flash');
        muzzleFlash.setScale(2);
        muzzleFlash.setDepth(this.playerShip.depth-1);
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
        console.trace();
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

    getEnemyShip()
    {
        const newEnemyShip = this.enemyShipGroup.getFirstDead({key: 'enemy-ship2'});
        if(newEnemyShip)
        {
            return newEnemyShip;
        }
        else
        {
            console.warn("no available enemy-ship2");
        }
    }

    getAsteroid()
    {
        const comet = this.cometGroup.getFirstDead({key: 'comet'});
        if(comet)
        {
            comet.body.setCircle(comet.height * 0.4, 3, 3);
            comet.health = 3;
            comet.spawnsDebris = true;
            return comet;
        }
        else
        {
            console.warn("no available comet");
        }
    }

    getDebris(spawnsGems = 0)
    {
        const debris = this.debrisGroup.getFirstDead({key: 'comet-small'});
        if(debris)
        {
            if(spawnsGems > 0)
            {
                debris.setFrame(1);
            }
            else
            {
                debris.setFrame(0);
            }

            debris.spawnsGems = spawnsGems;
            debris.spawnsDebris = false;
            debris.body.setCircle(debris.height * 0.4, 3, 3);
            debris.health = 1;
            return debris;
        }
        else
        {
            console.warn("no available comet-small");
        }
    }

    getOre()
    {
        const ore = this.oreGroup.getFirstDead({key: 'ore-small'});
        if(ore)
        {
            return ore;
        }
        else
        {
            console.warn("no available ore-small");
        }
    }

    getGiantAsteroid()
    {
        return this.giantAsteroid;
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
        this.load.image('asteroid-giant', asteroidGiantImage);
        this.load.spritesheet('bullet', bulletImage, { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('explosion', explosionImage, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('bullet-muzzle-flash', bulletMuzzleFlash, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('ore-small', oreSmallImage, { frameWidth: 8, frameHeight: 8});
        this.load.spritesheet('bullet-impact', bulletImpactTexture, { frameWidth: 32, frameHeight: 32 });
        this.load.image('comet', cometImage);
        this.load.spritesheet('comet-small', cometSmallImage, { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('gem-collect', gemCollectFlash, { frameWidth: 12, frameHeight: 12});
        this.load.image('enemy-ship2', enemy2Texture);

        this.load.image('cursor', cursorTexture);

        this.load.audio('explosionSfx', require('../assets/Explosion.ogg'));
        this.load.audio('hitSfx', require('../assets/Hit_Hurt.ogg'));
        this.load.audio('laserSfx', require('../assets/Laser_Shoot11.mp3'));
        this.load.audio('pickupSfx', require('../assets/Pickup_Coin.ogg'));
        this.load.audio('bgm', require('../assets/bgm-mix3.mp3'));

        this.load.image('starsBackground', starBackgroundImage);

    }
    
    create() {
        this.input.mouse.disableContextMenu();
        this.sys.canvas.style.cursor = 'none';

        this.anims.create({ 
            key: 'bullet',
            frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({ 
            key: 'bullet-muzzle-flash',
            frames: this.anims.generateFrameNumbers('bullet-muzzle-flash', { start: 0, end: 4}),
            frameRate: 24,
            repeat: 0
        });

        this.anims.create({
            key: 'gem-collect',
            frames: this.anims.generateFrameNumbers('gem-collect', {start: 0, end: 7}),
            frameRate: 18,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: 'bullet-impact',
            frames: this.anims.generateFrameNumbers('bullet-impact', { start: 0, end: 6}),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true
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

        this.background1 = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starsBackground').setOrigin(0, 0);
        this.background2 = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starsBackground').setOrigin(0, 0);
        this.background2.setScale(1.5);
        this.background1.setAlpha(0.3);
        this.background2.setAlpha(0.7);

        this.bulletGroup = this.add.group(
            {
                defaultKey: 'bullet',
                classType: Bullet,
                maxSize: 50
            });

        this.starGroup = this.physics.add.group(
            {
                defaultKey: 'green-gem', 
                classType: Star,
                maxSize: 50
            });

        this.cometGroup = this.add.group(
            {
                defaultKey: 'comet', 
                classType: Comet,
                maxSize: 50,
                createCallback: function(comet)
                {
                    comet.setName('asteroid' + this.getLength());
                    comet.enable();
                    comet.x = -100;
                }
            });

        this.debrisGroup = this.add.group(
            {
                defaultKey: 'comet-small',
                classType: Comet,
                maxSize: 50,
                active: false,
                createCallback: function(comet)
                {
                    comet.setName('debris' + this.getLength());
                    comet.enable();
                    comet.x = -100;
                }
            }
        );
        
        this.enemyShipGroup = this.add.group(
            {
                defaultKey: 'enemy-ship2',
                classType: EnemyShip,
                maxSize: 50,
                createCallback: function(enemy) {
                    enemy.setName('enemy' + this.getLength())
                }
            });

        this.oreGroup = this.add.group(
            {
                defaultKey: 'ore-small',
                maxSize: 50,
                active: false,
                createCallback: function(ore)
                {
                    ore.setName('ore' + this.getLength());
                }
            }
        );

        this.playerShip = new PlayerShip({scene: this, position:{ x: 150, y: 150 }, image: 'ship'});

        this.giantAsteroid = this.make.sprite({
            key: 'asteroid-giant',
            add: false});
        
        this.giantAsteroid.init = function() { 
            this.health = 25;
            this.scene.add.existing(this);
            this.scene.physics.world.enable(this);
            this.setActive(true);
            this.setVisible(true);
            this.body.setCircle(45, 19, 14);
            this.setScale(3);

    
            this.body.allowGravity = false;
            this.body.allowDrag = false;
            this.body.collideWorldBounds = false;
        };

        this.giantAsteroid.spawnGems = function(x, y, count) {
            const oreArray = [];
            for(let i = 0; i < count; i++)
            {
                oreArray.push(this.scene.getOre());
                oreArray[oreArray.length-1].x = x;
                oreArray[oreArray.length-1].y = y;

                this.scene.physics.world.enable(oreArray[oreArray.length-1]);
                oreArray[oreArray.length-1].setActive(true).setVisible(true);
                oreArray[oreArray.length-1].setFrame(0);
                oreArray[oreArray.length-1].setScale(3);
                oreArray[oreArray.length-1].body.collideWorldBounds = true;

                const velocity = new Phaser.Math.Vector2();
                Phaser.Math.RandomXY(velocity, 20);

                oreArray[oreArray.length-1].body.setVelocity(velocity.x, velocity.y);
            }
        };

        this.giantAsteroid.takeDamage = function(config = null) {
            flash(this);
            this.scene.hitSound.play({volume: 0.5});

            this.health--;
            this.scene.hitSound.play({volume: 0.4});
            if(this.health <= 0)
            {
                this.spawnGems(this.x, this.y, 5);
                this.scene.bgm.stop();
                this.scene.cameras.main.shake(2400, new Phaser.Math.Vector2(0.05, 0.05), true);

                const explosion = new Explosion(this.scene, this.x, this.y, 'explosion');
                explosion.play();
                explosion.setScale(5);

                const timer = this.scene.time.addEvent({
                    delay: 333,
                    callback: function(){
                        this.scene.cameras.main.flash(5, 255, 255, 255);
                        this.scene.explosionSound.play({volume: 0.4});
                        const x = this.x + Phaser.Math.Between(-200, 200);
                        const y = this.y + Phaser.Math.Between(-200, 200);
                        const explosion = new Explosion(this.scene, x, y, 'explosion');
                        explosion.play();
                        explosion.setScale(5);

                        this.spawnGems(x, y, 5);
                        
                    },
                    callbackScope: this,
                    repeat: 6
                });              
                

                this.scene.physics.world.disable(this);
                this.setActive(false).setVisible(false);
            }
        };

        this.bgm = this.sound.add('bgm');
        this.laserSound = this.sound.add('laserSfx');
        this.hitSound = this.sound.add('hitSfx');
        this.explosionSound = this.sound.add('explosionSfx');
        this.pickupSound = this.sound.add('pickupSfx');

        this.startGame();
        this.customCursor = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'cursor');
        this.customCursor.setScale(3);
        this.customCursor.setActive(false).setVisible(false);

        this.activeText = this.add.text(10, 10, "Active Asteroids: 0, Active Debris: 0");

    }

    update(time, delta) {
        this.activeText.setText(`Active Asteroids: ${this.cometGroup.countActive()}\nActive Debris: ${this.debrisGroup.countActive()}\nActive Gems: ${this.starGroup.countActive()}\nActive Ore: ${this.oreGroup.countActive()}`);

        this.customCursor.x = this.input.activePointer.x;
        this.customCursor.y = this.input.activePointer.y;
        this.customCursor.setDepth(100);
        this.background1.tilePositionX += delta * this.bg1ScrollSpeed;
        this.background2.tilePositionX += delta * this.bg1ScrollSpeed;

        if(this.playerShip && this.playerShip.active)
            this.playerShip.update(time, delta);

        const scene = this;

        const starGroup = this.starGroup;
        const cometGroup = this.cometGroup;
        const enemyShipGroup = this.enemyShipGroup;
        const oreGroup = this.oreGroup;


        scene.bulletGroup.children.iterate(function(bullet) {
            if(!bullet.active)
                return;

            if((bullet.x + bullet.width) < 0 || bullet.x > scene.cameras.main.width || bullet.y > scene.cameras.main.width || (bullet.y + bullet.height < 0))
            {
                scene.bulletGroup.killAndHide(bullet);
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

        enemyShipGroup.children.iterate(function(enemyShip) {
            if(!enemyShip.active)
                return;

            enemyShip.update(time, delta);
        });

        // oreGroup.children.iterate(function(ore) {
        //     if(!ore.active)
        //         return;

        //     if((ore.x + ore.body.width) < 0 || ore.x > scene.cameras.main.width || ore.y > scene.cameras.main.height || (ore.y + ore.body.height < 0))
        //     {
        //         oreGroup.killAndHide(ore);
        //         ore.setActive(false).setVisible(false);
        //         scene.physics.world.disable(ore);
        //     }
        // });
    }
}