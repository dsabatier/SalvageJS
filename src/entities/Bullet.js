export class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, image)
    {
        super(scene, x, y, image);

        this.scene = scene;
    }

    die()
    {
        this.scene.bulletGroup.killAndHide(this);
        this.disableBody();
    }

    init(position, direction)
    {
        this.enableBody();
        this.x = position.x;
        this.y = position.y;

        this.body.allowGravity = false;
        this.body.allowDrag = true;
        this.body.collideWorldBounds = false;

        this.body.setDrag(0, 0);
        this.body.setSize(12, 12);
        this.setScale(2);

        this.direction = new Phaser.Math.Vector2(1, 0);
        this.speed = 400;

        this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
        this.anims.play('bullet', true);
    }
}