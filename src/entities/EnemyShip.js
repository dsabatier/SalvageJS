import { Explosion } from './Explosion';

export class EnemyShip extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture)
    {
        super(scene, x, y, texture);
    
    }

    takeDamage()
    {
        this.health--;

        if(this.health <= 0)
        {
            const newStar = this.scene.starGroup.getFirstDead({key: 'star', x: this.x, y: this.y});
            newStar.init(this.x, this.y);

            this.disableBody(true, true);
            this.scene.enemyShip2Group.killAndHide(this);

            const explosion = new Explosion(this.scene, this.x, this.y, 'explosion');
            explosion.play();

            this.scene.explosionSound.play({volume: 0.6});

            if(this.xTween)
                this.xTween.stop();

            if(this.yTween)
                this.yTween.stop();
        }
        else
        {
            this.whiteFilled = true;
            this.setTintFill(0xffffff);

            this.scene.time.addEvent({
                delay: 50,
                callback: () => { this.clearTint()},
                callbackScope: this,
                loop: false
            });

            this.scene.hitSound.play({volume: 0.5});
            
        }
    }

    init(config)
    {
        this.enableBody(true, 0, 0, true, true);
        this.health = 2;
        this.x = 512;
        this.y = 112 + (Math.random() * 300)
        this.speed = 100;
        this.direction = new Phaser.Math.Vector2(-1, 0);
        this.body.setSize(16,16,true);
        this.setScale(3);
        this.setType(config);
    }

    setType(config)
    {
        switch(config.type) {
            case "straight":
                this.body.setVelocity(this.direction.x * this.speed, this.direction.y * this.speed);
                break;
            case "sin":
                this.xTween = this.scene.tweens.add({
                    targets: this,
                    ease: 'Linear',
                    x: -16,
                    duration: 4000,
                    repeat: 0,
                    yoyo: false
                });

                this.yTween = this.scene.tweens.add({
                    targets: this,
                    ease: 'Sine.easeInOut',
                    y: this.y + 100,
                    duration: 1000,
                    repeat: -1,
                    yoyo: true
                });
        
                this.xTween.setCallback('onComplete', function(){ 
                    this.yTween.stop();
                }, {}, this);
            default:
                this.body.setVelocity(this.direction.x * this.speed, this.direction.y * this.speed);
        }
    }

    update(time, delta)
    {
        if(this.x <= -16)
        {
            this.scene.enemyShip2Group.killAndHide(this);
            return;
        }
    }

}