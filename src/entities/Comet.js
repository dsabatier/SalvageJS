import { Explosion } from './Explosion';
export class Comet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y, key);

        this.type = key;

        this.speed = 0;
        this.direction = new Phaser.Math.Vector2(0, 0);
        this.health = 3;
        this.group = {};
    }

    disableCollider()
    {
        this.disableBody();
    }

    takeDamage()
    {
        this.health--;

        if(this.health <= 0)
        {
            if(this.type === "comet")
            {
                const count = 2 + Math.floor(Math.random() * 2);
                for(let i = 0; i < count; i++)
                {
                    const newDebris = this.scene.debrisGroup.getFirstDead({key: 'comet-small', x: this.x, y: this.y});
                    newDebris.init(this.x, this.y);
                }
            }
            else
            {
                const newStar = this.scene.starGroup.getFirstDead({key: 'star', x: this.x, y: this.y});
                newStar.init(this.x, this.y);
            }
            
            this.disableBody();

            const group = this.type === "comet" ? this.scene.cometGroup : this.scene.debrisGroup;
            group.killAndHide(this);

            this.scene.explosionSound.play({volume: 0.4});

            if(this.type !== "comet")
            {
                const explosion = new Explosion(this.scene, this.x, this.y, 'explosion');
                explosion.play();
            }
            else
            {
                const explosion = new Explosion(this.scene, this.x, this.y, 'explosion');
                explosion.play();
                explosion.setScale(4);
            }
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

    init(x, y)
    {
        if(this.type === "comet")
        {
            this.health = 3;
            this.enableBody();
            this.setScale(3);
            this.body.setCircle(this.height * 0.4, 3, 3);
            this.body.allowGravity = false;
            this.body.allowDrag = false;
            this.body.collideWorldBounds = false;
            this.body.setBounce(0.5);
    
            const direction = new Phaser.Math.Vector2(0, 0);
    
            const xRoll = Math.random();
    
            if(xRoll > 0.5)
            {
                this.x = 512;
                this.y = 50 + Math.random() * (512-50);
                direction.x = -1;
                direction.y = this.y > 256 ? 0.3 + (-Math.random() * 0.4) : 0.3 + Math.random() * 0.4;
            }
            else
            {
                this.x = 0;
                this.y = 50 + Math.random() * (512-50);
                direction.x = 1;
                direction.y = this.y > 256 ? -Math.random() * 0.4 : 0.3 + Math.random() * 0.4;
            }
            
            this.speed = 20 + (Math.random() * 200);
            direction.normalize();
            this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
        }
        else
        {
            this.enableBody(true, x, y, true, true);
            this.x = x;
            this.y = y;
            this.health = 1;

            this.setScale(3);
            this.body.setCircle(this.height * 0.4, 3, 3);
            this.body.allowGravity = false;
            this.body.allowDrag = false;
            this.body.collideWorldBounds = false;
            this.body.setBounce(0.5);
            const randomX = Math.random() * (2 - -1) + -1;
            const randomY = Math.random() * (2 - -1) + -1;
            const direction = new Phaser.Math.Vector2(randomX, randomY);
            this.speed = 20 + (Math.random() * 120);
            direction.normalize();
            this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
        }
        
    }

    update()
    {
        if((this.x + this.body.width) < 0 || this.body.x > 512 || this.body.y > 512 || (this.y + this.body.height < 0))
        {
            const group = this.type === "comet" ? this.scene.cometGroup : this.scene.debrisGroup;
            group.killAndHide(this);
            return;
        }
    }

}