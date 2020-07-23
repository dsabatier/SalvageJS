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
        this.switchWeaponKey = this.scene.input.keyboard.addKey('space');
        this.switchWeaponKey.on('down', this.switchWeapon.bind(this));

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
    }

    takeDamage()
    {
        if(this.invincible)
            return;
            
        this.health--;

        if(this.health <= 0)
        {
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
                    scene.scene.start('MainMenu');
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
            cooldown: 20,
            shoot: function()
            {
                let position = this.owner.body.center;
                //const angle = Phaser.Math.Angle.Between(this.owner.x, this.owner.y, this.owner.scene.input.activePointer.x, this.owner.scene.input.activePointer.y);
                const direction = new Phaser.Math.Vector2(1, 0).normalize();
                position.x += direction.x * 30;
                position.y += direction.y * 30;
        
                this.owner.scene.addBullet(position, direction, 1);
                this.owner.scene.laserSound.play({volume: 0.5, detune: 0});
            },
            update: function(time, delta)
            {
                if(this.owner.scene.input.activePointer.leftButtonDown())
                {
                    if(!this.shootButtonDown && time - this.lastBulletFiredTime > this.cooldown && this.group.countActive() < 3)
                    {
                        // add delay here
                        this.shoot();
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
            cooldown: 60,
            shoot: function()
            {
                let position = this.owner.body.center;
                let angle = Phaser.Math.Angle.Between(this.owner.x, this.owner.y, this.owner.scene.input.activePointer.x, this.owner.scene.input.activePointer.y);
                angle += Phaser.Math.FloatBetween(-0.25, 0.25);
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