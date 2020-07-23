export class LinePattern extends Phaser.GameObjects.Group
{
    constructor(world, scene, config)
    {
        super(world, scene);
        this.line = new Phaser.Geom.Line(config.startX, config.startY, config.endX, config.endY);
        this.scene = scene;

        this.startX = config.startX;
        this.startY = config.startY;
        this.endX = config.endX;
        this.endY = config.endY;

        this.speed = config.speed * 0.1;

        this.count = config.count;
        this.graphics = this.scene.add.graphics({ lineStyle: { color: 0x00ff00 } });
        this.rotationSpeed = config.rotationSpeed ? config.rotationSpeed : 0;
    }

    init()
    {
        for(let i = 0; i < this.count; i++)
        {
            const newAsteroid = this.scene.getAsteroid(true);
            this.add(newAsteroid);
            newAsteroid.enable();
        }

        Phaser.Actions.PlaceOnLine(this.getChildren(), this.line);
    }

    update(time, delta)
    {
        if(!this.children)
            return;

        if(process.env.NODE_ENV === 'development')
        {
            this.graphics.clear();
            this.graphics.strokeLineShape(this.line);
        }

        const offsetX = delta * 0.01 * this.speed;        
        Phaser.Geom.Line.Offset(this.line, -offsetX, 0);
        Phaser.Geom.Line.Rotate(this.line, delta * 0.0001 * this.rotationSpeed);
        Phaser.Actions.PlaceOnLine(this.getChildren(), this.line);

        // todo: remove this group from the scene when it is off screen
    }
}

