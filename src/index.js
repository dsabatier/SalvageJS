import Phaser from "phaser";
import { Gameplay } from "./scenes/Gameplay"
import { MainMenu } from "./scenes/MainMenu"

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 768,
    height: 512,
    render: {
        pixelArt: true,
    },
    backgroundColor: '#141013',
    zoom: 1,
    scene: [MainMenu, Gameplay],
    title: 'Salvage',
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
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false

};

const game = new Phaser.Game(config);
console.log(process.env.NODE_ENV)