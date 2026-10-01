export type ItemType =
  | "weapon"
  | "armor"
  | "potion"
  | "material"
  | "quest";

export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";

export interface ItemData {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  rarity?: ItemRarity;
}

export class Item {
  public id: string;
  public name: string;
  public type: ItemType;
  public description: string;
  public rarity: ItemRarity;

  constructor(data: ItemData) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.description = data.description;
    this.rarity = data.rarity ?? "common";
  }
}