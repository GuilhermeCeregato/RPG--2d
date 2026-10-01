import { Item, ItemData } from "./Item";

export interface WeaponData extends ItemData {
  type: "weapon";
  attack: number;
}

export class Weapon extends Item {
  public attack: number;

  constructor(data: WeaponData) {
    super(data);

    this.attack = data.attack;
  }
}