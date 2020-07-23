export class Bullet extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y, key);

        this.scene = scene;
        
    }

    die()
    {
        this.disable();
    }

    init(position, direction)
    {
        this.enable();
        this.x = position.x;
        this.y = position.y;

        this.body.allowGravity = false;
        this.body.allowDrag = true;
        this.body.collideWorldBounds = false;

        this.body.setDrag(0, 0);
        this.body.setSize(12, 12);
        this.setScale(2);

        this.direction = new Phaser.Math.Vector2(1, 0);
        this.speed = 600;

        this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
        this.anims.play('bullet', true);
    }

    enable()
    {
        this.scene.physics.world.enable(this);
        this.setActive(true)
        .setVisible(true);
        this.setPosition(-100, -100);
    }
    
    disable()
    {

        this.scene.bulletGroup.killAndHide(this);
        this.scene.physics.world.disable(this);
        this.setActive(false).setVisible(false);
    }
}