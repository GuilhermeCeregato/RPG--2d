// ========================================
// IDENTIFICAÇÃO DAS CLASSES
// ========================================

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

// ========================================
// PASSIVA
// ========================================

export interface CharacterPassive {
  id: string;
  name: string;
  description: string;
}

// ========================================
// HABILIDADE
// ========================================

export interface CharacterAbility {
  id: string;
  name: string;
  description: string;
}

// ========================================
// DADOS DA CLASSE
// ========================================

export interface CharacterClassData {
  id: CharacterClassId;

  name: string;

  description: string;

  // ========================================
  // ATRIBUTOS
  // ========================================

  strength: number;
  vitality: number;
  defense: number;
  agility: number;
  luck: number;
  intelligence: number;

  // ========================================
  // PASSIVAS
  // ========================================

  passives: CharacterPassive[];

  // ========================================
  // HABILIDADES
  // ========================================

  abilities: CharacterAbility[];

  // ========================================
  // CLASSE SECRETA
  // ========================================

  secret?: boolean;
}

// ========================================
// CLASSES
// ========================================

export const CHARACTER_CLASSES: CharacterClassData[] = [
  // ========================================
  // GUERREIRO
  // ========================================

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
    intelligence: 2,

    passives: [
      {
        id: "brute_force",
        name: "Força Bruta",
        description:
          "Aumenta o dano causado por ataques físicos.",
      },

      {
        id: "combat_stance",
        name: "Postura de Combate",
        description:
          "Reduz levemente o dano recebido enquanto estiver em combate.",
      },

      {
        id: "battle_veteran",
        name: "Veterano de Batalha",
        description:
          "Recebe menos penalidades durante combates prolongados.",
      },
    ],

    abilities: [
      {
        id: "heavy_strike",
        name: "Golpe Pesado",
        description:
          "Realiza um ataque poderoso que causa dano físico aumentado.",
      },

      {
        id: "guard_break",
        name: "Quebra-Guarda",
        description:
          "Ataque pesado capaz de enfraquecer a defesa do inimigo.",
      },
    ],
  },

  // ========================================
  // CAVALEIRO
  // ========================================

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
    intelligence: 3,

    passives: [
      {
        id: "wall",
        name: "Muralha",
        description:
          "Recebe uma redução adicional de dano enquanto estiver equipado com armadura.",
      },

      {
        id: "guardian",
        name: "Guardião",
        description:
          "Aumenta a resistência do personagem contra ataques físicos.",
      },

      {
        id: "fortress",
        name: "Fortaleza",
        description:
          "Quanto menor estiver a vida, maior será sua resistência.",
      },
    ],

    abilities: [
      {
        id: "taunt",
        name: "Provocar",
        description:
          "Provoca o inimigo, fazendo com que ele concentre sua atenção no Cavaleiro.",
      },

      {
        id: "knight_wall",
        name: "Muralha",
        description:
          "Assume uma postura defensiva e reduz drasticamente o dano recebido por um curto período.",
      },
    ],
  },

  // ========================================
  // BERSERKER
  // ========================================

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
    intelligence: 1,

    passives: [
      {
        id: "fury",
        name: "Fúria",
        description:
          "Quanto menor a vida, maior será o dano físico causado.",
      },

      {
        id: "blood_thirst",
        name: "Sede de Sangue",
        description:
          "Ataques contra inimigos feridos possuem maior chance de causar dano crítico.",
      },

      {
        id: "adrenaline",
        name: "Adrenalina",
        description:
          "Recebe um pequeno aumento de velocidade durante situações de perigo.",
      },
    ],

    abilities: [
      {
        id: "frenzy",
        name: "Frenesi",
        description:
          "Executa uma sequência rápida de ataques contra o inimigo.",
      },

      {
        id: "rupture",
        name: "Ruptura",
        description:
          "Golpe brutal que causa dano elevado e ignora parte da defesa inimiga.",
      },
    ],
  },

  // ========================================
  // PALADINO
  // ========================================

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
    intelligence: 5,

    passives: [
      {
        id: "holy_determination",
        name: "Determinação Sagrada",
        description:
          "Aumenta a resistência do Paladino contra efeitos negativos.",
      },

      {
        id: "protective_light",
        name: "Luz Protetora",
        description:
          "Recebe uma pequena redução de dano enquanto estiver com vida elevada.",
      },

      {
        id: "holy_oath",
        name: "Juramento Sagrado",
        description:
          "Aumenta a eficiência de habilidades de suporte e cura.",
      },
    ],

    abilities: [
      {
        id: "restorative_light",
        name: "Luz Restauradora",
        description:
          "Libera energia sagrada para restaurar parte da própria vida.",
      },

      {
        id: "judgment",
        name: "Julgamento",
        description:
          "Ataque sagrado que causa dano adicional contra inimigos enfraquecidos.",
      },
    ],
  },

  // ========================================
  // MAGO
  // ========================================

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
    intelligence: 10,

    passives: [
      {
        id: "concentration",
        name: "Concentração",
        description:
          "Aumenta a eficiência das habilidades mágicas.",
      },

      {
        id: "arcane_affinity",
        name: "Afinidade Arcana",
        description:
          "Aumenta o dano causado por ataques mágicos.",
      },

      {
        id: "expanded_mind",
        name: "Mente Expandida",
        description:
          "Aumenta a influência da Inteligência sobre habilidades mágicas.",
      },
    ],

    abilities: [
      {
        id: "arcane_projectile",
        name: "Projétil Arcano",
        description:
          "Dispara um projétil mágico contra o inimigo.",
      },

      {
        id: "elemental_blast",
        name: "Explosão Elemental",
        description:
          "Libera uma poderosa explosão mágica que causa dano em uma área.",
      },
    ],
  },

  // ========================================
  // FEITICEIRO
  // ========================================

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
    intelligence: 12,

    passives: [
      {
        id: "arcane_overload",
        name: "Sobrecarga Arcana",
        description:
          "Habilidades mágicas podem causar dano adicional, mas possuem maior risco de sobrecarga.",
      },

      {
        id: "mana_flow",
        name: "Fluxo de Mana",
        description:
          "Aumenta a eficiência no uso de habilidades mágicas.",
      },

      {
        id: "magic_instability",
        name: "Instabilidade Mágica",
        description:
          "Possui chance de aumentar significativamente o dano de uma habilidade mágica.",
      },
    ],

    abilities: [
      {
        id: "arcane_overload",
        name: "Sobrecarga Arcana",
        description:
          "Concentra energia mágica em um único ataque de altíssimo poder.",
      },

      {
        id: "arcane_storm",
        name: "Tempestade Arcana",
        description:
          "Cria uma tempestade de energia mágica que atinge uma área.",
      },
    ],
  },

  // ========================================
  // CLÉRIGO
  // ========================================

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
    intelligence: 8,

    passives: [
      {
        id: "blessing",
        name: "Bênção",
        description:
          "Aumenta a eficiência das habilidades de cura e suporte.",
      },

      {
        id: "unshakable_faith",
        name: "Fé Inabalável",
        description:
          "Reduz a duração de efeitos negativos recebidos.",
      },

      {
        id: "divine_light",
        name: "Luz Divina",
        description:
          "Aumenta a resistência contra inimigos e efeitos de natureza sombria.",
      },
    ],

    abilities: [
      {
        id: "holy_heal",
        name: "Cura Sagrada",
        description:
          "Restaura parte da vida do personagem.",
      },

      {
        id: "divine_blessing",
        name: "Bênção Divina",
        description:
          "Concede um aumento temporário de defesa e resistência.",
      },
    ],
  },

  // ========================================
  // NECROMANTE
  // ========================================

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
    intelligence: 11,

    passives: [
      {
        id: "death_pact",
        name: "Pacto da Morte",
        description:
          "Aumenta o poder das habilidades relacionadas à morte.",
      },

      {
        id: "dark_energy",
        name: "Energia Sombria",
        description:
          "Ataques mágicos podem causar dano adicional contra inimigos feridos.",
      },

      {
        id: "soul_harvest",
        name: "Colheita de Almas",
        description:
          "Derrotar inimigos pode fortalecer temporariamente o Necromante.",
      },
    ],

    abilities: [
      {
        id: "essence_drain",
        name: "Drenar Essência",
        description:
          "Drena a energia do inimigo e converte parte do dano em recuperação de vida.",
      },

      {
        id: "raise_dead",
        name: "Levantar Morto",
        description:
          "Invoca temporariamente uma criatura para lutar ao lado do Necromante.",
      },
    ],
  },

  // ========================================
  // ARQUEIRO
  // ========================================

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
    intelligence: 3,

    passives: [
      {
        id: "precision",
        name: "Precisão",
        description:
          "Aumenta a chance de acertar ataques à distância.",
      },

      {
        id: "steady_aim",
        name: "Mira Estável",
        description:
          "Aumenta o dano causado quando o Arqueiro permanece afastado do inimigo.",
      },

      {
        id: "eagle_eye",
        name: "Olho de Águia",
        description:
          "Aumenta a chance de ataques à distância causarem acertos críticos.",
      },
    ],

    abilities: [
      {
        id: "piercing_arrow",
        name: "Flecha Perfurante",
        description:
          "Dispara uma flecha capaz de atravessar parte da defesa inimiga.",
      },

      {
        id: "arrow_rain",
        name: "Chuva de Flechas",
        description:
          "Dispara várias flechas contra uma área.",
      },
    ],
  },

  // ========================================
  // CAÇADOR
  // ========================================

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
    intelligence: 5,

    passives: [
      {
        id: "tracker",
        name: "Rastreador",
        description:
          "Aumenta a eficiência contra inimigos que já foram encontrados ou marcados.",
      },

      {
        id: "predator",
        name: "Predador",
        description:
          "Causa mais dano contra inimigos que estejam com pouca vida.",
      },

      {
        id: "survival",
        name: "Sobrevivência",
        description:
          "Aumenta a capacidade de resistir a situações perigosas.",
      },
    ],

    abilities: [
      {
        id: "trap",
        name: "Armadilha",
        description:
          "Coloca uma armadilha no chão que prejudica o inimigo ao ser ativada.",
      },

      {
        id: "hunter_mark",
        name: "Marca do Caçador",
        description:
          "Marca um inimigo, aumentando o dano causado contra ele.",
      },
    ],
  },

  // ========================================
  // ATIRADOR
  // ========================================

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
    intelligence: 4,

    passives: [
      {
        id: "perfect_shot",
        name: "Tiro Perfeito",
        description:
          "Aumenta o dano de ataques à distância realizados com precisão.",
      },

      {
        id: "precision_aim",
        name: "Mira de Precisão",
        description:
          "Aumenta a chance de causar acertos críticos.",
      },

      {
        id: "weak_point",
        name: "Ponto Fraco",
        description:
          "Acertos críticos causam dano adicional.",
      },
    ],

    abilities: [
      {
        id: "precise_shot",
        name: "Tiro Preciso",
        description:
          "Realiza um disparo extremamente preciso com grande chance de crítico.",
      },

      {
        id: "deadly_shot",
        name: "Disparo Mortal",
        description:
          "Um disparo poderoso focado em causar dano crítico elevado.",
      },
    ],
  },

  // ========================================
  // RANGER
  // ========================================

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
    intelligence: 5,

    passives: [
      {
        id: "survivor",
        name: "Sobrevivente",
        description:
          "Aumenta a resistência do Ranger durante explorações e combates prolongados.",
      },

      {
        id: "explorer",
        name: "Explorador",
        description:
          "Aumenta a eficiência de movimentação e exploração.",
      },

      {
        id: "adaptation",
        name: "Adaptação",
        description:
          "Recebe pequenos bônus dependendo da situação de combate.",
      },
    ],

    abilities: [
      {
        id: "natural_arrow",
        name: "Flecha Natural",
        description:
          "Dispara uma flecha fortalecida por energia natural.",
      },

      {
        id: "explorer_step",
        name: "Passo do Explorador",
        description:
          "Realiza um movimento rápido para reposicionar o personagem.",
      },
    ],
  },

  // ========================================
  // LADINO
  // ========================================

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
    intelligence: 4,

    passives: [
      {
        id: "opportunist",
        name: "Oportunista",
        description:
          "Causa dano adicional contra inimigos distraídos ou enfraquecidos.",
      },

      {
        id: "light_steps",
        name: "Passos Leves",
        description:
          "Aumenta a chance de esquiva.",
      },

      {
        id: "quick_hands",
        name: "Mãos Rápidas",
        description:
          "Aumenta a velocidade de ações relacionadas a equipamentos e ataques rápidos.",
      },
    ],

    abilities: [
      {
        id: "backstab",
        name: "Golpe pelas Costas",
        description:
          "Ataque rápido que causa dano elevado quando usado contra um inimigo desprevenido.",
      },

      {
        id: "stealth",
        name: "Furtividade",
        description:
          "Reduz temporariamente a chance de ser detectado pelos inimigos.",
      },
    ],
  },

  // ========================================
  // ASSASSINO
  // ========================================

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
    intelligence: 3,

    passives: [
      {
        id: "execution",
        name: "Execução",
        description:
          "Causa dano adicional contra inimigos com pouca vida.",
      },

      {
        id: "deadly_strike",
        name: "Golpe Mortal",
        description:
          "Aumenta significativamente o dano causado por acertos críticos.",
      },

      {
        id: "dual_wield",
        name: "Dupla Empunhadura",
        description:
          "Permite equipar duas armas de uma mão simultaneamente, incluindo duas adagas.",
      },
    ],

    abilities: [
      {
        id: "shadow_step",
        name: "Passo Sombrio",
        description:
          "Move-se rapidamente até uma posição próxima, permitindo iniciar ataques de surpresa.",
      },

      {
        id: "assassin_execution",
        name: "Execução",
        description:
          "Ataque extremamente poderoso contra inimigos próximos da derrota.",
      },
    ],
  },

  // ========================================
  // MONGE
  // ========================================

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
    intelligence: 5,

    passives: [
      {
        id: "discipline",
        name: "Disciplina",
        description:
          "Aumenta a resistência do Monge contra efeitos que interrompem suas ações.",
      },

      {
        id: "trained_body",
        name: "Corpo Treinado",
        description:
          "Aumenta a eficiência de ataques físicos realizados sem depender de armas pesadas.",
      },

      {
        id: "combat_flow",
        name: "Fluxo de Combate",
        description:
          "Ataques consecutivos podem aumentar temporariamente a velocidade de combate.",
      },
    ],

    abilities: [
      {
        id: "flurry_of_blows",
        name: "Rajada de Golpes",
        description:
          "Executa vários golpes rápidos em sequência.",
      },

      {
        id: "inner_focus",
        name: "Foco Interior",
        description:
          "Concentra energia para aumentar temporariamente o desempenho do Monge.",
      },
    ],
  },

  // ========================================
  // DRUIDA
  // ========================================

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
    intelligence: 9,

    passives: [
      {
        id: "nature_affinity",
        name: "Sintonia Natural",
        description:
          "Aumenta a eficiência de habilidades relacionadas à natureza.",
      },

      {
        id: "beast_skin",
        name: "Pele de Fera",
        description:
          "Aumenta a resistência física do Druida.",
      },

      {
        id: "cycle_of_nature",
        name: "Ciclo da Natureza",
        description:
          "Aumenta a eficiência de cura e recuperação.",
      },
    ],

    abilities: [
      {
        id: "roots",
        name: "Raízes",
        description:
          "Invoca raízes que prendem o inimigo temporariamente.",
      },

      {
        id: "wild_form",
        name: "Forma Selvagem",
        description:
          "Transforma temporariamente o Druida, alterando suas características de combate.",
      },
    ],
  },

  // ========================================
  // CLASSE SECRETA
  // ========================================

  {
    id: "unknown",

    name: "???",

    description:
      "Uma classe misteriosa cuja verdadeira identidade de apostador vem à tona.",

    strength: 1,
    vitality: 1,
    defense: 1,
    agility: 1,
    luck: 101,
    intelligence: 2,

    passives: [
      {
        id: "lucky_bet",
        name: "Aposta da Sorte",
        description:
          "A Sorte possui efeitos muito mais fortes para esta classe.",
      },

      {
        id: "all_or_nothing",
        name: "Tudo ou Nada",
        description:
          "Algumas ações podem gerar resultados extremamente positivos ou negativos.",
      },

      {
        id: "jackpot",
        name: "Jackpot",
        description:
          "Possui uma pequena chance de transformar determinados resultados em um resultado extraordinário.",
      },
    ],

    abilities: [
      {
        id: "risky_bet",
        name: "Aposta Arriscada",
        description:
          "Realiza uma ação de resultado imprevisível, podendo gerar uma grande vantagem.",
      },

      {
        id: "jackpot_ability",
        name: "Jackpot",
        description:
          "Tenta ativar um resultado extremamente raro baseado na Sorte.",
      },
    ],

    secret: true,
  },
];