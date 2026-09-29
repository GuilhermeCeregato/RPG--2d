export type ItemType =
  | "weapon"
  | "armor"
  | "potion"
  | "material"
  | "quest";

export interface ItemData {
  id: string;
  name: string;
  type: ItemType;
  description: string;
}

export class Item {
  public id: string;
  public name: string;
  public type: ItemType;
  public description: string;

  constructor(data: ItemData) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.description = data.description;
  }
}