import Phaser from "phaser";
import { SCENE_KEYS } from "../utils/constants";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.BOOT,
    });
  }

  preload(): void {
    this.load.image(
      "slime_gel",
      "/assets/models/slime_gel.png"
    );
  }

  create(): void {
    console.log(
      "slime_gel.png carregado:",
      this.textures.exists("slime_gel")
    );

    this.scene.start(SCENE_KEYS.GAME);
  }
}