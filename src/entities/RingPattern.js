export class RingPattern extends Phaser.GameObjects.Group
{
    constructor(world, scene, x, y, config)
    {
        super(world, scene);
        this.centerPoint = new Phaser.Geom.Point(x, y);
        this.circle = new Phaser.Geom.Circle(x, y, config.radius);
        this.scene = scene;
        this.radius = config.radius;
        this.x = x;
        this.y = y;
        this.startAngle = config.startAngle;
        this.endAngle = config.endAngle;
        this.speed = config.speed * 0.01;
        this.rotationSpeed = config.rotationSpeed * 0.002;
        this.count = config.count;

        this.circle = new Phaser.Geom.Circle(x, y, config.radius);

        this.graphics = this.scene.add.graphics({ lineStyle: { color: 0x00ff00 } });
    }

    init()
    {
        for(let i = 0; i < this.count; i++)
        {
            const newAsteroid = this.scene.getAsteroid(true);
            this.add(newAsteroid);
            newAsteroid.enable();
        }

        Phaser.Actions.PlaceOnCircle(this.getChildren(), this.circle, 0, 5);
    }

    update(time, delta)
    {
        if(!this.children)
            return;

        if(process.env.NODE_ENV === 'development')
        {
            this.graphics.clear();
            this.graphics.strokeCircleShape(this.circle);
        }
        
        this.x -= delta * 0.01 * this.speed;
        this.circle.setPosition(this.x, this.y);

        this.startAngle += delta * 0.001 * this.rotationSpeed;
        this.endAngle = this.startAngle + 5;

        Phaser.Actions.PlaceOnCircle(this.getChildren(), this.circle, this.startAngle, this.endAngle);
    }
}

