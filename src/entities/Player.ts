import Phaser from "phaser";
import {
  PLAYER_SPEED,
  SCENE_KEYS,
} from "../utils/constants";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  // VIDA
  public maxHealth = 100;
  public health = 100;

  private healthBarBackground: Phaser.GameObjects.Rectangle;
  private healthBar: Phaser.GameObjects.Rectangle;

  private healthBarWidth = 40;
  private healthBarHeight = 6;

  private isDead = false;

  // LEVEL
  public level = 1;

  private healthPerLevel = 20;

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

    // BARRA DE VIDA - FUNDO
    this.healthBarBackground =
      scene.add.rectangle(
        this.x,
        this.y - 22,
        this.healthBarWidth,
        this.healthBarHeight,
        0x222222
      );

    this.healthBarBackground.setDepth(1000);

    // BARRA DE VIDA
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

    // TECLADO
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
  }

  update(): void {
    // Atualiza posição da barra de vida
    this.healthBarBackground.setPosition(
      this.x,
      this.y - 22
    );

    this.healthBar.setPosition(
      this.x,
      this.y - 22
    );

    // Se estiver morto, não pode se mover
    if (this.isDead) {
      this.setVelocity(0, 0);
      return;
    }

    let velocityX = 0;
    let velocityY = 0;

    // ESQUERDA
    if (
      this.wasd.A.isDown ||
      this.cursors.left.isDown
    ) {
      velocityX = -PLAYER_SPEED;
    }

    // DIREITA
    if (
      this.wasd.D.isDown ||
      this.cursors.right.isDown
    ) {
      velocityX = PLAYER_SPEED;
    }

    // CIMA
    if (
      this.wasd.W.isDown ||
      this.cursors.up.isDown
    ) {
      velocityY = -PLAYER_SPEED;
    }

    // BAIXO
    if (
      this.wasd.S.isDown ||
      this.cursors.down.isDown
    ) {
      velocityY = PLAYER_SPEED;
    }

    const velocity =
      new Phaser.Math.Vector2(
        velocityX,
        velocityY
      );

    // Impede movimento diagonal mais rápido
    if (velocity.length() > 0) {
      velocity
        .normalize()
        .scale(PLAYER_SPEED);
    }

    this.setVelocity(
      velocity.x,
      velocity.y
    );
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
    this.maxHealth += this.healthPerLevel;

    // Recupera toda a vida
    this.health = this.maxHealth;

    // Recupera a barra de vida
    this.healthBar.setScale(1, 1);

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

    this.health -= amount;

    this.health = Math.max(
      0,
      this.health
    );

    console.log(
      `Player recebeu ${amount} de dano. Vida: ${this.health}/${this.maxHealth}`
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
    const healthPercent =
      this.health /
      this.maxHealth;

    this.healthBar.setScale(
      healthPercent,
      1
    );

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
    if (this.health <= 0) {
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

    this.setVelocity(0, 0);

    console.log(
      "PLAYER MORREU!"
    );

    // Deixa o player cinza
    this.setTint(0x555555);

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