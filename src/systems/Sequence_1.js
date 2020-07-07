import { Sequence_1_1 } from './Sequence_1_1';
import { Sequence_1_2 } from './Sequence_1_2';

export class Sequence_1 {
    constructor(scene)
    {
        this.scene = scene;
    }

    play()
    {
        this.scene.time.addEvent({
            delay: 0,
            callback: function()
            {
                const sequence = new Sequence_1_1(this.scene);
                sequence.play();
            },
            callbackScope: this,
            loop: false
        });

        // this.scene.time.addEvent({
        //     delay: 2000,
        //     callback: function()
        //     {
        //         const sequence = new Sequence_1_2(this.scene);
        //         sequence.play();
        //     },
        //     callbackScope: this,
        //     loop: false
        // });
    }
}