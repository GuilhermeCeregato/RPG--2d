import Phaser from "phaser";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public enemyName: string;
  public maxHealth: number;
  public health: number;

  // XP que esse inimigo entrega ao morrer
  public experienceReward: number;

  private healthBarBackground: Phaser.GameObjects.Rectangle;
  private healthBar: Phaser.GameObjects.Rectangle;

  private healthBarWidth = 40;
  private healthBarHeight = 6;

  // IA
  private target: Phaser.Physics.Arcade.Sprite | null = null;
  private detectionRange = 250;
  private moveSpeed = 70;

  // ATAQUE
  private attackRange = 40;
  private attackDamage = 10;
  private attackCooldown = 1000;
  private canAttack = true;

  // KNOCKBACK
  private playerKnockbackForce = 180;
  private enemyKnockbackForce = 250;

  // CALLBACK DE MORTE
  private onDeath?: (
    enemy: Enemy
  ) => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemyName: string = "Inimigo",
    maxHealth: number = 100,
    experienceReward: number = 50,
    onDeath?: (enemy: Enemy) => void
  ) {
    super(scene, x, y, "");

    this.enemyName = enemyName;
    this.maxHealth = maxHealth;
    this.health = maxHealth;

    this.experienceReward =
      experienceReward;

    this.onDeath = onDeath;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(32, 32);
    this.setTint(0xe74c3c);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.setCollideWorldBounds(true);
    body.setAllowGravity(false);
    body.setImmovable(false);

    // =========================
    // BARRA DE VIDA
    // =========================

    this.healthBarBackground =
      scene.add.rectangle(
        this.x,
        this.y - 25,
        this.healthBarWidth,
        this.healthBarHeight,
        0x222222
      );

    this.healthBarBackground.setDepth(
      1000
    );

    this.healthBar =
      scene.add.rectangle(
        this.x,
        this.y - 25,
        this.healthBarWidth,
        this.healthBarHeight,
        0x2ecc71
      );

    this.healthBar.setDepth(1001);

    this.healthBar.setOrigin(
      0.5,
      0.5
    );
  }

  // =========================
  // DEFINIR ALVO
  // =========================

  setTarget(
    target: Phaser.Physics.Arcade.Sprite
  ): void {
    this.target = target;
  }

  // =========================
  // UPDATE
  // =========================

  update(): void {
    this.healthBarBackground.setPosition(
      this.x,
      this.y - 25
    );

    this.healthBar.setPosition(
      this.x,
      this.y - 25
    );

    if (!this.target) {
      this.setVelocity(0, 0);
      return;
    }

    const distance =
      Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.target.x,
        this.target.y
      );

    // =========================
    // ATAQUE
    // =========================

    if (
      distance <=
      this.attackRange
    ) {
      this.setVelocity(0, 0);

      this.attack();

      return;
    }

    // =========================
    // PERSEGUIÇÃO
    // =========================

    if (
      distance <=
      this.detectionRange
    ) {
      const direction =
        new Phaser.Math.Vector2(
          this.target.x - this.x,
          this.target.y - this.y
        );

      if (direction.length() > 0) {
        direction.normalize();

        this.setVelocity(
          direction.x *
            this.moveSpeed,
          direction.y *
            this.moveSpeed
        );
      }
    } else {
      this.setVelocity(0, 0);
    }
  }

  // =========================
  // ATAQUE
  // =========================

  private attack(): void {
    if (!this.target) return;

    if (!this.canAttack) return;

    this.canAttack = false;

    const direction =
      new Phaser.Math.Vector2(
        this.target.x - this.x,
        this.target.y - this.y
      );

    if (direction.length() > 0) {
      direction.normalize();
    }

    const knockbackX =
      direction.x *
      this.playerKnockbackForce;

    const knockbackY =
      direction.y *
      this.playerKnockbackForce;

    // =========================
    // EFEITO DE IMPACTO
    // =========================

    const impact =
      this.scene.add.circle(
        this.target.x,
        this.target.y,
        7,
        0xffffff
      );

    impact.setDepth(1100);

    this.scene.tweens.add({
      targets: impact,
      scale: 2.5,
      alpha: 0,
      duration: 120,

      onComplete: () => {
        impact.destroy();
      },
    });

    // =========================
    // DAR DANO
    // =========================

    const target =
      this.target as any;

    if (
      typeof target.takeDamage ===
      "function"
    ) {
      target.takeDamage(
        this.attackDamage,
        knockbackX,
        knockbackY
      );
    }

    console.log(
      `${this.enemyName} atacou o Player!`
    );

    // =========================
    // COOLDOWN
    // =========================

    this.scene.time.delayedCall(
      this.attackCooldown,
      () => {
        this.canAttack = true;
      }
    );
  }

  // =========================
  // RECEBER DANO
  // =========================

  takeDamage(
    amount: number
  ): void {
    this.health -= amount;

    this.health = Math.max(
      0,
      this.health
    );

    console.log(
      `${this.enemyName} recebeu ${amount} de dano. Vida: ${this.health}/${this.maxHealth}`
    );

    // =========================
    // KNOCKBACK
    // =========================

    if (this.target) {
      const direction =
        new Phaser.Math.Vector2(
          this.x - this.target.x,
          this.y - this.target.y
        );

      if (direction.length() > 0) {
        direction.normalize();

        this.setVelocity(
          direction.x *
            this.enemyKnockbackForce,
          direction.y *
            this.enemyKnockbackForce
        );
      }
    }

    // =========================
    // ATUALIZAR HP
    // =========================

    const healthPercent =
      this.health /
      this.maxHealth;

    this.healthBar.setScale(
      healthPercent,
      1
    );

    // =========================
    // FLASH
    // =========================

    this.setTint(0xffffff);

    this.scene.time.delayedCall(
      100,
      () => {
        if (this.active) {
          this.setTint(0xe74c3c);
        }
      }
    );

    // =========================
    // MORTE
    // =========================

    if (this.health <= 0) {
      this.die();
    }
  }

  // =========================
  // MORTE
  // =========================

  private die(): void {
    console.log(
      `${this.enemyName} morreu!`
    );

    console.log(
      `XP ganho: ${this.experienceReward}`
    );

    // Avisar o GameScene
    if (this.onDeath) {
      this.onDeath(this);
    }

    // Destruir barra de vida
    this.healthBarBackground.destroy();
    this.healthBar.destroy();

    // Destruir inimigo
    this.destroy();
  }
}