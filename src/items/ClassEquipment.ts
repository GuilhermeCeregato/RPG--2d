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

// ========================================
// CAVALEIRO
// ========================================

export function createKnightEquipment(): Armor {
  return new Armor({
    id: "knight_initial_chest",
    name: "Peitoral do Cavaleiro",
    type: "armor",
    description:
      "Um peitoral simples usado pelos cavaleiros iniciantes da Guilda.",
    rarity: "common",
    defense: 3,
    slot: "chest",

    attributes: [
      {
        name: "Vitalidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// BERSERKER
// ========================================

export function createBerserkerEquipment(): Armor {
  return new Armor({
    id: "berserker_mechanical_gauntlet",
    name: "Manopla Mecânica",
    type: "armor",
    description:
      "Uma pequena manopla mecânica feita para proteger o braço durante combates intensos.",
    rarity: "common",
    defense: 2,
    slot: "gloves",

    attributes: [
      {
        name: "Força",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// DUELISTA
// ========================================

export function createDuelistEquipment(): Armor {
  return new Armor({
    id: "duelist_card_belt",
    name: "Cinto de Cartas",
    type: "armor",
    description:
      "Um cinto simples utilizado para carregar cartas durante duelos.",
    rarity: "common",
    defense: 1,
    slot: "belt",

    attributes: [
      {
        name: "Agilidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// ESPADACHIM
// ========================================

export function createSwordsmanEquipment(): Armor {
  return new Armor({
    id: "swordsman_red_scarf",
    name: "Cachecol Vermelho",
    type: "armor",
    description:
      "Um cachecol vermelho usado por espadachins que valorizam velocidade e presença.",
    rarity: "common",
    defense: 1,
    slot: "accessory",

    attributes: [
      {
        name: "Agilidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// LUTADOR
// ========================================

export function createFighterEquipment(): Armor {
  return new Armor({
    id: "fighter_hand_wraps",
    name: "Faixas de Combate",
    type: "armor",
    description:
      "Faixas simples utilizadas para proteger as mãos durante o combate corpo a corpo.",
    rarity: "common",
    defense: 1,
    slot: "gloves",

    attributes: [
      {
        name: "Força",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// MONGE
// ========================================

export function createMonkEquipment(): Armor {
  return new Armor({
    id: "monk_body_wraps",
    name: "Faixas do Monge",
    type: "armor",
    description:
      "Faixas resistentes utilizadas para proteger diferentes partes do corpo durante o treinamento.",
    rarity: "common",
    defense: 2,
    slot: "chest",

    attributes: [
      {
        name: "Agilidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// ASSASSINO
// ========================================

export function createAssassinEquipment(): Armor {
  return new Armor({
    id: "assassin_hooded_coat",
    name: "Casaco do Assassino",
    type: "armor",
    description:
      "Um casaco escuro com capuz utilizado para esconder a identidade do assassino.",
    rarity: "common",
    defense: 2,
    slot: "chest",

    attributes: [
      {
        name: "Agilidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// LADINO
// ========================================

export function createRogueEquipment(): Armor {
  return new Armor({
    id: "rogue_simple_belt",
    name: "Cinto do Ladino",
    type: "armor",
    description:
      "Um cinto simples com espaço para pequenas ferramentas.",
    rarity: "common",
    defense: 1,
    slot: "belt",

    attributes: [
      {
        name: "Agilidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// ARQUEIRO
// ========================================

export function createArcherEquipment(): Armor {
  return new Armor({
    id: "archer_glove",
    name: "Luva do Arqueiro",
    type: "armor",
    description:
      "Uma luva reforçada para proteger a mão durante o uso do arco.",
    rarity: "common",
    defense: 1,
    slot: "gloves",

    attributes: [
      {
        name: "Agilidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// CAÇADOR
// ========================================

export function createHunterEquipment(): Armor {
  return new Armor({
    id: "hunter_outfit",
    name: "Traje de Caça",
    type: "armor",
    description:
      "Um traje simples e resistente utilizado por caçadores iniciantes.",
    rarity: "common",
    defense: 2,
    slot: "chest",

    attributes: [
      {
        name: "Vitalidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// ATIRADOR
// ========================================

export function createSharpshooterEquipment(): Armor {
  return new Armor({
    id: "sharpshooter_slingshot",
    name: "Equipamento do Atirador",
    type: "armor",
    description:
      "Um pequeno conjunto de equipamentos de cintura acompanhado de um estilingue.",
    rarity: "common",
    defense: 1,
    slot: "belt",

    attributes: [
      {
        name: "Agilidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// PATRULHEIRO
// ========================================

export function createRangerEquipment(): Armor {
  return new Armor({
    id: "ranger_cape",
    name: "Capa do Patrulheiro",
    type: "armor",
    description:
      "Uma capa curta utilizada por patrulheiros para proteção e mobilidade.",
    rarity: "common",
    defense: 2,
    slot: "chest",

    attributes: [
      {
        name: "Agilidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// MAGO
// ========================================

export function createMageEquipment(): Armor {
  return new Armor({
    id: "mage_arcane_pendant",
    name: "Pingente Arcano",
    type: "armor",
    description:
      "Um pequeno pingente utilizado por magos iniciantes para canalizar energia mágica.",
    rarity: "common",
    defense: 1,
    slot: "necklace",

    attributes: [
      {
        name: "Inteligência",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// FEITICEIRO
// ========================================

export function createSorcererEquipment(): Armor {
  return new Armor({
    id: "sorcerer_magic_ring",
    name: "Anel Mágico",
    type: "armor",
    description:
      "Um pequeno anel utilizado para auxiliar no controle de energia mágica.",
    rarity: "common",
    defense: 1,
    slot: "ring",

    attributes: [
      {
        name: "Inteligência",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// CLÉRIGO
// ========================================

export function createClericEquipment(): Armor {
  return new Armor({
    id: "cleric_sacred_necklace",
    name: "Colar Sagrado",
    type: "armor",
    description:
      "Um colar simples com um símbolo sagrado utilizado pelos clérigos.",
    rarity: "common",
    defense: 1,
    slot: "necklace",

    attributes: [
      {
        name: "Inteligência",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// NECROMANTE
// ========================================

export function createNecromancerEquipment(): Armor {
  return new Armor({
    id: "necromancer_shadow_mantle",
    name: "Manto das Sombras",
    type: "armor",
    description:
      "Um pequeno manto escuro que parece absorver parte da luz ao redor.",
    rarity: "common",
    defense: 2,
    slot: "chest",

    attributes: [
      {
        name: "Inteligência",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// DRUIDA
// ========================================

export function createDruidEquipment(): Armor {
  return new Armor({
    id: "druid_nature_pendant",
    name: "Pingente da Natureza",
    type: "armor",
    description:
      "Um pequeno pingente feito com materiais naturais.",
    rarity: "common",
    defense: 1,
    slot: "necklace",

    attributes: [
      {
        name: "Vitalidade",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// INVOCADOR
// ========================================

export function createSummonerEquipment(): Armor {
  return new Armor({
    id: "summoner_talisman",
    name: "Talismã do Invocador",
    type: "armor",
    description:
      "Um talismã utilizado para auxiliar na conexão com criaturas invocadas.",
    rarity: "common",
    defense: 1,
    slot: "amulet",

    attributes: [
      {
        name: "Inteligência",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// PALADINO
// ========================================

export function createPaladinEquipment(): Armor {
  return new Armor({
    id: "paladin_sacred_medal",
    name: "Medalha Sagrada",
    type: "armor",
    description:
      "Uma medalha entregue aos paladinos iniciantes como símbolo de seu juramento.",
    rarity: "common",
    defense: 2,
    slot: "accessory",

    attributes: [
      {
        name: "Defesa",
        value: 1,
      },
    ],

    passives: [],
  });
}

// ========================================
// CLASSE SECRETA
// ========================================

export function createGamblerEquipment(): Armor {
  return new Armor({
    id: "gambler_lucky_token",
    name: "Ficha da Sorte",
    type: "armor",
    description:
      "Uma ficha aparentemente comum que parece sempre voltar para o dono.",
    rarity: "rare",
    defense: 1,
    slot: "accessory",

    attributes: [
      {
        name: "Sorte",
        value: 2,
      },
    ],

    passives: [],
  });
}

// ========================================
// CRIADOR GERAL
// ========================================

export function createClassStarterEquipment(
  classId: string
): Armor | null {
  switch (classId) {
    case "warrior":
      return createWarriorEquipment();

    case "knight":
      return createKnightEquipment();

    case "berserker":
      return createBerserkerEquipment();

    case "duelist":
      return createDuelistEquipment();

    case "swordsman":
      return createSwordsmanEquipment();

    case "fighter":
      return createFighterEquipment();

    case "monk":
      return createMonkEquipment();

    case "assassin":
      return createAssassinEquipment();

    case "rogue":
      return createRogueEquipment();

    case "archer":
      return createArcherEquipment();

    case "hunter":
      return createHunterEquipment();

    case "sharpshooter":
      return createSharpshooterEquipment();

    case "ranger":
      return createRangerEquipment();

    case "mage":
      return createMageEquipment();

    case "sorcerer":
      return createSorcererEquipment();

    case "cleric":
      return createClericEquipment();

    case "necromancer":
      return createNecromancerEquipment();

    case "druid":
      return createDruidEquipment();

    case "summoner":
      return createSummonerEquipment();

    case "paladin":
      return createPaladinEquipment();

    case "gambler":
    case "apostador":
      return createGamblerEquipment();

    default:
      return null;
  }
}