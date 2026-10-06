import { Armor } from "./Armor";

export function createWarriorEquipment(): Armor {
  return new Armor({
    id: "warrior_training_shoulder",
    name: "Ombreira do Guerreiro",
    type: "armor",
    description:
      "Uma ombreira simples entregue aos guerreiros iniciantes da Guilda.",
    rarity: "common",
    defense: 2,
    slot: "shoulder",

    attributes: [
      {
        name: "Força",
        value: 1,
      },
    ],

    passives: [],
  });
}