import {
  PUBLIC_CLASS_CATALOG,
  SECRET_CLASS_CATALOG,
  type ClassCatalogEntry,
  type ClassSubclass,
} from "../data/ClassCatalog";

// ========================================
// TIPOS
// ========================================

export interface SubclassProgressEntry {
  classId: string;
  subclassId: string;
}

export interface SubclassProgress {
  unlocked: SubclassProgressEntry[];
  selected: SubclassProgressEntry | null;
}

export interface SubclassUnlockResult {
  success: boolean;
  message: string;
}

export interface SubclassBonuses {
  strength: number;
  vitality: number;
  defense: number;
  agility: number;
  luck: number;
  intelligence: number;
}

type SubclassWithOptionalGameplay = ClassSubclass & {
  bonuses?: Partial<SubclassBonuses>;
  attributes?: Partial<SubclassBonuses>;
  gameplayData?: unknown;
  gameplay?: unknown;
};

const ZERO_BONUSES: SubclassBonuses = {
  strength: 0,
  vitality: 0,
  defense: 0,
  agility: 0,
  luck: 0,
  intelligence: 0,
};

// ========================================
// SISTEMA DE SUBCLASSES
// ========================================

export class SubclassSystem {
  private readonly requiredLevel: number;

  private progress: SubclassProgress = {
    unlocked: [],
    selected: null,
  };

  constructor(requiredLevel = 20) {
    this.requiredLevel = Math.max(1, Math.floor(requiredLevel));
  }

  // ========================================
  // CATÁLOGO
  // ========================================

  getPublicCatalog(): ClassCatalogEntry[] {
    return PUBLIC_CLASS_CATALOG;
  }

  getClass(classId: string, includeSecret = false): ClassCatalogEntry | undefined {
    const publicClass = PUBLIC_CLASS_CATALOG.find((entry) => entry.id === classId);
    if (publicClass) return publicClass;
    if (!includeSecret) return undefined;
    return SECRET_CLASS_CATALOG.find((entry) => entry.id === classId);
  }

  getSubclasses(classId: string, includeSecret = false): ClassSubclass[] {
    return this.getClass(classId, includeSecret)?.subclasses ?? [];
  }

  getSubclass(
    classId: string,
    subclassId: string,
    includeSecret = false
  ): ClassSubclass | undefined {
    return this.getSubclasses(classId, includeSecret).find(
      (subclass) => subclass.id === subclassId
    );
  }

  // ========================================
  // VERIFICAR DESBLOQUEIO
  // ========================================

  isUnlocked(classId: string, subclassId: string): boolean {
    return this.progress.unlocked.some(
      (entry) => entry.classId === classId && entry.subclassId === subclassId
    );
  }

  canUnlock(
    classId: string,
    subclassId: string,
    playerLevel: number,
    trialCompleted: boolean,
    secretClassUnlocked = false
  ): SubclassUnlockResult {
    const characterClass = this.getClass(classId, secretClassUnlocked);
    if (!characterClass) {
      return { success: false, message: "Essa classe ainda não está desbloqueada." };
    }

    const subclass = this.getSubclass(classId, subclassId, secretClassUnlocked);
    if (!subclass) {
      return { success: false, message: "Essa subclasse não existe nessa classe." };
    }

    if (this.isUnlocked(classId, subclassId)) {
      return { success: false, message: "Essa subclasse já foi desbloqueada." };
    }

    if (playerLevel < this.requiredLevel) {
      return {
        success: false,
        message: `Você precisa alcançar o nível ${this.requiredLevel}.`,
      };
    }

    if (!trialCompleted) {
      return { success: false, message: "Você precisa concluir a prova dessa subclasse." };
    }

    return { success: true, message: "Requisitos cumpridos." };
  }

  // ========================================
  // DESBLOQUEAR SUBCLASSE
  // ========================================

  unlockSubclass(
    classId: string,
    subclassId: string,
    playerLevel: number,
    trialCompleted: boolean,
    secretClassUnlocked = false
  ): SubclassUnlockResult {
    const result = this.canUnlock(
      classId,
      subclassId,
      playerLevel,
      trialCompleted,
      secretClassUnlocked
    );
    if (!result.success) return result;

    this.progress.unlocked.push({ classId, subclassId });
    return { success: true, message: "Subclasse desbloqueada!" };
  }

  // ========================================
  // SELECIONAR SUBCLASSE
  // ========================================

  selectSubclass(classId: string, subclassId: string): boolean {
    if (!this.isUnlocked(classId, subclassId)) return false;
    if (!this.getSubclass(classId, subclassId, true)) return false;

    this.progress.selected = { classId, subclassId };
    return true;
  }

  clearSelectedSubclass(): void {
    this.progress.selected = null;
  }

  /** Retorna o ID selecionado. Sem classId, retorna a subclasse ativa atual. */
  getSelectedSubclassId(classId?: string): string | null {
    const selected = this.progress.selected;
    if (!selected || (classId !== undefined && selected.classId !== classId)) {
      return null;
    }
    return selected.subclassId;
  }

  getSelectedSubclass(classId?: string): ClassSubclass | undefined {
    const selected = this.progress.selected;
    if (!selected || (classId !== undefined && selected.classId !== classId)) {
      return undefined;
    }
    return this.getSubclass(selected.classId, selected.subclassId, true);
  }

  /** Lista os IDs das subclasses desbloqueadas, mantendo compatibilidade com Player.ts. */
  getUnlockedSubclassIds(): string[] {
    return this.progress.unlocked.map((entry) => entry.subclassId);
  }

  getUnlockedSubclasses(): SubclassProgressEntry[] {
    return this.progress.unlocked.map((entry) => ({ ...entry }));
  }

  // ========================================
  // BÔNUS E DADOS DE JOGABILIDADE
  // ========================================

  getBonuses(): SubclassBonuses {
    const subclass = this.getSelectedSubclass() as SubclassWithOptionalGameplay | undefined;
    if (!subclass) return { ...ZERO_BONUSES };

    // Aceita os dois formatos, caso o catálogo passe a usar "bonuses" ou "attributes".
    const bonuses = subclass.bonuses ?? subclass.attributes ?? {};
    return {
      strength: this.toBonusNumber(bonuses.strength),
      vitality: this.toBonusNumber(bonuses.vitality),
      defense: this.toBonusNumber(bonuses.defense),
      agility: this.toBonusNumber(bonuses.agility),
      luck: this.toBonusNumber(bonuses.luck),
      intelligence: this.toBonusNumber(bonuses.intelligence),
    };
  }

  getSelectedGameplayData(): unknown {
    const subclass = this.getSelectedSubclass() as SubclassWithOptionalGameplay | undefined;
    if (!subclass) return null;
    return subclass.gameplayData ?? subclass.gameplay ?? null;
  }

  private toBonusNumber(value: unknown): number {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  }

  // ========================================
  // PROGRESSO
  // ========================================

  getProgress(): SubclassProgress {
    return {
      unlocked: this.getUnlockedSubclasses(),
      selected: this.progress.selected ? { ...this.progress.selected } : null,
    };
  }

  loadProgress(progress: SubclassProgress): void {
    const unlocked: SubclassProgressEntry[] = [];
    for (const entry of progress.unlocked ?? []) {
      if (
        entry &&
        typeof entry.classId === "string" &&
        typeof entry.subclassId === "string" &&
        this.getSubclass(entry.classId, entry.subclassId, true) &&
        !unlocked.some(
          (saved) => saved.classId === entry.classId && saved.subclassId === entry.subclassId
        )
      ) {
        unlocked.push({ classId: entry.classId, subclassId: entry.subclassId });
      }
    }

    this.progress = {
      unlocked,
      selected: null,
    };

    const selected = progress.selected;
    if (
      selected &&
      this.isUnlocked(selected.classId, selected.subclassId) &&
      this.getSubclass(selected.classId, selected.subclassId, true)
    ) {
      this.progress.selected = { ...selected };
    }
  }
}
