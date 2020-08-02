export class ScrollingBackground {
    constructor(config)
    {
        this.scene = config.scene;
        this.config = config;

        this.tileSprites = [];
        for(let i = 0; i < config.tileSprites.length; i++)
        {
            this.tileSprites.push({
                tileSprite: config.tileSprites[i],
                scrollSpeed: config.scrollSpeed[i]
            });
        }
    }

    update(time, delta)
    {
        for(let i = 0; i < this.tileSprites.length; i++)
        {
            this.tileSprites[i].tileSprite.tilePositionX += delta * this.tileSprites[i].scrollSpeed;
            this.tileSprites[i].tileSprite.setDepth(i-this.tileSprites.length);
        }
    }

    setSpeedMultiplier(number)
    {
        for(let i = 0; i < this.tileSprites.length; i++)
        {
            this.tileSprites[i].scrollSpeed *= number;
        }
    }
}