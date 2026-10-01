import Phaser from "phaser";
import { DialogueNode } from "../systems/DialogueSystem";

export class NPC extends Phaser.Physics.Arcade.Sprite {
  public npcName: string;
  public dialogues: DialogueNode[];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    npcName: string,
    dialogues: DialogueNode[]
  ) {
    super(scene, x, y, "");

    this.npcName = npcName;
    this.dialogues = dialogues;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Placeholder do NPC
    this.setDisplaySize(28, 28);
    this.setTint(0xd4a017);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.setImmovable(true);
    body.setAllowGravity(false);
  }
}