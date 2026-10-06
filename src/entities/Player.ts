import Phaser from "phaser";
import {
  PLAYER_SPEED,
  SCENE_KEYS,
} from "../utils/constants";
import { Weapon } from "../items/Weapon";
import {
  CHARACTER_CLASSES,
  CharacterClassData,
  CharacterClassId,
} from "./CharacterClass";
import { StatsSystem } from "../systems/StatsSystem";
import {
  EquipmentBonuses,
} from "../systems/StatsSystem";
import {
  drawClassBack,
  drawClassFront,
} from "./ClassAccessories";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  private sprintKey!: Phaser.Input.Keyboard.Key;

  private characterClass: CharacterClassData;

  private accessoryBack!: Phaser.GameObjects.Graphics;
  private accessoryFront!: Phaser.GameObjects.Graphics;

  private bodySize = 28;

  public maxHealth = 100;
  public health = 100;

  private healthBarBackground: Phaser.GameObjects.Rectangle;
  private healthBar: Phaser.GameObjects.Rectangle;

  private healthBarWidth = 40;
  private healthBarHeight = 6;

  private healthBarOffsetY = 46;

  private isDead = false;

  private healthRegenPerSecond = 5;

  private inCombat = false;
  private combatDuration = 30000;
  private combatTimer = 0;

  public level = 1;
  private healthPerLevel = 20;

  public maxStamina = 100;
  public stamina = 100;

  private sprintSpeed = 300;
  private staminaDrainPerSecond = 15;
  private staminaRegenPerSecond = 20;
  private sprintEnabled = false;

  public baseAttack = 10;
  private equippedWeapon: Weapon | null = null;

  // ========================================
  // BÔNUS DOS EQUIPAMENTOS
  // ========================================

  private equipmentBonuses: EquipmentBonuses = {
    strength: 0,
    vitality: 0,
    defense: 0,
    agility: 0,
    luck: 0,
    intelligence: 0,
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(28, 28);
    this.setTint(0x3498db);
    this.setDepth(10);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

    this.characterClass =
      CHARACTER_CLASSES.find(
        (characterClass) => characterClass.id === "warrior"
      )!;

    this.accessoryBack = scene.add.graphics();
    this.accessoryBack.setDepth(9);

    this.accessoryFront = scene.add.graphics();
    this.accessoryFront.setDepth(11);

    this.redrawAccessories();

    this.maxHealth = StatsSystem.getMaxHealth(
      100,
      this.characterClass,
      this.equipmentBonuses
    );

    this.health = this.maxHealth;

    this.healthBarBackground = scene.add.rectangle(
      this.x,
      this.y - this.healthBarOffsetY,
      this.healthBarWidth,
      this.healthBarHeight,
      0x222222
    );

    this.healthBarBackground.setDepth(1000);

    this.healthBar = scene.add.rectangle(
      this.x,
      this.y - this.healthBarOffsetY,
      this.healthBarWidth,
      this.healthBarHeight,
      0x2ecc71
    );

    this.healthBar.setDepth(1001);
    this.healthBar.setOrigin(0.5, 0.5);

    if (!scene.input.keyboard) {
      throw new Error("Teclado não disponível.");
    }

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.wasd = {
      W: scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.W
      ),
      A: scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.A
      ),
      S: scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S
      ),
      D: scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.D
      ),
    };

    this.sprintKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    scene.events.on(
      Phaser.Scenes.Events.POST_UPDATE,
      this.updateAccessories,
      this
    );
  }

  update(): void {
    this.healthBarBackground.setPosition(
      this.x,
      this.y - this.healthBarOffsetY
    );

    this.healthBar.setPosition(
      this.x,
      this.y - this.healthBarOffsetY
    );

    if (this.isDead) {
      this.setVelocity(0, 0);
      return;
    }

    const delta =
      this.scene.game.loop.delta / 1000;

    if (this.inCombat) {
      this.combatTimer -=
        this.scene.game.loop.delta;

      if (this.combatTimer <= 0) {
        this.combatTimer = 0;
        this.inCombat = false;

        console.log(
          "Player saiu de combate."
        );
      }
    }

    if (
      !this.inCombat &&
      this.health < this.maxHealth
    ) {
      this.health +=
        this.healthRegenPerSecond * delta;

      this.health = Math.min(
        this.maxHealth,
        this.health
      );

      this.updateHealthBar();
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.sprintKey
      )
    ) {
      if (this.stamina > 0) {
        this.sprintEnabled =
          !this.sprintEnabled;

        console.log(
          this.sprintEnabled
            ? "Sprint ativado!"
            : "Sprint desativado!"
        );
      }
    }

    let velocityX = 0;
    let velocityY = 0;

    if (
      this.wasd.A.isDown ||
      this.cursors.left.isDown
    ) {
      velocityX = -1;
    }

    if (
      this.wasd.D.isDown ||
      this.cursors.right.isDown
    ) {
      velocityX = 1;
    }

    if (
      this.wasd.W.isDown ||
      this.cursors.up.isDown
    ) {
      velocityY = -1;
    }

    if (
      this.wasd.S.isDown ||
      this.cursors.down.isDown
    ) {
      velocityY = 1;
    }

    const velocity =
      new Phaser.Math.Vector2(
        velocityX,
        velocityY
      );

    const isMoving =
      velocity.length() > 0;

    if (
      this.sprintEnabled &&
      isMoving
    ) {
      const staminaUsed =
        this.staminaDrainPerSecond *
        delta;

      this.stamina -= staminaUsed;

      this.stamina = Math.max(
        0,
        this.stamina
      );

      if (this.stamina <= 0) {
        this.stamina = 0;
        this.sprintEnabled = false;

        console.log(
          "Stamina acabou! Sprint desativado."
        );
      }
    } else if (!this.sprintEnabled) {
      this.stamina +=
        this.staminaRegenPerSecond *
        delta;

      this.stamina = Math.min(
        this.maxStamina,
        this.stamina
      );
    }

    const normalSpeed =
      StatsSystem.getMovementSpeed(
        PLAYER_SPEED,
        this.characterClass,
        this.equipmentBonuses
      );

    const sprintSpeed =
      StatsSystem.getMovementSpeed(
        this.sprintSpeed,
        this.characterClass,
        this.equipmentBonuses
      );

    const currentSpeed =
      this.sprintEnabled &&
      isMoving
        ? sprintSpeed
        : normalSpeed;

    if (velocity.length() > 0) {
      velocity
        .normalize()
        .scale(currentSpeed);
    }

    this.setVelocity(
      velocity.x,
      velocity.y
    );
  }

  private redrawAccessories(): void {
    const classId =
      this.characterClass.id;

    this.accessoryBack.clear();
    this.accessoryFront.clear();

    drawClassBack(
      this.accessoryBack,
      classId,
      0,
      0,
      this.bodySize
    );

    drawClassFront(
      this.accessoryFront,
      classId,
      0,
      0,
      this.bodySize
    );
  }

  private updateAccessories = (): void => {
    this.accessoryBack.setPosition(
      this.x,
      this.y
    );

    this.accessoryFront.setPosition(
      this.x,
      this.y
    );
  };

  setClass(
    classId: CharacterClassId
  ): boolean {
    const newClass =
      CHARACTER_CLASSES.find(
        (characterClass) =>
          characterClass.id === classId
      );

    if (!newClass) {
      return false;
    }

    this.characterClass = newClass;

    this.redrawAccessories();

    this.maxHealth =
      StatsSystem.getMaxHealth(
        100 +
          (this.level - 1) *
            this.healthPerLevel,
        this.characterClass,
        this.equipmentBonuses
      );

    this.health =
      this.maxHealth;

    this.updateHealthBar();

    console.log(
      `Classe escolhida: ${this.characterClass.name}`
    );

    return true;
  }

  // ========================================
  // EQUIPAMENTOS / ATRIBUTOS
  // ========================================

  setEquipmentBonuses(
    bonuses: Partial<EquipmentBonuses>
  ): void {
    this.equipmentBonuses = {
      strength: bonuses.strength ?? 0,
      vitality: bonuses.vitality ?? 0,
      defense: bonuses.defense ?? 0,
      agility: bonuses.agility ?? 0,
      luck: bonuses.luck ?? 0,
      intelligence:
        bonuses.intelligence ?? 0,
    };

    const oldMaxHealth =
      this.maxHealth;

    this.maxHealth =
      StatsSystem.getMaxHealth(
        100 +
          (this.level - 1) *
            this.healthPerLevel,
        this.characterClass,
        this.equipmentBonuses
      );

    if (
      this.maxHealth <
      oldMaxHealth
    ) {
      this.health =
        Math.min(
          this.health,
          this.maxHealth
        );
    }

    this.updateHealthBar();

    console.log(
      "Bônus de equipamentos atualizados:",
      this.equipmentBonuses
    );
  }

  getEquipmentBonuses(): EquipmentBonuses {
    return {
      ...this.equipmentBonuses,
    };
  }

  getClass(): CharacterClassId {
    return this.characterClass.id;
  }

  getClassData(): CharacterClassData {
    return this.characterClass;
  }

  getStrength(): number {
    return StatsSystem.getStrength(
      this.characterClass,
      this.equipmentBonuses
    );
  }

  getVitality(): number {
    return StatsSystem.getVitality(
      this.characterClass,
      this.equipmentBonuses
    );
  }

  getDefense(): number {
    return StatsSystem.getDefense(
      this.characterClass,
      this.equipmentBonuses
    );
  }

  getAgility(): number {
    return StatsSystem.getAgility(
      this.characterClass,
      this.equipmentBonuses
    );
  }

  getLuck(): number {
    return StatsSystem.getLuck(
      this.characterClass,
      this.equipmentBonuses
    );
  }

  getIntelligence(): number {
    return StatsSystem.getIntelligence(
      this.characterClass,
      this.equipmentBonuses
    );
  }

  getDodgeChance(): number {
    return StatsSystem.getDodgeChance(
      this.characterClass,
      this.equipmentBonuses
    );
  }

  enterCombat(): void {
    if (this.isDead) {
      return;
    }

    const wasAlreadyInCombat =
      this.inCombat;

    this.inCombat = true;
    this.combatTimer =
      this.combatDuration;

    if (!wasAlreadyInCombat) {
      console.log(
        "Player entrou em combate!"
      );
    }
  }

  isInCombat(): boolean {
    return this.inCombat;
  }

  getCombatTimeRemaining(): number {
    if (!this.inCombat) {
      return 0;
    }

    return Math.max(
      0,
      this.combatTimer
    );
  }

  getHealth(): number {
    return this.health;
  }

  getMaxHealth(): number {
    return this.maxHealth;
  }

  private updateHealthBar(): void {
    const healthPercent =
      Phaser.Math.Clamp(
        this.health /
          this.maxHealth,
        0,
        1
      );

    this.healthBar.setScale(
      healthPercent,
      1
    );
  }

  heal(amount: number): void {
    if (
      this.isDead ||
      amount <= 0
    ) {
      return;
    }

    this.health += amount;

    this.health = Math.min(
      this.maxHealth,
      this.health
    );

    this.updateHealthBar();

    console.log(
      `Player recuperou ${amount} de HP. Vida: ${Math.ceil(
        this.health
      )}/${this.maxHealth}`
    );
  }

  useStamina(
    amount: number
  ): boolean {
    if (amount <= 0) {
      return true;
    }

    if (
      this.stamina <
      amount
    ) {
      return false;
    }

    this.stamina -= amount;

    this.stamina = Math.max(
      0,
      this.stamina
    );

    return true;
  }

  restoreStamina(
    amount: number
  ): void {
    if (amount <= 0) {
      return;
    }

    this.stamina += amount;

    this.stamina = Math.min(
      this.maxStamina,
      this.stamina
    );
  }

  getStamina(): number {
    return this.stamina;
  }

  getMaxStamina(): number {
    return this.maxStamina;
  }

  isSprinting(): boolean {
    return this.sprintEnabled;
  }

  equipWeapon(
    weapon: Weapon
  ): void {
    if (this.isDead) {
      return;
    }

    this.equippedWeapon =
      weapon;

    console.log(
      `Arma equipada: ${weapon.name}`
    );

    console.log(
      `ATK da arma: +${weapon.attack}`
    );

    console.log(
      `ATK total: ${this.getAttack()}`
    );
  }

  unequipWeapon(): void {
    if (!this.equippedWeapon) {
      return;
    }

    console.log(
      `Arma removida: ${this.equippedWeapon.name}`
    );

    this.equippedWeapon = null;

    console.log(
      `ATK total: ${this.getAttack()}`
    );
  }

  getAttack(): number {
    const weaponAttack =
      this.equippedWeapon?.attack ??
      0;

    const baseDamage =
      this.baseAttack +
      weaponAttack;

    return StatsSystem.getPhysicalDamage(
      baseDamage,
      this.characterClass,
      this.equipmentBonuses
    );
  }

  levelUp(
    newLevel: number
  ): void {
    if (this.isDead) {
      return;
    }

    this.level = newLevel;

    this.maxHealth =
      StatsSystem.getMaxHealth(
        100 +
          (this.level - 1) *
            this.healthPerLevel,
        this.characterClass,
        this.equipmentBonuses
      );

    this.health =
      this.maxHealth;

    this.stamina =
      this.maxStamina;

    this.sprintEnabled = false;

    this.inCombat = false;
    this.combatTimer = 0;

    this.healthBar.setScale(
      1,
      1
    );

    this.setTint(
      0xffff00
    );

    this.scene.time.delayedCall(
      500,
      () => {
        if (
          this.active &&
          !this.isDead
        ) {
          this.setTint(
            0x3498db
          );
        }
      }
    );

    console.log(
      `Player subiu para o nível ${this.level}!`
    );

    console.log(
      `Vida máxima: ${this.maxHealth}`
    );

    console.log(
      `Stamina máxima: ${this.maxStamina}`
    );

    console.log(
      `ATK atual: ${this.getAttack()}`
    );
  }

  takeDamage(
    amount: number,
    knockbackX: number = 0,
    knockbackY: number = 0
  ): void {
    if (this.isDead) {
      return;
    }

    const dodgeChance =
      this.getDodgeChance();

    if (
      Math.random() <
      dodgeChance
    ) {
      console.log(
        `Player desviou do ataque! (${Math.round(
          dodgeChance * 100
        )}% de esquiva)`
      );

      return;
    }

    this.enterCombat();

    const finalDamage =
      StatsSystem.getDamageTaken(
        amount,
        this.characterClass,
        this.equipmentBonuses
      );

    this.health -=
      finalDamage;

    this.health = Math.max(
      0,
      this.health
    );

    console.log(
      `Player recebeu ${finalDamage} de dano. Vida: ${Math.ceil(
        this.health
      )}/${this.maxHealth}`
    );

    if (
      knockbackX !== 0 ||
      knockbackY !== 0
    ) {
      this.setVelocity(
        knockbackX,
        knockbackY
      );
    }

    this.updateHealthBar();

    this.setTint(
      0xffffff
    );

    this.scene.time.delayedCall(
      100,
      () => {
        if (
          this.active &&
          !this.isDead
        ) {
          this.setTint(
            0x3498db
          );
        }
      }
    );

    if (
      this.health <= 0
    ) {
      this.die();
    }
  }

  private die(): void {
    if (this.isDead) {
      return;
    }

    this.isDead = true;
    this.inCombat = false;
    this.combatTimer = 0;
    this.sprintEnabled = false;

    this.setVelocity(
      0,
      0
    );

    console.log(
      "PLAYER MORREU!"
    );

    this.setTint(
      0x555555
    );

    this.scene.time.delayedCall(
      800,
      () => {
        this.scene.scene.start(
          SCENE_KEYS.GAME_OVER
        );
      }
    );
  }

  isPlayerDead(): boolean {
    return this.isDead;
  }
}