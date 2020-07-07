import Phaser from "phaser";
import flash from "./utils/ImageEffects"
import { Gameplay } from "./scenes/Gameplay"
import { MainMenu } from "./scenes/MainMenu"

const config = {
    type: Phaser.WEBGL,
    parent: "phaser-example",
    width: 768,
    height: 512,
    render: {
        pixelArt: true,
    },
    backgroundColor: '#000000',
    zoom: 1,
    scene: [MainMenu, Gameplay],
    title: 'SalvageJS',
    audio: {
        disableWebAudio: false
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    input: {
        activePointers: 1
    }

};

const game = new Phaser.Game(config);