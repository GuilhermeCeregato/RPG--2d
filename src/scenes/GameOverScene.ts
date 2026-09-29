import Phaser from "phaser";
import { SCENE_KEYS } from "../utils/constants";

export class GameOverScene extends Phaser.Scene {
  private enterKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: SCENE_KEYS.GAME_OVER,
    });
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // =========================
    // FUNDO
    // =========================

    this.add
      .rectangle(
        width / 2,
        height / 2,
        width,
        height,
        0x111111
      );

    // =========================
    // GAME OVER
    // =========================

    this.add
      .text(
        width / 2,
        height / 2 - 80,
        "GAME OVER",
        {
          fontSize: "64px",
          color: "#ff4444",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    // =========================
    // MENSAGEM
    // =========================

    this.add
      .text(
        width / 2,
        height / 2 + 10,
        "Você morreu!",
        {
          fontSize: "28px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    // =========================
    // INSTRUÇÃO
    // =========================

    this.add
      .text(
        width / 2,
        height / 2 + 70,
        "Pressione ENTER para tentar novamente",
        {
          fontSize: "18px",
          color: "#cccccc",
        }
      )
      .setOrigin(0.5);

    // =========================
    // TECLA ENTER
    // =========================

    if (!this.input.keyboard) {
      throw new Error(
        "Teclado não disponível."
      );
    }

    this.enterKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      );
  }

  update(): void {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.enterKey
      )
    ) {
      this.scene.start(
        SCENE_KEYS.GAME
      );
    }
  }
}