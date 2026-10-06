import Phaser from "phaser";
import {
  drawCharacterBody,
  drawCharacterHead,
  drawClassBack,
  drawClassFront,
} from "../entities/ClassAccessories";

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

// ========================================
// REGISTRO DE AVENTUREIRO
// ========================================

export interface RegistrationPassive {
  id: string;
  name: string;
  description: string;
}

export interface RegistrationAbility {
  id: string;
  name: string;
  description: string;
}

export interface RegistrationClass {
  id: string;
  name: string;
  description: string;

  strength: number;
  vitality: number;
  defense: number;
  agility: number;
  luck: number;
  intelligence: number;

  passives: RegistrationPassive[];
  abilities: RegistrationAbility[];
}

export interface RegistrationData {
  name: string;
  classId: string;
}

// ========================================
// LAYOUT DA TELA DE REGISTRO
// ========================================

const REG_W = 1190;
const REG_H = 680;
const REG_DEPTH = 3000;

// Prévia do personagem
const PREVIEW_X = 905;
const PREVIEW_Y = 245;
const PREVIEW_SIZE = 120;

// Ícone da classe
const CLASS_ICON_X = 150;
const CLASS_ICON_Y = 215;

export class DialogueSystem {
  private scene: Phaser.Scene;

  // ========================================
  // DIÁLOGO NORMAL
  // ========================================

  private dialogueBox!: Phaser.GameObjects.Rectangle;
  private dialogueName!: Phaser.GameObjects.Text;
  private dialogueText!: Phaser.GameObjects.Text;
  private continueText!: Phaser.GameObjects.Text;

  private choiceTexts: Phaser.GameObjects.Text[] = [];

  // ========================================
  // INPUT DE NOME ANTIGO
  // ========================================

  private nameInputBackground!: Phaser.GameObjects.Rectangle;
  private nameInputText!: Phaser.GameObjects.Text;
  private nameInputHint!: Phaser.GameObjects.Text;

  // ========================================
  // SELEÇÃO DE CLASSE ANTIGA
  // ========================================

  private classSelectionBackground!: Phaser.GameObjects.Rectangle;
  private classSelectionTitle!: Phaser.GameObjects.Text;

  private classSelectionTexts: Phaser.GameObjects.Text[] = [];

  // ========================================
  // REGISTRO
  // ========================================

  private registrationMode = false;

  private registrationContainer!: Phaser.GameObjects.Container;

  // Painel da classe selecionada
  private selectedClassPanel!: Phaser.GameObjects.Rectangle;
  private selectedClassName!: Phaser.GameObjects.Text;
  private selectedClassDescription!: Phaser.GameObjects.Text;
  private selectedClassAttributes!: Phaser.GameObjects.Text;
  private selectedClassPassives!: Phaser.GameObjects.Text;
  private selectedClassAbilities!: Phaser.GameObjects.Text;
  private selectedClassIcon!: Phaser.GameObjects.Graphics;
  private selectedClassIconText!: Phaser.GameObjects.Text;

  // Lista de classes
  private registrationClassButtons: Phaser.GameObjects.Rectangle[] = [];
  private registrationClassTexts: Phaser.GameObjects.Text[] = [];
  private registrationClassArrows: Phaser.GameObjects.Text[] = [];

  // Prévia do personagem
  private characterIcon!: Phaser.GameObjects.Graphics;
  private characterModificationText!: Phaser.GameObjects.Text;

  // Nome
  private registrationNameInput!: Phaser.GameObjects.Rectangle;
  private registrationNameText!: Phaser.GameObjects.Text;

  // Botões
  private registrationButton!: Phaser.GameObjects.Rectangle;
  private registrationCancelButton!: Phaser.GameObjects.Text;

  // Dados do registro
  private registrationClasses: RegistrationClass[] = [];

  private selectedRegistrationClass: RegistrationClass | null = null;

  private registrationPlayerName = "";

  private onRegistrationConfirmed:
    ((data: RegistrationData) => void) | null = null;

  // ========================================
  // DIÁLOGO
  // ========================================

  private nodes: Record<string, DialogueNode> = {};

  private currentNodeId = "";

  private npcName = "";

  private active = false;

  private inputMode = false;

  private classSelectionMode = false;

  private playerName = "";

  // ========================================
  // TECLAS
  // ========================================

  private interactKey!: Phaser.Input.Keyboard.Key;

  private numberKeys: Phaser.Input.Keyboard.Key[] = [];

  private backspaceKey!: Phaser.Input.Keyboard.Key;

  private enterKey!: Phaser.Input.Keyboard.Key;

  // ========================================
  // CALLBACKS
  // ========================================

  private onNameConfirmed: ((name: string) => void) | null = null;

  private onClassSelected: ((classId: string) => void) | null = null;

  // ========================================
  // CONSTRUTOR
  // ========================================

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.interactKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );

    this.backspaceKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.BACKSPACE
    );

    this.enterKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.numberKeys = [
      Phaser.Input.Keyboard.KeyCodes.ONE,
      Phaser.Input.Keyboard.KeyCodes.TWO,
      Phaser.Input.Keyboard.KeyCodes.THREE,
      Phaser.Input.Keyboard.KeyCodes.FOUR,
      Phaser.Input.Keyboard.KeyCodes.FIVE,
      Phaser.Input.Keyboard.KeyCodes.SIX,
      Phaser.Input.Keyboard.KeyCodes.SEVEN,
      Phaser.Input.Keyboard.KeyCodes.EIGHT,
      Phaser.Input.Keyboard.KeyCodes.NINE,
    ].map((keyCode) =>
      scene.input.keyboard!.addKey(keyCode)
    );

    const width = scene.scale.width;
    const height = scene.scale.height;

    // ========================================
    // DIÁLOGO NORMAL
    // ========================================

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

    this.dialogueName = scene.add
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

    this.dialogueText = scene.add
      .text(
        70,
        height - 130,
        "",
        {
          fontSize: "18px",
          color: "#ffffff",
          wordWrap: {
            width: width - 140,
          },
        }
      )
      .setScrollFactor(0)
      .setDepth(201)
      .setVisible(false);

    this.continueText = scene.add
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

    // ========================================
    // INPUT DE NOME ANTIGO
    // ========================================

    this.nameInputBackground = scene.add
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
      .setStrokeStyle(2, 0xffffff)
      .setVisible(false);

    this.nameInputText = scene.add
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

    this.nameInputHint = scene.add
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

    // ========================================
    // SELEÇÃO DE CLASSE ANTIGA
    // ========================================

    this.classSelectionBackground = scene.add
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
      .setStrokeStyle(2, 0xffffff)
      .setVisible(false);

    this.classSelectionTitle = scene.add
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

    // ========================================
    // REGISTRO NOVO
    // ========================================

    this.createRegistrationUI();
  }

  // ========================================
  // CRIAR UI DO REGISTRO
  // ========================================

  private createRegistrationUI(): void {
    const scene = this.scene;

    const width = scene.scale.width;
    const height = scene.scale.height;

    const scale = Math.min(
      1,
      (width - 20) / REG_W,
      (height - 20) / REG_H
    );

    const container = scene.add
      .container(
        width / 2 - (REG_W * scale) / 2,
        height / 2 - (REG_H * scale) / 2
      )
      .setScale(scale)
      .setScrollFactor(0)
      .setDepth(REG_DEPTH)
      .setVisible(false);

    this.registrationContainer = container;

    // ========================================
    // AJUDANTES
    // ========================================

    const box = (
      x: number,
      y: number,
      w: number,
      h: number,
      fill: number,
      border: number,
      borderWidth = 1
    ): Phaser.GameObjects.Rectangle => {
      const rectangle = scene.add
        .rectangle(
          x,
          y,
          w,
          h,
          fill,
          1
        )
        .setOrigin(0, 0)
        .setStrokeStyle(
          borderWidth,
          border
        );

      container.add(rectangle);

      return rectangle;
    };

    const label = (
      x: number,
      y: number,
      text: string,
      style: Phaser.Types.GameObjects.Text.TextStyle,
      originX = 0.5,
      originY = 0.5
    ): Phaser.GameObjects.Text => {
      const textObject = scene.add
        .text(
          x,
          y,
          text,
          style
        )
        .setOrigin(
          originX,
          originY
        );

      container.add(textObject);

      return textObject;
    };

    // ========================================
    // MOLDURA PRINCIPAL
    // ========================================

    box(
      0,
      0,
      REG_W,
      REG_H,
      0x101010,
      0x5a5a5a,
      2
    );

    label(
      REG_W / 2,
      34,
      "REGISTRO DE AVENTUREIRO",
      {
        fontSize: "25px",
        color: "#ffd700",
        fontStyle: "bold",
      }
    );

    // ========================================
    // PAINEL ESQUERDO - CLASSE
    // ========================================

    this.selectedClassPanel = box(
      25,
      70,
      600,
      340,
      0x151515,
      0x4d4d4d
    );

    // ========================================
    // ÍCONE DA CLASSE
    // ========================================

    box(
      40,
      85,
      220,
      310,
      0x101010,
      0x3f3f3f
    );

    this.selectedClassIcon =
      scene.add.graphics();

    container.add(
      this.selectedClassIcon
    );

    this.selectedClassIconText =
      label(
        CLASS_ICON_X,
        378,
        "CLASSE",
        {
          fontSize: "12px",
          color: "#999999",
          fontStyle: "bold",
        }
      );

    // ========================================
    // NOME DA CLASSE
    // ========================================

    this.selectedClassName =
      label(
        445,
        102,
        "SELECIONE UMA CLASSE",
        {
          fontSize: "18px",
          color: "#ffd700",
          fontStyle: "bold",
          align: "center",
          wordWrap: {
            width: 320,
          },
        }
      );

    // ========================================
    // DESCRIÇÃO
    // ========================================

    this.selectedClassDescription =
      label(
        445,
        130,
        "",
        {
          fontSize: "11px",
          color: "#dddddd",
          wordWrap: {
            width: 315,
          },
          lineSpacing: 2,
          align: "center",
          maxLines: 3,
        },
        0.5,
        0
      );

    // ========================================
    // ATRIBUTOS
    // ========================================

    label(
      445,
      180,
      "ATRIBUTOS BASE",
      {
        fontSize: "11px",
        color: "#d4a017",
        fontStyle: "bold",
      }
    );

    this.selectedClassAttributes =
      label(
        445,
        198,
        "",
        {
          fontSize: "10px",
          color: "#ffffff",
          lineSpacing: 2,
          align: "center",
          wordWrap: {
            width: 315,
          },
        },
        0.5,
        0
      );

    // ========================================
    // PASSIVAS
    // ========================================

    label(
      445,
      242,
      "PASSIVAS",
      {
        fontSize: "11px",
        color: "#7fc8ff",
        fontStyle: "bold",
      }
    );

    this.selectedClassPassives =
      label(
        445,
        258,
        "",
        {
          fontSize: "9px",
          color: "#dddddd",
          wordWrap: {
            width: 315,
          },
          lineSpacing: 1,
          align: "left",
          maxLines: 4,
        },
        0.5,
        0
      );

    // ========================================
    // HABILIDADES
    // ========================================

    label(
      445,
      315,
      "HABILIDADES",
      {
        fontSize: "11px",
        color: "#ff9b71",
        fontStyle: "bold",
      }
    );

    this.selectedClassAbilities =
      label(
        445,
        331,
        "",
        {
          fontSize: "9px",
          color: "#dddddd",
          wordWrap: {
            width: 315,
          },
          lineSpacing: 1,
          align: "left",
          maxLines: 3,
        },
        0.5,
        0
      );

    // ========================================
    // PAINEL DA LISTA DE CLASSES
    // ========================================

    box(
      25,
      420,
      600,
      240,
      0x151515,
      0x4d4d4d
    );

    label(
      325,
      438,
      "CLASSES DISPONÍVEIS",
      {
        fontSize: "15px",
        color: "#ffd700",
        fontStyle: "bold",
      }
    );

    // ========================================
    // PAINEL DIREITO - PRÉVIA
    // ========================================

    box(
      645,
      70,
      520,
      515,
      0x151515,
      0x4d4d4d
    );

    label(
      905,
      92,
      "PRÉVIA DO PERSONAGEM",
      {
        fontSize: "17px",
        color: "#ffffff",
        fontStyle: "bold",
      }
    );

    // ========================================
    // ÁREA DO PERSONAGEM
    // ========================================

    box(
      665,
      110,
      480,
      245,
      0x101010,
      0x3f3f3f
    );

    this.characterIcon =
      scene.add.graphics();

    container.add(
      this.characterIcon
    );

    // ========================================
    // MODIFICAÇÕES
    // ========================================

    label(
      905,
      372,
      "MODIFICAÇÕES DA CLASSE",
      {
        fontSize: "13px",
        color: "#d4a017",
        fontStyle: "bold",
      }
    );

    this.characterModificationText =
      label(
        905,
        394,
        "",
        {
          fontSize: "11px",
          color: "#dddddd",
          align: "center",
          wordWrap: {
            width: 440,
          },
          lineSpacing: 3,
          maxLines: 4,
        },
        0.5,
        0
      );

    // ========================================
    // CAMPO DE NOME
    // ========================================

    box(
      665,
      505,
      480,
      70,
      0x101010,
      0x3f3f3f
    );

    this.registrationNameInput =
      box(
        685,
        513,
        440,
        38,
        0x181818,
        0x666666
      );

    this.registrationNameInput.setInteractive({
      useHandCursor: true,
    });

    this.registrationNameText =
      label(
        905,
        532,
        "INSIRA SEU NOME",
        {
          fontSize: "15px",
          color: "#999999",
          fontStyle: "bold",
        }
      );

    label(
      905,
      561,
      "Até 16 caracteres",
      {
        fontSize: "11px",
        color: "#666666",
      }
    );

    // ========================================
    // BOTÕES
    // ========================================

    this.registrationButton =
      box(
        945,
        603,
        200,
        44,
        0x176b3a,
        0x3fa866
      );

    this.registrationButton.setInteractive({
      useHandCursor: true,
    });

    label(
      1045,
      625,
      "REGISTRAR",
      {
        fontSize: "15px",
        color: "#ffffff",
        fontStyle: "bold",
      }
    );

    this.registrationCancelButton =
      label(
        780,
        625,
        "CANCELAR",
        {
          fontSize: "13px",
          color: "#999999",
        }
      );

    this.registrationCancelButton.setInteractive({
      useHandCursor: true,
    });

    // ========================================
    // EVENTOS
    // ========================================

    this.registrationNameInput.on(
      "pointerdown",
      () => {
        if (!this.registrationMode) {
          return;
        }

        this.registrationNameInput.setStrokeStyle(
          2,
          0xd4a017
        );
      }
    );

    this.registrationButton.on(
      "pointerover",
      () => {
        if (this.registrationMode) {
          this.registrationButton.setFillStyle(
            0x218b4b
          );
        }
      }
    );

    this.registrationButton.on(
      "pointerout",
      () => {
        this.registrationButton.setFillStyle(
          0x176b3a
        );
      }
    );

    this.registrationButton.on(
      "pointerdown",
      () => {
        this.confirmRegistration();
      }
    );

    this.registrationCancelButton.on(
      "pointerover",
      () => {
        this.registrationCancelButton.setColor(
          "#ffffff"
        );
      }
    );

    this.registrationCancelButton.on(
      "pointerout",
      () => {
        this.registrationCancelButton.setColor(
          "#999999"
        );
      }
    );

    this.registrationCancelButton.on(
      "pointerdown",
      () => {
        this.close();
      }
    );
  }

  // ========================================
  // INICIAR DIÁLOGO
  // ========================================

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
    this.currentNodeId = "node_0";
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

  // ========================================
  // UPDATE
  // ========================================

  update(): void {
    if (!this.active) {
      return;
    }

    if (this.registrationMode) {
      return;
    }

    if (this.inputMode) {
      this.updateNameInput();
      return;
    }

    if (this.classSelectionMode) {
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

  // ========================================
  // MOSTRAR NÓ
  // ========================================

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

      if (this.registrationMode) {
        return;
      }
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

  // ========================================
  // ESCOLHAS
  // ========================================

  private showChoices(
    choices: DialogueChoice[]
  ): void {
    const startY =
      this.scene.scale.height -
      110;

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
                fontSize: "16px",
                color: "#ffffff",
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
              useHandCursor: true,
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

    if (!this.registrationMode) {
      this.close();
    }
  }

  // ========================================
  // PRÓXIMO NÓ
  // ========================================

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

  // ========================================
  // REGISTRO
  // ========================================

  startRegistration(
    classes: RegistrationClass[],
    callback: (
      data: RegistrationData
    ) => void
  ): void {
    this.active = true;
    this.registrationMode = true;

    this.registrationClasses =
      classes;

    this.selectedRegistrationClass =
      null;

    this.registrationPlayerName =
      "";

    this.onRegistrationConfirmed =
      callback;

    this.scene.input.keyboard!.on(
      "keydown",
      this.handleRegistrationInput,
      this
    );

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

    this.clearChoices();

    this.registrationContainer.setVisible(
      true
    );

    this.createRegistrationClasses();

    this.updateSelectedClass();

    this.updateRegistrationName();
  }

  // ========================================
  // CLASSES
  // ========================================

  private createRegistrationClasses(): void {
    this.clearRegistrationClasses();

    const startX = 37;
    const startY = 455;

    const buttonWidth = 184;
    const buttonHeight = 27;

    const gapX = 12;
    const gapY = 5;

    this.registrationClasses.forEach(
      (
        characterClass,
        index
      ) => {
        const column =
          index % 3;

        const row =
          Math.floor(
            index / 3
          );

        const x =
          startX +
          column *
            (buttonWidth + gapX);

        const y =
          startY +
          row *
            (buttonHeight + gapY);

        const button =
          this.scene.add
            .rectangle(
              x,
              y,
              buttonWidth,
              buttonHeight,
              0x1b1b1b,
              1
            )
            .setOrigin(0, 0)
            .setStrokeStyle(
              1,
              0x4a4a4a
            )
            .setInteractive({
              useHandCursor: true,
            });

        const text =
          this.scene.add
            .text(
              x + 12,
              y +
                buttonHeight / 2,
              characterClass.name,
              {
                fontSize: "10px",
                color: "#ffffff",
                fontStyle: "bold",
              }
            )
            .setOrigin(0, 0.5);

        const arrow =
          this.scene.add
            .text(
              x +
                buttonWidth -
                14,
              y +
                buttonHeight / 2,
              "›",
              {
                fontSize: "16px",
                color: "#aaaaaa",
              }
            )
            .setOrigin(0.5);

        this.registrationContainer.add(
          [
            button,
            text,
            arrow,
          ]
        );

        button.on(
          "pointerover",
          () => {
            if (
              this.selectedRegistrationClass
                ?.id ===
              characterClass.id
            ) {
              return;
            }

            button.setFillStyle(
              0x292929
            );

            button.setStrokeStyle(
              1,
              0xd4a017
            );

            text.setColor(
              "#ffd700"
            );

            arrow.setColor(
              "#ffd700"
            );
          }
        );

        button.on(
          "pointerout",
          () => {
            if (
              this.selectedRegistrationClass
                ?.id ===
              characterClass.id
            ) {
              return;
            }

            button.setFillStyle(
              0x1b1b1b
            );

            button.setStrokeStyle(
              1,
              0x4a4a4a
            );

            text.setColor(
              "#ffffff"
            );

            arrow.setColor(
              "#aaaaaa"
            );
          }
        );

        button.on(
          "pointerdown",
          () => {
            this.selectRegistrationClass(
              characterClass
            );
          }
        );

        this.registrationClassButtons.push(
          button
        );

        this.registrationClassTexts.push(
          text
        );

        this.registrationClassArrows.push(
          arrow
        );
      }
    );
  }

  // ========================================
  // SELECIONAR CLASSE
  // ========================================

  private selectRegistrationClass(
    characterClass: RegistrationClass
  ): void {
    this.selectedRegistrationClass =
      characterClass;

    for (
      let i = 0;
      i <
      this.registrationClasses.length;
      i++
    ) {
      const currentClass =
        this.registrationClasses[i];

      const button =
        this.registrationClassButtons[i];

      const text =
        this.registrationClassTexts[i];

      const arrow =
        this.registrationClassArrows[i];

      if (
        currentClass.id ===
        characterClass.id
      ) {
        button.setFillStyle(
          0x5a4a16
        );

        button.setStrokeStyle(
          2,
          0xffd700
        );

        text.setColor(
          "#ffd700"
        );

        arrow.setColor(
          "#ffd700"
        );
      } else {
        button.setFillStyle(
          0x1b1b1b
        );

        button.setStrokeStyle(
          1,
          0x4a4a4a
        );

        text.setColor(
          "#ffffff"
        );

        arrow.setColor(
          "#aaaaaa"
        );
      }
    }

    this.updateSelectedClass();
  }

  // ========================================
  // ATUALIZAR CLASSE SELECIONADA
  // ========================================

  private updateSelectedClass(): void {
    if (
      !this.selectedRegistrationClass
    ) {
      this.selectedClassName.setText(
        "SELECIONE UMA CLASSE"
      );

      this.selectedClassDescription.setText(
        "Escolha uma das classes abaixo para visualizar suas características."
      );

      this.selectedClassAttributes.setText(
        "Força: -          Vitalidade: -\n" +
          "Defesa: -         Agilidade: -\n" +
          "Sorte: -          Inteligência: -"
      );

      this.selectedClassPassives.setText(
        "Nenhuma passiva selecionada."
      );

      this.selectedClassAbilities.setText(
        "Nenhuma habilidade selecionada."
      );

      this.selectedClassIconText.setText(
        "CLASSE"
      );

      this.characterModificationText.setText(
        "Selecione uma classe para visualizar\n" +
          "as alterações visuais do personagem."
      );

      this.drawClassIcon(
        null
      );

      this.drawCharacterIcon();

      return;
    }

    const characterClass =
      this.selectedRegistrationClass;

    this.selectedClassName.setText(
      characterClass.name
    );

    this.selectedClassDescription.setText(
      characterClass.description
    );

    // ========================================
    // ATRIBUTOS
    // ========================================

    this.selectedClassAttributes.setText(
      `Força: ${characterClass.strength}          Vitalidade: ${characterClass.vitality}\n` +
        `Defesa: ${characterClass.defense}         Agilidade: ${characterClass.agility}\n` +
        `Sorte: ${characterClass.luck}          Inteligência: ${characterClass.intelligence}`
    );

    // ========================================
    // PASSIVAS
    // ========================================

    const passiveText =
      characterClass.passives
        .map(
          (passive) =>
            `• ${passive.name}: ${passive.description}`
        )
        .join("\n");

    this.selectedClassPassives.setText(
      passiveText ||
        "Nenhuma passiva."
    );

    // ========================================
    // HABILIDADES
    // ========================================

    const abilityText =
      characterClass.abilities
        .map(
          (ability) =>
            `• ${ability.name}: ${ability.description}`
        )
        .join("\n");

    this.selectedClassAbilities.setText(
      abilityText ||
        "Nenhuma habilidade."
    );

    // ========================================
    // RESTANTE DA UI
    // ========================================

    this.selectedClassIconText.setText(
      characterClass.name.toUpperCase()
    );

    this.characterModificationText.setText(
      this.getClassModificationText(
        characterClass.id
      )
    );

    this.drawClassIcon(
      characterClass
    );

    this.drawCharacterIcon();
  }

  // ========================================
  // DESCRIÇÃO DA MODIFICAÇÃO
  // ========================================

  private getClassModificationText(
    classId: string
  ): string {
    const modifications: Record<
      string,
      string
    > = {
      warrior:
        "• Pequena ombreira de metal em um dos ombros",

      knight:
        "• Ombreiras maiores\n" +
        "• Detalhe de armadura no peito",

      berserker:
        "• Faixas nos braços\n" +
        "• Pequena proteção no antebraço",

      paladin:
        "• Símbolo sagrado dourado no peito",

      monk:
        "• Faixas nas duas mãos e antebraços",

      assassin:
        "• Meia máscara cobrindo a parte inferior do rosto\n" +
        "• Duas adagas quando a dupla empunhadura estiver equipada",

      rogue:
        "• Capuz pequeno\n" +
        "• Adaga presa na cintura",

      mage:
        "• Pequeno capuz pontudo\n" +
        "• Cristal no peito",

      sorcerer:
        "• Orbe mágico flutuando perto do ombro",

      cleric:
        "• Colar com símbolo sagrado",

      necromancer:
        "• Pequeno manto escuro\n" +
        "• Amuleto de caveira",

      druid:
        "• Folhas e raminhos presos no ombro\n" +
        "• Pequeno colar natural",

      archer:
        "• Aljava pequena nas costas",

      hunter:
        "• Bolsa de caça na cintura\n" +
        "• Pequena faca",

      sharpshooter:
        "• Bandoleira pequena\n" +
        "• Luneta/visor preso ao equipamento",

      ranger:
        "• Capa curta\n" +
        "• Aljava",

      unknown:
        "• Brinco dourado\n" +
        "• Ficha de aposta presa à roupa\n" +
        "• Detalhe de terno/colete",
    };

    return (
      modifications[classId] ??
      "• Pequenos detalhes relacionados à classe"
    );
  }

  // ========================================
  // ÍCONE DA CLASSE
  // ========================================

  private drawClassIcon(
    characterClass: RegistrationClass | null
  ): void {
    const g =
      this.selectedClassIcon;

    g.clear();

    const x =
      CLASS_ICON_X;

    const y =
      CLASS_ICON_Y;

    if (!characterClass) {
      g.lineStyle(
        3,
        0x666666,
        1
      );

      g.strokeCircle(
        x,
        y - 35,
        34
      );

      g.strokeRoundedRect(
        x - 48,
        y + 10,
        96,
        62,
        26
      );

      return;
    }

    g.fillStyle(
      0x242424,
      1
    );

    g.fillCircle(
      x,
      y - 5,
      70
    );

    g.lineStyle(
      3,
      0xd4a017,
      1
    );

    g.strokeCircle(
      x,
      y - 5,
      70
    );

    g.fillStyle(
      0xd4a017,
      1
    );

    g.fillCircle(
      x,
      y - 22,
      20
    );

    g.fillRoundedRect(
      x - 32,
      y + 2,
      64,
      52,
      24
    );
  }

  // ========================================
  // PRÉVIA DO PERSONAGEM
  // ========================================

  private drawCharacterIcon(): void {
    const g =
      this.characterIcon;

    g.clear();

    const classId =
      this.selectedRegistrationClass?.id ??
      null;

    if (classId) {
      drawClassBack(
        g,
        classId,
        PREVIEW_X,
        PREVIEW_Y,
        PREVIEW_SIZE
      );
    }

    drawCharacterBody(
      g,
      PREVIEW_X,
      PREVIEW_Y,
      PREVIEW_SIZE
    );

    drawCharacterHead(
      g,
      PREVIEW_X,
      PREVIEW_Y,
      PREVIEW_SIZE
    );

    if (classId) {
      drawClassFront(
        g,
        classId,
        PREVIEW_X,
        PREVIEW_Y,
        PREVIEW_SIZE
      );
    }
  }

  // ========================================
  // NOME
  // ========================================

  private updateRegistrationName(): void {
    if (
      this.registrationPlayerName
        .length === 0
    ) {
      this.registrationNameText.setText(
        "INSIRA SEU NOME"
      );

      this.registrationNameText.setColor(
        "#999999"
      );

      return;
    }

    this.registrationNameText.setText(
      this.registrationPlayerName
    );

    this.registrationNameText.setColor(
      "#ffffff"
    );
  }

  private handleRegistrationInput = (
    event: KeyboardEvent
  ): void => {
    if (!this.registrationMode) {
      return;
    }

    const key =
      event.key;

    if (key === "Backspace") {
      this.registrationPlayerName =
        this.registrationPlayerName.slice(
          0,
          -1
        );

      this.updateRegistrationName();

      return;
    }

    if (key === "Enter") {
      this.confirmRegistration();

      return;
    }

    if (
      key.length === 1 &&
      /^[a-zA-ZÀ-ÿ0-9 ]$/.test(
        key
      ) &&
      this.registrationPlayerName
        .length < 16
    ) {
      this.registrationPlayerName +=
        key;

      this.updateRegistrationName();
    }
  };

  // ========================================
  // CONFIRMAR REGISTRO
  // ========================================

  private confirmRegistration(): void {
    if (!this.registrationMode) {
      return;
    }

    const name =
      this.registrationPlayerName.trim();

    if (name.length === 0) {
      this.registrationNameInput.setStrokeStyle(
        2,
        0xb52b2b
      );

      this.registrationNameText.setColor(
        "#b52b2b"
      );

      return;
    }

    if (
      !this.selectedRegistrationClass
    ) {
      this.selectedClassPanel.setStrokeStyle(
        2,
        0xb52b2b
      );

      return;
    }

    if (this.onRegistrationConfirmed) {
      this.onRegistrationConfirmed({
        name,
        classId:
          this.selectedRegistrationClass.id,
      });
    }

    this.close();
  }

  // ========================================
  // INPUT DE NOME ANTIGO
  // ========================================

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
      this.playerName.length < 16
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
      this.playerName || "|"
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

    if (this.onNameConfirmed) {
      this.onNameConfirmed(
        name
      );
    }

    this.onNameConfirmed =
      null;

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

  // ========================================
  // SELEÇÃO DE CLASSE ANTIGA
  // ========================================

  startClassSelection(
    callback?: (
      classId: string
    ) => void
  ): void {
    this.classSelectionMode = true;

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
      (
        characterClass,
        index
      ) => {
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
                fontSize: "18px",
                color: "#ffffff",
                backgroundColor:
                  "#202020",
                padding: {
                  x: 12,
                  y: 8,
                },
                fixedWidth: 330,
              }
            )
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(402)
            .setInteractive({
              useHandCursor: true,
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
    if (this.onClassSelected) {
      this.onClassSelected(
        classId
      );
    }

    this.close();
  }

  // ========================================
  // LIMPAR
  // ========================================

  private clearRegistrationClasses(): void {
    for (
      const button of
      this.registrationClassButtons
    ) {
      button.destroy();
    }

    for (
      const text of
      this.registrationClassTexts
    ) {
      text.destroy();
    }

    for (
      const arrow of
      this.registrationClassArrows
    ) {
      arrow.destroy();
    }

    this.registrationClassButtons =
      [];

    this.registrationClassTexts =
      [];

    this.registrationClassArrows =
      [];
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

    this.classSelectionTexts =
      [];
  }

  // ========================================
  // FECHAR
  // ========================================

  close(): void {
    this.active = false;

    this.inputMode = false;

    this.classSelectionMode =
      false;

    this.registrationMode =
      false;

    this.clearChoices();

    this.clearClassSelection();

    this.clearRegistrationClasses();

    // ========================================
    // DIÁLOGO
    // ========================================

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

    // ========================================
    // INPUT ANTIGO
    // ========================================

    this.nameInputBackground.setVisible(
      false
    );

    this.nameInputText.setVisible(
      false
    );

    this.nameInputHint.setVisible(
      false
    );

    // ========================================
    // CLASSE ANTIGA
    // ========================================

    this.classSelectionBackground.setVisible(
      false
    );

    this.classSelectionTitle.setVisible(
      false
    );

    // ========================================
    // REGISTRO
    // ========================================

    this.registrationContainer.setVisible(
      false
    );

    // ========================================
    // REMOVER INPUTS
    // ========================================

    this.scene.input.keyboard!.off(
      "keydown",
      this.handleTextInput,
      this
    );

    this.scene.input.keyboard!.off(
      "keydown",
      this.handleRegistrationInput,
      this
    );

    // ========================================
    // RESET
    // ========================================

    this.nodes = {};

    this.currentNodeId = "";

    this.selectedRegistrationClass =
      null;

    this.registrationPlayerName =
      "";

    this.onNameConfirmed =
      null;

    this.onClassSelected =
      null;

    this.onRegistrationConfirmed =
      null;
  }

  // ========================================
  // ESTADO
  // ========================================

  isActive(): boolean {
    return this.active;
  }

  getPlayerName(): string {
    return this.playerName;
  }
}