import Phaser from "phaser";

export class DialogueSystem {
  private scene: Phaser.Scene;

  private dialogueBox: Phaser.GameObjects.Rectangle;
  private dialogueName: Phaser.GameObjects.Text;
  private dialogueText: Phaser.GameObjects.Text;
  private continueText: Phaser.GameObjects.Text;

  private dialogues: string[] = [];
  private currentDialogue = 0;
  private active = false;

  private interactKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.interactKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );

    const width = scene.scale.width;
    const height = scene.scale.height;

    // Caixa principal do diálogo
    this.dialogueBox = scene.add
      .rectangle(
        width / 2,
        height - 100,
        width - 80,
        150,
        0x111111,
        0.95
      )
      .setScrollFactor(0)
      .setDepth(200)
      .setStrokeStyle(2, 0xffffff)
      .setVisible(false);

    // Nome do NPC
    this.dialogueName = scene.add
      .text(70, height - 165, "", {
        fontSize: "20px",
        color: "#ffd700",
        fontStyle: "bold",
      })
      .setScrollFactor(0)
      .setDepth(201)
      .setVisible(false);

    // Texto
    this.dialogueText = scene.add
      .text(70, height - 130, "", {
        fontSize: "18px",
        color: "#ffffff",
        wordWrap: {
          width: width - 140,
        },
      })
      .setScrollFactor(0)
      .setDepth(201)
      .setVisible(false);

    // Indicador
    this.continueText = scene.add
      .text(width - 130, height - 65, "[E] Continuar", {
        fontSize: "14px",
        color: "#cccccc",
      })
      .setScrollFactor(0)
      .setDepth(201)
      .setVisible(false);
  }

  start(npcName: string, dialogues: string[]): void {
    if (dialogues.length === 0) return;

    this.dialogues = dialogues;
    this.currentDialogue = 0;
    this.active = true;

    this.dialogueName.setText(npcName);

    this.showCurrentDialogue();

    this.dialogueBox.setVisible(true);
    this.dialogueName.setVisible(true);
    this.dialogueText.setVisible(true);
    this.continueText.setVisible(true);
  }

  update(): void {
    if (!this.active) return;

    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.nextDialogue();
    }
  }

  private showCurrentDialogue(): void {
    this.dialogueText.setText(
      this.dialogues[this.currentDialogue]
    );

    if (this.currentDialogue >= this.dialogues.length - 1) {
      this.continueText.setText("[E] Fechar");
    } else {
      this.continueText.setText("[E] Continuar");
    }
  }

  private nextDialogue(): void {
    this.currentDialogue++;

    if (this.currentDialogue >= this.dialogues.length) {
      this.close();
      return;
    }

    this.showCurrentDialogue();
  }

  close(): void {
    this.active = false;

    this.dialogueBox.setVisible(false);
    this.dialogueName.setVisible(false);
    this.dialogueText.setVisible(false);
    this.continueText.setVisible(false);

    this.dialogues = [];
    this.currentDialogue = 0;
  }

  isActive(): boolean {
    return this.active;
  }
}