import Phaser from "phaser";

export interface DialogueChoice {
  text: string;
  nextNode?: string;
  action?: () => void;
}

export interface DialogueNode {
  text: string;
  choices?: DialogueChoice[];
  nextNode?: string;
  action?: () => void;
  inputName?: boolean;
  classSelection?: boolean;
}

export class DialogueSystem {
  private scene: Phaser.Scene;

  private dialogueBox: Phaser.GameObjects.Rectangle;
  private dialogueName: Phaser.GameObjects.Text;
  private dialogueText: Phaser.GameObjects.Text;
  private continueText: Phaser.GameObjects.Text;

  private choiceTexts: Phaser.GameObjects.Text[] = [];

  private nameInputBackground:
    Phaser.GameObjects.Rectangle;

  private nameInputText:
    Phaser.GameObjects.Text;

  private nameInputHint:
    Phaser.GameObjects.Text;

  private classSelectionBackground:
    Phaser.GameObjects.Rectangle;

  private classSelectionTitle:
    Phaser.GameObjects.Text;

  private classSelectionTexts:
    Phaser.GameObjects.Text[] = [];

  private nodes: Record<
    string,
    DialogueNode
  > = {};

  private currentNodeId = "";
  private npcName = "";

  private active = false;
  private inputMode = false;
  private classSelectionMode = false;

  private playerName = "";

  private interactKey:
    Phaser.Input.Keyboard.Key;

  private numberKeys:
    Phaser.Input.Keyboard.Key[] = [];

  private backspaceKey:
    Phaser.Input.Keyboard.Key;

  private enterKey:
    Phaser.Input.Keyboard.Key;

  private onNameConfirmed:
    ((name: string) => void) | null = null;

  private onClassSelected:
    ((classId: string) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.interactKey =
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.E
      );

    this.backspaceKey =
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.BACKSPACE
      );

    this.enterKey =
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      );

    this.numberKeys = [
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.ONE
      ),
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.TWO
      ),
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.THREE
      ),
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.FOUR
      ),
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.FIVE
      ),
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.SIX
      ),
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.SEVEN
      ),
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.EIGHT
      ),
      scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.NINE
      ),
    ];

    const width =
      scene.scale.width;

    const height =
      scene.scale.height;

    // =========================
    // CAIXA PRINCIPAL
    // =========================

    this.dialogueBox =
      scene.add
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
        .setStrokeStyle(
          2,
          0xffffff
        )
        .setVisible(false);

    // =========================
    // NOME DO NPC
    // =========================

    this.dialogueName =
      scene.add
        .text(
          70,
          height - 165,
          "",
          {
            fontSize: "20px",
            color: "#ffd700",
            fontStyle: "bold",
          }
        )
        .setScrollFactor(0)
        .setDepth(201)
        .setVisible(false);

    // =========================
    // TEXTO
    // =========================

    this.dialogueText =
      scene.add
        .text(
          70,
          height - 130,
          "",
          {
            fontSize: "18px",
            color: "#ffffff",
            wordWrap: {
              width:
                width - 140,
            },
          }
        )
        .setScrollFactor(0)
        .setDepth(201)
        .setVisible(false);

    // =========================
    // CONTINUAR
    // =========================

    this.continueText =
      scene.add
        .text(
          width - 150,
          height - 65,
          "",
          {
            fontSize: "14px",
            color: "#cccccc",
          }
        )
        .setScrollFactor(0)
        .setDepth(201)
        .setVisible(false);

    // =========================
    // INPUT DE NOME
    // =========================

    this.nameInputBackground =
      scene.add
        .rectangle(
          width / 2,
          height / 2 + 30,
          420,
          70,
          0x151515,
          1
        )
        .setScrollFactor(0)
        .setDepth(300)
        .setStrokeStyle(
          2,
          0xffffff
        )
        .setVisible(false);

    this.nameInputText =
      scene.add
        .text(
          width / 2,
          height / 2 + 30,
          "",
          {
            fontSize: "24px",
            color: "#ffffff",
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(301)
        .setVisible(false);

    this.nameInputHint =
      scene.add
        .text(
          width / 2,
          height / 2 + 85,
          "Digite seu nome e pressione ENTER",
          {
            fontSize: "14px",
            color: "#cccccc",
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(301)
        .setVisible(false);

    // =========================
    // SELEÇÃO DE CLASSE
    // =========================

    this.classSelectionBackground =
      scene.add
        .rectangle(
          width / 2,
          height / 2,
          820,
          580,
          0x101010,
          0.98
        )
        .setScrollFactor(0)
        .setDepth(400)
        .setStrokeStyle(
          2,
          0xffffff
        )
        .setVisible(false);

    this.classSelectionTitle =
      scene.add
        .text(
          width / 2,
          95,
          "ESCOLHA SUA CLASSE",
          {
            fontSize: "28px",
            color: "#ffd700",
            fontStyle: "bold",
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(401)
        .setVisible(false);
  }

  start(
    npcName: string,
    nodes: DialogueNode[]
  ): void {
    if (
      nodes.length === 0 ||
      this.active
    ) {
      return;
    }

    this.nodes = {};

    nodes.forEach(
      (node, index) => {
        this.nodes[
          `node_${index}`
        ] = node;
      }
    );

    this.npcName = npcName;
    this.currentNodeId =
      "node_0";

    this.active = true;

    this.dialogueName.setText(
      npcName
    );

    this.dialogueBox.setVisible(
      true
    );

    this.dialogueName.setVisible(
      true
    );

    this.dialogueText.setVisible(
      true
    );

    this.continueText.setVisible(
      true
    );

    this.showCurrentNode();
  }

  update(): void {
    if (!this.active) {
      return;
    }

    if (this.inputMode) {
      this.updateNameInput();
      return;
    }

    if (
      this.classSelectionMode
    ) {
      return;
    }

    const currentNode =
      this.nodes[
        this.currentNodeId
      ];

    if (!currentNode) {
      this.close();
      return;
    }

    if (
      currentNode.choices &&
      currentNode.choices.length > 0
    ) {
      this.handleChoiceInput(
        currentNode.choices
      );

      return;
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.interactKey
      )
    ) {
      this.nextNode();
    }
  }

  private showCurrentNode(): void {
    this.clearChoices();

    const node =
      this.nodes[
        this.currentNodeId
      ];

    if (!node) {
      this.close();
      return;
    }

    this.dialogueText.setText(
      node.text
    );

    if (node.action) {
      node.action();
    }

    if (node.inputName) {
      this.startNameInput();
      return;
    }

    if (node.classSelection) {
      this.continueText.setVisible(
        false
      );

      return;
    }

    if (
      node.choices &&
      node.choices.length > 0
    ) {
      this.showChoices(
        node.choices
      );

      this.continueText.setVisible(
        false
      );

      return;
    }

    this.continueText.setVisible(
      true
    );

    this.continueText.setText(
      node.nextNode
        ? "[E] Continuar"
        : "[E] Fechar"
    );
  }

  private showChoices(
    choices: DialogueChoice[]
  ): void {
    const startY =
      this.scene.scale.height - 110;

    choices.forEach(
      (choice, index) => {
        const text =
          this.scene.add
            .text(
              90,
              startY +
                index * 27,
              `${index + 1}. ${choice.text}`,
              {
                fontSize:
                  "16px",
                color:
                  "#ffffff",
                backgroundColor:
                  "#202020",
                padding: {
                  x: 8,
                  y: 4,
                },
              }
            )
            .setScrollFactor(0)
            .setDepth(202)
            .setInteractive({
              useHandCursor:
                true,
            });

        text.on(
          "pointerover",
          () => {
            text.setColor(
              "#ffd700"
            );
          }
        );

        text.on(
          "pointerout",
          () => {
            text.setColor(
              "#ffffff"
            );
          }
        );

        text.on(
          "pointerdown",
          () => {
            this.choose(
              index,
              choices
            );
          }
        );

        this.choiceTexts.push(
          text
        );
      }
    );
  }

  private handleChoiceInput(
    choices: DialogueChoice[]
  ): void {
    for (
      let i = 0;
      i <
        Math.min(
          choices.length,
          this.numberKeys.length
        );
      i++
    ) {
      if (
        Phaser.Input.Keyboard.JustDown(
          this.numberKeys[i]
        )
      ) {
        this.choose(
          i,
          choices
        );

        return;
      }
    }
  }

  private choose(
    index: number,
    choices: DialogueChoice[]
  ): void {
    const choice =
      choices[index];

    if (!choice) {
      return;
    }

    this.clearChoices();

    if (choice.action) {
      choice.action();
    }

    if (choice.nextNode) {
      this.currentNodeId =
        choice.nextNode;

      this.showCurrentNode();

      return;
    }

    this.close();
  }

  private nextNode(): void {
    const node =
      this.nodes[
        this.currentNodeId
      ];

    if (!node) {
      this.close();
      return;
    }

    if (node.nextNode) {
      this.currentNodeId =
        node.nextNode;

      this.showCurrentNode();

      return;
    }

    this.close();
  }

  // =========================
  // NOME
  // =========================

  startNameInput(
    callback?: (name: string) => void
  ): void {
    this.inputMode = true;

    this.playerName = "";

    this.onNameConfirmed =
      callback ?? null;

    this.dialogueBox.setVisible(
      false
    );

    this.dialogueName.setVisible(
      false
    );

    this.dialogueText.setVisible(
      false
    );

    this.continueText.setVisible(
      false
    );

    this.nameInputBackground.setVisible(
      true
    );

    this.nameInputText.setVisible(
      true
    );

    this.nameInputHint.setVisible(
      true
    );

    this.updateNameText();

    this.scene.input.keyboard!.on(
      "keydown",
      this.handleTextInput,
      this
    );
  }

  private handleTextInput = (
    event: KeyboardEvent
  ): void => {
    if (!this.inputMode) {
      return;
    }

    const key =
      event.key;

    if (
      key.length === 1 &&
      /^[a-zA-ZÀ-ÿ0-9 ]$/.test(
        key
      ) &&
      this.playerName.length <
        16
    ) {
      this.playerName += key;

      this.updateNameText();
    }
  };

  private updateNameInput(): void {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.backspaceKey
      )
    ) {
      this.playerName =
        this.playerName.slice(
          0,
          -1
        );

      this.updateNameText();
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.enterKey
      )
    ) {
      const name =
        this.playerName.trim();

      if (name.length === 0) {
        return;
      }

      this.finishNameInput(
        name
      );
    }
  }

  private updateNameText(): void {
    this.nameInputText.setText(
      this.playerName ||
        "|"
    );
  }

  private finishNameInput(
    name: string
  ): void {
    this.scene.input.keyboard!.off(
      "keydown",
      this.handleTextInput,
      this
    );

    this.inputMode = false;

    this.nameInputBackground.setVisible(
      false
    );

    this.nameInputText.setVisible(
      false
    );

    this.nameInputHint.setVisible(
      false
    );

    if (
      this.onNameConfirmed
    ) {
      this.onNameConfirmed(
        name
      );
    }

    this.onNameConfirmed =
      null;

    // =========================
    // AVANÇA PARA O PRÓXIMO NÓ
    // =========================

    const currentNode =
      this.nodes[
        this.currentNodeId
      ];

    if (
      currentNode &&
      currentNode.nextNode
    ) {
      this.currentNodeId =
        currentNode.nextNode;
    }

    this.dialogueBox.setVisible(
      true
    );

    this.dialogueName.setVisible(
      true
    );

    this.dialogueText.setVisible(
      true
    );

    this.continueText.setVisible(
      true
    );

    this.showCurrentNode();
  }

  // =========================
  // SELEÇÃO DE CLASSE
  // =========================

  startClassSelection(
    callback?: (
      classId: string
    ) => void
  ): void {
    this.classSelectionMode =
      true;

    this.onClassSelected =
      callback ?? null;

    this.dialogueBox.setVisible(
      false
    );

    this.dialogueName.setVisible(
      false
    );

    this.dialogueText.setVisible(
      false
    );

    this.continueText.setVisible(
      false
    );

    this.classSelectionBackground.setVisible(
      true
    );

    this.classSelectionTitle.setVisible(
      true
    );
  }

  showClassOptions(
    classes: {
      id: string;
      name: string;
    }[],
    callback: (
      classId: string
    ) => void
  ): void {
    this.startClassSelection(
      callback
    );

    this.clearClassSelection();

    const columns = 2;
    const startX = 235;
    const startY = 145;

    const columnWidth = 370;
    const rowHeight = 48;

    classes.forEach(
      (characterClass, index) => {
        const column =
          index % columns;

        const row =
          Math.floor(
            index / columns
          );

        const x =
          startX +
          column *
            columnWidth;

        const y =
          startY +
          row *
            rowHeight;

        const option =
          this.scene.add
            .text(
              x,
              y,
              `${index + 1}. ${characterClass.name}`,
              {
                fontSize:
                  "18px",
                color:
                  "#ffffff",
                backgroundColor:
                  "#202020",
                padding: {
                  x: 12,
                  y: 8,
                },
                fixedWidth:
                  330,
              }
            )
            .setOrigin(
              0,
              0
            )
            .setScrollFactor(0)
            .setDepth(402)
            .setInteractive({
              useHandCursor:
                true,
            });

        option.on(
          "pointerover",
          () => {
            option.setColor(
              "#ffd700"
            );
          }
        );

        option.on(
          "pointerout",
          () => {
            option.setColor(
              "#ffffff"
            );
          }
        );

        option.on(
          "pointerdown",
          () => {
            this.selectClass(
              characterClass.id
            );
          }
        );

        this.classSelectionTexts.push(
          option
        );
      }
    );
  }

  private selectClass(
    classId: string
  ): void {
    if (
      this.onClassSelected
    ) {
      this.onClassSelected(
        classId
      );
    }

    this.close();
  }

  private clearChoices(): void {
    for (
      const text of
        this.choiceTexts
    ) {
      text.destroy();
    }

    this.choiceTexts = [];
  }

  private clearClassSelection(): void {
    for (
      const text of
        this.classSelectionTexts
    ) {
      text.destroy();
    }

    this.classSelectionTexts = [];
  }

  close(): void {
    this.active = false;
    this.inputMode = false;
    this.classSelectionMode =
      false;

    this.clearChoices();
    this.clearClassSelection();

    this.dialogueBox.setVisible(
      false
    );

    this.dialogueName.setVisible(
      false
    );

    this.dialogueText.setVisible(
      false
    );

    this.continueText.setVisible(
      false
    );

    this.nameInputBackground.setVisible(
      false
    );

    this.nameInputText.setVisible(
      false
    );

    this.nameInputHint.setVisible(
      false
    );

    this.classSelectionBackground.setVisible(
      false
    );

    this.classSelectionTitle.setVisible(
      false
    );

    this.nodes = {};
    this.currentNodeId = "";

    this.onNameConfirmed =
      null;

    this.onClassSelected =
      null;

    this.scene.input.keyboard!.off(
      "keydown",
      this.handleTextInput,
      this
    );
  }

  isActive(): boolean {
    return this.active;
  }

  getPlayerName(): string {
    return this.playerName;
  }
}