import { Explosion } from './Explosion';

export class EnemyShip extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture)
    {
        super(scene, x, y, texture);
        this.tweens = [];
    }


    takeDamage()
    {
        this.health--;

        if(this.health <= 0)
        {
            const newStar = this.scene.starGroup.getFirstDead({key: 'star'});
            newStar.init(this.x, this.y);

            const explosion = new Explosion(this.scene, this.x, this.y, 'explosion');
            explosion.play();

            this.disable();

            this.scene.explosionSound.play({volume: 0.6});

            this.cleanupTweens();
        }
        else
        {
            this.whiteFilled = true;
            this.setTintFill(0xffffff);

            this.scene.time.addEvent({
                delay: 50,
                callback: () => { this.clearTint()},
                callbackScope: this,
                loop: false
            });

            this.scene.hitSound.play({volume: 0.3});
        }
    }

    init()
    {
        this.enable();

        this.x = this.scene.cameras.main.width;

        this.health = 1;
        this.setSize(16,16,true);
        this.setScale(3);
    }

    update(time, delta)
    {
        console.log("?");
        if(this.x <= -16)
        {
            this.cleanupTweens()
            this.scene.enemyShipGroup.killAndHide(this);
            this.disable();
        }
    }

    cleanupTweens()
    {
        for(let i = 0; i < this.tweens.length; i++)
        {
            this.tweens[i].remove();
        }

        this.tweens = [];
    }

    enable()
    {
        this.scene.physics.world.enable(this);
        this.setActive(true)
        .setVisible(true);
    }
    
    disable()
    {
        this.scene.enemyShipGroup.killAndHide(this);
        this.scene.physics.world.disable(this);
        this.setActive(false)
        .setVisible(false);
    }

}