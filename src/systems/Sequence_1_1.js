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

        this.addAsteroid({x: 1, y: 0.75, vx: -420, vy: -50, delay: 2200});
        this.addAsteroid({x: 1, y: 0.8, vx: -370, vy: -90, delay: 2200});
        this.addAsteroid({x: 1, y: 0.6, vx: -270, vy: 15, delay: 200});

        this.addDebris({x: 1, y: 0.3, vx: -250, vy: -60, delay: 3000});
        this.addDebris({x: 1, y: 0.6, vx: -370, vy: 20, delay: 600});
        this.addDebris({x: 1, y: 0.5, vx: -270, vy: 10, delay: 200});
        this.addDebris({x: 1, y: 0.4, vx: -270, vy: -2, delay: 600});

        this.addAsteroid({x: 1, y: 0.2, vx: -470, vy: 50, delay: 200});
        this.addDebris({x: 1, y: 0.5, vx: -270, vy: 10, delay: 200});
        this.addAsteroid({x: 1, y: 0.3, vx: -270, vy: 90, delay: 600});
        this.addAsteroid({x: 1, y: 0.5, vx: -270, vy: -20, delay: 600});
        this.addDebris({x: 1, y: 0.55, vx: -240, vy: -10, delay: 200});
        this.addDebris({x: 1, y: 0.65, vx: -270, vy: 5, delay: 200});
        this.addDebris({x: 1, y: 0.35, vx: -320, vy: 90, delay: 200});

        this.addGiantAsteroid({x: 1.3, y: 0.5, vx: -50, vy: 0, delay: 5000});

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
        this.add(this.scene.getAsteroid(), config.x, config.y, config.vx, config.vy, config.delay);
    }

    addGiantAsteroid(config)
    {
        this.add(this.scene.getGiantAsteroid(), config.x, config.y, config.vx, config.vy, config.delay);
    }

    addDebris(config) //verticalPercentPosition, vx, vy, delay, spawnsGems = false)
    {
        this.add(this.scene.getDebris(config.spawnsGems), config.x, config.y, config.vx, config.vy, config.delay);
    }

    add(obj, x, y, vx, vy, delay)
    {
        this.scene.time.addEvent({
            callback: function ()
            {
                this.x = this.scene.cameras.main.width * x;
                this.y = this.scene.cameras.main.height * y;
                this.init();
                this.body.setVelocity(vx, vy);
            },
            callbackScope:  obj,
            delay: this.setDelay(delay),
        })
    }
}