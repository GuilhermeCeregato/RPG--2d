import { Item, ItemData } from "./Item";

export interface PotionData extends ItemData {
  type: "potion";
  healAmount: number;
}

export class Potion extends Item {
  public healAmount: number;

  constructor(data: PotionData) {
    super(data);

    this.healAmount = data.healAmount;
  }
}