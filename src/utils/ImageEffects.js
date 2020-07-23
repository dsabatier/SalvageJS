import Phaser from "phaser";

function flash(sprite)
{
    if(!sprite.whiteFilled)
    {
        sprite.whiteFilled = true;
        sprite.setTintFill(0xffffff);
    
        sprite.scene.time.addEvent({
            delay: 50,
            callback: () => { 
                sprite.whiteFilled = false;
                sprite.clearTint();
            },
            loop: false
        });
    
        sprite.scene.hitSound.play({volume: 0.5});
    }
}

function blink(sprite)
{
    if(!sprite.isBlinked)
    {
        sprite.alpha = 0;
        sprite.isBlinked = true;
    
        sprite.scene.time.addEvent({
            delay: 70,
            callback: () => { 
                if(!sprite.scene)
                {
                    sprite.isBlinked = false;
                    return;
                }

                sprite.scene.time.addEvent({
                    delay: 50,
                    callback:() => {
                        sprite.isBlinked = false;
                    }
                });

                sprite.alpha = 1;
            },
            loop: false
        });
    
        //sprite.scene.hitSound.play({volume: 0.5}); //lol
    }
}

export { flash, blink };