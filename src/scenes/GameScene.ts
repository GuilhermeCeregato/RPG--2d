import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { NPC } from "../entities/NPC";
import { Weapon } from "../items/Weapon";
import { ItemDrop } from "../items/ItemDrop";
import { ExperienceSystem } from "../systems/Experience";
import { DialogueSystem } from "../systems/DialogueSystem";
import { InteractionSystem } from "../systems/InteractionSystem";
import { InventorySystem } from "../systems/Inventory";
import type { Item } from "../items/Item";
import {
  createClassStarterEquipment,
} from "../items/ClassEquipment";
import {
  CHARACTER_CLASSES,
  CharacterClassId,
} from "../entities/CharacterClass";
import { MapManager } from "../world/MapManager";
import { SCENE_KEYS } from "../utils/constants";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private mapManager!: MapManager;

  private enemies: Enemy[] = [];
  private npcs: NPC[] = [];

  private experienceSystem!: ExperienceSystem;
  private dialogueSystem!: DialogueSystem;
  private interactionSystem!: InteractionSystem;
  private inventorySystem!: InventorySystem;

  private combatText!: Phaser.GameObjects.Text;
  private combatTimer = 0;

  private healthBar!: Phaser.GameObjects.Rectangle;
  private healthBarBackground!: Phaser.GameObjects.Rectangle;

  private staminaBar!: Phaser.GameObjects.Rectangle;
  private staminaBarBackground!: Phaser.GameObjects.Rectangle;

  private levelText!: Phaser.GameObjects.Text;
  private xpText!: Phaser.GameObjects.Text;

  private sword!: Weapon;

  // Nome escolhido durante o registro
  private playerName = "";

  constructor() {
    super(
      SCENE_KEYS.GAME
    );
  }

  create(): void {
    this.mapManager =
      new MapManager(this);

    this.mapManager.build();

    this.physics.world.setBounds(
      0,
      0,
      this.mapManager.widthInPixels,
      this.mapManager.heightInPixels
    );

    // ========================================
    // PLAYER
    // ========================================

    this.player =
      new Player(
        this,
        720,
        400
      );

    this.player.setCollideWorldBounds(
      true
    );

    // ========================================
    // ARMA INICIAL
    // ========================================

    this.sword =
      new Weapon({
        id: "iron_sword",
        name: "Espada de Ferro",
        type: "weapon",
        description:
          "Uma espada simples de ferro.",
        attack: 15,
        rarity: "common",
      });

    this.player.equipWeapon(
      this.sword
    );

    // ========================================
    // COLISÃO PLAYER / MAPA
    // ========================================

    this.physics.add.collider(
      this.player,
      this.mapManager.walls
    );

    // ========================================
    // CÂMERA
    // ========================================

    this.cameras.main.startFollow(
      this.player,
      true,
      0.08,
      0.08
    );

    this.cameras.main.setBounds(
      0,
      0,
      this.mapManager.widthInPixels,
      this.mapManager.heightInPixels
    );

    // ========================================
    // EXPERIÊNCIA
    // ========================================

    this.experienceSystem =
      new ExperienceSystem(
        undefined,
        (level) => {
          this.player.levelUp(
            level
          );

          this.showLevelUpMessage(
            level
          );
        }
      );

    // ========================================
    // HUD
    // ========================================

    this.createHUD();

    // ========================================
    // DIÁLOGO
    // ========================================

    this.dialogueSystem =
      new DialogueSystem(this);

    // ========================================
    // NPC AVENTUREIRO
    // ========================================

    const npc =
      new NPC(
        this,
        1152,
        592,
        "Aventureiro",
        [
          {
            text:
              "Olá! Este é o começo da sua aventura.",
            nextNode: "node_1",
          },

          {
            text:
              "Existem criaturas perigosas na floresta.",
            nextNode: "node_2",
          },

          {
            text:
              "Tome cuidado e fique de olho nos seus equipamentos.",
          },
        ]
      );

    this.npcs.push(
      npc
    );

    // ========================================
    // NPC DA GUILDA
    // ========================================

    const guildNPC =
      new NPC(
        this,
        720,
        208,
        "Mestre da Guilda",
        [
          {
            text:
              "Bem-vindo à Guilda dos Aventureiros. Antes de começar sua jornada, você precisa se registrar.",
            nextNode: "node_1",
          },

          {
            text:
              "Preencha seu registro e escolha a classe que melhor combina com você.",
            action: () => {
              const availableClasses =
                CHARACTER_CLASSES.filter(
                  (characterClass) =>
                    !characterClass.secret
                );

              this.dialogueSystem.startRegistration(
                availableClasses.map(
                  (characterClass) => ({
                    id:
                      characterClass.id,

                    name:
                      characterClass.name,

                    description:
                      characterClass.description,

                    // ========================================
                    // ATRIBUTOS
                    // ========================================

                    strength:
                      characterClass.strength,

                    vitality:
                      characterClass.vitality,

                    defense:
                      characterClass.defense,

                    agility:
                      characterClass.agility,

                    luck:
                      characterClass.luck,

                    intelligence:
                      characterClass.intelligence,

                    // ========================================
                    // PASSIVAS
                    // ========================================

                    passives:
                      characterClass.passives,

                    // ========================================
                    // HABILIDADES
                    // ========================================

                    abilities:
                      characterClass.abilities,
                  })
                ),

                (registrationData) => {
                  this.completeRegistration(
                    registrationData.name,
                    registrationData.classId
                  );
                }
              );
            },
          },

          // ========================================
          // CATÁLOGO DE CLASSES E SUBCLASSES
          // ========================================

          {
            text:
              "Classes e Subclasses",
            action: () => {
              this.dialogueSystem.startClassCatalog();
            },
          },
        ]
      );

    this.npcs.push(
      guildNPC
    );

    // ========================================
    // SISTEMA DE INTERAÇÃO
    // ========================================

    this.interactionSystem =
      new InteractionSystem(
        this,
        this.player,
        this.dialogueSystem
      );

    // ========================================
    // INVENTÁRIO
    // ========================================

    this.inventorySystem =
      new InventorySystem(
        this,
        this.player
      );

    // ========================================
    // SLIME
    // ========================================

    this.spawnSlime(
      1776,
      592
    );

    // ========================================
    // ATAQUE
    // ========================================

    this.input.on(
      "pointerdown",
      () => {
        if (
          this.inventorySystem.isOpen() ||
          this.dialogueSystem.isActive()
        ) {
          return;
        }

        this.handlePlayerAttack();
      }
    );
  }

  update(
    time: number,
    delta: number
  ): void {
    if (!this.player) {
      return;
    }

    // ========================================
    // PLAYER
    // ========================================

    this.player.update();

    // ========================================
    // INIMIGOS
    // ========================================

    for (
      const enemy of this.enemies
    ) {
      if (
        enemy.active &&
        enemy.visible
      ) {
        enemy.update();
      }
    }

    // ========================================
    // DIÁLOGO
    // ========================================

    this.dialogueSystem.update();

    // ========================================
    // INTERAÇÃO
    // ========================================

    this.interactionSystem.update(
      this.npcs
    );

    // ========================================
    // INVENTÁRIO
    // ========================================

    const dialogueActive =
      this.dialogueSystem.isActive();

    this.inventorySystem.setInputBlocked(
      dialogueActive
    );

    if (!dialogueActive) {
      this.inventorySystem.update();
    }

    // ========================================
    // COMBATE
    // ========================================

    if (
      this.player.isInCombat()
    ) {
      this.combatTimer =
        this.player.getCombatTimeRemaining();

      this.combatText.setText(
        `EM COMBATE\n${Math.ceil(
          this.combatTimer /
            1000
        )}s`
      );

      this.combatText.setVisible(
        true
      );
    } else {
      this.combatText.setVisible(
        false
      );
    }

    // ========================================
    // HUD
    // ========================================

    this.updateHUD();

    // ========================================
    // RESPAWN
    // ========================================

    this.checkEnemyRespawn(
      time
    );
  }

  // ========================================
  // REGISTRO DO AVENTUREIRO
  // ========================================

  private completeRegistration(
    name: string,
    classId: string
  ): void {
    const validClass =
      CHARACTER_CLASSES.find(
        (characterClass) =>
          characterClass.id ===
            classId &&
          !characterClass.secret
      );

    if (!validClass) {
      return;
    }

    const success =
      this.player.setClass(
        validClass.id as CharacterClassId
      );

    if (!success) {
      return;
    }

    this.playerName =
      name;

    this.inventorySystem.setClass(
      validClass.name
    );

    // ========================================
    // EQUIPAMENTO INICIAL DA CLASSE
    // ========================================

    const starterEquipment =
      createClassStarterEquipment(
        validClass.id
      );

    if (starterEquipment) {
      this.inventorySystem.addItem(
        starterEquipment
      );

      console.log(
        `Equipamento inicial recebido: ${starterEquipment.name}`
      );
    }

    // ========================================
    // INFORMAÇÕES DO REGISTRO
    // ========================================

    console.log(
      `Aventureiro registrado: ${this.playerName}`
    );

    console.log(
      `Classe escolhida: ${validClass.name}`
    );

    console.log(
      `Força: ${validClass.strength}`
    );

    console.log(
      `Vitalidade: ${validClass.vitality}`
    );

    console.log(
      `Defesa: ${validClass.defense}`
    );

    console.log(
      `Agilidade: ${validClass.agility}`
    );

    console.log(
      `Sorte: ${validClass.luck}`
    );

    console.log(
      `Inteligência: ${validClass.intelligence}`
    );

    console.log(
      "Passivas:",
      validClass.passives
    );

    console.log(
      "Habilidades:",
      validClass.abilities
    );
  }

  // ========================================
  // CRIAR SLIME
  // ========================================

  private spawnSlime(
    x: number,
    y: number
  ): void {
    const slime =
      new Enemy(
        this,
        x,
        y
      );

    slime.setCollideWorldBounds(
      true
    );

    slime.setTarget(
      this.player
    );

    this.physics.add.collider(
      slime,
      this.mapManager.walls
    );

    this.physics.add.collider(
      slime,
      this.player
    );

    this.enemies.push(
      slime
    );

    slime.onDefeated = () => {
      this.handleEnemyDefeated(
        slime
      );
    };
  }

  // ========================================
  // INIMIGO DERROTADO
  // ========================================

  private handleEnemyDefeated(
    enemy: Enemy
  ): void {
    const xp =
      enemy.experienceReward;

    this.experienceSystem.addExperience(
      xp
    );

    this.createItemDrop(
      enemy.x,
      enemy.y
    );

    enemy.setActive(
      false
    );

    enemy.setVisible(
      false
    );

    const body =
      enemy.body as
        | Phaser.Physics.Arcade.Body
        | null;

    if (body) {
      body.enable =
        false;
    }

    enemy.respawnAt =
      this.time.now +
      5000;
  }

  // ========================================
  // DROP
  // ========================================

  private createItemDrop(
    x: number,
    y: number
  ): void {
    const random =
      Math.random();

    let textureKey: string;

    let itemName: string;

    let rarity:
      | "common"
      | "uncommon"
      | "rare"
      | "epic"
      | "legendary";

    if (
      random < 0.75
    ) {
      textureKey =
        "slime_gel";

      itemName =
        "Gel de Slime";

      rarity =
        "common";
    } else if (
      random < 0.95
    ) {
      textureKey =
        "slime_core";

      itemName =
        "Núcleo de Slime";

      rarity =
        "rare";
    } else {
      textureKey =
        "slime_essence";

      itemName =
        "Essência de Slime";

      rarity =
        "legendary";
    }

    const quantity =
      Phaser.Math.Between(
        1,
        3
      );

    const item = {
      id: textureKey,
      name: itemName,
      type: "material",
      description:
        "Material obtido de um slime.",
      rarity,
    } as Item;

    new ItemDrop(
      this,
      x,
      y,
      item,
      this.player,
      (collectedItem: Item) => {
        this.inventorySystem.addItem(
          collectedItem,
          quantity
        );
      }
    );
  }

  // ========================================
  // ATAQUE DO PLAYER
  // ========================================

  private handlePlayerAttack(): void {
    if (
      this.player.isPlayerDead()
    ) {
      return;
    }

    const attackRange =
      60;

    for (
      const enemy of this.enemies
    ) {
      if (
        !enemy.active ||
        !enemy.visible
      ) {
        continue;
      }

      const distance =
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y
        );

      if (
        distance <=
        attackRange
      ) {
        enemy.takeDamage(
          this.player.getAttack()
        );

        this.player.enterCombat();
      }
    }
  }

  // ========================================
  // RESPAWN
  // ========================================

  private checkEnemyRespawn(
    time: number
  ): void {
    for (
      const enemy of this.enemies
    ) {
      if (
        enemy.respawnAt !==
          undefined &&
        time >=
          enemy.respawnAt
      ) {
        enemy.resetEnemy();

        enemy.setPosition(
          1776,
          592
        );

        enemy.setTarget(
          this.player
        );
      }
    }
  }

  // ========================================
  // HUD
  // ========================================

  private createHUD(): void {
    this.healthBarBackground =
      this.add.rectangle(
        20,
        20,
        220,
        18,
        0x222222
      );

    this.healthBar =
      this.add.rectangle(
        20,
        20,
        220,
        18,
        0xb52b2b
      );

    this.healthBarBackground
      .setOrigin(
        0,
        0
      )
      .setScrollFactor(
        0
      )
      .setDepth(
        1000
      );

    this.healthBar
      .setOrigin(
        0,
        0
      )
      .setScrollFactor(
        0
      )
      .setDepth(
        1001
      );

    this.staminaBarBackground =
      this.add.rectangle(
        20,
        45,
        220,
        12,
        0x222222
      );

    this.staminaBar =
      this.add.rectangle(
        20,
        45,
        220,
        12,
        0x2b8fca
      );

    this.staminaBarBackground
      .setOrigin(
        0,
        0
      )
      .setScrollFactor(
        0
      )
      .setDepth(
        1000
      );

    this.staminaBar
      .setOrigin(
        0,
        0
      )
      .setScrollFactor(
        0
      )
      .setDepth(
        1001
      );

    this.levelText =
      this.add.text(
        20,
        65,
        "Nível 1",
        {
          fontSize:
            "16px",
          color:
            "#ffffff",
        }
      );

    this.levelText
      .setScrollFactor(
        0
      )
      .setDepth(
        1000
      );

    this.xpText =
      this.add.text(
        20,
        88,
        "XP: 0 / 100",
        {
          fontSize:
            "13px",
          color:
            "#ffffff",
        }
      );

    this.xpText
      .setScrollFactor(
        0
      )
      .setDepth(
        1000
      );

    this.combatText =
      this.add.text(
        640,
        30,
        "",
        {
          fontSize:
            "16px",
          color:
            "#ff5555",
          align:
            "center",
          backgroundColor:
            "#000000",
          padding: {
            x: 10,
            y: 6,
          },
        }
      );

    this.combatText
      .setOrigin(
        0.5,
        0
      )
      .setScrollFactor(
        0
      )
      .setDepth(
        1000
      )
      .setVisible(
        false
      );
  }

  private updateHUD(): void {
    const health =
      this.player.health;

    const maxHealth =
      this.player.maxHealth;

    const healthPercent =
      Phaser.Math.Clamp(
        health /
          maxHealth,
        0,
        1
      );

    this.healthBar.width =
      220 *
      healthPercent;

    const stamina =
      this.player.stamina;

    const maxStamina =
      this.player.maxStamina;

    const staminaPercent =
      Phaser.Math.Clamp(
        stamina /
          maxStamina,
        0,
        1
      );

    this.staminaBar.width =
      220 *
      staminaPercent;

    const level =
      this.experienceSystem.getLevel();

    const currentXP =
      this.experienceSystem.getExperience();

    const requiredXP =
      this.experienceSystem.getExperienceToNextLevel();

    this.levelText.setText(
      `Nível ${level}`
    );

    this.xpText.setText(
      `XP: ${currentXP} / ${requiredXP}`
    );
  }

  private showLevelUpMessage(
    level: number
  ): void {
    const text =
      this.add.text(
        this.scale.width /
          2,
        this.scale.height /
            2 -
          80,
        `LEVEL UP!\nNível ${level}`,
        {
          fontSize:
            "32px",
          color:
            "#ffd700",
          align:
            "center",
          stroke:
            "#000000",
          strokeThickness:
            5,
        }
      );

    text
      .setOrigin(
        0.5
      )
      .setScrollFactor(
        0
      )
      .setDepth(
        2000
      );

    this.tweens.add({
      targets: text,
      alpha: 0,
      y:
        text.y - 50,
      duration:
        1800,

      onComplete: () => {
        text.destroy();
      },
    });
  }
}