export class Star extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'green-gem');
        this.speed = 0;
        this.direction = new Phaser.Math.Vector2(0, 0);

    }

    collect()
    {
        this.disableBody();
        this.scene.starGroup.killAndHide(this);
    }

    init(x, y)
    {
        if(x || y)
        {
            this.x = x;
            this.y = y;
        }
        //this.scene.physics.add.existing(this);
        this.enableBody(true, x, y, true, true);
        this.body.setSize(16,16,true);
        this.setScale(3);
        this.body.allowGravity = false;

        this.body.allowDrag = false;
        this.body.collideWorldBounds = false;

        const direction = new Phaser.Math.Vector2(0, 0);

        const xRoll = Math.random();
        const yRoll = Math.random();

        if(!x || !y)
        {
            this.x = xRoll > 0.5 ? 512 : 0;
            this.y = yRoll > 0.5 ? 512 : 0;
        }

        direction.x = xRoll > 0.5 ? -0.3 + (-Math.random() * 0.7) : 0.3 + (Math.random() * 0.7);
        direction.y = yRoll > 0.5 ? -Math.random() : Math.random();

        if(!x || !y)
        {
            this.speed = 50 + (Math.random() * 200);
        }
        else
        {
            this.speed = 10 + (Math.random() * 20);
        }

        direction.normalize();
        this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
    }

    update()
    {
        if((this.x + this.width) < 0 || this.x > 512 || this.y > 512 || (this.y + this.height < 0))
        {
            this.scene.starGroup.killAndHide(this);
            return;
        }
    }
}