export class ExperienceSystem {
  private level = 1;
  private experience = 0;
  private experienceToNextLevel = 100;

  private onExperienceChange?: (
    experience: number,
    experienceToNextLevel: number,
    level: number
  ) => void;

  private onLevelUp?: (
    level: number
  ) => void;

  constructor(
    onExperienceChange?: (
      experience: number,
      experienceToNextLevel: number,
      level: number
    ) => void,
    onLevelUp?: (
      level: number
    ) => void
  ) {
    this.onExperienceChange =
      onExperienceChange;

    this.onLevelUp =
      onLevelUp;
  }

  // =========================
  // ADICIONAR XP
  // =========================

  addExperience(
    amount: number
  ): void {
    if (amount <= 0) {
      return;
    }

    this.experience += amount;

    console.log(
      `+${amount} XP | XP: ${this.experience}/${this.experienceToNextLevel}`
    );

    this.notifyExperienceChange();

    // =========================
    // VERIFICAR LEVEL UP
    // =========================

    while (
      this.experience >=
      this.experienceToNextLevel
    ) {
      this.experience -=
        this.experienceToNextLevel;

      this.level++;

      console.log(
        `LEVEL UP! Agora você está no nível ${this.level}`
      );

      if (this.onLevelUp) {
        this.onLevelUp(
          this.level
        );
      }

      this.notifyExperienceChange();
    }
  }

  // =========================
  // AVISAR MUDANÇA DE XP
  // =========================

  private notifyExperienceChange(): void {
    if (
      this.onExperienceChange
    ) {
      this.onExperienceChange(
        this.experience,
        this.experienceToNextLevel,
        this.level
      );
    }
  }

  // =========================
  // GETTERS
  // =========================

  getLevel(): number {
    return this.level;
  }

  getExperience(): number {
    return this.experience;
  }

  getExperienceToNextLevel(): number {
    return this.experienceToNextLevel;
  }
}