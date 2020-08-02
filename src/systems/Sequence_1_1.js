import { RingPattern } from "../entities/RingPattern";
import { LinePattern } from "../entities/LinePattern";

export class Sequence_1_1
{
    constructor(scene)
    {
        this.scene = scene;
        this.runningTime = 0;
    }

    play()
    {
        this.addDebris({x: 1, y: 0.33, vx: -270, vy: 10, delay: 1000});
        this.addDebris({x: 1, y: 0.66, vx: -270, vy: -5, delay: 3000, spawnsGems: 3});
        this.addDebris({x: 1, y: 0.5, vx: -270, vy: 15, delay: 3000});
        this.addDebris({x: 1, y: 0.2, vx: -270, vy: 20, delay: 1000});
        this.addDebris({x: 1, y: 0.4, vx: -270, vy: -10, delay: 600});
        this.addDebris({x: 1, y: 0.6, vx: -270, vy: 25, delay: 600, spawnsGems: 2});
        this.addDebris({x: 1, y: 0.8, vx: -270, vy: -60, delay: 600, spawnsGems: 3});

        this.addDebris({x: 1, y: 0.8, vx: -270, vy: -60, delay: 3000});
        this.addDebris({x: 1, y: 0.2, vx: -270, vy: 120, delay: 600});
        this.addDebris({x: 1, y: 0.2, vx: -270, vy: 120, delay: 600});
        this.addDebris({x: 1, y: 0.4, vx: -270, vy: 20, delay: 600});
        this.addDebris({x: 1, y: 0.7, vx: -270, vy: -30, delay: 600});
        this.addDebris({x: 1, y: 0.4, vx: -270, vy: 120, delay: 600});
        this.addDebris({x: 1, y: 0.9, vx: -270, vy: -20, delay: 600});
        this.addDebris({x: 1, y: 0.4, vx: -270, vy: 120, delay: 200});
        this.addDebris({x: 1, y: 0.66, vx: -270, vy: 0, delay: 600});

        this.addAsteroid({x: 1, y: 0.5, vx: -220, vy: 5, delay: 3000, invincible: true });
        this.addAsteroid({x: 1, y: 0.8, vx: -470, vy: -90, delay: 3200, invincible: true });
        this.addAsteroid({x: 1, y: 0.6, vx: -270, vy: 15, delay: 3200});

        this.addDebris({x: 1, y: 0.3, vx: -250, vy: -60, delay: 3000});
        this.addDebris({x: 1, y: 0.6, vx: -370, vy: 20, delay: 600});
        this.addDebris({x: 1, y: 0.5, vx: -270, vy: 10, delay: 200});
        this.addDebris({x: 1, y: 0.4, vx: -270, vy: -2, delay: 600});

        this.addAsteroid({x: 1, y: 0.2, vx: -470, vy: 50, delay: 200});
        this.addDebris({x: 1, y: 0.5, vx: -270, vy: 10, delay: 200});
        this.addAsteroid({x: 1, y: 0.3, vx: -270, vy: 90, delay: 600});
        this.addAsteroid({x: 1, y: 0.5, vx: -270, vy: -20, delay: 600,  invincible: true});
        this.addDebris({x: 1, y: 0.55, vx: -240, vy: -10, delay: 200});
        this.addDebris({x: 1, y: 0.65, vx: -270, vy: 5, delay: 200});
        this.addDebris({x: 1, y: 0.35, vx: -320, vy: 90, delay: 200});

        this.addLine({startX: 1.1, endX: 1.1, startY: 0.25, endY: 0.75, count: 4, speed: 350, rotationSpeed: 10, delay: 0});
        this.addLine({startX: 1.1, endX: 1.1, startY: 0, endY: 0.75, count: 5, speed: 350, rotationSpeed: -10, delay: 3000});
        this.addLine({startX: 1.1, endX: 1.1, startY: 0.25, endY: 1, count: 5, speed: 350, delay: 3000});
        this.addLine({startX: 1.1, endX: 1.1, startY: 0, endY: 0.3, count: 3, speed: 350, delay: 3000});
        this.addLine({startX: 1.1, endX: 1.1, startY: 0.7, endY: 1, count: 3, speed: 350, delay: 0});

        this.addAsteroid({x: 1, y: 0.1, vx: -470, vy: 50, delay: 2000});
        this.addDebris({x: 1, y: 0.5, vx: -270, vy: 10, delay: 200});
        this.addAsteroid({x: 1, y: 0.6, vx: -270, vy: 90, delay: 600});
        this.addDebris({x: 1, y: 0.9, vx: -240, vy: -10, delay: 200});
        this.addDebris({x: 1, y: 0.2, vx: -320, vy: 90, delay: 1200});
        this.addAsteroid({x: 1, y: 0.5, vx: -270, vy: -20, delay: 600});
        this.addDebris({x: 1, y: 0.55, vx: -240, vy: -10, delay: 200});
        this.addAsteroid({x: 1, y: 0.3, vx: -270, vy: -20, delay: 600});
        this.addDebris({x: 1, y: 0.7, vx: -270, vy: 5, delay: 600});
        this.addAsteroid({x: 1, y: 0.4, vx: -270, vy: -20, delay: 600});
        this.addDebris({x: 1, y: 0.65, vx: -270, vy: 5, delay: 200});

        this.addAsteroid({x: 0.9, y: 0, vx: 0, vy: 250, delay: 3000, invincible: true});
        this.addAsteroid({x: 0.8, y: 1, vx: 0, vy: -250, delay: 800, invincible: true});
        this.addAsteroid({x: 0.7, y: 0, vx: 0, vy: 250, delay: 800, invincible: true});
        this.addAsteroid({x: 0.6, y: 1, vx: 0, vy: -250, delay: 800, invincible: true});
        this.addAsteroid({x: 0.5, y: 0, vx: 0, vy: 250, delay: 800, invincible: true});
        this.addAsteroid({x: 0.4, y: 1, vx: 0, vy: -250, delay: 800, invincible: true});
        this.addAsteroid({x: 0.3, y: 0, vx: 0, vy: 250, delay: 800, invincible: true});
        this.addAsteroid({x: 0.2, y: 1, vx: 0, vy: -250, delay: 800, invincible: true});
        this.addAsteroid({x: 0.1, y: 0, vx: 0, vy: 250, delay: 800, invincible: true});
        this.addAsteroid({x: 0.0, y: 1, vx: 0, vy: -250, delay: 800, invincible: true});

        this.addRotatingCircle({x: 1.3, y: 0.5, radius: 200, count: 10, startAngle: 0, endAngle: 5, speed: 600, rotationSpeed: 500, delay: 5000});

        this.addDebris({x: 1, y: 0.9, vx: -240, vy: -10, delay: 20000});
        this.addDebris({x: 1, y: 0.2, vx: -320, vy: 90, delay: 1200});
        this.addDebris({x: 1, y: 0.55, vx: -240, vy: -10, delay: 200});
        this.addDebris({x: 1, y: 0.6, vx: -370, vy: 20, delay: 200});
        this.addDebris({x: 1, y: 0.5, vx: -270, vy: 10, delay: 200});
        this.addDebris({x: 1, y: 0.3, vx: -250, vy: -60, delay: 2000});
        this.addDebris({x: 1, y: 0.4, vx: -270, vy: -2, delay: 600});
        this.addAsteroid({x: 1, y: 0.2, vx: -470, vy: 50, delay: 200, invincible: true});
        this.addDebris({x: 1, y: 0.5, vx: -270, vy: 10, delay: 200});
        this.addAsteroid({x: 1, y: 0.3, vx: -270, vy: 90, delay: 200});
        this.addAsteroid({x: 1, y: 0.5, vx: -270, vy: -20, delay: 2000, invincible: true});
        this.addDebris({x: 1, y: 0.55, vx: -240, vy: -10, delay: 200});
        this.addDebris({x: 1, y: 0.65, vx: -270, vy: 5, delay: 200});
        this.addAsteroid({x: 1, y: 0.3, vx: -270, vy: 90, delay: 600, invincible: true});
        this.addAsteroid({x: 1, y: 0.5, vx: -270, vy: -20, delay: 600, invincible: true});
        this.addDebris({x: 1, y: 0.35, vx: -320, vy: 90, delay: 200});
        this.addAsteroid({x: 1, y: 0.3, vx: -270, vy: 90, delay: 200});
        this.addAsteroid({x: 1, y: 0.5, vx: -270, vy: -20, delay: 400});
        this.addDebris({x: 1, y: 0.55, vx: -340, vy: -10, delay: 200});
        this.addDebris({x: 1, y: 0.65, vx: -270, vy: 5, delay: 200});
        this.addAsteroid({x: 1, y: 0.3, vx: -220, vy: 90, delay: 600});
        this.addAsteroid({x: 1, y: 0.5, vx: -290, vy: -60, delay: 600});
        this.addDebris({x: 1, y: 0.35, vx: -320, vy: 90, delay: 200});
        this.addAsteroid({x: 1, y: 0.2, vx: -470, vy: 50, delay: 200, invincible: true});
        this.addDebris({x: 1, y: 0.2, vx: -270, vy: 100, delay: 200});
        this.addAsteroid({x: 1, y: 0.6, vx: -290, vy: 90, delay: 200});
        this.addAsteroid({x: 1, y: 0.4, vx: -220, vy: 90, delay: 2000, invincible: true});
        this.addDebris({x: 1, y: 0.3, vx: -340, vy: -90, delay: 200});
        this.addDebris({x: 1, y: 0.7, vx: -270, vy: 5, delay: 200});

        this.addAsteroid({x: 1, y: 0.4, vx: -470, vy: 10, delay: 3200});
        this.addAsteroid({x: 1, y: 0.35, vx: -470, vy: -10, delay: 200, invincible: true});
        this.addAsteroid({x: 1, y: 0.4, vx: -470, vy: 5, delay: 200});
        this.addAsteroid({x: 1, y: 0.5, vx: -470, vy: 0, delay: 200});

        this.addRotatingCircle({x: 1.3, y: 0.5, radius: 200, count: 10, startAngle: 0, endAngle: 5, speed: 500, rotationSpeed: 500, delay: 5000});
        this.addRotatingCircle({x: 1.3, y: 0.25, radius: 125, count: 5, startAngle: 0, endAngle: 5, speed: 500, rotationSpeed: 500, delay: 5000});
        this.addRotatingCircle({x: 1.3, y: 0.75, radius: 125, count: 5, startAngle: 0, endAngle: 5, speed: 500, rotationSpeed: 500, delay: 5000});

        this.addAsteroid({x: 1, y: 0.7, vx: -470, vy: 10, delay: 13200});
        this.addAsteroid({x: 1, y: 0.85, vx: -470, vy: -10, delay: 200});
        this.addAsteroid({x: 1, y: 0.6, vx: -470, vy: 5, delay: 200});
        this.addAsteroid({x: 1, y: 0.6, vx: -470, vy: 0, delay: 200, invincible: true});

        this.addAsteroid({x: 1, y: 0.5, vx: -470, vy: 20, delay: 3200});
        this.addAsteroid({x: 1, y: 0.75, vx: -470, vy: -20, delay: 200});
        this.addAsteroid({x: 1, y: 0.65, vx: -470, vy: 5, delay: 200});
        this.addAsteroid({x: 1, y: 0.6, vx: -470, vy: 10, delay: 200, invincible: true});


        this.addGiantAsteroid({x: 1.3, y: 0.5, vx: -50, vy: 0, delay: 0});

        this.scene.time.addEvent({
            callback: function() {
                this.scene.endLevel();
            },
            callbackScope: this,
            delay: this.setDelay(5500)
        });

        console.log(this.runningTime);

    }

    setDelay(ms)
    {
        this.runningTime+=ms;
        return this.runningTime;
    }

    addAsteroid(config){
        this.add(this.scene.getAsteroid(config.invincible), config.x, config.y, config.vx, config.vy, config.delay);
    }

    addGiantAsteroid(config)
    {
        this.add(this.scene.getGiantAsteroid(), config.x, config.y, config.vx, config.vy, config.delay);
    }

    addDebris(config) //verticalPercentPosition, vx, vy, delay, spawnsGems = false)
    {
        this.add(this.scene.getDebris(config.spawnsGems), config.x, config.y, config.vx, config.vy, config.delay);
    }

    addRotatingCircle(config)
    {
        this.scene.time.addEvent({
            callback: function ()
            {
                const ringPattern = new RingPattern(
                    this.scene.physics.world, 
                    this.scene, 
                    this.scene.customWorldBounds.width * config.x, 
                    this.scene.customWorldBounds.height * config.y, 
                    config);

                ringPattern.init();
                this.scene.updateGroups.push(ringPattern);
                this.scene.add.existing(ringPattern);
            },
            callbackScope:  this,
            delay: this.setDelay(config.delay),
        })
    }

    addLine(config)
    {
        config.startX =  this.scene.customWorldBounds.width * config.startX;
        config.endX = this.scene.customWorldBounds.width * config.endX;
        config.startY = this.scene.customWorldBounds.height * config.startY;
        config.endY = this.scene.customWorldBounds.height * config.endY;

        this.scene.time.addEvent({
            callback: function ()
            {

                const linePattern = new LinePattern(
                    this.scene.physics.world, 
                    this.scene, 
                    config);

                linePattern.init();
                this.scene.updateGroups.push(linePattern);
                this.scene.add.existing(linePattern);
            },
            callbackScope:  this,
            delay: this.setDelay(config.delay),
        })
    }

    add(obj, x, y, vx, vy, delay)
    {
        this.scene.time.addEvent({
            callback: function ()
            {
                this.x = this.scene.customWorldBounds.width * x;
                this.y = this.scene.customWorldBounds.height * y;
                this.init();
                this.body.setVelocity(vx, vy);
            },
            callbackScope:  obj,
            delay: this.setDelay(delay),
        })
    }

}