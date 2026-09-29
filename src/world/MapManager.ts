import Phaser from "phaser";
import { TILE_SIZE } from "../utils/constants";

const MAP_WIDTH = 60;
const MAP_HEIGHT = 34;

export class MapManager {
  private scene: Phaser.Scene;

  public walls: Phaser.Physics.Arcade.StaticGroup;

  public widthInPixels: number;
  public heightInPixels: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.walls =
      scene.physics.add.staticGroup();

    this.widthInPixels =
      MAP_WIDTH * TILE_SIZE;

    this.heightInPixels =
      MAP_HEIGHT * TILE_SIZE;
  }

  build(): void {
    this.createGround();
    this.createOuterWalls();
    this.createObstacles();
    this.createDecoration();
  }

  // ========================================
  // CHÃO
  // ========================================

  private createGround(): void {
    for (
      let row = 0;
      row < MAP_HEIGHT;
      row++
    ) {
      for (
        let col = 0;
        col < MAP_WIDTH;
        col++
      ) {
        const x =
          col * TILE_SIZE +
          TILE_SIZE / 2;

        const y =
          row * TILE_SIZE +
          TILE_SIZE / 2;

        // Pequena variação no verde
        const random = Phaser.Math.Between(
          0,
          3
        );

        const colors = [
          0x2d5a2d,
          0x315f31,
          0x2f5c2f,
          0x345f34,
        ];

        this.scene.add
          .rectangle(
            x,
            y,
            TILE_SIZE,
            TILE_SIZE,
            colors[random]
          )
          .setStrokeStyle(
            1,
            0x234923
          );
      }
    }
  }

  // ========================================
  // PAREDES EXTERNAS
  // ========================================

  private createOuterWalls(): void {
    for (
      let col = 0;
      col < MAP_WIDTH;
      col++
    ) {
      this.createWall(col, 0);

      this.createWall(
        col,
        MAP_HEIGHT - 1
      );
    }

    for (
      let row = 0;
      row < MAP_HEIGHT;
      row++
    ) {
      this.createWall(0, row);

      this.createWall(
        MAP_WIDTH - 1,
        row
      );
    }
  }

  // ========================================
  // OBSTÁCULOS
  // ========================================

  private createObstacles(): void {
    // Parede superior esquerda
    this.createWallRectangle(
      8,
      5,
      6,
      2
    );

    // Parede superior direita
    this.createWallRectangle(
      40,
      6,
      7,
      2
    );

    // Parede central esquerda
    this.createWallRectangle(
      12,
      14,
      3,
      6
    );

    // Parede central direita
    this.createWallRectangle(
      43,
      14,
      5,
      4
    );

    // Parede central
    this.createWallRectangle(
      27,
      10,
      6,
      2
    );

    // Parede inferior esquerda
    this.createWallRectangle(
      7,
      25,
      8,
      3
    );

    // Parede inferior direita
    this.createWallRectangle(
      42,
      25,
      7,
      3
    );

    // Parede inferior central
    this.createWallRectangle(
      27,
      28,
      5,
      2
    );
  }

  // ========================================
  // DECORAÇÃO
  // ========================================

  private createDecoration(): void {
    // Grupo de árvores superior esquerdo
    this.createTree(5, 4);
    this.createTree(7, 3);
    this.createTree(10, 3);
    this.createTree(14, 4);

    // Grupo de árvores superior direito
    this.createTree(49, 4);
    this.createTree(52, 3);
    this.createTree(55, 5);

    // Árvores laterais
    this.createTree(4, 12);
    this.createTree(5, 15);

    this.createTree(55, 12);
    this.createTree(53, 15);

    // Grupo inferior esquerdo
    this.createTree(4, 22);
    this.createTree(5, 25);
    this.createTree(17, 27);

    // Grupo inferior direito
    this.createTree(54, 22);
    this.createTree(52, 25);
    this.createTree(56, 27);

    // Árvores centrais
    this.createTree(21, 7);
    this.createTree(24, 7);

    this.createTree(36, 21);
    this.createTree(39, 23);

    // Pedras
    this.createRock(19, 12);
    this.createRock(23, 18);
    this.createRock(34, 7);
    this.createRock(38, 16);
    this.createRock(31, 25);
    this.createRock(48, 21);

    // Arbustos
    this.createBush(18, 9);
    this.createBush(25, 23);
    this.createBush(37, 12);
    this.createBush(45, 23);

    // Água
    this.createWaterArea(
      30,
      14,
      7,
      4
    );
  }

  // ========================================
  // ÁRVORE
  // ========================================

  private createTree(
    col: number,
    row: number
  ): void {
    const x =
      col * TILE_SIZE +
      TILE_SIZE / 2;

    const y =
      row * TILE_SIZE +
      TILE_SIZE / 2;

    // Sombra
    this.scene.add.ellipse(
      x,
      y + 10,
      27,
      10,
      0x193719,
      0.5
    );

    // Tronco
    this.scene.add.rectangle(
      x,
      y + 5,
      8,
      18,
      0x704214
    );

    // Copa
    this.scene.add.circle(
      x,
      y - 6,
      14,
      0x1f6b32
    );

    this.scene.add.circle(
      x - 9,
      y - 3,
      9,
      0x267a38
    );

    this.scene.add.circle(
      x + 9,
      y - 3,
      9,
      0x246f34
    );

    // Brilho da copa
    this.scene.add.circle(
      x - 4,
      y - 10,
      4,
      0x3b8f47
    );

    // Colisão
    this.createDecorationCollision(
      x,
      y + 5,
      18,
      18
    );
  }

  // ========================================
  // PEDRA
  // ========================================

  private createRock(
    col: number,
    row: number
  ): void {
    const x =
      col * TILE_SIZE +
      TILE_SIZE / 2;

    const y =
      row * TILE_SIZE +
      TILE_SIZE / 2;

    this.scene.add.ellipse(
      x,
      y + 8,
      24,
      9,
      0x1b351b,
      0.5
    );

    this.scene.add
      .ellipse(
        x,
        y,
        20,
        15,
        0x777777
      )
      .setRotation(
        Phaser.Math.FloatBetween(
          -0.2,
          0.2
        )
      );

    this.scene.add.ellipse(
      x - 5,
      y - 3,
      7,
      4,
      0x999999
    );

    this.createDecorationCollision(
      x,
      y,
      18,
      14
    );
  }

  // ========================================
  // ARBUSTO
  // ========================================

  private createBush(
    col: number,
    row: number
  ): void {
    const x =
      col * TILE_SIZE +
      TILE_SIZE / 2;

    const y =
      row * TILE_SIZE +
      TILE_SIZE / 2;

    this.scene.add.circle(
      x - 7,
      y,
      7,
      0x287a35
    );

    this.scene.add.circle(
      x + 7,
      y,
      7,
      0x2b853b
    );

    this.scene.add.circle(
      x,
      y - 5,
      8,
      0x329442
    );
  }

  // ========================================
  // ÁGUA
  // ========================================

  private createWaterArea(
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
            0x247ba0
          )
          .setStrokeStyle(
            1,
            0x1b5873
          );

        // Pequeno reflexo
        if (
          (row + col) % 2 ===
          0
        ) {
          this.scene.add.rectangle(
            x,
            y - 5,
            10,
            2,
            0x4fa9c4,
            0.7
          );
        }

        // Colisão com água
        this.createDecorationCollision(
          x,
          y,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }
  }

  // ========================================
  // COLISÃO DE DECORAÇÃO
  // ========================================

  private createDecorationCollision(
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const collision =
      this.scene.add.rectangle(
        x,
        y,
        width,
        height,
        0x000000,
        0
      );

    this.scene.physics.add.existing(
      collision,
      true
    );

    this.walls.add(collision);
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
        0x4a4a4a
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
}