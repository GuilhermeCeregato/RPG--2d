import Phaser from "phaser";
import { Item } from "./Item";
import { Player } from "../entities/Player";

export class ItemDrop extends Phaser.Physics.Arcade.Sprite {
  public item: Item;

  private player: Player;
  private collected = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    item: Item,
    player: Player,
    onCollect: (item: Item) => void
  ) {
    super(
      scene,
      x,
      y,
      "slime_gel"
    );

    this.item = item;
    this.player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Mantém a proporção original do PNG
    const maxWidth = 32;
    const maxHeight = 32;

    const scale = Math.min(
      maxWidth / this.width,
      maxHeight / this.height
    );

    this.setScale(scale);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);
    body.setImmovable(true);

    scene.tweens.add({
      targets: this,
      y: y - 5,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    scene.physics.add.overlap(
      this,
      player,
      () => {
        if (this.collected) {
          return;
        }

        this.collected = true;

        onCollect(this.item);

        this.collectEffect();

        this.destroy();
      }
    );
  }

  private collectEffect(): void {
    const effect =
      this.scene.add.image(
        this.x,
        this.y,
        "slime_gel"
      );

    // Mantém a proporção original
    const maxWidth = 20;
    const maxHeight = 20;

    const scale = Math.min(
      maxWidth / effect.width,
      maxHeight / effect.height
    );

    effect.setScale(scale);

    effect
      .setAlpha(0.8)
      .setDepth(1100);

    this.scene.tweens.add({
      targets: effect,
      scale: scale * 2.5,
      alpha: 0,
      duration: 200,
      ease: "Quad.easeOut",
      onComplete: () => {
        effect.destroy();
      },
    });
  }
}