import Phaser from "phaser";
import { Item } from "../items/Item";

interface InventorySlot {
  item: Item | null;
  quantity: number;
}

export class InventorySystem {
  private scene: Phaser.Scene;
  private inventoryOpen = false;

  private inventoryBackground!: Phaser.GameObjects.Rectangle;
  private inventoryTitle!: Phaser.GameObjects.Text;
  private inventoryCloseText!: Phaser.GameObjects.Text;

  private slots: Phaser.GameObjects.Rectangle[] = [];

  private itemIcons: (
    Phaser.GameObjects.Image | null
  )[] = [];

  private itemTexts: Phaser.GameObjects.Text[] = [];

  private descriptionBackground!: Phaser.GameObjects.Rectangle;
  private descriptionTitle!: Phaser.GameObjects.Text;
  private descriptionText!: Phaser.GameObjects.Text;
  private descriptionQuantity!: Phaser.GameObjects.Text;

  private inventoryKey: Phaser.Input.Keyboard.Key;

  private inventory: InventorySlot[] = [];
  private maxSlots = 24;
  private selectedSlot = -1;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    if (!scene.input.keyboard) {
      throw new Error("Teclado não disponível.");
    }

    this.inventoryKey =
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.I
      );

    for (let i = 0; i < this.maxSlots; i++) {
      this.inventory.push({
        item: null,
        quantity: 0,
      });

      this.itemIcons.push(null);
    }

    this.createInventory();
    this.setVisible(false);
  }

  private createInventory(): void {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    this.inventoryBackground =
      this.scene.add
        .rectangle(
          width / 2,
          height / 2,
          850,
          500,
          0x111318,
          0.98
        )
        .setScrollFactor(0)
        .setDepth(4000)
        .setStrokeStyle(3, 0x555b66);

    this.inventoryTitle =
      this.scene.add
        .text(
          width / 2,
          height / 2 - 215,
          "INVENTÁRIO",
          {
            fontSize: "30px",
            color: "#ffffff",
            fontStyle: "bold",
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(4005);

    this.inventoryCloseText =
      this.scene.add
        .text(
          width / 2,
          height / 2 + 215,
          "[I] Fechar",
          {
            fontSize: "16px",
            color: "#999999",
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(4005);

    const columns = 6;
    const rows = 4;
    const slotSize = 70;
    const spacing = 15;

    const totalWidth =
      columns * slotSize +
      (columns - 1) * spacing;

    const startX =
      width / 2 -
      totalWidth / 2 +
      slotSize / 2 -
      130;

    const startY =
      height / 2 - 125;

    for (let row = 0; row < rows; row++) {
      for (
        let column = 0;
        column < columns;
        column++
      ) {
        const index =
          row * columns + column;

        const x =
          startX +
          column *
            (slotSize + spacing);

        const y =
          startY +
          row *
            (slotSize + spacing);

        const slot =
          this.scene.add
            .rectangle(
              x,
              y,
              slotSize,
              slotSize,
              0x20242b
            )
            .setScrollFactor(0)
            .setDepth(4001)
            .setStrokeStyle(
              2,
              0x414750
            )
            .setInteractive();

        slot.on(
          "pointerover",
          () => {
            if (
              this.inventory[index].item
            ) {
              slot.setFillStyle(
                0x292e36
              );
            }
          }
        );

        slot.on(
          "pointerout",
          () => {
            if (
              this.inventory[index].item
            ) {
              slot.setFillStyle(
                0x20242b
              );
            }
          }
        );

        slot.on(
          "pointerdown",
          () => {
            this.selectSlot(index);
          }
        );

        this.slots.push(slot);

        const itemText =
          this.scene.add
            .text(
              x + 23,
              y + 22,
              "",
              {
                fontSize: "14px",
                color: "#ffffff",
                fontStyle: "bold",
                stroke: "#000000",
                strokeThickness: 3,
              }
            )
            .setOrigin(1, 1)
            .setScrollFactor(0)
            .setDepth(4004);

        this.itemTexts.push(itemText);
      }
    }

    this.descriptionBackground =
      this.scene.add
        .rectangle(
          width / 2 + 275,
          height / 2 + 20,
          240,
          300,
          0x181b20,
          1
        )
        .setScrollFactor(0)
        .setDepth(4001)
        .setStrokeStyle(
          2,
          0x414750
        );

    this.descriptionTitle =
      this.scene.add
        .text(
          width / 2 + 275,
          height / 2 - 105,
          "Selecione um item",
          {
            fontSize: "20px",
            color: "#ffffff",
            fontStyle: "bold",
            align: "center",
            wordWrap: {
              width: 200,
            },
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(4005);

    this.descriptionText =
      this.scene.add
        .text(
          width / 2 + 275,
          height / 2 - 40,
          "",
          {
            fontSize: "16px",
            color: "#bfc3c9",
            align: "center",
            wordWrap: {
              width: 200,
            },
          }
        )
        .setOrigin(0.5, 0)
        .setScrollFactor(0)
        .setDepth(4005);

    this.descriptionQuantity =
      this.scene.add
        .text(
          width / 2 + 275,
          height / 2 + 105,
          "",
          {
            fontSize: "16px",
            color: "#ffd700",
            fontStyle: "bold",
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(4005);
  }

  update(): void {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.inventoryKey
      )
    ) {
      this.toggle();
    }
  }

  addItem(
    item: Item,
    quantity: number = 1
  ): boolean {
    const existingSlot =
      this.inventory.find(
        (slot) =>
          slot.item?.id === item.id
      );

    if (existingSlot) {
      existingSlot.quantity += quantity;

      this.refreshInventory();

      console.log(
        `+${quantity} ${item.name}`
      );

      return true;
    }

    const emptySlot =
      this.inventory.find(
        (slot) => slot.item === null
      );

    if (!emptySlot) {
      console.log(
        "Inventário cheio!"
      );

      return false;
    }

    emptySlot.item = item;
    emptySlot.quantity = quantity;

    this.refreshInventory();

    console.log(
      `Adicionado: ${item.name} x${quantity}`
    );

    return true;
  }

  removeItem(
    itemId: string,
    quantity: number = 1
  ): boolean {
    const slot =
      this.inventory.find(
        (slot) =>
          slot.item?.id === itemId
      );

    if (
      !slot ||
      !slot.item
    ) {
      return false;
    }

    slot.quantity -= quantity;

    if (slot.quantity <= 0) {
      slot.item = null;
      slot.quantity = 0;
    }

    this.refreshInventory();

    return true;
  }

  private refreshInventory(): void {
    for (
      let i = 0;
      i < this.inventory.length;
      i++
    ) {
      const slot =
        this.inventory[i];

      if (
        this.itemIcons[i] !== null
      ) {
        this.itemIcons[i]!.destroy();
        this.itemIcons[i] = null;
      }

      if (slot.item) {
        this.createItemIcon(
          i,
          slot.item
        );

        this.itemTexts[i].setText(
          `x${slot.quantity}`
        );
      } else {
        this.itemTexts[i].setText("");
      }
    }

    this.clearSelection();

    if (!this.inventoryOpen) {
      this.setVisible(false);
    }
  }

  private createItemIcon(
    index: number,
    item: Item
  ): void {
    const slot =
      this.slots[index];

    let textureKey = "";

    if (
      item.id === "slime_gel"
    ) {
      textureKey = "slime_gel";
    }

    if (!textureKey) {
      return;
    }

    if (
      !this.scene.textures.exists(
        textureKey
      )
    ) {
      console.error(
        `Textura não encontrada: ${textureKey}`
      );

      return;
    }

    const icon =
      this.scene.add.image(
        slot.x,
        slot.y - 5,
        textureKey
      );

    /*
     * Mantém a proporção original
     * do slime_gel.png.
     */
    const maxWidth = 46;
    const maxHeight = 46;

    const scale = Math.min(
      maxWidth / icon.width,
      maxHeight / icon.height
    );

    icon.setScale(scale);

    icon
      .setScrollFactor(0)
      .setDepth(4003);

    icon.setVisible(
      this.inventoryOpen
    );

    this.itemIcons[index] =
      icon;
  }

  private selectSlot(
    index: number
  ): void {
    if (
      !this.inventoryOpen
    ) {
      return;
    }

    const slot =
      this.inventory[index];

    if (
      !slot ||
      !slot.item
    ) {
      this.clearSelection();
      return;
    }

    this.selectedSlot = index;

    for (
      let i = 0;
      i < this.slots.length;
      i++
    ) {
      this.slots[i].setStrokeStyle(
        2,
        i === index
          ? 0xffd700
          : 0x414750
      );
    }

    this.descriptionTitle.setText(
      slot.item.name
    );

    this.descriptionText.setText(
      slot.item.description
    );

    this.descriptionQuantity.setText(
      `Quantidade: ${slot.quantity}`
    );
  }

  private clearSelection(): void {
    this.selectedSlot = -1;

    for (
      const slot of this.slots
    ) {
      slot.setStrokeStyle(
        2,
        0x414750
      );
    }

    this.descriptionTitle.setText(
      "Selecione um item"
    );

    this.descriptionText.setText("");

    this.descriptionQuantity.setText(
      ""
    );
  }

  private toggle(): void {
    this.inventoryOpen =
      !this.inventoryOpen;

    this.setVisible(
      this.inventoryOpen
    );

    if (
      !this.inventoryOpen
    ) {
      this.clearSelection();
    }
  }

  private setVisible(
    visible: boolean
  ): void {
    this.inventoryBackground.setVisible(
      visible
    );

    this.inventoryTitle.setVisible(
      visible
    );

    this.inventoryCloseText.setVisible(
      visible
    );

    this.descriptionBackground.setVisible(
      visible
    );

    this.descriptionTitle.setVisible(
      visible
    );

    this.descriptionText.setVisible(
      visible
    );

    this.descriptionQuantity.setVisible(
      visible
    );

    for (
      const slot of this.slots
    ) {
      slot.setVisible(visible);
    }

    for (
      const text of this.itemTexts
    ) {
      text.setVisible(visible);
    }

    for (
      const icon of this.itemIcons
    ) {
      if (icon !== null) {
        icon.setVisible(visible);
      }
    }
  }

  isOpen(): boolean {
    return this.inventoryOpen;
  }
}