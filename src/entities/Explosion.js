export class Explosion extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture)
    {
        super(scene, x, y, texture);
    }

    play()
    {
        this.setScale(3);
        this.scene.add.existing(this);
        this.anims.play('explosion', true);
    }
}