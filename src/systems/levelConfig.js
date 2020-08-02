import { ScrollingBackground } from "../systems/Background/background";
import { Sequence_1 } from "../systems/Sequence_1";
import { Explosion } from "../entities/Explosion";

const level1 = {
    setup: function(scene)
    {
        scene.scrollingBackground = new ScrollingBackground({
            tileSprites: [
                scene.add.tileSprite(0, 0, scene.customWorldBounds.width, scene.customWorldBounds.height, 'starsBackground').setAlpha(0.3).setScale(1).setOrigin(0, 0),
                scene.add.tileSprite(0, 0, scene.customWorldBounds.width*2, scene.customWorldBounds.height*2, 'starsBackground').setOrigin(0, 0).setScale(1.5).setAlpha(0.7)
            ],
            scrollSpeed: [
                0.1, 
                0.15]
        });
    },
    sequence:  function(scene) { return new Sequence_1(scene) }
}

const level2 = {
    setup: function(scene)
    {
        const zone = scene.add.zone(768*0.5,470).setSize(768, 33);
        scene.physics.world.enable(zone);
        zone.body.moves = false;
        zone.body.setAllowGravity(false);
        zone.body.debugBodyColor = 0x00ffff;

        scene.physics.add.overlap(scene.playerShip, zone, ()=>{ 
            scene.playerShip.takeDamage(999);
            scene.cameras.main.flash(5, 180, 32, 42);
            scene.cameras.main.shake(100, new Phaser.Math.Vector2(0.08, 0.08), true);
            
            const explosion = new Explosion(scene, scene.playerShip.x, scene.playerShip.y, 'explosion');
            explosion.play();
    
            scene.playerShip.destroy();
            scene.explosionSound.play({volume: 0.4});
            scene.bgm.stop();
            scene.time.addEvent({
                delay: 3200,
                callback: function() {
                    // scene.inventory.oreCount = 0;
                    // scene.score.pointsCount = 0;
                    scene.scene.start('MainMenu');
    
                },
                callbackScope: scene
            })
        });
        console.log(scene.playerShip);
        console.log(zone);

        scene.cameras.main.setBackgroundColor(0x242234);
        scene.scrollingBackground = new ScrollingBackground({
            tileSprites: [
                scene.add.tileSprite(0, 512-310, 1024, 128, 'stalagmiteBackground').setOrigin(0, 0).setScale(2),
                scene.add.tileSprite(0, 512-78, 768, 32, 'lavaYellowBackground').setOrigin(0, 0),
                scene.add.tileSprite(0, 512-78, 768, 32, 'lavaOrangeBackground').setOrigin(0, 0),
                
            ],
            scrollSpeed: [
                0.05, 
                0.15,
                0.17]
        });
    },
    sequence:  function(scene) {  return new Sequence_1(scene) }
}

export default {
    data: [
        {
            setup: function(scene)
            {
                console.log("i should neeeever be called");
            }
        },
        level1
    ]
}

