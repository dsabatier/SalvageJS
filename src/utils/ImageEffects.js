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

export { flash };