import {
  CharacterClassData,
} from "../entities/CharacterClass";

export interface CharacterStats {
  strength: number;
  vitality: number;
  defense: number;
  agility: number;
  luck: number;
}

export class StatsSystem {
  // =========================
  // ATRIBUTOS
  // =========================

  static getStrength(
    characterClass: CharacterClassData
  ): number {
    return characterClass.strength;
  }

  static getVitality(
    characterClass: CharacterClassData
  ): number {
    return characterClass.vitality;
  }

  static getDefense(
    characterClass: CharacterClassData
  ): number {
    return characterClass.defense;
  }

  static getAgility(
    characterClass: CharacterClassData
  ): number {
    return characterClass.agility;
  }

  static getLuck(
    characterClass: CharacterClassData
  ): number {
    return characterClass.luck;
  }

  // =========================
  // VIDA
  // =========================

  static getMaxHealth(
    baseHealth: number,
    characterClass: CharacterClassData
  ): number {
    return (
      baseHealth +
      characterClass.vitality * 10
    );
  }

  // =========================
  // DANO FÍSICO
  // =========================

  static getPhysicalDamage(
    baseDamage: number,
    characterClass: CharacterClassData
  ): number {
    const multiplier =
      1 +
      characterClass.strength * 0.05;

    return Math.floor(
      baseDamage * multiplier
    );
  }

  // =========================
  // REDUÇÃO DE DANO
  // =========================

  static getDamageReduction(
    characterClass: CharacterClassData
  ): number {
    return Math.min(
      characterClass.defense * 0.03,
      0.75
    );
  }

  // =========================
  // DANO RECEBIDO
  // =========================

  static getDamageTaken(
    damage: number,
    characterClass: CharacterClassData
  ): number {
    const reduction =
      this.getDamageReduction(
        characterClass
      );

    return Math.max(
      1,
      Math.floor(
        damage * (1 - reduction)
      )
    );
  }

  // =========================
  // VELOCIDADE
  // =========================

  static getMovementSpeed(
    baseSpeed: number,
    characterClass: CharacterClassData
  ): number {
    const multiplier =
      1 +
      characterClass.agility * 0.03;

    return Math.floor(
      baseSpeed * multiplier
    );
  }

  // =========================
  // ESQUIVA
  // =========================

  static getDodgeChance(
    characterClass: CharacterClassData
  ): number {
    return Math.min(
      characterClass.agility * 0.01,
      0.50
    );
  }

  // =========================
  // SORTE
  // =========================

  static getLuckTier(
    characterClass: CharacterClassData
  ): string {
    const luck =
      characterClass.luck;

    if (luck >= 101) {
      return "special";
    }

    if (luck >= 51) {
      return "very_high";
    }

    if (luck >= 26) {
      return "high";
    }

    if (luck >= 11) {
      return "medium";
    }

    return "low";
  }

  // =========================
  // CHANCE DE SORTE
  // =========================

  static getLuckMultiplier(
    characterClass: CharacterClassData
  ): number {
    const luck =
      characterClass.luck;

    if (luck >= 101) {
      return 3;
    }

    if (luck >= 51) {
      return 2;
    }

    if (luck >= 26) {
      return 1.5;
    }

    if (luck >= 11) {
      return 1.2;
    }

    return 1;
  }

  // =========================
  // TESTE DE SORTE
  // =========================

  static rollLuck(
    chance: number,
    characterClass: CharacterClassData
  ): boolean {
    const luckMultiplier =
      this.getLuckMultiplier(
        characterClass
      );

    const finalChance =
      Math.min(
        chance * luckMultiplier,
        100
      );

    return (
      Math.random() * 100 <
      finalChance
    );
  }
}