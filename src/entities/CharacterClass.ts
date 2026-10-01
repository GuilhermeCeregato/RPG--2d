export type CharacterClassId =
  | "warrior"
  | "knight"
  | "berserker"
  | "paladin"
  | "mage"
  | "sorcerer"
  | "cleric"
  | "necromancer"
  | "archer"
  | "hunter"
  | "sharpshooter"
  | "ranger"
  | "rogue"
  | "assassin"
  | "monk"
  | "druid"
  | "unknown";

export interface CharacterClassData {
  id: CharacterClassId;
  name: string;
  description: string;

  strength: number;
  vitality: number;
  defense: number;
  agility: number;
  luck: number;

  secret?: boolean;
}

export const CHARACTER_CLASSES: CharacterClassData[] = [

  // =========================
  // GUERREIRO
  // =========================

  {
    id: "warrior",
    name: "Guerreiro",
    description:
      "Especialista em combate corpo a corpo, equilibrando ataque e resistência.",

    strength: 6,
    vitality: 6,
    defense: 5,
    agility: 2,
    luck: 1,
  },

  // =========================
  // CAVALEIRO
  // =========================

  {
    id: "knight",
    name: "Cavaleiro",
    description:
      "Combatente defensivo especializado em proteção, armaduras e escudos.",

    strength: 3,
    vitality: 8,
    defense: 9,
    agility: 1,
    luck: 1,
  },

  // =========================
  // BERSERKER
  // =========================

  {
    id: "berserker",
    name: "Berserker",
    description:
      "Guerreiro agressivo que sacrifica defesa em troca de maior poder ofensivo.",

    strength: 10,
    vitality: 5,
    defense: 1,
    agility: 4,
    luck: 1,
  },

  // =========================
  // PALADINO
  // =========================

  {
    id: "paladin",
    name: "Paladino",
    description:
      "Guerreiro sagrado capaz de combinar combate, defesa e poderes de suporte.",

    strength: 5,
    vitality: 7,
    defense: 7,
    agility: 1,
    luck: 2,
  },

  // =========================
  // MAGO
  // =========================

  {
    id: "mage",
    name: "Mago",
    description:
      "Especialista em magia ofensiva e manipulação de diferentes forças mágicas.",

    strength: 1,
    vitality: 2,
    defense: 2,
    agility: 3,
    luck: 7,
  },

  // =========================
  // FEITICEIRO
  // =========================

  {
    id: "sorcerer",
    name: "Feiticeiro",
    description:
      "Usuário de magia poderosa que concentra seu potencial em habilidades mágicas.",

    strength: 1,
    vitality: 2,
    defense: 1,
    agility: 4,
    luck: 8,
  },

  // =========================
  // CLÉRIGO
  // =========================

  {
    id: "cleric",
    name: "Clérigo",
    description:
      "Usuário de poderes sagrados focado em cura, proteção e suporte.",

    strength: 2,
    vitality: 7,
    defense: 5,
    agility: 1,
    luck: 5,
  },

  // =========================
  // NECROMANTE
  // =========================

  {
    id: "necromancer",
    name: "Necromante",
    description:
      "Mago das artes sombrias capaz de manipular energia da morte e invocações.",

    strength: 2,
    vitality: 3,
    defense: 2,
    agility: 2,
    luck: 10,
  },

  // =========================
  // ARQUEIRO
  // =========================

  {
    id: "archer",
    name: "Arqueiro",
    description:
      "Combatente à distância especializado em precisão e ataques com arco.",

    strength: 4,
    vitality: 2,
    defense: 2,
    agility: 8,
    luck: 3,
  },

  // =========================
  // CAÇADOR
  // =========================

  {
    id: "hunter",
    name: "Caçador",
    description:
      "Especialista em rastreamento, sobrevivência, armadilhas e combate à distância.",

    strength: 4,
    vitality: 5,
    defense: 2,
    agility: 7,
    luck: 5,
  },

  // =========================
  // ATIRADOR
  // =========================

  {
    id: "sharpshooter",
    name: "Atirador",
    description:
      "Especialista em ataques precisos de longa distância e golpes críticos.",

    strength: 6,
    vitality: 2,
    defense: 1,
    agility: 7,
    luck: 5,
  },

  // =========================
  // RANGER
  // =========================

  {
    id: "ranger",
    name: "Ranger",
    description:
      "Combatente versátil que combina mobilidade, arco e sobrevivência.",

    strength: 4,
    vitality: 5,
    defense: 3,
    agility: 8,
    luck: 3,
  },

  // =========================
  // LADINO
  // =========================

  {
    id: "rogue",
    name: "Ladino",
    description:
      "Combatente ágil especializado em velocidade, esquiva e ataques oportunistas.",

    strength: 4,
    vitality: 2,
    defense: 1,
    agility: 10,
    luck: 7,
  },

  // =========================
  // ASSASSINO
  // =========================

  {
    id: "assassin",
    name: "Assassino",
    description:
      "Especialista em furtividade e ataques rápidos capazes de causar grande dano.",

    strength: 9,
    vitality: 1,
    defense: 1,
    agility: 11,
    luck: 3,
  },

  // =========================
  // MONGE
  // =========================

  {
    id: "monk",
    name: "Monge",
    description:
      "Combatente que domina técnicas de luta corporal, velocidade e disciplina.",

    strength: 6,
    vitality: 5,
    defense: 4,
    agility: 9,
    luck: 1,
  },

  // =========================
  // DRUIDA
  // =========================

  {
    id: "druid",
    name: "Druida",
    description:
      "Usuário de poderes da natureza capaz de utilizar magia, suporte e transformação.",

    strength: 2,
    vitality: 7,
    defense: 4,
    agility: 3,
    luck: 8,
  },

  // =========================
  // CLASSE SECRETA
  // =========================

  {
    id: "unknown",
    name: "???",
    description:
      "Uma classe misteriosa cuja verdadeira identidade de apostador vem a tona.",

    strength: 1,
    vitality: 1,
    defense: 1,
    agility: 1,
    luck: 101,

    secret: true,
  },
];