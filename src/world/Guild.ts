import Phaser from "phaser";
import { TILE_SIZE } from "../utils/constants";

export class Guild {
  private scene: Phaser.Scene;

  public walls: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.walls =
      scene.physics.add.staticGroup();
  }

  build(): void {
    // ========================================
    // ESTRUTURA DA GUILDA
    // ========================================

    const startCol = 16;
    const startRow = 3;

    const width = 11;
    const height = 7;

    // ========================================
    // PISO
    // ========================================

    this.createFloor(
      startCol,
      startRow,
      width,
      height
    );

    // ========================================
    // PAREDES
    // ========================================

    this.createWallRectangle(
      startCol,
      startRow,
      width,
      1
    );

    this.createWallRectangle(
      startCol,
      startRow + height - 1,
      width,
      1
    );

    this.createWallRectangle(
      startCol,
      startRow,
      1,
      height
    );

    this.createWallRectangle(
      startCol + width - 1,
      startRow,
      1,
      height
    );

    // ========================================
    // PORTA
    // ========================================

    this.createDoor(
      startCol + 5,
      startRow + height - 1
    );

    // ========================================
    // BALCÃO
    // ========================================

    this.createCounter(
      startCol + 3,
      startRow + 2,
      5
    );

    // ========================================
    // MESA
    // ========================================

    this.createTable(
      startCol + 2,
      startRow + 4
    );

    this.createTable(
      startCol + 8,
      startRow + 4
    );

    // ========================================
    // MURAL
    // ========================================

    this.createQuestBoard(
      startCol + 1,
      startRow + 1
    );

    // ========================================
    // PLACA
    // ========================================

    this.createGuildSign(
      startCol + 5,
      startRow - 1
    );
  }

  // ========================================
  // PISO
  // ========================================

  private createFloor(
    startCol: number,
    startRow: number,
    width: number,
    height: number
  ): void {
    for (
      let row = startRow;
      row < startRow + height;
      row++
    ) {
      for (
        let col = startCol;
        col < startCol + width;
        col++
      ) {
        const x =
          col * TILE_SIZE +
          TILE_SIZE / 2;

        const y =
          row * TILE_SIZE +
          TILE_SIZE / 2;

        this.scene.add
          .rectangle(
            x,
            y,
            TILE_SIZE,
            TILE_SIZE,
            0x76533a
          )
          .setStrokeStyle(
            1,
            0x5a3f2c
          );
      }
    }
  }

  // ========================================
  // PAREDE
  // ========================================

  private createWall(
    col: number,
    row: number
  ): void {
    const x =
      col * TILE_SIZE +
      TILE_SIZE / 2;

    const y =
      row * TILE_SIZE +
      TILE_SIZE / 2;

    const wall =
      this.scene.add.rectangle(
        x,
        y,
        TILE_SIZE,
        TILE_SIZE,
        0x4b3527
      );

    wall.setStrokeStyle(
      1,
      0x2d2119
    );

    this.scene.physics.add.existing(
      wall,
      true
    );

    this.walls.add(wall);
  }

  // ========================================
  // PAREDE RETANGULAR
  // ========================================

  private createWallRectangle(
    startCol: number,
    startRow: number,
    width: number,
    height: number
  ): void {
    for (
      let row = startRow;
      row < startRow + height;
      row++
    ) {
      for (
        let col = startCol;
        col < startCol + width;
        col++
      ) {
        this.createWall(
          col,
          row
        );
      }
    }
  }

  // ========================================
  // PORTA
  // ========================================

  private createDoor(
    col: number,
    row: number
  ): void {
    const x =
      col * TILE_SIZE +
      TILE_SIZE / 2;

    const y =
      row * TILE_SIZE +
      TILE_SIZE / 2;

    this.scene.add
      .rectangle(
        x,
        y,
        TILE_SIZE,
        TILE_SIZE,
        0x8b5a2b
      )
      .setStrokeStyle(
        2,
        0x5c3a1e
      );

    this.scene.add
      .rectangle(
        x + 7,
        y,
        4,
        4,
        0xd4af37
      );
  }

  // ========================================
  // BALCÃO
  // ========================================

  private createCounter(
    col: number,
    row: number,
    width: number
  ): void {
    const x =
      col * TILE_SIZE +
      (width * TILE_SIZE) / 2;

    const y =
      row * TILE_SIZE +
      TILE_SIZE / 2;

    this.scene.add
      .rectangle(
        x,
        y,
        width * TILE_SIZE - 8,
        24,
        0x4a2f1c
      )
      .setStrokeStyle(
        2,
        0x2d1c11
      );
  }

  // ========================================
  // MESA
  // ========================================

  private createTable(
    col: number,
    row: number
  ): void {
    const x =
      col * TILE_SIZE +
      TILE_SIZE / 2;

    const y =
      row * TILE_SIZE +
      TILE_SIZE / 2;

    this.scene.add
      .rectangle(
        x,
        y,
        42,
        26,
        0x573a24
      )
      .setStrokeStyle(
        2,
        0x352315
      );

    this.scene.add.circle(
      x - 20,
      y,
      6,
      0x39271a
    );

    this.scene.add.circle(
      x + 20,
      y,
      6,
      0x39271a
    );
  }

  // ========================================
  // MURAL DE MISSÕES
  // ========================================

  private createQuestBoard(
    col: number,
    row: number
  ): void {
    const x =
      col * TILE_SIZE +
      TILE_SIZE / 2;

    const y =
      row * TILE_SIZE +
      TILE_SIZE / 2;

    this.scene.add
      .rectangle(
        x,
        y,
        42,
        34,
        0x5b3924
      )
      .setStrokeStyle(
        2,
        0x302016
      );

    this.scene.add.rectangle(
      x - 9,
      y - 3,
      10,
      14,
      0xe8d7a8
    );

    this.scene.add.rectangle(
      x + 7,
      y + 2,
      10,
      12,
      0xd8c18f
    );
  }

  // ========================================
  // PLACA DA GUILDA
  // ========================================

  private createGuildSign(
    col: number,
    row: number
  ): void {
    const x =
      col * TILE_SIZE +
      TILE_SIZE / 2;

    const y =
      row * TILE_SIZE +
      TILE_SIZE / 2;

    this.scene.add
      .text(
        x,
        y,
        "GUILDA",
        {
          fontSize: "16px",
          color: "#ffd700",
          backgroundColor: "#302016",
          padding: {
            x: 8,
            y: 4,
          },
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(10);
  }
}