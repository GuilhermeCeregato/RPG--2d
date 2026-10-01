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

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  private sprintKey!: Phaser.Input.Keyboard.Key;

  // =========================
  // CLASSE
  // =========================

  private characterClass: CharacterClassData;

  // =========================
  // VIDA
  // =========================

  public maxHealth = 100;
  public health = 100;

  private healthBarBackground: Phaser.GameObjects.Rectangle;
  private healthBar: Phaser.GameObjects.Rectangle;

  private healthBarWidth = 40;
  private healthBarHeight = 6;

  private isDead = false;

  // Regeneração passiva
  private healthRegenPerSecond = 5;

  // =========================
  // COMBATE
  // =========================

  private inCombat = false;

  private combatDuration = 30000;

  private combatTimer = 0;

  // =========================
  // LEVEL
  // =========================

  public level = 1;

  private healthPerLevel = 20;

  // =========================
  // STAMINA
  // =========================

  public maxStamina = 100;
  public stamina = 100;

  private sprintSpeed = 300;

  private staminaDrainPerSecond = 15;
  private staminaRegenPerSecond = 20;

  private sprintEnabled = false;

  // =========================
  // ATAQUE
  // =========================

  public baseAttack = 10;

  private equippedWeapon: Weapon | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number
  ) {
    super(scene, x, y, "");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(28, 28);
    this.setTint(0x3498db);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.setCollideWorldBounds(true);

    // =========================
    // CLASSE INICIAL
    // =========================

    this.characterClass =
      CHARACTER_CLASSES.find(
        (characterClass) =>
          characterClass.id === "warrior"
      )!;

    // =========================
    // VIDA BASE DA CLASSE
    // =========================

    this.maxHealth =
      StatsSystem.getMaxHealth(
        100,
        this.characterClass
      );

    this.health =
      this.maxHealth;

    // =========================
    // BARRA DE VIDA - FUNDO
    // =========================

    this.healthBarBackground =
      scene.add.rectangle(
        this.x,
        this.y - 22,
        this.healthBarWidth,
        this.healthBarHeight,
        0x222222
      );

    this.healthBarBackground.setDepth(1000);

    // =========================
    // BARRA DE VIDA
    // =========================

    this.healthBar =
      scene.add.rectangle(
        this.x,
        this.y - 22,
        this.healthBarWidth,
        this.healthBarHeight,
        0x2ecc71
      );

    this.healthBar.setDepth(1001);

    this.healthBar.setOrigin(
      0.5,
      0.5
    );

    // =========================
    // TECLADO
    // =========================

    if (!scene.input.keyboard) {
      throw new Error(
        "Teclado não disponível."
      );
    }

    this.cursors =
      scene.input.keyboard.createCursorKeys();

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

    this.sprintKey =
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SHIFT
      );
  }

  update(): void {
    // =========================
    // BARRA DE VIDA
    // =========================

    this.healthBarBackground.setPosition(
      this.x,
      this.y - 22
    );

    this.healthBar.setPosition(
      this.x,
      this.y - 22
    );

    // =========================
    // SE ESTIVER MORTO
    // =========================

    if (this.isDead) {
      this.setVelocity(0, 0);
      return;
    }

    const delta =
      this.scene.game.loop.delta /
      1000;

    // =========================
    // COMBATE
    // =========================

    if (this.inCombat) {
      this.combatTimer -=
        this.scene.game.loop.delta;

      // Sai do combate após
      // 30 segundos sem hits.
      if (
        this.combatTimer <= 0
      ) {
        this.combatTimer = 0;

        this.inCombat = false;

        console.log(
          "Player saiu de combate."
        );
      }
    }

    // =========================
    // REGENERAÇÃO DE VIDA
    // =========================

    if (
      !this.inCombat &&
      this.health < this.maxHealth
    ) {
      this.health +=
        this.healthRegenPerSecond *
        delta;

      this.health =
        Math.min(
          this.maxHealth,
          this.health
        );

      this.updateHealthBar();
    }

    // =========================
    // TOGGLE DO SPRINT
    // =========================

    if (
      Phaser.Input.Keyboard.JustDown(
        this.sprintKey
      )
    ) {
      if (
        this.stamina > 0
      ) {
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

    // =========================
    // MOVIMENTO
    // =========================

    // ESQUERDA
    if (
      this.wasd.A.isDown ||
      this.cursors.left.isDown
    ) {
      velocityX = -1;
    }

    // DIREITA
    if (
      this.wasd.D.isDown ||
      this.cursors.right.isDown
    ) {
      velocityX = 1;
    }

    // CIMA
    if (
      this.wasd.W.isDown ||
      this.cursors.up.isDown
    ) {
      velocityY = -1;
    }

    // BAIXO
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

    // =========================
    // STAMINA
    // =========================

    if (
      this.sprintEnabled &&
      isMoving
    ) {
      const staminaUsed =
        this.staminaDrainPerSecond *
        delta;

      this.stamina -= staminaUsed;

      this.stamina =
        Math.max(
          0,
          this.stamina
        );

      // Se acabou a stamina,
      // desliga o sprint.
      if (
        this.stamina <= 0
      ) {
        this.stamina = 0;

        this.sprintEnabled =
          false;

        console.log(
          "Stamina acabou! Sprint desativado."
        );
      }
    }

    else if (
      !this.sprintEnabled
    ) {
      this.stamina +=
        this.staminaRegenPerSecond *
        delta;

      this.stamina =
        Math.min(
          this.maxStamina,
          this.stamina
        );
    }

    // =========================
    // VELOCIDADE
    // =========================

    const normalSpeed =
      StatsSystem.getMovementSpeed(
        PLAYER_SPEED,
        this.characterClass
      );

    const sprintSpeed =
      StatsSystem.getMovementSpeed(
        this.sprintSpeed,
        this.characterClass
      );

    const currentSpeed =
      this.sprintEnabled &&
      isMoving
        ? sprintSpeed
        : normalSpeed;

    // Impede movimento diagonal
    // de ficar mais rápido.
    if (
      velocity.length() > 0
    ) {
      velocity
        .normalize()
        .scale(
          currentSpeed
        );
    }

    this.setVelocity(
      velocity.x,
      velocity.y
    );
  }

  // =========================
  // CLASSE
  // =========================

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

    this.characterClass =
      newClass;

    this.maxHealth =
      StatsSystem.getMaxHealth(
        100 +
          (this.level - 1) *
            this.healthPerLevel,
        this.characterClass
      );

    this.health =
      this.maxHealth;

    this.updateHealthBar();

    console.log(
      `Classe escolhida: ${this.characterClass.name}`
    );

    return true;
  }

  getClass(): CharacterClassId {
    return this.characterClass.id;
  }

  getClassData(): CharacterClassData {
    return this.characterClass;
  }

  // =========================
  // ATRIBUTOS
  // =========================

  getStrength(): number {
    return StatsSystem.getStrength(
      this.characterClass
    );
  }

  getVitality(): number {
    return StatsSystem.getVitality(
      this.characterClass
    );
  }

  getDefense(): number {
    return StatsSystem.getDefense(
      this.characterClass
    );
  }

  getAgility(): number {
    return StatsSystem.getAgility(
      this.characterClass
    );
  }

  getLuck(): number {
    return StatsSystem.getLuck(
      this.characterClass
    );
  }

  getDodgeChance(): number {
    return StatsSystem.getDodgeChance(
      this.characterClass
    );
  }

  // =========================
  // COMBATE
  // =========================

  enterCombat(): void {
    if (this.isDead) {
      return;
    }

    const wasAlreadyInCombat =
      this.inCombat;

    this.inCombat = true;

    // Reinicia os 30 segundos.
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

  // =========================
  // VIDA
  // =========================

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

    this.health =
      Math.min(
        this.maxHealth,
        this.health
      );

    this.updateHealthBar();

    console.log(
      `Player recuperou ${amount} de HP. Vida: ${Math.ceil(this.health)}/${this.maxHealth}`
    );
  }

  // =========================
  // STAMINA
  // =========================

  useStamina(
    amount: number
  ): boolean {
    if (
      amount <= 0
    ) {
      return true;
    }

    if (
      this.stamina < amount
    ) {
      return false;
    }

    this.stamina -= amount;

    this.stamina =
      Math.max(
        0,
        this.stamina
      );

    return true;
  }

  restoreStamina(
    amount: number
  ): void {
    if (
      amount <= 0
    ) {
      return;
    }

    this.stamina += amount;

    this.stamina =
      Math.min(
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

  // =========================
  // ATAQUE
  // =========================

  equipWeapon(weapon: Weapon): void {
    if (this.isDead) {
      return;
    }

    this.equippedWeapon = weapon;

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
      this.equippedWeapon?.attack ?? 0;

    const baseDamage =
      this.baseAttack +
      weaponAttack;

    return StatsSystem.getPhysicalDamage(
      baseDamage,
      this.characterClass
    );
  }

  getEquippedWeapon(): Weapon | null {
    return this.equippedWeapon;
  }

  // =========================
  // LEVEL UP
  // =========================

  levelUp(newLevel: number): void {
    if (this.isDead) {
      return;
    }

    this.level = newLevel;

    // Aumenta a vida máxima
    this.maxHealth =
      StatsSystem.getMaxHealth(
        100 +
          (this.level - 1) *
            this.healthPerLevel,
        this.characterClass
      );

    // Recupera toda a vida
    this.health =
      this.maxHealth;

    // Recupera toda a stamina
    this.stamina =
      this.maxStamina;

    // Desliga o sprint
    this.sprintEnabled =
      false;

    // Sai do combate
    this.inCombat =
      false;

    this.combatTimer =
      0;

    // Recupera a barra de vida
    this.healthBar.setScale(
      1,
      1
    );

    // Efeito visual de level up
    this.setTint(0xffff00);

    this.scene.time.delayedCall(
      500,
      () => {
        if (
          this.active &&
          !this.isDead
        ) {
          this.setTint(0x3498db);
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

  // =========================
  // DANO
  // =========================

  takeDamage(
    amount: number,
    knockbackX: number = 0,
    knockbackY: number = 0
  ): void {
    if (this.isDead) {
      return;
    }

    // =========================
    // ESQUIVA
    // =========================

    const dodgeChance =
      this.getDodgeChance();

    if (
      Math.random() <
      dodgeChance
    ) {
      console.log(
        `Player desviou do ataque! (${Math.round(dodgeChance * 100)}% de esquiva)`
      );

      return;
    }

    // Entrou em combate porque
    // recebeu dano.
    this.enterCombat();

    // Aplica a defesa da classe.
    const finalDamage =
      StatsSystem.getDamageTaken(
        amount,
        this.characterClass
      );

    this.health -=
      finalDamage;

    this.health = Math.max(
      0,
      this.health
    );

    console.log(
      `Player recebeu ${finalDamage} de dano. Vida: ${Math.ceil(this.health)}/${this.maxHealth}`
    );

    // Knockback
    if (
      knockbackX !== 0 ||
      knockbackY !== 0
    ) {
      this.setVelocity(
        knockbackX,
        knockbackY
      );
    }

    // Atualiza barra de vida
    this.updateHealthBar();

    // Efeito de dano
    this.setTint(0xffffff);

    this.scene.time.delayedCall(
      100,
      () => {
        if (
          this.active &&
          !this.isDead
        ) {
          this.setTint(0x3498db);
        }
      }
    );

    // Morte
    if (
      this.health <= 0
    ) {
      this.die();
    }
  }

  // =========================
  // MORTE
  // =========================

  private die(): void {
    if (this.isDead) {
      return;
    }

    this.isDead = true;

    this.inCombat =
      false;

    this.combatTimer =
      0;

    this.sprintEnabled =
      false;

    this.setVelocity(
      0,
      0
    );

    console.log(
      "PLAYER MORREU!"
    );

    // Deixa o player cinza
    this.setTint(
      0x555555
    );

    // Vai para Game Over
    this.scene.time.delayedCall(
      800,
      () => {
        this.scene.scene.start(
          SCENE_KEYS.GAME_OVER
        );
      }
    );
  }

  // =========================
  // VERIFICAR SE ESTÁ MORTO
  // =========================

  isPlayerDead(): boolean {
    return this.isDead;
  }
}