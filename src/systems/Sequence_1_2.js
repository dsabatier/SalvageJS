export class Sequence_1_2
{
    constructor(scene)
    {
        this.scene = scene;
    }

    play()
    {
        const ship = this.scene.getAsteroid();
        ship.init();
        ship.y = this.scene.customWorldBounds.height / 2;

        const path = new Phaser.Curves.Path(this.scene.customWorldBounds.width, this.scene.customWorldBounds.height / 2);
        
        for(let i = 0; i < 8; i++)
        {
            path.ellipseTo(-50, 50, 180, 360, i % 2 === 0, 0)
        }

        const graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0xff0000, 1);
        path.draw(graphics);

    }
}