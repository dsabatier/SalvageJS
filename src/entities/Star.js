export class Star extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'green-gem');
        this.speed = 0;
        this.direction = new Phaser.Math.Vector2(0, 0);

    }

    collect()
    {
        this.disable();
    }

    init()
    {
        this.enable();
        
        this.setActive(true);
        this.setVisible(true);

        this.body.setSize(16,16,true);
        this.setScale(3);
        this.body.allowGravity = false;

        this.body.allowDrag = false;
        this.body.collideWorldBounds = false;

        const direction = new Phaser.Math.Vector2(0, 0);

        const xRoll = Math.random();
        const yRoll = Math.random();


        this.x = xRoll > 0.5 ? this.scene.cameras.main.width : 0;
        this.y = yRoll > 0.5 ? this.scene.cameras.main.width : 0;
        
        direction.x = xRoll > 0.5 ? -0.3 + (-Math.random() * 0.7) : 0.3 + (Math.random() * 0.7);
        direction.y = yRoll > 0.5 ? -Math.random() : Math.random();

        this.speed = 10 + (Math.random() * 20);

        direction.normalize();
        this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
    }

    update()
    {
        if((this.x + this.width) < 0 || (this.x - this.width) > this.scene.cameras.main.width || (this.y - this.height) > this.scene.cameras.main.height || (this.y + this.height) < 0)
        {
            this.scene.starGroup.killAndHide(this);
            this.disable();
            return;
        }
    }

    enable()
    {
        this.scene.physics.world.enable(this);
        this.setActive(true)
        .setVisible(true);
    }
    
    disable()
    {
        this.scene.starGroup.killAndHide(this);
        this.scene.physics.world.disable(this);
        this.setActive(false).setVisible(false);
    }
}