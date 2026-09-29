import Phaser from "phaser";

import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";
import { GameOverScene } from "./scenes/GameOverScene";

import {
  GAME_WIDTH,
  GAME_HEIGHT,
} from "./utils/constants";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,

  width: GAME_WIDTH,
  height: GAME_HEIGHT,

  parent: "game-container",

  backgroundColor: "#000000",

  pixelArt: true,

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,

    width: window.innerWidth,
    height: window.innerHeight,
  },

  physics: {
    default: "arcade",

    arcade: {
      gravity: {
        x: 0,
        y: 0,
      },

      debug: false,
    },
  },

  scene: [
    BootScene,
    GameScene,
    GameOverScene,
  ],
};

new Phaser.Game(config);