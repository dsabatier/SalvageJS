import { Explosion } from './Explosion';
import { flash } from '../utils/ImageEffects';
export class Comet extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y, key);

        this.type = key;

        this.speed = 0;
        this.direction = new Phaser.Math.Vector2(0, 0);
        this.health = 1;
        this.group = {};
        this.spawnsDebris = false;
        this.spawnsGems = false;
        this.gemsToSpawn = 0;
        this.setScale(3);
        this.setActive(false);
        this.setVisible(false);

    }

    takeDamage()
    {
        this.health--;

        if(this.health <= 0)
        {
            if(this.spawnsDebris)
            {
                this.scene.cameras.main.shake(40, new Phaser.Math.Vector2(0.005, 0.005), true);
                const debrisArray = [];
                const count = 2 + Math.floor(Math.random() * 2);
                for(let i = 0; i < count; i++)
                {
                    debrisArray.push(this.scene.getDebris(i === 1));
                    debrisArray[debrisArray.length-1].x = this.x;
                    debrisArray[debrisArray.length-1].y = this.y;
                    debrisArray[debrisArray.length-1].init();

                    const velocity = new Phaser.Math.Vector2();
                    Phaser.Math.RandomXY(velocity, 80);

                    debrisArray[debrisArray.length-1].body.setVelocity(velocity.x, velocity.y);
                }
            }

            if(this.spawnsGems > 0)
            {
                const oreArray = [];
                const count = this.spawnsGems;
                for(let i = 0; i < count; i++)
                {
                    oreArray.push(this.scene.getOre());
                    oreArray[oreArray.length-1].x = this.x;
                    oreArray[oreArray.length-1].y = this.y;

                    this.scene.physics.world.enable(oreArray[oreArray.length-1]);
                    oreArray[oreArray.length-1].setActive(true).setVisible(true);
                    oreArray[oreArray.length-1].setFrame(0);
                    oreArray[oreArray.length-1].setScale(3);
                    oreArray[oreArray.length-1].body.collideWorldBounds = true;
                    
                    const velocity = new Phaser.Math.Vector2();
                    Phaser.Math.RandomXY(velocity, 20);

                    oreArray[oreArray.length-1].body.setVelocity(velocity.x, velocity.y);
                }
            }
            
            this.disable()

            this.scene.explosionSound.play({volume: 0.4});

            const explosion = new Explosion(this.scene, this.x, this.y, 'explosion');
            explosion.play();
            explosion.setScale(this.scale);
            
        }
        else
        {
            flash(this);
            this.scene.hitSound.play({volume: 0.5});
        }
    }

    init()
    {
        if(this.spawnsGems)
        {
            this.setFrame(1);
        }

        this.enable();

    }

    update()
    {
        if((this.x + this.body.width) < 0 || this.x > this.scene.cameras.main.width || this.y > this.scene.cameras.main.height || (this.y + this.body.height < 0))
        {
            const group = this.type === "comet" ? this.scene.cometGroup : this.scene.debrisGroup;
            group.killAndHide(this);
            this.disable();
            return;
        }
    }

    enable()
    {
        this.scene.physics.world.enable(this);
        this.setActive(true)
        .setVisible(true);

        this.body.allowGravity = false;
        this.body.allowDrag = false;
        this.body.collideWorldBounds = false;
    }
    
    disable()
    {
        const group = this.type === "comet" ? this.scene.cometGroup : this.scene.debrisGroup;
        group.killAndHide(this);
        this.scene.physics.world.disable(this);
        this.setActive(false).setVisible(false);
    }

}