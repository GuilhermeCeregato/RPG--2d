import {
  CharacterClassData,
} from "../entities/CharacterClass";

export interface CharacterStats {
  strength: number;
  vitality: number;
  defense: number;
  agility: number;
  luck: number;
  intelligence: number;
}

export interface EquipmentBonuses {
  strength: number;
  vitality: number;
  defense: number;
  agility: number;
  luck: number;
  intelligence: number;
}

export class StatsSystem {
  // =========================
  // ATRIBUTOS
  // =========================

  static getStrength(
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    return (
      characterClass.strength +
      (equipmentBonuses.strength ?? 0)
    );
  }

  static getVitality(
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    return (
      characterClass.vitality +
      (equipmentBonuses.vitality ?? 0)
    );
  }

  static getDefense(
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    return (
      characterClass.defense +
      (equipmentBonuses.defense ?? 0)
    );
  }

  static getAgility(
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    return (
      characterClass.agility +
      (equipmentBonuses.agility ?? 0)
    );
  }

  static getLuck(
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    return (
      characterClass.luck +
      (equipmentBonuses.luck ?? 0)
    );
  }

  static getIntelligence(
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    return (
      characterClass.intelligence +
      (equipmentBonuses.intelligence ?? 0)
    );
  }

  // =========================
  // VIDA
  // =========================

  static getMaxHealth(
    baseHealth: number,
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    const vitality =
      this.getVitality(
        characterClass,
        equipmentBonuses
      );

    return (
      baseHealth +
      vitality * 10
    );
  }

  // =========================
  // DANO FÍSICO
  // =========================

  static getPhysicalDamage(
    baseDamage: number,
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    const strength =
      this.getStrength(
        characterClass,
        equipmentBonuses
      );

    const multiplier =
      1 +
      strength * 0.05;

    return Math.floor(
      baseDamage * multiplier
    );
  }

  // =========================
  // DANO MÁGICO
  // =========================

  static getMagicDamage(
    baseDamage: number,
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    const intelligence =
      this.getIntelligence(
        characterClass,
        equipmentBonuses
      );

    const multiplier =
      1 +
      intelligence * 0.05;

    return Math.floor(
      baseDamage * multiplier
    );
  }

  // =========================
  // REDUÇÃO DE DANO
  // =========================

  static getDamageReduction(
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    const defense =
      this.getDefense(
        characterClass,
        equipmentBonuses
      );

    return Math.min(
      defense * 0.03,
      0.75
    );
  }

  // =========================
  // DANO RECEBIDO
  // =========================

  static getDamageTaken(
    damage: number,
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    const reduction =
      this.getDamageReduction(
        characterClass,
        equipmentBonuses
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
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    const agility =
      this.getAgility(
        characterClass,
        equipmentBonuses
      );

    const multiplier =
      1 +
      agility * 0.03;

    return Math.floor(
      baseSpeed * multiplier
    );
  }

  // =========================
  // ESQUIVA
  // =========================

  static getDodgeChance(
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    const agility =
      this.getAgility(
        characterClass,
        equipmentBonuses
      );

    return Math.min(
      agility * 0.01,
      0.50
    );
  }

  // =========================
  // SORTE
  // =========================

  static getLuckTier(
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): string {
    const luck =
      this.getLuck(
        characterClass,
        equipmentBonuses
      );

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
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): number {
    const luck =
      this.getLuck(
        characterClass,
        equipmentBonuses
      );

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
    characterClass: CharacterClassData,
    equipmentBonuses: Partial<EquipmentBonuses> = {}
  ): boolean {
    const luckMultiplier =
      this.getLuckMultiplier(
        characterClass,
        equipmentBonuses
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