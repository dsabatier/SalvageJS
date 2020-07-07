export class PlayerShip extends Phaser.Physics.Arcade.Sprite
{
    constructor(config)
    {
        super(config.scene, config.position.x, config.position.y, config.image);

        this.bulletCooldown = 270;
        this.lastBulletFiredTime = 0;

        this.scene = config.scene;
        this.position = new Phaser.Math.Vector2(config.position.x, config.position.y);

        this.cursorPosition = {};
        this.cursorPosition.x = 0;
        this.cursorPosition.y = 0;

        this.playerControlsEnabled = false;
        this.anims.play('ship', true);
    }

    init(){
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this);
        this.body.allowGravity = false;
        this.body.allowDrag = true;
        this.body.setDrag(1500, 1500);

        this.body.setSize(12, 12);
        this.setOrigin(0.5, 0.5);
        this.setScale(3);
    }

    spawnBullet()
    {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.input.activePointer.x, this.scene.input.activePointer.y);
        let position = this.body.center;
        const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize();
        position.x += direction.x * 30;
        position.y += direction.y * 30;

        this.scene.addBullet(position, direction);//new Bullet({scene: this.scene, position: {x: position.x + (direction.x * 10), y: position.y + (direction.y * 10)}, image: 'bullet', direction, speed: 380});
        this.scene.laserSound.play({volume: 0.5});
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

    update(time, delta)
    {
        
        if(!this.playerControlsEnabled)
            return;

        //Phaser.Math.Angle.Between(this.x, this.y, this.scene.input.activePointer.x, this.scene.input.activePointer.y);
        this.flipX = this.scene.input.activePointer.x < this.x;       
        this.body.setOffset(this.flipX ? 0 : 10, 1); 

        const speed = 330;
        const direction = new Phaser.Math.Vector2();
        
        if(this.scene.playerInput.right.isDown)
            direction.x = 1;

        if(this.scene.playerInput.left.isDown)
            direction.x = -1;

        if(this.scene.playerInput.up.isDown)
            direction.y = -1;

        if(this.scene.playerInput.down.isDown)
            direction.y = 1;
        
        if(this.scene.input.activePointer.leftButtonDown())
        {
            if((time - this.lastBulletFiredTime) > this.bulletCooldown)
            {
                this.lastBulletFiredTime = time;
                this.spawnBullet()
            }
        }

        direction.normalize();

        if(direction.x != 0)
            this.body.setVelocityX(direction.x * speed);

        if(direction.y != 0)
            this.body.setVelocityY(direction.y * speed);
    }
}