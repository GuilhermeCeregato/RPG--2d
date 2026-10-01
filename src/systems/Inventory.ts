import Phaser from "phaser";
import { Item, ItemRarity } from "../items/Item";

interface InventorySlot {
  item: Item | null;
  quantity: number;
}

interface EquipmentSlot {
  id: string;
  name: string;
  item: Item | null;
  background: Phaser.GameObjects.Rectangle;
  icon: Phaser.GameObjects.Image | null;
  label: Phaser.GameObjects.Text;
}

type InventoryCategory =
  | "all"
  | "weapon"
  | "armor"
  | "potion"
  | "material"
  | "quest";

export class InventorySystem {
  private scene: Phaser.Scene;
  private inventoryOpen = false;

  private uiContainer!: Phaser.GameObjects.Container;

  private slots: InventorySlot[] = [];
  private readonly slotCount = 24;
  private selectedSlot = -1;

  private currentCategory: InventoryCategory = "all";

  private inventoryBackground!: Phaser.GameObjects.Rectangle;
  private titleText!: Phaser.GameObjects.Text;

  private levelBackground!: Phaser.GameObjects.Rectangle;
  private levelText!: Phaser.GameObjects.Text;

  private characterPanel!: Phaser.GameObjects.Rectangle;
  private characterHead!: Phaser.GameObjects.Ellipse;
  private characterBody!: Phaser.GameObjects.Rectangle;
  private characterLegLeft!: Phaser.GameObjects.Rectangle;
  private characterLegRight!: Phaser.GameObjects.Rectangle;

  private equipmentSlots: EquipmentSlot[] = [];

  private statsPanel!: Phaser.GameObjects.Rectangle;
  private statsTexts: Phaser.GameObjects.Text[] = [];

  private attributePanel!: Phaser.GameObjects.Rectangle;
  private attributeTexts: Phaser.GameObjects.Text[] = [];

  private inventoryPanel!: Phaser.GameObjects.Rectangle;

  private categoryButtons: Phaser.GameObjects.Rectangle[] = [];
  private categoryTexts: Phaser.GameObjects.Text[] = [];

  private inventorySlotBackgrounds: Phaser.GameObjects.Rectangle[] = [];
  private inventorySlotIcons: (Phaser.GameObjects.Image | null)[] = [];
  private inventorySlotTexts: Phaser.GameObjects.Text[] = [];

  private itemInfoPanel!: Phaser.GameObjects.Rectangle;
  private itemNameText!: Phaser.GameObjects.Text;
  private itemDescriptionText!: Phaser.GameObjects.Text;
  private itemRarityText!: Phaser.GameObjects.Text;
  private itemQuantityText!: Phaser.GameObjects.Text;

  private healthBarBackground!: Phaser.GameObjects.Rectangle;
  private healthBar!: Phaser.GameObjects.Rectangle;
  private healthBarText!: Phaser.GameObjects.Text;

  private staminaBarBackground!: Phaser.GameObjects.Rectangle;
  private staminaBar!: Phaser.GameObjects.Rectangle;
  private staminaBarText!: Phaser.GameObjects.Text;

  private closeText!: Phaser.GameObjects.Text;

  private characterClass = "Guerreiro";
  private characterSubclass = "Nenhuma";
  private characterProfession = "Nenhuma";

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    for (let i = 0; i < this.slotCount; i++) {
      this.slots.push({
        item: null,
        quantity: 0,
      });
    }

    this.uiContainer = this.scene.add.container(0, 0);

    this.uiContainer.setScrollFactor(0);
    this.uiContainer.setDepth(10000);

    this.createUI();

    this.uiContainer.each(
      (child: Phaser.GameObjects.GameObject) => {
        (child as Phaser.GameObjects.Image).setScrollFactor(0);
      }
    );

    this.uiContainer.setVisible(false);

    if (!scene.input.keyboard) {
      throw new Error("Teclado não disponível.");
    }

    scene.input.keyboard.on("keydown-I", () => {
      this.toggle();
    });
  }

  private createUI(): void {
    const camera = this.scene.cameras.main;

    const centerX = camera.width / 2;
    const centerY = camera.height / 2;

    this.inventoryBackground = this.scene.add.rectangle(
      centerX,
      centerY,
      1160,
      650,
      0x101218,
      0.98
    );

    this.inventoryBackground.setStrokeStyle(
      2,
      0x555b66,
      1
    );

    this.uiContainer.add(
      this.inventoryBackground
    );

    this.titleText = this.scene.add.text(
      centerX,
      centerY - 305,
      "PERSONAGEM",
      {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#e6e6e6",
        fontStyle: "bold",
      }
    );

    this.titleText.setOrigin(0.5);

    this.uiContainer.add(
      this.titleText
    );

    this.levelBackground = this.scene.add.rectangle(
      centerX - 420,
      centerY - 220,
      270,
      65,
      0x191d24
    );

    this.levelBackground.setStrokeStyle(
      1,
      0x777e8a,
      1
    );

    this.uiContainer.add(
      this.levelBackground
    );

    this.levelText = this.scene.add.text(
      centerX - 420,
      centerY - 220,
      "1\nNÍVEL",
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        fontStyle: "bold",
        align: "center",
        lineSpacing: 4,
      }
    );

    this.levelText.setOrigin(0.5);

    this.uiContainer.add(
      this.levelText
    );

    this.createStatsPanel(
      centerX - 420,
      centerY - 53
    );

    this.createAttributePanel(
      centerX - 420,
      centerY + 180
    );

    this.createCharacterEquipment(
      centerX - 45,
      centerY + 15
    );

    this.createInventoryPanel(
      centerX + 385,
      centerY + 15
    );

    this.createBottomBars(
      centerX - 45,
      centerY + 292
    );

    this.closeText = this.scene.add.text(
      centerX + 515,
      centerY + 305,
      "[I] FECHAR",
      {
        fontFamily: "Arial",
        fontSize: "12px",
        color: "#777d87",
      }
    );

    this.closeText.setOrigin(1, 0.5);

    this.uiContainer.add(
      this.closeText
    );
  }

  private createStatsPanel(
    x: number,
    y: number
  ): void {
    this.statsPanel = this.scene.add.rectangle(
      x,
      y,
      270,
      255,
      0x15191f
    );

    this.statsPanel.setStrokeStyle(
      1,
      0x454b55,
      1
    );

    this.uiContainer.add(
      this.statsPanel
    );

    const title = this.scene.add.text(
      x - 115,
      y - 110,
      "STATUS BASE",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#d7d9dd",
        fontStyle: "bold",
      }
    );

    this.uiContainer.add(title);

    const characterInfoBackground =
      this.scene.add.rectangle(
        x,
        y - 53,
        235,
        82,
        0x11151b
      );

    characterInfoBackground.setStrokeStyle(
      1,
      0x3b414a,
      1
    );

    this.uiContainer.add(
      characterInfoBackground
    );

    const characterInfo = [
      ["CLASSE", this.characterClass],
      ["SUBCLASSE", this.characterSubclass],
      ["PROFISSÃO", this.characterProfession],
    ];

    characterInfo.forEach(
      ([name, value], index) => {
        const rowY =
          y - 84 + index * 25;

        const nameText = this.scene.add.text(
          x - 85,
          rowY,
          name,
          {
            fontFamily: "Arial",
            fontSize: "10px",
            color: "#9298a2",
          }
        );

        const valueText = this.scene.add.text(
          x + 85,
          rowY,
          value,
          {
            fontFamily: "Arial",
            fontSize: "10px",
            color: "#eeeeee",
            fontStyle: "bold",
          }
        );

        valueText.setOrigin(1, 0);

        this.statsTexts.push(
          nameText,
          valueText
        );

        this.uiContainer.add([
          nameText,
          valueText,
        ]);
      }
    );

    const stats = [
      ["VIDA", "100 / 100"],
      ["ATAQUE", "10"],
      ["DEFESA", "0"],
      ["VELOCIDADE", "200"],
      ["CRÍTICO", "5%"],
      ["SORTE", "0"],
    ];

    stats.forEach(
      ([name, value], index) => {
        const rowY =
          y + 2 + index * 21;

        const nameText = this.scene.add.text(
          x - 110,
          rowY,
          name,
          {
            fontFamily: "Arial",
            fontSize: "10px",
            color: "#9298a2",
          }
        );

        const valueText = this.scene.add.text(
          x + 105,
          rowY,
          value,
          {
            fontFamily: "Arial",
            fontSize: "10px",
            color: "#eeeeee",
            fontStyle: "bold",
          }
        );

        valueText.setOrigin(1, 0);

        this.statsTexts.push(
          nameText,
          valueText
        );

        this.uiContainer.add([
          nameText,
          valueText,
        ]);
      }
    );
  }

  private createAttributePanel(
    x: number,
    y: number
  ): void {
    this.attributePanel = this.scene.add.rectangle(
      x,
      y,
      270,
      205,
      0x15191f
    );

    this.attributePanel.setStrokeStyle(
      1,
      0x454b55,
      1
    );

    this.uiContainer.add(
      this.attributePanel
    );

    const title = this.scene.add.text(
      x - 115,
      y - 88,
      "ATRIBUTOS",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#d7d9dd",
        fontStyle: "bold",
      }
    );

    this.uiContainer.add(title);

    const points = this.scene.add.text(
      x + 115,
      y - 88,
      "PONTOS: 0",
      {
        fontFamily: "Arial",
        fontSize: "11px",
        color: "#858c96",
      }
    );

    points.setOrigin(1, 0);

    this.uiContainer.add(points);

    const attributes = [
      "FORÇA",
      "VITALIDADE",
      "DEFESA",
      "AGILIDADE",
      "SORTE",
    ];

    attributes.forEach(
      (name, index) => {
        const rowY =
          y - 55 + index * 29;

        const nameText = this.scene.add.text(
          x - 110,
          rowY,
          name,
          {
            fontFamily: "Arial",
            fontSize: "11px",
            color: "#a0a5ad",
          }
        );

        const valueText = this.scene.add.text(
          x + 35,
          rowY,
          "1",
          {
            fontFamily: "Arial",
            fontSize: "11px",
            color: "#eeeeee",
            fontStyle: "bold",
          }
        );

        const plus = this.scene.add.rectangle(
          x + 105,
          rowY + 7,
          20,
          20,
          0x252a32
        );

        plus.setStrokeStyle(
          1,
          0x555c67,
          1
        );

        const plusText = this.scene.add.text(
          x + 105,
          rowY + 7,
          "+",
          {
            fontFamily: "Arial",
            fontSize: "14px",
            color: "#bfc4cc",
            fontStyle: "bold",
          }
        );

        plusText.setOrigin(0.5);

        this.attributeTexts.push(
          nameText,
          valueText,
          plusText
        );

        this.uiContainer.add([
          nameText,
          valueText,
          plus,
          plusText,
        ]);
      }
    );
  }

  private createCharacterEquipment(
    x: number,
    y: number
  ): void {
    this.characterPanel = this.scene.add.rectangle(
      x,
      y,
      405,
      510,
      0x15191f
    );

    this.characterPanel.setStrokeStyle(
      1,
      0x454b55,
      1
    );

    this.uiContainer.add(
      this.characterPanel
    );

    const title = this.scene.add.text(
      x,
      y - 225,
      "EQUIPAMENTOS",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#d7d9dd",
        fontStyle: "bold",
      }
    );

    title.setOrigin(0.5);

    this.uiContainer.add(title);

    this.characterHead = this.scene.add.ellipse(
      x,
      y - 45,
      38,
      38,
      0x3498db
    );

    this.characterHead.setStrokeStyle(
      2,
      0x6ec6ff,
      1
    );

    this.characterBody = this.scene.add.rectangle(
      x,
      y + 25,
      50,
      82,
      0x3498db
    );

    this.characterBody.setStrokeStyle(
      2,
      0x6ec6ff,
      1
    );

    this.characterLegLeft = this.scene.add.rectangle(
      x - 14,
      y + 87,
      14,
      38,
      0x246b9c
    );

    this.characterLegRight = this.scene.add.rectangle(
      x + 14,
      y + 87,
      14,
      38,
      0x246b9c
    );

    this.uiContainer.add([
      this.characterHead,
      this.characterBody,
      this.characterLegLeft,
      this.characterLegRight,
    ]);

    const slotSize = 58;

    const positions = [
      {
        id: "helmet",
        name: "CAPACETE",
        x: x - 150,
        y: y - 145,
      },
      {
        id: "chest",
        name: "PEITORAL",
        x: x - 150,
        y: y - 55,
      },
      {
        id: "necklace",
        name: "COLAR",
        x: x - 150,
        y: y + 35,
      },
      {
        id: "gloves",
        name: "LUVA",
        x: x - 150,
        y: y + 125,
      },
      {
        id: "weapon",
        name: "ARMA",
        x: x + 150,
        y: y - 145,
      },
      {
        id: "offhand",
        name: "SECUNDÁRIA",
        x: x + 150,
        y: y - 55,
      },
      {
        id: "boots",
        name: "BOTAS",
        x: x + 150,
        y: y + 35,
      },
      {
        id: "accessory",
        name: "ACESSÓRIO",
        x: x + 150,
        y: y + 125,
      },
      {
        id: "ring",
        name: "ANEL",
        x: x - 90,
        y: y + 195,
      },
      {
        id: "belt",
        name: "CINTO",
        x: x - 30,
        y: y + 195,
      },
      {
        id: "amulet",
        name: "AMULETO",
        x: x + 30,
        y: y + 195,
      },
      {
        id: "relic",
        name: "RELIQUIA",
        x: x + 90,
        y: y + 195,
      },
    ];

    positions.forEach(
      (position) => {
        const background =
          this.scene.add.rectangle(
            position.x,
            position.y,
            slotSize,
            slotSize,
            0x20252d
          );

        background.setStrokeStyle(
          1,
          0x555c67,
          1
        );

        const label =
          this.scene.add.text(
            position.x,
            position.y + 38,
            position.name,
            {
              fontFamily: "Arial",
              fontSize: "7px",
              color: "#737a85",
              align: "center",
            }
          );

        label.setOrigin(0.5);

        const equipmentSlot: EquipmentSlot = {
          id: position.id,
          name: position.name,
          item: null,
          background,
          icon: null,
          label,
        };

        this.equipmentSlots.push(
          equipmentSlot
        );

        this.uiContainer.add([
          background,
          label,
        ]);
      }
    );
  }

  private createInventoryPanel(
    x: number,
    y: number
  ): void {
    this.inventoryPanel =
      this.scene.add.rectangle(
        x,
        y,
        330,
        510,
        0x15191f
      );

    this.inventoryPanel.setStrokeStyle(
      1,
      0x454b55,
      1
    );

    this.uiContainer.add(
      this.inventoryPanel
    );

    const title =
      this.scene.add.text(
        x,
        y - 225,
        "INVENTÁRIO",
        {
          fontFamily: "Arial",
          fontSize: "14px",
          color: "#d7d9dd",
          fontStyle: "bold",
        }
      );

    title.setOrigin(0.5);

    this.uiContainer.add(title);

    const categories: {
      label: string;
      category: InventoryCategory;
    }[] = [
      {
        label: "TODOS",
        category: "all",
      },
      {
        label: "ARM",
        category: "weapon",
      },
      {
        label: "DEF",
        category: "armor",
      },
      {
        label: "POÇ",
        category: "potion",
      },
      {
        label: "MAT",
        category: "material",
      },
      {
        label: "QUEST",
        category: "quest",
      },
    ];

    const buttonWidth = 43;
    const gap = 7;

    const totalWidth =
      categories.length *
        buttonWidth +
      (categories.length - 1) *
        gap;

    const startX =
      x -
      totalWidth / 2 +
      buttonWidth / 2;

    categories.forEach(
      (
        categoryData,
        index
      ) => {
        const buttonX =
          startX +
          index *
            (buttonWidth + gap);

        const button =
          this.scene.add.rectangle(
            buttonX,
            y - 190,
            buttonWidth,
            27,
            index === 0
              ? 0x353b45
              : 0x20252d
          );

        button.setStrokeStyle(
          index === 0 ? 2 : 1,
          index === 0
            ? 0x8a929d
            : 0x555c67,
          1
        );

        const text =
          this.scene.add.text(
            buttonX,
            y - 190,
            categoryData.label,
            {
              fontFamily: "Arial",
              fontSize: "8px",
              color:
                index === 0
                  ? "#ffffff"
                  : "#858c96",
              fontStyle: "bold",
            }
          );

        text.setOrigin(0.5);

        button.setInteractive({
          useHandCursor: true,
        });

        text.setInteractive({
          useHandCursor: true,
        });

        button.on(
          "pointerdown",
          () => {
            this.setCategory(
              categoryData.category
            );
          }
        );

        text.on(
          "pointerdown",
          () => {
            this.setCategory(
              categoryData.category
            );
          }
        );

        this.categoryButtons.push(
          button
        );

        this.categoryTexts.push(
          text
        );

        this.uiContainer.add([
          button,
          text,
        ]);
      }
    );

    const columns = 6;
    const slotSize = 43;
    const spacing = 7;

    const gridWidth =
      columns *
        slotSize +
      (columns - 1) *
        spacing;

    const gridStartX =
      x -
      gridWidth / 2 +
      slotSize / 2;

    const gridStartY =
      y - 135;

    for (
      let i = 0;
      i < this.slotCount;
      i++
    ) {
      const column =
        i % columns;

      const row =
        Math.floor(i / columns);

      const slotX =
        gridStartX +
        column *
          (slotSize + spacing);

      const slotY =
        gridStartY +
        row *
          (slotSize + spacing);

      const background =
        this.scene.add.rectangle(
          slotX,
          slotY,
          slotSize,
          slotSize,
          0x20252d
        );

      background.setStrokeStyle(
        1,
        0x454b55,
        1
      );

      const icon =
        this.scene.add.image(
          slotX,
          slotY,
          "slime_gel"
        );

      const iconScale =
        Math.min(
          29 / icon.width,
          29 / icon.height
        );

      icon.setScale(
        iconScale
      );

      icon.setVisible(false);

      const quantityText =
        this.scene.add.text(
          slotX + 17,
          slotY + 16,
          "",
          {
            fontFamily: "Arial",
            fontSize: "9px",
            color: "#ffffff",
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 2,
          }
        );

      quantityText.setOrigin(1, 1);

      this.inventorySlotBackgrounds.push(
        background
      );

      this.inventorySlotIcons.push(
        icon
      );

      this.inventorySlotTexts.push(
        quantityText
      );

      this.uiContainer.add([
        background,
        icon,
        quantityText,
      ]);

      background.setInteractive({
        useHandCursor: true,
      });

      background.on(
        "pointerdown",
        () => {
          this.selectSlot(i);
        }
      );

      icon.setInteractive({
        useHandCursor: true,
      });

      icon.on(
        "pointerdown",
        () => {
          this.selectSlot(i);
        }
      );

      quantityText.setInteractive({
        useHandCursor: true,
      });

      quantityText.on(
        "pointerdown",
        () => {
          this.selectSlot(i);
        }
      );
    }

    this.itemInfoPanel =
      this.scene.add.rectangle(
        x,
        y + 190,
        292,
        105,
        0x11151b
      );

    this.itemInfoPanel.setStrokeStyle(
      1,
      0x3f454f,
      1
    );

    this.itemNameText =
      this.scene.add.text(
        x - 128,
        y + 155,
        "Nenhum item selecionado",
        {
          fontFamily: "Arial",
          fontSize: "12px",
          color: "#e8e8e8",
          fontStyle: "bold",
          wordWrap: {
            width: 255,
          },
        }
      );

    this.itemDescriptionText =
      this.scene.add.text(
        x - 128,
        y + 178,
        "Selecione um item para ver seus detalhes.",
        {
          fontFamily: "Arial",
          fontSize: "9px",
          color: "#7f8792",
          wordWrap: {
            width: 255,
          },
          lineSpacing: 3,
        }
      );

    this.itemRarityText =
      this.scene.add.text(
        x - 128,
        y + 211,
        "",
        {
          fontFamily: "Arial",
          fontSize: "9px",
          color: "#ffffff",
          fontStyle: "bold",
        }
      );

    this.itemQuantityText =
      this.scene.add.text(
        x + 128,
        y + 211,
        "",
        {
          fontFamily: "Arial",
          fontSize: "10px",
          color: "#aeb4bd",
        }
      );

    this.itemQuantityText.setOrigin(1, 0);

    this.uiContainer.add([
      this.itemInfoPanel,
      this.itemNameText,
      this.itemDescriptionText,
      this.itemRarityText,
      this.itemQuantityText,
    ]);

    this.categoryButtons.forEach(
      (button) => {
        this.uiContainer.bringToTop(
          button
        );
      }
    );

    this.categoryTexts.forEach(
      (text) => {
        this.uiContainer.bringToTop(
          text
        );
      }
    );
  }

  private createBottomBars(
    x: number,
    y: number
  ): void {
    this.healthBarBackground =
      this.scene.add.rectangle(
        x - 120,
        y,
        210,
        13,
        0x252a32
      );

    this.healthBarBackground.setStrokeStyle(
      1,
      0x4a505a,
      1
    );

    this.healthBar =
      this.scene.add.rectangle(
        x - 120,
        y,
        206,
        9,
        0x2ecc71
      );

    this.healthBarText =
      this.scene.add.text(
        x - 120,
        y,
        "HP 100 / 100",
        {
          fontFamily: "Arial",
          fontSize: "8px",
          color: "#ffffff",
          fontStyle: "bold",
        }
      );

    this.healthBarText.setOrigin(0.5);

    this.staminaBarBackground =
      this.scene.add.rectangle(
        x + 120,
        y,
        210,
        13,
        0x252a32
      );

    this.staminaBarBackground.setStrokeStyle(
      1,
      0x4a505a,
      1
    );

    this.staminaBar =
      this.scene.add.rectangle(
        x + 120,
        y,
        206,
        9,
        0x3498db
      );

    this.staminaBarText =
      this.scene.add.text(
        x + 120,
        y,
        "STAMINA 100 / 100",
        {
          fontFamily: "Arial",
          fontSize: "8px",
          color: "#ffffff",
          fontStyle: "bold",
        }
      );

    this.staminaBarText.setOrigin(0.5);

    this.uiContainer.add([
      this.healthBarBackground,
      this.healthBar,
      this.healthBarText,
      this.staminaBarBackground,
      this.staminaBar,
      this.staminaBarText,
    ]);
  }

  setHealth(
    health: number,
    maxHealth: number
  ): void {
    const percentage =
      Phaser.Math.Clamp(
        health / maxHealth,
        0,
        1
      );

    this.healthBar.width =
      206 * percentage;

    this.healthBarText.setText(
      `HP ${Math.ceil(health)} / ${Math.ceil(maxHealth)}`
    );
  }

  setStamina(
    stamina: number,
    maxStamina: number
  ): void {
    const percentage =
      Phaser.Math.Clamp(
        stamina / maxStamina,
        0,
        1
      );

    this.staminaBar.width =
      206 * percentage;

    this.staminaBarText.setText(
      `STAMINA ${Math.ceil(stamina)} / ${Math.ceil(maxStamina)}`
    );
  }

  setClass(
    characterClass: string
  ): void {
    this.characterClass =
      characterClass;

    this.updateCharacterInfo();
  }

  setSubclass(
    subclass: string
  ): void {
    this.characterSubclass =
      subclass;

    this.updateCharacterInfo();
  }

  setProfession(
    profession: string
  ): void {
    this.characterProfession =
      profession;

    this.updateCharacterInfo();
  }

  private updateCharacterInfo(): void {
    if (
      this.statsTexts.length < 6
    ) {
      return;
    }

    this.statsTexts[1].setText(
      this.characterClass
    );

    this.statsTexts[3].setText(
      this.characterSubclass
    );

    this.statsTexts[5].setText(
      this.characterProfession
    );
  }

  private selectSlot(
    index: number
  ): void {
    if (
      index < 0 ||
      index >= this.slots.length
    ) {
      return;
    }

    const slot =
      this.slots[index];

    if (!slot.item) {
      this.clearSelection();
      return;
    }

    if (
      !this.itemMatchesCategory(
        slot.item
      )
    ) {
      return;
    }

    this.selectedSlot = index;

    this.inventorySlotBackgrounds.forEach(
      (
        background,
        slotIndex
      ) => {
        const currentSlot =
          this.slots[slotIndex];

        if (
          slotIndex === index &&
          currentSlot.item
        ) {
          background.setStrokeStyle(
            2,
            0xd6b35a,
            1
          );
        } else if (
          currentSlot.item
        ) {
          background.setStrokeStyle(
            1,
            this.getRarityColorNumber(
              currentSlot.item.rarity
            ),
            1
          );
        } else {
          background.setStrokeStyle(
            1,
            0x454b55,
            1
          );
        }
      }
    );

    this.itemNameText.setText(
      slot.item.name
    );

    this.itemDescriptionText.setText(
      slot.item.description ||
        "Sem descrição."
    );

    this.itemRarityText.setText(
      this.getRarityName(
        slot.item.rarity
      )
    );

    this.itemRarityText.setColor(
      this.getRarityColor(
        slot.item.rarity
      )
    );

    this.itemQuantityText.setText(
      `x${slot.quantity}`
    );

    this.itemNameText.setColor(
      this.getRarityColor(
        slot.item.rarity
      )
    );

    this.itemNameText.setVisible(true);
    this.itemDescriptionText.setVisible(true);
    this.itemRarityText.setVisible(true);
    this.itemQuantityText.setVisible(true);
  }

  private clearSelection(): void {
    this.selectedSlot = -1;

    this.inventorySlotBackgrounds.forEach(
      (
        background,
        index
      ) => {
        const slot =
          this.slots[index];

        if (slot.item) {
          background.setStrokeStyle(
            1,
            this.getRarityColorNumber(
              slot.item.rarity
            ),
            1
          );
        } else {
          background.setStrokeStyle(
            1,
            0x454b55,
            1
          );
        }
      }
    );

    this.itemNameText.setText(
      "Nenhum item selecionado"
    );

    this.itemDescriptionText.setText(
      "Selecione um item para ver seus detalhes."
    );

    this.itemRarityText.setText("");
    this.itemQuantityText.setText("");

    this.itemNameText.setColor(
      "#e8e8e8"
    );
  }

  private setCategory(
    category: InventoryCategory
  ): void {
    this.currentCategory =
      category;

    this.categoryButtons.forEach(
      (
        button,
        index
      ) => {
        const buttonCategory =
          this.getCategoryByIndex(
            index
          );

        if (
          buttonCategory ===
          category
        ) {
          button.setFillStyle(
            0x353b45
          );

          button.setStrokeStyle(
            2,
            0x8a929d,
            1
          );

          this.categoryTexts[
            index
          ].setColor(
            "#ffffff"
          );
        } else {
          button.setFillStyle(
            0x20252d
          );

          button.setStrokeStyle(
            1,
            0x555c67,
            1
          );

          this.categoryTexts[
            index
          ].setColor(
            "#858c96"
          );
        }
      }
    );

    for (
      let i = 0;
      i < this.slotCount;
      i++
    ) {
      this.updateSlot(i);
    }

    if (
      this.selectedSlot !== -1
    ) {
      const selected =
        this.slots[
          this.selectedSlot
        ];

      if (
        !selected.item ||
        !this.itemMatchesCategory(
          selected.item
        )
      ) {
        this.clearSelection();
      }
    }
  }

  private getCategoryByIndex(
    index: number
  ): InventoryCategory {
    const categories:
      InventoryCategory[] = [
      "all",
      "weapon",
      "armor",
      "potion",
      "material",
      "quest",
    ];

    return (
      categories[index] ??
      "all"
    );
  }

  private itemMatchesCategory(
    item: Item
  ): boolean {
    if (
      this.currentCategory ===
      "all"
    ) {
      return true;
    }

    return (
      item.type ===
      this.currentCategory
    );
  }

  addItem(
    item: Item,
    quantity: number = 1
  ): boolean {
    for (
      let i = 0;
      i < this.slots.length;
      i++
    ) {
      const slot =
        this.slots[i];

      if (
        slot.item &&
        slot.item.id ===
          item.id
      ) {
        slot.quantity +=
          quantity;

        this.updateSlot(i);

        if (
          this.selectedSlot === i
        ) {
          this.selectSlot(i);
        }

        return true;
      }
    }

    for (
      let i = 0;
      i < this.slots.length;
      i++
    ) {
      if (
        !this.slots[i].item
      ) {
        this.slots[i] = {
          item,
          quantity,
        };

        this.updateSlot(i);

        console.log(
          `Item adicionado: ${item.name} x${quantity}`
        );

        return true;
      }
    }

    console.log(
      "Inventário cheio!"
    );

    return false;
  }

  removeItem(
    itemId: string,
    quantity: number = 1
  ): boolean {
    for (
      let i = 0;
      i < this.slots.length;
      i++
    ) {
      const slot =
        this.slots[i];

      if (
        slot.item &&
        slot.item.id ===
          itemId
      ) {
        if (
          slot.quantity <
          quantity
        ) {
          return false;
        }

        slot.quantity -=
          quantity;

        if (
          slot.quantity <= 0
        ) {
          this.slots[i] = {
            item: null,
            quantity: 0,
          };

          if (
            this.selectedSlot ===
            i
          ) {
            this.clearSelection();
          }
        }

        this.updateSlot(i);

        return true;
      }
    }

    return false;
  }

  private updateSlot(
    index: number
  ): void {
    const slot =
      this.slots[index];

    const background =
      this.inventorySlotBackgrounds[
        index
      ];

    const icon =
      this.inventorySlotIcons[
        index
      ];

    const quantityText =
      this.inventorySlotTexts[
        index
      ];

    if (
      !slot.item ||
      !this.itemMatchesCategory(
        slot.item
      )
    ) {
      background.setVisible(
        !slot.item
      );

      if (slot.item) {
        background.setVisible(
          false
        );
      }

      if (icon) {
        icon.setVisible(
          false
        );
      }

      quantityText.setText("");
      quantityText.setVisible(
        false
      );

      return;
    }

    background.setVisible(true);

    background.setFillStyle(
      0x20252d
    );

    if (
      this.selectedSlot ===
      index
    ) {
      background.setStrokeStyle(
        2,
        0xd6b35a,
        1
      );
    } else {
      background.setStrokeStyle(
        1,
        this.getRarityColorNumber(
          slot.item.rarity
        ),
        1
      );
    }

    const textureKey =
      this.getTextureKey(
        slot.item
      );

    if (
      icon &&
      this.scene.textures.exists(
        textureKey
      )
    ) {
      icon.setTexture(
        textureKey
      );

      const scale =
        Math.min(
          29 / icon.width,
          29 / icon.height
        );

      icon.setScale(scale);
      icon.setVisible(true);
    } else if (icon) {
      icon.setVisible(false);
    }

    quantityText.setText(
      slot.quantity > 1
        ? `x${slot.quantity}`
        : ""
    );

    quantityText.setVisible(
      slot.quantity > 1
    );
  }

  private getTextureKey(
    item: Item
  ): string {
    switch (item.id) {
      case "slime_gel":
        return "slime_gel";

      case "slime_core":
        return "slime_core";

      case "slime_essence":
        return "slime_essence";

      default:
        return "slime_gel";
    }
  }

  private getRarityName(
    rarity: ItemRarity
  ): string {
    switch (rarity) {
      case "common":
        return "COMUM";

      case "uncommon":
        return "INCOMUM";

      case "rare":
        return "RARO";

      case "epic":
        return "ÉPICO";

      case "legendary":
        return "LENDÁRIO";

      default:
        return "";
    }
  }

  private getRarityColor(
    rarity: ItemRarity
  ): string {
    switch (rarity) {
      case "common":
        return "#bfc3c8";

      case "uncommon":
        return "#55d66b";

      case "rare":
        return "#4da6ff";

      case "epic":
        return "#b56cff";

      case "legendary":
        return "#ffb52e";

      default:
        return "#ffffff";
    }
  }

  private getRarityColorNumber(
    rarity: ItemRarity
  ): number {
    switch (rarity) {
      case "common":
        return 0xbfc3c8;

      case "uncommon":
        return 0x55d66b;

      case "rare":
        return 0x4da6ff;

      case "epic":
        return 0xb56cff;

      case "legendary":
        return 0xffb52e;

      default:
        return 0x454b55;
    }
  }

  setLevel(
    level: number
  ): void {
    this.levelText.setText(
      `${level}\nNÍVEL`
    );
  }

  toggle(): void {
    if (this.inventoryOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.inventoryOpen = true;

    this.uiContainer.setDepth(
      10000
    );

    this.uiContainer.setVisible(
      true
    );

    this.scene.physics.world.pause();

    this.scene.events.emit(
      "inventory-open"
    );
  }

  close(): void {
    this.inventoryOpen = false;

    this.uiContainer.setVisible(
      false
    );

    this.scene.physics.world.resume();

    this.scene.events.emit(
      "inventory-close"
    );
  }

  isOpen(): boolean {
    return this.inventoryOpen;
  }

  update(): void {
    /*
     * A interface fica fixa na tela.
     * Não precisa acompanhar o jogador.
     */
  }

  getSlots(): InventorySlot[] {
    return this.slots;
  }

  getItemCount(
    itemId: string
  ): number {
    let total = 0;

    this.slots.forEach(
      (slot) => {
        if (
          slot.item &&
          slot.item.id ===
            itemId
        ) {
          total +=
            slot.quantity;
        }
      }
    );

    return total;
  }
}