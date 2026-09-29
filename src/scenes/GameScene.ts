import Phaser from "phaser";
import { SCENE_KEYS } from "../utils/constants";
import { MapManager } from "../world/MapManager";
import { Player } from "../entities/Player";
import { NPC } from "../entities/NPC";
import { Enemy } from "../entities/Enemy";
import { InteractionSystem } from "../systems/InteractionSystem";
import { DialogueSystem } from "../systems/DialogueSystem";
import { ExperienceSystem } from "../systems/Experience";
import { InventorySystem } from "../systems/Inventory";
import { Item } from "../items/Item";
import { ItemDrop } from "../items/ItemDrop";

export class GameScene extends Phaser.Scene {
  private mapManager!: MapManager;
  private player!: Player;

  private npcs: NPC[] = [];
  private enemies: Enemy[] = [];
  private itemDrops: ItemDrop[] = [];

  private interactionSystem!: InteractionSystem;
  private dialogueSystem!: DialogueSystem;
  private experienceSystem!: ExperienceSystem;
  private inventorySystem!: InventorySystem;

  private levelText!: Phaser.GameObjects.Text;
  private experienceText!: Phaser.GameObjects.Text;
  private experienceBarBackground!: Phaser.GameObjects.Rectangle;
  private experienceBar!: Phaser.GameObjects.Rectangle;
  private levelUpText!: Phaser.GameObjects.Text;

  private attackCooldown = 350;
  private canAttack = true;
  private attackDamage = 25;
  private attackRange = 55;

  private enemyRespawnDelay = 3000;

  constructor() {
    super({
      key: SCENE_KEYS.GAME,
    });
  }

  create(): void {
    console.log(
      "Textura slime_gel existe:",
      this.textures.exists(
        "slime_gel"
      )
    );

    this.mapManager =
      new MapManager(this);

    this.mapManager.build();

    this.physics.world.setBounds(
      0,
      0,
      this.mapManager.widthInPixels,
      this.mapManager.heightInPixels
    );

    this.cameras.main.setBounds(
      0,
      0,
      this.mapManager.widthInPixels,
      this.mapManager.heightInPixels
    );

    this.player =
      new Player(
        this,
        this.mapManager.widthInPixels / 2,
        this.mapManager.heightInPixels / 2
      );

    this.physics.add.collider(
      this.player,
      this.mapManager.walls
    );

    this.cameras.main.startFollow(
      this.player,
      true
    );

    this.createHUD();

    this.experienceSystem =
      new ExperienceSystem(
        (
          experience: number,
          experienceToNextLevel: number,
          level: number
        ) => {
          this.updateExperienceHUD(
            experience,
            experienceToNextLevel,
            level
          );
        },

        (level: number) => {
          this.player.levelUp(
            level
          );

          this.showLevelUp(
            level
          );
        }
      );

    this.updateExperienceHUD(
      this.experienceSystem.getExperience(),
      this.experienceSystem.getExperienceToNextLevel(),
      this.experienceSystem.getLevel()
    );

    // NPC
    const npc =
      new NPC(
        this,
        160,
        160,
        "Aventureiro",
        [
          "Olá! Este é o começo da sua aventura.",
          "Existem criaturas perigosas na floresta.",
          "Tome cuidado e fique de olho nos seus equipamentos.",
        ]
      );

    this.npcs.push(npc);

    // Slime inicial
    this.spawnSlime(
      480,
      320
    );

    this.dialogueSystem =
      new DialogueSystem(this);

    this.interactionSystem =
      new InteractionSystem(
        this,
        this.player,
        this.dialogueSystem
      );

    this.inventorySystem =
      new InventorySystem(this);

    // Ataque com botão esquerdo
    this.input.on(
      "pointerdown",
      (
        pointer: Phaser.Input.Pointer
      ) => {
        if (
          !pointer.leftButtonDown()
        ) {
          return;
        }

        if (
          this.inventorySystem.isOpen()
        ) {
          return;
        }

        this.playerAttack(
          pointer
        );
      }
    );

    console.log(
      "GameScene criada com sucesso!"
    );
  }

  update(): void {
    this.player.update();

    for (
      const enemy of this.enemies
    ) {
      if (enemy.active) {
        enemy.update();
      }
    }

    this.dialogueSystem.update();

    this.interactionSystem.update(
      this.npcs
    );

    this.inventorySystem.update();
  }

  private spawnSlime(
    x: number,
    y: number
  ): void {
    const enemy =
      new Enemy(
        this,
        x,
        y,
        "Slime",
        100,
        50,
        (
          deadEnemy: Enemy
        ) => {
          // XP
          this.experienceSystem.addExperience(
            deadEnemy.experienceReward
          );

          // Drop
          this.createSlimeDrop(
            deadEnemy.x,
            deadEnemy.y
          );

          // Respawn
          this.scheduleEnemyRespawn(
            x,
            y
          );
        }
      );

    this.enemies.push(
      enemy
    );

    enemy.setTarget(
      this.player
    );

    console.log(
      "Slime apareceu!"
    );
  }

  private createSlimeDrop(
    x: number,
    y: number
  ): void {
    const slimeGel =
      new Item({
        id: "slime_gel",
        name: "Gel de Slime",
        type: "material",
        description:
          "Um material deixado por Slimes.",
      });

    const drop =
      new ItemDrop(
        this,
        x,
        y,
        slimeGel,
        this.player,
        (item: Item) => {
          const added =
            this.inventorySystem.addItem(
              item,
              1
            );

          if (added) {
            console.log(
              `Você coletou ${item.name}!`
            );
          }
        }
      );

    this.itemDrops.push(
      drop
    );

    console.log(
      "Slime deixou um Gel de Slime!"
    );
  }

  private scheduleEnemyRespawn(
    x: number,
    y: number
  ): void {
    console.log(
      `Novo Slime aparecerá em ${
        this.enemyRespawnDelay / 1000
      } segundos.`
    );

    this.time.delayedCall(
      this.enemyRespawnDelay,
      () => {
        if (
          !this.player ||
          this.player.isPlayerDead()
        ) {
          return;
        }

        this.spawnSlime(
          x,
          y
        );
      }
    );
  }

  private createHUD(): void {
    this.levelText =
      this.add
        .text(
          25,
          20,
          "Nível 1",
          {
            fontSize: "22px",
            color: "#ffffff",
            fontStyle: "bold",
          }
        )
        .setScrollFactor(0)
        .setDepth(2000);

    this.experienceText =
      this.add
        .text(
          25,
          48,
          "XP: 0 / 100",
          {
            fontSize: "16px",
            color: "#ffffff",
          }
        )
        .setScrollFactor(0)
        .setDepth(2000);

    this.experienceBarBackground =
      this.add
        .rectangle(
          25,
          75,
          220,
          12,
          0x222222
        )
        .setOrigin(0, 0.5)
        .setScrollFactor(0)
        .setDepth(1999);

    this.experienceBar =
      this.add
        .rectangle(
          25,
          75,
          0,
          12,
          0x3498db
        )
        .setOrigin(0, 0.5)
        .setScrollFactor(0)
        .setDepth(2000);

    this.levelUpText =
      this.add
        .text(
          this.scale.width / 2,
          this.scale.height / 2 - 100,
          "LEVEL UP!",
          {
            fontSize: "48px",
            color: "#ffd700",
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 6,
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(3000)
        .setAlpha(0);
  }

  private updateExperienceHUD(
    experience: number,
    experienceToNextLevel: number,
    level: number
  ): void {
    if (!this.levelText) {
      return;
    }

    this.levelText.setText(
      `Nível ${level}`
    );

    this.experienceText.setText(
      `XP: ${experience} / ${experienceToNextLevel}`
    );

    const percentage =
      Phaser.Math.Clamp(
        experience /
          experienceToNextLevel,
        0,
        1
      );

    this.experienceBar.width =
      220 * percentage;
  }

  private showLevelUp(
    level: number
  ): void {
    this.levelUpText.setText(
      `LEVEL UP!\nNível ${level}`
    );

    this.levelUpText.setAlpha(0);
    this.levelUpText.setScale(
      0.5
    );

    this.tweens.add({
      targets:
        this.levelUpText,

      alpha: 1,
      scale: 1,

      duration: 300,

      ease: "Back.easeOut",

      hold: 900,

      yoyo: true,

      onComplete: () => {
        this.levelUpText.setAlpha(
          0
        );
      },
    });
  }

  private playerAttack(
    pointer: Phaser.Input.Pointer
  ): void {
    if (!this.canAttack) {
      return;
    }

    if (
      this.player.isPlayerDead()
    ) {
      return;
    }

    this.canAttack = false;

    this.time.delayedCall(
      this.attackCooldown,
      () => {
        this.canAttack = true;
      }
    );

    const worldPoint =
      this.cameras.main.getWorldPoint(
        pointer.x,
        pointer.y
      );

    const direction =
      new Phaser.Math.Vector2(
        worldPoint.x -
          this.player.x,
        worldPoint.y -
          this.player.y
      );

    if (
      direction.length() === 0
    ) {
      direction.set(1, 0);
    } else {
      direction.normalize();
    }

    const attackDistance = 35;

    const attackX =
      this.player.x +
      direction.x *
        attackDistance;

    const attackY =
      this.player.y +
      direction.y *
        attackDistance;

    this.createAttackEffect(
      attackX,
      attackY
    );

    this.checkAttackHit(
      attackX,
      attackY
    );
  }

  private createAttackEffect(
    x: number,
    y: number
  ): void {
    const attackEffect =
      this.add.circle(
        x,
        y,
        12,
        0xffffff
      );

    attackEffect.setDepth(
      1000
    );

    this.tweens.add({
      targets:
        attackEffect,

      scale: 2.5,
      alpha: 0,

      duration: 180,

      ease: "Quad.easeOut",

      onComplete: () => {
        attackEffect.destroy();
      },
    });

    const flash =
      this.add.circle(
        x,
        y,
        5,
        0xffffff
      );

    flash.setDepth(
      1001
    );

    this.tweens.add({
      targets: flash,

      scale: 3,
      alpha: 0,

      duration: 80,

      onComplete: () => {
        flash.destroy();
      },
    });
  }

  private checkAttackHit(
    attackX: number,
    attackY: number
  ): void {
    for (
      const enemy of this.enemies
    ) {
      if (!enemy.active) {
        continue;
      }

      const distance =
        Phaser.Math.Distance.Between(
          attackX,
          attackY,
          enemy.x,
          enemy.y
        );

      if (
        distance <=
        this.attackRange
      ) {
        this.createHitEffect(
          enemy.x,
          enemy.y
        );

        this.hitStop();

        enemy.takeDamage(
          this.attackDamage
        );

        console.log(
          "ATAQUE ACERTOU O INIMIGO!"
        );

        break;
      }
    }
  }

  private createHitEffect(
    x: number,
    y: number
  ): void {
    const impact =
      this.add.circle(
        x,
        y,
        6,
        0xffffff
      );

    impact.setDepth(
      1100
    );

    this.tweens.add({
      targets: impact,

      scale: 3,
      alpha: 0,

      duration: 120,

      ease: "Back.easeOut",

      onComplete: () => {
        impact.destroy();
      },
    });

    for (
      let i = 0;
      i < 6;
      i++
    ) {
      const angle =
        Phaser.Math.FloatBetween(
          0,
          Math.PI * 2
        );

      const distance =
        Phaser.Math.Between(
          12,
          25
        );

      const particle =
        this.add.rectangle(
          x,
          y,
          4,
          4,
          0xffffff
        );

      particle.setDepth(
        1101
      );

      this.tweens.add({
        targets: particle,

        x:
          x +
          Math.cos(angle) *
            distance,

        y:
          y +
          Math.sin(angle) *
            distance,

        alpha: 0,

        duration: 180,

        onComplete: () => {
          particle.destroy();
        },
      });
    }
  }

  private hitStop(): void {
    const previousTimeScale =
      this.time.timeScale;

    this.time.timeScale =
      0.05;

    this.time.delayedCall(
      35,
      () => {
        this.time.timeScale =
          previousTimeScale;
      }
    );
  }
}