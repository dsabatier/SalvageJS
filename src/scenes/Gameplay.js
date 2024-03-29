import { PlayerShip } from "../entities/PlayerShip";
import { Star } from "../entities/Star";
import { Comet } from "../entities/Comet";
import { Bullet } from "../entities/Bullet";
import { EnemyShip } from "../entities/EnemyShip";
import { Explosion } from "../entities/Explosion";

import shipImage from "../assets/ship2-Sheet.png";
import carImage from "../assets/car-Sheet.png";
import bulletImage from "../assets/basic_bullet-Sheet.png";
import explosionImage from "../assets/explosion-Sheet.png";
import bulletMuzzleFlash from "../assets/bullet-muzzle-flash-Sheet.png";
import chargedBulletMuzzleFlash from "../assets/charged-bullet-muzzle-flash-Sheet.png";
import gemCollectFlash from '../assets/gem-collect-Sheet.png';
import starImage from '../assets/star.png';
import greenGemImage from '../assets/green-gem.png';
import asteroidGiantImage from '../assets/asteroid-giant.png';
import asteroidMediumTexture from '../assets/asteroid-med-Sheet.png';
import cometSmallImage from '../assets/asteroid-sm-Sheet.png';
import oreSmallImage from '../assets/ore-small-Sheet.png';
import enemy2Texture from '../assets/enemy-ship2.png';
import cursorTexture from '../assets/cursor-Sheet.png';
import bulletImpactTexture from '../assets/bullet-impact-Sheet.png';
import greenChargingTexture from '../assets/green-charging-Sheet.png';
import bottomUIBGTexture from '../assets/bottom-ui-bar-bg.png';
import hpBarBorderTexture from '../assets/hp-bar-border.png';
import mouseButtonTexture from '../assets/mouse-button.png';
import miniBulletTexture from '../assets/mini-bullet-Sheet.png';
import starBackgroundImage from "../assets/stars-background.png";
import lavaYellowBackgroundImage from "../assets/lava-yellow.png";
import lavaOrangeBackgroundImage from "../assets/lava-orange.png";
import rapidFireIconTexture from '../assets/rapid-fire-icon.png';
import normalBulletIconTexture from '../assets/normal-bullet-icon.png';
import absorbIconTexture from '../assets/absorb-icon.png';
import stalagmiteImage from '../assets/stalagmite-bg.png';
import { flash } from "../utils/ImageEffects";
import levelConfig  from "../systems/levelConfig";


export class Gameplay extends Phaser.Scene
{
    constructor()
    {
        super({ key: "Gameplay" });
        this.bulletGroupCount = 0;
        this.updateGroups = [];
        this.cursorShootMode = true;
        this.customWorldBounds = new Phaser.Geom.Rectangle(0, 0, 768, 512-44);

        this.score = {};
        this.inventory = {};
        this.inventory.oreCount = 0;
        this.score.pointCount = 0;
    }

    startGame()
    {
        this.events.on('switchedWeapon', (equippedWeapon) => {
            if(!this.playerShip.playerControlsEnabled)
                return;

            switch(equippedWeapon.name)
            {
                case 'minigun':
                    this.ui.normalBulletIcon.setAlpha(1);
                    this.ui.rapidFireIcon.setAlpha(0.5);
                    break;
                case 'normal':
                    this.ui.normalBulletIcon.setAlpha(0.5);
                    this.ui.rapidFireIcon.setAlpha(1);
                    break;
            }
        });

        this.playerShip.init();

        this.playerShip.playIntroSequence();

        this.time.addEvent({
            delay: 4000,
            callback: function(){
                this.physics.add.overlap(this.playerShip, this.oreGroup, this.collectStar, null, this);
                this.physics.add.overlap(this.playerShip, this.cometGroup, this.handleCometCollision, null, this);   
                this.physics.add.overlap(this.bulletGroup, this.cometGroup, this.handleBulletCometCollision, null, this);
                this.physics.add.overlap(this.miniBulletGroup, this.cometGroup, this.handleBulletCometCollision, null, this);
                this.physics.add.overlap(this.miniBulletGroup, this.debrisGroup, this.handleBulletCometCollision, null, this);
                this.physics.add.overlap(this.bulletGroup, this.debrisGroup, this.handleBulletCometCollision, null, this);
                this.physics.add.overlap(this.playerShip, this.debrisGroup, this.handleCometCollision, null, this);
                this.physics.add.overlap(this.playerShip, this.enemyShipGroup, this.handleCometCollision, null, this);
                this.physics.add.overlap(this.bulletGroup, this.giantAsteroid, this.handleBulletCometCollision, null, this);
                this.physics.add.overlap(this.miniBulletGroup, this.giantAsteroid, this.handleBulletCometCollision, null, this);
                

                // start first sequence
                this.time.addEvent({
                    delay: 1000,
                    callback: function()
                    {
                        this.levelConfig.data[this.currentLevel].sequence(this).play();
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
        gemCollectFlash.setScale(2);
        gemCollectFlash.setDepth(this.playerShip.depth+1);

        this.oreGroup.killAndHide(star);
        star.setActive(false).setVisible(false);
        this.physics.world.disable(star);
        this.pickupSound.play({volume: 0.2})

        this.inventory.oreCount++;
        this.score.pointCount+=15;
    }

    handleCometCollision(player, comet)
    {
        if(player.invincible)
            return;

        comet.takeDamage();
        
        const scene = this.scene;
        const dead = player.takeDamage();

        if(!dead)
        {
            this.explosionSound.play({volume: 0.3, detune: 200});
            this.cameras.main.flash(5, 115, 23, 45);
            this.cameras.main.shake(100, new Phaser.Math.Vector2(0.05, 0.05), true);
            this.ui.hpBarFill.graphics.fillStyle(0xffffff, 1);
            this.time.addEvent({
                delay: 50,
                callback: function() {
                    this.ui.hpBarFill.graphics.fillStyle(0xb4202a, 1);
                },
                callbackScope: this
            })
            return;
        }
            
        this.cameras.main.flash(5, 180, 32, 42);
        this.cameras.main.shake(100, new Phaser.Math.Vector2(0.08, 0.08), true);
        
        const explosion = new Explosion(this, player.x, player.y, 'explosion');
        explosion.play();

        player.destroy();
        this.explosionSound.play({volume: 0.4});
        this.bgm.stop();
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                // scene.inventory.oreCount = 0;
                // scene.score.pointsCount = 0;
                scene.start('MainMenu');

            },
            callbackScope: this
        })
    }

    handleBulletCometCollision(bullet, comet)
    {
        const bulletImpact = this.add.sprite(bullet.x, bullet.y, 'bullet-impact').play('bullet-impact');
        bulletImpact.setScale(bullet.key == 'bullet' ? 2 : 1);

        bullet.die();
        comet.takeDamage(bullet.damage);
    }

    addBullet(position, direction, damage)
    {
        let newBullet = this.bulletGroup.getFirstDead({key: 'bullet', x: 0, y: 0});
        newBullet.damage = damage;
        if(!newBullet)
        {
            console.warn("no available bullet");
            return;
        }
        newBullet.init(position, direction);
        newBullet.setActive(true).setVisible(true);
        newBullet.setDepth(this.playerShip.depth-1);
    }

    addMiniBullet(position, direction, damage)
    {
        let newBullet = this.miniBulletGroup.getFirstDead({key: 'mini-bullet', x: 0, y: 0});

        newBullet.anims.play('mini-bullet', true);
        this.physics.world.enable(newBullet);
        if(!newBullet.initialized)
        {        
            newBullet.body.setSize(6, 6);
            newBullet.setScale(2);
            newBullet.initialized = true;
        }

        newBullet.body.setVelocity(direction.x * 420, direction.y * 420);
        newBullet.x = position.x;
        newBullet.y = position.y;
        newBullet.damage = damage;
        if(!newBullet)
        {
            console.warn("no available bullet");
            return;
        }

        newBullet.setActive(true).setVisible(true);
        newBullet.setDepth(this.playerShip.depth-1);

        const muzzleFlash = this.add.sprite(position.x, position.y, 'bullet-muzzle-flash').play('bullet-muzzle-flash');
        muzzleFlash.setScale(1);
        muzzleFlash.setDepth(this.playerShip.depth-1);

        newBullet.disable = function()
        {
            this.scene.bulletGroup.killAndHide(this);
            this.scene.physics.world.disable(this);
            this.setActive(false).setVisible(false);
        }

        newBullet.die = function()
        {
            this.disable();
        }
    }

    addComet()
    {
        if(this.starsCollected < 25)
        {
            const newComet = this.cometGroup.getFirstDead({key: 'asteroid-medium', x: 0, y: 0});
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

    getAsteroid(invincible = false)
    {
        const comet = this.cometGroup.getFirstDead({key: 'asteroid-medium'});
        if(comet)
        {
            comet.body.setCircle(comet.height * 0.4, 3, 3);
            comet.health = 3;
            comet.spawnsDebris = true;
            comet.invincible = invincible;
            if(comet.invincible)
                comet.setFrame(1);

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
            debris.body.setCircle(debris.height * 0.35, 2.8, 2.5);
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
            ore.oreGroup = this.oreGroup;

            ore.disable = function()
            {
                this.oreGroup.killAndHide(this);
                this.scene.physics.world.disable(this);
                this.setActive(false).setVisible(false);
            }
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


    init(data) {
        this.levelConfig = levelConfig;
        this.currentLevel = data.level;
        this.timer = 0;
        this.playerShip = null;
        this.playerInput = {};
        this.starsCollected = 0;
        this.playerInput.up = this.input.keyboard.addKey('W');
        this.playerInput.down = this.input.keyboard.addKey('S');
        this.playerInput.left = this.input.keyboard.addKey('A');
        this.playerInput.right = this.input.keyboard.addKey('D');

        console.log("Starting level: " + this.currentLevel);
    }
    
    preload() {
        this.load.spritesheet('ship', shipImage, { frameWidth: 24, frameHeight: 16 });
        this.load.spritesheet('car', carImage, { frameWidth: 24, frameHeight: 16 });
        this.load.spritesheet('green-charging', greenChargingTexture, { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('bullet', bulletImage, { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('explosion', explosionImage, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('bullet-muzzle-flash', bulletMuzzleFlash, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('charged-bullet-muzzle-flash', chargedBulletMuzzleFlash, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('ore-small', oreSmallImage, { frameWidth: 8, frameHeight: 8});
        this.load.spritesheet('bullet-impact', bulletImpactTexture, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('asteroid-medium', asteroidMediumTexture, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('comet-small', cometSmallImage, { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('gem-collect', gemCollectFlash, { frameWidth: 12, frameHeight: 12});
        this.load.spritesheet('mini-bullet', miniBulletTexture, { frameWidth: 10, frameHeight: 10 });

        this.load.image('starsBackground', starBackgroundImage);
        this.load.image('lavaYellowBackground', lavaYellowBackgroundImage);
        this.load.image('lavaOrangeBackground', lavaOrangeBackgroundImage);
        this.load.image('stalagmiteBackground', stalagmiteImage);
        this.load.image('star', starImage);
        this.load.image('green-gem', greenGemImage);
        this.load.image('asteroid-giant', asteroidGiantImage);
        this.load.image('enemy-ship2', enemy2Texture);
        this.load.image('bottom-ui-bg', bottomUIBGTexture);
        this.load.image('hp-bar-border', hpBarBorderTexture);
        this.load.image('mouse-button', mouseButtonTexture);
        this.load.image('normal-bullet-icon', normalBulletIconTexture);
        this.load.image('rapid-fire-icon', rapidFireIconTexture);
        this.load.image('absorb-icon', absorbIconTexture);

        this.load.spritesheet('cursor', cursorTexture, { frameWidth: 16, frameWidth: 16 });

        this.load.audio('explosionSfx', require('../assets/Explosion.ogg'));
        this.load.audio('hitSfx', require('../assets/Hit_Hurt.ogg'));
        this.load.audio('laserSfx', require('../assets/Laser_Shoot11.mp3'));
        this.load.audio('pickupSfx', require('../assets/Pickup_Coin.ogg'));
        this.load.audio('bgm', require('../assets/bgm-mix3.mp3'));
        this.load.audio('absorbingSfx', require('../assets/absorbing-sound.mp3'));
        this.load.audio('invincibleImpactSfx', require('../assets/invincible-impact.mp3'))
        this.load.audio('switchWeaponSfx', require('../assets/switch-weapon.mp3'));
        this.load.audio('shortChargeUpSfx', require('../assets/short-charge-up.mp3'));

    }
    
    create() {
        this.input.mouse.disableContextMenu();
        this.sys.canvas.style.cursor = 'none';
        this.graphicsObj = this.add.graphics();

        this.anims.create({ 
            key: 'bullet',
            frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({ 
            key: 'mini-bullet',
            frames: this.anims.generateFrameNumbers('mini-bullet', { start: 0, end: 2}),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({ 
            key: 'bullet-muzzle-flash',
            frames: this.anims.generateFrameNumbers('bullet-muzzle-flash', { start: 0, end: 4}),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({ 
            key: 'charged-bullet-muzzle-flash',
            frames: this.anims.generateFrameNumbers('charged-bullet-muzzle-flash', { start: 0, end: 6}),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true
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

        this.anims.create({
            key: 'green-charging',
            frames: this.anims.generateFrameNumbers('green-charging', { start: 0, end: 6 }),
            frameRate: 18,
            repeat: -1
        })
        
        this.playerShip = new PlayerShip({scene: this, position:{ x: 150, y: 150 }, image: 'ship'});
        this.levelConfig.data[this.currentLevel].setup(this);

        this.physics.world.setBounds(this.customWorldBounds.x, this.customWorldBounds.y, this.customWorldBounds.width, this.customWorldBounds.height);
        this.bulletGroup = this.add.group(
            {
                defaultKey: 'bullet',
                classType: Bullet,
                maxSize: 10
            });

        this.miniBulletGroup = this.add.group(
            {
                defaultKey: 'mini-bullet',
                maxSize: 25
            });

        this.starGroup = this.physics.add.group(
            {
                defaultKey: 'green-gem', 
                classType: Star,
                maxSize: 50
            });

        this.cometGroup = this.add.group(
            {
                defaultKey: 'asteroid-medium', 
                classType: Comet,
                maxSize: 50,
                createCallback: function(comet)
                {
                    comet.setName('asteroid-medium' + this.getLength());
                    comet.enable();
                    comet.x = -100;
                    comet.setFrame(0);
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
            this.setScale(2);

    
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
                oreArray[oreArray.length-1].setScale(2);
                oreArray[oreArray.length-1].body.collideWorldBounds = false;

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

                this.scene.time.addEvent({
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
                
                this.disable();

            }
        };

        this.giantAsteroid.disable = function()
        {
            this.scene.physics.world.disable(this);
            this.setActive(false).setVisible(false);
        }

        this.bgm = this.sound.add('bgm');
        this.laserSound = this.sound.add('laserSfx');
        this.shortChargeUpSound = this.sound.add('shortChargeUpSfx');
        this.hitSound = this.sound.add('hitSfx');
        this.explosionSound = this.sound.add('explosionSfx');
        this.pickupSound = this.sound.add('pickupSfx');
        this.invincibleImpactSound = this.sound.add('invincibleImpactSfx');
        this.absorbingSound = this.sound.add('absorbingSfx');
        this.weaponSwitchSound = this.sound.add('switchWeaponSfx');

        this.startGame();
        this.customCursor = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'cursor', 0);
        //this.customCursor.setFrame(1);
        this.customCursor.setScale(2);
        this.customCursor.setActive(false).setVisible(false);

        if(process.env.NODE_ENV === 'development')
            this.activeText = this.add.text(10, 10, "Active Asteroids: 0, Active Debris: 0");

        this.ui = {};

        this.ui.bottomBarBg = this.add.image(768/2, 512-24, 'bottom-ui-bg');
        this.ui.bottomBarBg.setDepth(50);
        this.ui.bottomBarBg.setScale(3, 2);

        this.ui.gemIcon = this.add.image(575, 512-24, 'green-gem');
        this.ui.gemIcon.setDepth(51);
        this.ui.gemIcon.setScale(2);

        this.oreCountText = this.add.bitmapText(this.ui.gemIcon.x + 22, this.ui.gemIcon.y+13, 'main', "1", -14).setOrigin(0, 0.5);
        this.oreCountText.setTintFill(0xffffff);
        this.oreCountText.setScale(2);
        this.oreCountText.setDepth(51);

        this.spaceBarText = this.add.bitmapText(350, this.ui.gemIcon.y, 'main', "Space Bar to Switch", -8).setOrigin(0, 0.5);
        this.spaceBarText.setTintFill(0xffffff);
        this.spaceBarText.setScale(2);
        this.spaceBarText.setDepth(51);

        this.pointsCountText = this.add.bitmapText(this.customWorldBounds.width/2, 24, 'main', "1", -24).setOrigin(0.5, 0.5);
        this.pointsCountText.setTintFill(0x588dbe);
        this.pointsCountText.setScale(1.5);
        this.pointsCountText.setDepth(51);

        this.ui.hpBarBorder = this.add.image(24, 512-24, 'hp-bar-border').setOrigin(0, 0.5);
        this.ui.hpBarBorder.setScale(3);
        this.ui.hpBarBorder.setDepth(51);

        this.ui.hpBarFill = {};
        this.ui.hpBarFill.rect = new Phaser.Geom.Rectangle(33, 512-30, 46*3, 13);
        this.ui.hpBarFill.graphics = this.add.graphics({ fillStyle: { color: 0xb4202a }})
        this.ui.hpBarFill.graphics.setDepth(51);
        this.ui.hpBarFill.graphics.fillRectShape(this.ui.hpBarFill.rect);
        this.ui.hpBarFill.update = () =>
        {
            this.ui.hpBarFill.graphics.clear();
            const max = 46*3;
            const step = max/3;

            this.ui.hpBarFill.rect.width = step * this.playerShip.health;
            this.ui.hpBarFill.graphics.fillRectShape(this.ui.hpBarFill.rect);
            this.ui.hpBarFill.graphics.setDepth(51);
        }
        this.ui.hpBarFill.update.bind(this);

        this.ui.leftMouseButtonIcon = this.add.image(216, 512-24, 'mouse-button');
        this.ui.leftMouseButtonIcon.setDepth(51);
        this.ui.leftMouseButtonIcon.setScale(2);

        // this.ui.rightMouseButtonIcon = this.add.image(370, 512-24, 'mouse-button');
        // this.ui.rightMouseButtonIcon.setDepth(51);
        // this.ui.rightMouseButtonIcon.setScale(2);
        // this.ui.rightMouseButtonIcon.flipX = true;

        this.ui.normalBulletIcon = this.add.image(250, 512-24, 'normal-bullet-icon');
        this.ui.normalBulletIcon.setDepth(51);
        this.ui.normalBulletIcon.setScale(2);

        this.ui.rapidFireIcon = this.add.image(308, 512-24, 'rapid-fire-icon');
        this.ui.rapidFireIcon.setDepth(51);
        this.ui.rapidFireIcon.setScale(2);
        this.ui.rapidFireIcon.setAlpha(0.5);

        // this.ui.absorbIcon = this.add.image(409, 512-33, 'absorb-icon');
        // this.ui.absorbIcon.setDepth(51);
        // this.ui.absorbIcon.setScale(2);
    }

    update(time, delta) {
        if(process.env.NODE_ENV === 'development')
        {
            this.activeText.setText(`Active Asteroids: ${this.cometGroup.countActive()}\nActive Debris: ${this.debrisGroup.countActive()}\nActive Gems: ${this.starGroup.countActive()}\nActive Ore: ${this.oreGroup.countActive()}`);
        }

        this.ui.hpBarFill.update();
        this.oreCountText.setText(String(this.inventory.oreCount));
        this.pointsCountText.setText(String(this.score.pointCount));
        this.customCursor.x = this.input.activePointer.x;
        this.customCursor.y = this.input.activePointer.y;
        this.customCursor.setDepth(100);

        if(this.playerShip && this.playerShip.active)
            this.playerShip.update(time, delta);

        const scene = this;

        const starGroup = this.starGroup;
        const cometGroup = this.cometGroup;
        const enemyShipGroup = this.enemyShipGroup;
        const oreGroup = this.oreGroup;

        this.bulletGroup.children.iterate(function(bullet) {
            if(!bullet.active)
                return;

            scene.disableIfOutOfBounds(bullet, true);
        });

        this.miniBulletGroup.children.iterate(function(bullet) {
            if(!bullet.active)
                return;

            scene.disableIfOutOfBounds(bullet, true);
        });

        starGroup.children.iterate(function(star) {
            if(!star.active)
                return;

            scene.disableIfOutOfBounds(star);
        });
        
        cometGroup.children.iterate(function(comet) {
            if(!comet.active)
                return;

            scene.disableIfOutOfBounds(comet);
        });

        this.debrisGroup.children.iterate(function(debris){
            if(!debris.active)
                return;

            scene.disableIfOutOfBounds(debris);
        });

        enemyShipGroup.children.iterate(function(enemyShip) {
            if(!enemyShip.active)
                return;

            scene.disableIfOutOfBounds(enemyShip);
        });

        oreGroup.children.iterate(function(ore) {
            if(!ore.active)
                return;

            const angle = Phaser.Math.Angle.Between(ore.x, ore.y, ore.scene.playerShip.x, ore.scene.playerShip.y);
            const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize();
            const distance = Phaser.Math.Distance.Between(ore.x, ore.y, ore.scene.playerShip.x, ore.scene.playerShip.y);

            if(distance < 150 || ore.beingCollected)
            {
                ore.beingCollected = true;
                const ratio = Phaser.Math.Clamp(256 - distance, 0, 256) / 256;
                const speed = 100 + (300 * ratio);  
    
                ore.body.setVelocity(direction.x * speed, direction.y * speed);
            }

            scene.disableIfOutOfBounds(ore, true);
        });

        if(this.giantAsteroid.body)
            this.disableIfOutOfBounds(this.giantAsteroid);

        this.graphicsObj.clear();

        for(let i = 0; i < this.updateGroups.length; i++)
        {
            this.updateGroups[i].update(time, delta);
        }

        this.scrollingBackground.update(time, delta);
    }

    disableIfOutOfBounds(go, checkRightSide)
    {

        if((go.x + go.body.width) < 0 || go.y > this.customWorldBounds.height + 200 || go.y < -200 || (checkRightSide && go.x > this.customWorldBounds.width))
        {
            go.disable();
            return;
        }
    }
}