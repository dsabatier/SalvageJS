import { blink, flash } from "../utils/ImageEffects";

export class PlayerShip extends Phaser.Physics.Arcade.Sprite
{
    constructor(config)
    {
        super(config.scene, config.position.x, config.position.y, config.image);

        this.lastBulletFiredTime = 0;

        this.scene = config.scene;
        this.position = new Phaser.Math.Vector2(config.position.x, config.position.y);

        this.cursorPosition = {};
        this.cursorPosition.x = 0;
        this.cursorPosition.y = 0;

        this.playerControlsEnabled = false;
        this.anims.play('ship', true);
        this.chargingImage = null;

        this.collecting = false;
        this.health = 3;
        this.invincible = false;
        this.equippedWeapon = null;

        this.shootButtonDownLastFrame = false;
    }

    init(){

        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this);
        this.setOrigin(0.5, 0.5);
        this.setSize(8, 8, true);
        this.setScale(2);
        this.body.allowGravity = false;
        this.body.allowDrag = true;
        this.body.setDrag(1500, 1500);

        this.switchWeaponKey = this.scene.input.keyboard.addKey('space');
        this.switchWeaponKey.on('down', this.switchWeapon.bind(this));
    }

    takeDamage(amount = 1)
    {
        if(this.invincible)
            return;
            
        this.health-=amount;

        if(this.health <= 0)
        {
            this.health = 0;
            this.switchWeaponKey.removeAllListeners();
            return true;
        }
        else
        {
            this.invincible = true;
            this.scene.time.addEvent({
                delay: 3300,
                callback: function(){
                    this.invincible = false;
                },
                callbackScope: this
            })
        }

        return false;
    }

    switchWeapon()
    {
        if(!this.playerControlsEnabled)
            return;

        this.scene.weaponSwitchSound.play();
        this.scene.events.emit('switchedWeapon', this.equippedWeapon);

        this.equippedWeapon = this.equippedWeapon.name == 'normal' ? this.rapidFireWeapon() : this.normalWeapon();
        this.equippedWeapon.onEquip();
    }

    setPlayerControlsEnabled(enabled)
    {
        this.playerControlsEnabled = enabled;
        this.body.collideWorldBounds = enabled;
        this.scene.customCursor.setActive(enabled).setVisible(enabled);
    }

    playIntroSequence()
    {
        this.flipX = false;
        this.scene.bg1ScrollSpeed = 0.3;
        this.scene.bg2ScrollSpeed = 0.5;

        this.x = -16;
        this.y = 320;

        const tween = this.scene.tweens.add({
            targets: this,
            ease: 'Quad.easeOut',
            x: 200,
            duration: 800,
            repeat: 0,
            yoyo: false
        });

        tween.setCallback('onComplete', function(){ 
            this.setPlayerControlsEnabled(true);
            this.equippedWeapon = this.normalWeapon();
            this.equippedWeapon.onEquip();
            this.scene.bg1ScrollSpeed = 0.1;
            this.scene.bg2ScrollSpeed = 0.15;
        }, {}, this);
    }

    playExitSequence()
    {
        this.flipX = false;
        this.scene.bg1ScrollSpeed = 0.3;
        this.scene.bg2ScrollSpeed = 0.35;

        const tween = this.scene.tweens.add({
            targets: this,
            ease: 'Quad.easeIn',
            x: this.scene.cameras.main.width * 1.5,
            duration: 1200,
            repeat: 0,
            yoyo: false
        });

        const scene = this.scene;
        tween.setCallback('onComplete', function(){
            this.scene.time.addEvent({
                callback: function() {
                    scene.bgm.stop();
                    const nextLevel = scene.currentLevel + 1;
                    if(nextLevel < scene.levelConfig.data.length)
                    {
                        scene.scene.start('Gameplay', { level: nextLevel});
                    }
                    else
                    {
                        scene.scene.start('MainMenu');
                    }

                },
                delay: 2000
            })
        }, {}, this);
    }

    newWeapon(config)
    {
        return {
            name: config.name,
            owner: config.owner,
            cooldown: config.cooldown,
            group: config.group,
            shoot: config.shoot,
            update: config.update,
            onEquip: config.onEquip
        }
    }

    normalWeapon()
    {
        const normalWeapon = this.newWeapon({
            name: 'normal',
            owner: this,
            group: this.scene.bulletGroup,
            cooldown: 600,
            shoot: function()
            {
                if(!this.owner.body)
                    return;
                //const angle = Phaser.Math.Angle.Between(this.owner.x, this.owner.y, this.owner.scene.input.activePointer.x, this.owner.scene.input.activePointer.y);

                const position = this.owner.body.center;
                const direction = new Phaser.Math.Vector2(1, 0).normalize();
                position.x += direction.x * 10;
                position.y += direction.y * 10;
        
                this.owner.scene.addBullet(position, direction, 3);
                this.owner.scene.laserSound.play({volume: 0.5, detune: 0});
                this.owner.scene.cameras.main.shake(100, new Phaser.Math.Vector2(0.005, 0.002), true);

                const muzzleFlash = this.owner.scene.add.sprite(position.x, position.y, 'bullet-muzzle-flash');
                muzzleFlash.play('bullet-muzzle-flash');
                muzzleFlash.once('animationcomplete', () => {
                    muzzleFlash.destroy();
                });
                muzzleFlash.setScale(2);
                muzzleFlash.setDepth(this.owner.depth-1);
            },
            update: function(time, delta)
            {
                const direction = new Phaser.Math.Vector2(1, 0).normalize();

                const position = this.owner.body.center;
                position.x += direction.x * 20;
                position.y += direction.y * 20;

                if(this.muzzleFlash)
                {
                    this.muzzleFlash.setPosition(position.x, position.y);
                }

                if(this.owner.scene.input.activePointer.leftButtonDown())
                {
                    if(time - this.lastBulletFiredTime > this.cooldown && this.group.countActive() < 3)
                    {
                        this.owner.scene.shortChargeUpSound.play({volume: 0.4});
                        this.muzzleFlash = this.owner.scene.add.sprite(position.x, position.y, 'charged-bullet-muzzle-flash').play('charged-bullet-muzzle-flash');
                        this.muzzleFlash.setScale(2);
                        this.muzzleFlash.setDepth(this.owner.depth+1);
                        this.muzzleFlash.once('animationcomplete', () => {
                            this.shoot();
                            this.owner.lastBulletFiredTime = time;

                            this.muzzleFlash.destroy();
                            this.muzzleFlash = null;
                        });

                        this.lastBulletFiredTime = time;
                        this.shootButtonDown = true;
                    }
                }
                else
                {
                    this.shootButtonDown = false;
                }
            },
            onEquip: function()
            {
                this.owner.scene.customCursor.setActive(false).setVisible(false);
            }
        })

        normalWeapon.lastBulletFiredTime = 0;
        normalWeapon.shootButtonDown = false;

        return normalWeapon;
    }

    rapidFireWeapon() {
        const newWeapon = {
            name: 'minigun',
            owner: this,
            group: this.scene.miniBulletGroup,
            cooldown: 150,
            shoot: function()
            {
                let position = this.owner.body.center;
                let angle = Phaser.Math.Angle.Between(this.owner.x, this.owner.y, this.owner.scene.input.activePointer.x, this.owner.scene.input.activePointer.y);
                angle += Phaser.Math.FloatBetween(-0.18, 0.18);
                const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize();
                position.x += direction.x * 20;
                position.y += direction.y * 20;
        
                this.owner.scene.addMiniBullet(position, direction, 0.34);
                this.owner.scene.laserSound.play({volume: 0.5, detune: 800});
            },
            update: function(time, delta)
            {
                if(this.owner.scene.input.activePointer.leftButtonDown())
                {
                    if(time - this.lastBulletFiredTime > this.cooldown && this.group.countActive() < 20)
                    {
                        this.shoot();
                        this.lastBulletFiredTime = time;
                    }
                }
            },
            onEquip: function()
            {
                this.owner.scene.customCursor.setActive(true).setVisible(true);
            }
        }

        newWeapon.lastBulletFiredTime = 0;

        return newWeapon;
    }

    update(time, delta)
    {
        if(!this.playerControlsEnabled)
            return;

        if(this.invincible)
        {
            blink(this);
        }
   
        this.body.setOffset(this.flipX ? 4 : 12, 4);

        const speed = 220;
        const direction = new Phaser.Math.Vector2();
        
        if(this.scene.playerInput.right.isDown)
            direction.x = 1;

        if(this.scene.playerInput.left.isDown)
            direction.x = -1;

        if(this.scene.playerInput.up.isDown)
            direction.y = -1;

        if(this.scene.playerInput.down.isDown)
            direction.y = 1;

        if(this.equippedWeapon)
            this.equippedWeapon.update(time, delta);

        direction.normalize();

        if(direction.x != 0)
            this.body.setVelocityX(direction.x * speed);

        if(direction.y != 0)
            this.body.setVelocityY(direction.y * speed);
    }
}