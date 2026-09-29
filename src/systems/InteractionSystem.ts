import Phaser from "phaser";
import { Player } from "../entities/Player";
import { NPC } from "../entities/NPC";
import { DialogueSystem } from "./DialogueSystem";

export class InteractionSystem {
  private scene: Phaser.Scene;
  private player: Player;
  private dialogueSystem: DialogueSystem;

  private interactKey: Phaser.Input.Keyboard.Key;

  private nearbyNPC: NPC | null = null;

  private interactionText: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    player: Player,
    dialogueSystem: DialogueSystem
  ) {
    this.scene = scene;
    this.player = player;
    this.dialogueSystem = dialogueSystem;

    this.interactKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );

    this.interactionText = scene.add
      .text(0, 0, "", {
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: {
          x: 8,
          y: 5,
        },
      })
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);
  }

  update(npcs: NPC[]): void {
    // Enquanto estiver conversando, não permite outra interação
    if (this.dialogueSystem.isActive()) {
      this.interactionText.setVisible(false);
      return;
    }

    this.nearbyNPC = this.findNearestNPC(npcs);

    if (this.nearbyNPC) {
      this.showInteractionPrompt();

      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.interact();
      }
    } else {
      this.hideInteractionPrompt();
    }
  }

  private findNearestNPC(npcs: NPC[]): NPC | null {
    let closestNPC: NPC | null = null;
    let closestDistance = Infinity;

    for (const npc of npcs) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.x,
        npc.y
      );

      if (distance < 60 && distance < closestDistance) {
        closestNPC = npc;
        closestDistance = distance;
      }
    }

    return closestNPC;
  }

  private showInteractionPrompt(): void {
    if (!this.nearbyNPC) return;

    this.interactionText.setText(
      `[E] Falar com ${this.nearbyNPC.npcName}`
    );

    this.interactionText.setPosition(
      this.player.x - this.interactionText.width / 2,
      this.player.y - 45
    );

    this.interactionText.setVisible(true);
  }

  private hideInteractionPrompt(): void {
    this.interactionText.setVisible(false);
  }

  private interact(): void {
    if (!this.nearbyNPC) return;

    this.dialogueSystem.start(
      this.nearbyNPC.npcName,
      this.nearbyNPC.dialogues
    );

    this.interactionText.setVisible(false);
  }
}