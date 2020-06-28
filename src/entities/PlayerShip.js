export class PlayerShip extends Phaser.Physics.Arcade.Sprite
{
    constructor(config)
    {
        super(config.scene, config.position.x, config.position.y, config.image);

        this.bulletCooldown = 300;
        this.lastBulletFiredTime = 0;

        this.scene = config.scene;
        this.position = new Phaser.Math.Vector2(config.position.x, config.position.y);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.allowGravity = false;
        this.body.allowDrag = true;
        this.body.setDrag(1500, 1500);

        this.body.setSize(12, 12);
        this.setScale(3);

        this.cursorPosition = {};
        this.cursorPosition.x = 0;
        this.cursorPosition.y = 0;

        this.playerControlsEnabled = false;
        this.anims.play('ship', true);
    }

    spawnBullet()
    {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.input.activePointer.x, this.scene.input.activePointer.y);
        let position = this.body.center;
        const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize();
        position.x += direction.x * 30;
        position.y += direction.y * 30;

        this.scene.addBullet(position, direction);//new Bullet({scene: this.scene, position: {x: position.x + (direction.x * 10), y: position.y + (direction.y * 10)}, image: 'bullet', direction, speed: 380});
        this.scene.laserSound.play({volume: 0.3});
    }

    setPlayerControlsEnabled(enabled)
    {
        this.playerControlsEnabled = enabled;
        this.body.collideWorldBounds = enabled;
    }

    playIntroSequence()
    {
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

    update(time, delta)
    {
        if(!this.playerControlsEnabled)
            return;

        //Phaser.Math.Angle.Between(this.x, this.y, this.scene.input.activePointer.x, this.scene.input.activePointer.y);
        this.flipX = this.scene.input.activePointer.x < this.x;
        const speed = 230;
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