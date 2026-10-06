import { Item, ItemData } from "./Item";

export type ArmorSlot =
  | "helmet"
  | "shoulder"
  | "chest"
  | "necklace"
  | "gloves"
  | "boots"
  | "accessory"
  | "ring"
  | "belt"
  | "amulet"
  | "relic";

export interface ArmorData extends ItemData {
  type: "armor";
  defense: number;
  slot: ArmorSlot;
}

export class Armor extends Item {
  public defense: number;
  public slot: ArmorSlot;

  constructor(data: ArmorData) {
    super(data);

    this.defense = data.defense;
    this.slot = data.slot;
  }
}