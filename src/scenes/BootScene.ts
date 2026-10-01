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

    this.load.image(
      "slime_core",
      "/assets/models/slime_core.png"
    );

    this.load.image(
      "slime_essence",
      "/assets/models/slime_essence.png"
    );
  }

  create(): void {
    console.log(
      "slime_gel carregado:",
      this.textures.exists("slime_gel")
    );

    console.log(
      "slime_core carregado:",
      this.textures.exists("slime_core")
    );

    console.log(
      "slime_essence carregado:",
      this.textures.exists("slime_essence")
    );

    this.scene.start(
      SCENE_KEYS.GAME
    );
  }
}