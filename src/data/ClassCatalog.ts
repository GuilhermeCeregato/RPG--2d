// ========================================
// CATÁLOGO DE CLASSES
// ========================================

export interface ClassReference {
  franchise: string;
  characters: string[];
}

export interface ClassSubclass {
  id: string;
  name: string;
  references: ClassReference[];
}

export interface ClassCatalogEntry {
  id: string;
  name: string;
  description: string;
  subclasses: ClassSubclass[];
}

// ========================================
// CLASSES PÚBLICAS
// ========================================

export const PUBLIC_CLASS_CATALOG: ClassCatalogEntry[] = [
  // ======================================
  // WARRIOR
  // ======================================

  {
    id: "warrior",
    name: "Warrior",
    description:
      "Uma classe versátil focada em combate direto, força física e domínio das armas.",
    subclasses: [
      {
        id: "warrior_samurai",
        name: "Samurai",
        references: [
          {
            franchise: "Demon Slayer",
            characters: [
              "Yoriichi",
              "Giyu",
              "Rengoku",
              "Muichiro",
            ],
          },
          {
            franchise: "Ghost of Tsushima",
            characters: ["Jin Sakai"],
          },
          {
            franchise: "Sekiro",
            characters: ["Wolf"],
          },
        ],
      },
      {
        id: "warrior_lancer",
        name: "Lancer",
        references: [
          {
            franchise: "Fate",
            characters: ["Cú Chulainn", "Diarmuid"],
          },
          {
            franchise: "Record of Ragnarok",
            characters: ["Lu Bu"],
          },
        ],
      },
      {
        id: "warrior_pugilist",
        name: "Pugilist",
        references: [
          {
            franchise: "Dragon Ball",
            characters: ["Goku"],
          },
          {
            franchise: "Jujutsu Kaisen",
            characters: ["Yuji"],
          },
          {
            franchise: "Baki",
            characters: ["Baki"],
          },
        ],
      },
    ],
  },

  // ======================================
  // KNIGHT
  // ======================================

  {
    id: "knight",
    name: "Knight",
    description:
      "Combatentes defensivos especializados em armaduras, proteção e combate disciplinado.",
    subclasses: [
      {
        id: "knight_royal_knight",
        name: "Royal Knight",
        references: [
          {
            franchise: "Re:Zero",
            characters: ["Reinhard"],
          },
          {
            franchise: "Fate",
            characters: ["Artoria"],
          },
        ],
      },
      {
        id: "knight_holy_knight",
        name: "Holy Knight",
        references: [
          {
            franchise: "Fate",
            characters: [
              "Jeanne",
              "Siegfried",
              "Lancelot",
            ],
          },
          {
            franchise: "Nanatsu no Taizai",
            characters: [
              "Gilthunder",
              "Howzer",
              "Griamore",
            ],
          },
        ],
      },
    ],
  },

  // ======================================
  // BERSERKER
  // ======================================

  {
    id: "berserker",
    name: "Berserker",
    description:
      "Guerreiros agressivos que transformam força bruta e ferocidade em poder de combate.",
    subclasses: [
      {
        id: "berserker_butcher",
        name: "Butcher",
        references: [
          {
            franchise: "Berserk",
            characters: ["Guts"],
          },
          {
            franchise: "God of War",
            characters: ["Kratos"],
          },
          {
            franchise: "DOOM",
            characters: ["Doom Slayer"],
          },
        ],
      },
      {
        id: "berserker_frenzied",
        name: "Frenzied",
        references: [
          {
            franchise: "Bleach",
            characters: ["Kenpachi"],
          },
          {
            franchise: "Demon Slayer",
            characters: ["Inosuke"],
          },
        ],
      },
      {
        id: "berserker_devastator",
        name: "Devastator",
        references: [
          {
            franchise: "Dragon Ball",
            characters: ["Broly"],
          },
          {
            franchise: "Nanatsu no Taizai",
            characters: ["Escanor"],
          },
          {
            franchise: "My Hero Academia",
            characters: ["Shigaraki"],
          },
        ],
      },
    ],
  },

  // ======================================
  // DUELIST
  // ======================================

  {
    id: "duelist",
    name: "Duelist",
    description:
      "Especialistas em confrontos individuais, técnica, leitura do adversário e precisão.",
    subclasses: [
      {
        id: "duelist_strategic",
        name: "Strategic Duelist",
        references: [
          {
            franchise: "Naruto",
            characters: ["Shikamaru"],
          },
          {
            franchise: "Yu-Gi-Oh!",
            characters: ["Seto Kaiba"],
          },
        ],
      },
      {
        id: "duelist_blade",
        name: "Blade Duelist",
        references: [
          {
            franchise: "Devil May Cry",
            characters: ["Vergil"],
          },
          {
            franchise: "Naruto",
            characters: ["Sasuke"],
          },
          {
            franchise: "One Piece",
            characters: ["Trafalgar Law"],
          },
        ],
      },
      {
        id: "duelist_combat",
        name: "Combat Duelist",
        references: [
          {
            franchise: "Tekken",
            characters: ["Jin Kazama"],
          },
          {
            franchise: "Street Fighter",
            characters: ["Akuma"],
          },
        ],
      },
    ],
  },

  // ======================================
  // SWORDSMAN
  // ======================================

  {
    id: "swordsman",
    name: "Swordsman",
    description:
      "Especialistas no domínio da espada, técnica de corte e diferentes estilos de lâmina.",
    subclasses: [
      {
        id: "swordsman_blade_master",
        name: "Blade Master",
        references: [
          {
            franchise: "One Piece",
            characters: ["Zoro", "Mihawk"],
          },
          {
            franchise: "Black Clover",
            characters: ["Yami"],
          },
        ],
      },
      {
        id: "swordsman_wandering",
        name: "Wandering Swordsman",
        references: [
          {
            franchise: "Vinland Saga",
            characters: ["Thorfinn"],
          },
          {
            franchise: "Afro Samurai",
            characters: ["Afro"],
          },
          {
            franchise: "Rurouni Kenshin",
            characters: ["Kenshin"],
          },
        ],
      },
      {
        id: "swordsman_dual_blade",
        name: "Dual Blade Master",
        references: [
          {
            franchise: "Sword Art Online",
            characters: ["Kirito"],
          },
          {
            franchise: "Record of Ragnarok",
            characters: ["Miyamoto Musashi"],
          },
          {
            franchise: "One Piece",
            characters: ["Killer"],
          },
        ],
      },
    ],
  },

  // ======================================
  // FIGHTER
  // ======================================

  {
    id: "fighter",
    name: "Fighter",
    description:
      "Combatentes físicos especializados em artes marciais e combate corporal.",
    subclasses: [
      {
        id: "fighter_boxer",
        name: "Boxer",
        references: [
          {
            franchise: "Hajime no Ippo",
            characters: ["Ippo"],
          },
          {
            franchise: "Ashita no Joe",
            characters: ["Joe Yabuki"],
          },
          {
            franchise: "Punch-Out!!",
            characters: ["Little Mac"],
          },
        ],
      },
      {
        id: "fighter_karateka",
        name: "Karateka",
        references: [
          {
            franchise: "King of Fighters",
            characters: ["Ryo Sakazaki"],
          },
          {
            franchise: "Street Fighter",
            characters: ["Makoto"],
          },
          {
            franchise: "The Karate Kid",
            characters: ["Daniel LaRusso"],
          },
        ],
      },
      {
        id: "fighter_martial_artist",
        name: "Martial Artist",
        references: [
          {
            franchise: "One Punch Man",
            characters: ["Garou"],
          },
          {
            franchise: "Fist of the North Star",
            characters: ["Kenshiro"],
          },
        ],
      },
    ],
  },

  // ======================================
  // MONK
  // ======================================

  {
    id: "monk",
    name: "Monk",
    description:
      "Guerreiros que desenvolvem o corpo, a disciplina e diferentes formas de energia espiritual.",
    subclasses: [
      {
        id: "monk_martial_master",
        name: "Martial Master",
        references: [
          {
            franchise: "Dragon Ball",
            characters: ["Master Roshi"],
          },
          {
            franchise: "Naruto",
            characters: ["Might Guy"],
          },
        ],
      },
      {
        id: "monk_spirit_fist",
        name: "Spirit Fist",
        references: [
          {
            franchise: "The God of High School",
            characters: ["Jin Mori"],
          },
          {
            franchise: "Yu Yu Hakusho",
            characters: ["Yusuke"],
          },
        ],
      },
      {
        id: "monk_ascendant",
        name: "Ascendant",
        references: [
          {
            franchise: "Journey to the West",
            characters: ["Sun Wukong"],
          },
          {
            franchise: "Avatar",
            characters: ["Aang"],
          },
        ],
      },
    ],
  },

  // ======================================
  // ASSASSIN
  // ======================================

  {
    id: "assassin",
    name: "Assassin",
    description:
      "Especialistas em ataques rápidos, furtividade, execução e eliminação precisa.",
    subclasses: [
      {
        id: "assassin_executioner",
        name: "Executioner",
        references: [
          {
            franchise: "Jujutsu Kaisen",
            characters: ["Toji"],
          },
          {
            franchise: "Attack on Titan",
            characters: ["Levi"],
          },
          {
            franchise: "Assassin's Creed",
            characters: ["Ezio"],
          },
        ],
      },
      {
        id: "assassin_shadow",
        name: "Shadow",
        references: [
          {
            franchise: "Naruto",
            characters: ["Itachi"],
          },
          {
            franchise: "Hunter × Hunter",
            characters: ["Killua"],
          },
          {
            franchise: "Sonic",
            characters: ["Shadow"],
          },
        ],
      },
      {
        id: "assassin_venefic",
        name: "Venefic",
        references: [
          {
            franchise: "Original",
            characters: ["Hikaru Geto"],
          },
          {
            franchise: "Demon Slayer",
            characters: ["Shinobu Kocho"],
          },
          {
            franchise: "Naruto",
            characters: ["Sasori"],
          },
        ],
      },
    ],
  },

  // ======================================
  // ROGUE
  // ======================================

  {
    id: "rogue",
    name: "Rogue",
    description:
      "Especialistas em mobilidade, furtividade, truques e oportunidades.",
    subclasses: [
      {
        id: "rogue_thief",
        name: "Thief",
        references: [
          {
            franchise: "One Piece",
            characters: ["Nami"],
          },
          {
            franchise: "Dragon Quest",
            characters: ["Erik"],
          },
          {
            franchise: "Sly Cooper",
            characters: ["Sly Cooper"],
          },
          {
            franchise: "Lupin III",
            characters: ["Lupin"],
          },
        ],
      },
      {
        id: "rogue_trickster",
        name: "Trickster",
        references: [
          {
            franchise: "JoJo's Bizarre Adventure",
            characters: ["Joseph Joestar"],
          },
          {
            franchise: "Persona",
            characters: ["Joker"],
          },
        ],
      },
    ],
  },

  // ======================================
  // ARCHER
  // ======================================

  {
    id: "archer",
    name: "Archer",
    description:
      "Combatentes especializados em ataques à distância utilizando arcos e técnicas de precisão.",
    subclasses: [
      {
        id: "archer_elite",
        name: "Elite Archer",
        references: [
          {
            franchise: "Bleach",
            characters: ["Uryu"],
          },
          {
            franchise: "Fate",
            characters: ["Archer / EMIYA"],
          },
        ],
      },
      {
        id: "archer_elemental",
        name: "Elemental Archer",
        references: [
          {
            franchise: "Inuyasha",
            characters: ["Kikyo"],
          },
        ],
      },
      {
        id: "archer_combat",
        name: "Combat Archer",
        references: [
          {
            franchise: "One Piece",
            characters: ["Usopp"],
          },
          {
            franchise: "My Hero Academia",
            characters: ["Snipe"],
          },
        ],
      },
    ],
  },

  // ======================================
  // HUNTER
  // ======================================

  {
    id: "hunter",
    name: "Hunter",
    description:
      "Especialistas em rastreamento, sobrevivência e caça de criaturas.",
    subclasses: [
      {
        id: "hunter_tracker",
        name: "Tracker",
        references: [
          {
            franchise: "Hunter × Hunter",
            characters: ["Gon"],
          },
          {
            franchise: "Dr. Stone",
            characters: ["Kohaku"],
          },
        ],
      },
      {
        id: "hunter_wild",
        name: "Wild Hunter",
        references: [],
      },
    ],
  },

  // ======================================
  // MARKSMAN
  // ======================================

  {
    id: "marksman",
    name: "Marksman",
    description:
      "Especialistas em armas de fogo, pontaria e ataques de longa distância.",
    subclasses: [
      {
        id: "marksman_sharpshooter",
        name: "Sharpshooter",
        references: [
          {
            franchise: "Trigun",
            characters: ["Vash"],
          },
          {
            franchise: "Lupin III",
            characters: ["Jigen"],
          },
          {
            franchise: "Marvel",
            characters: ["Hawkeye"],
          },
        ],
      },
      {
        id: "marksman_gunslinger",
        name: "Gunslinger",
        references: [
          {
            franchise: "Black Lagoon",
            characters: ["Revy"],
          },
          {
            franchise: "Cowboy Bebop",
            characters: ["Spike"],
          },
        ],
      },
    ],
  },

  // ======================================
  // RANGER
  // ======================================

  {
    id: "ranger",
    name: "Ranger",
    description:
      "Exploradores especializados em reconhecimento, sobrevivência e proteção de territórios.",
    subclasses: [
      {
        id: "ranger_scout",
        name: "Scout",
        references: [
          {
            franchise: "Naruto",
            characters: ["Kakashi"],
          },
          {
            franchise: "Attack on Titan",
            characters: ["Armin"],
          },
        ],
      },
      {
        id: "ranger_border_guardian",
        name: "Border Guardian",
        references: [
          {
            franchise: "The Legend of Zelda",
            characters: ["Link"],
          },
          {
            franchise: "Princess Mononoke",
            characters: ["Ashitaka"],
          },
        ],
      },
    ],
  },

  // ======================================
  // MAGE
  // ======================================

  {
    id: "mage",
    name: "Mage",
    description:
      "Usuários de magia que manipulam elementos, energia e diferentes formas de feitiçaria.",
    subclasses: [
      {
        id: "mage_elementalist",
        name: "Elementalist",
        references: [
          {
            franchise: "Fullmetal Alchemist",
            characters: ["Roy Mustang"],
          },
          {
            franchise: "Fairy Tail",
            characters: ["Natsu"],
          },
          {
            franchise: "My Hero Academia",
            characters: ["Todoroki"],
          },
          {
            franchise: "Mushoku Tensei",
            characters: ["Rudeus Greyrat"],
          },
        ],
      },
      {
        id: "mage_arcanist",
        name: "Arcanist",
        references: [
          {
            franchise: "Frieren",
            characters: ["Frieren"],
          },
          {
            franchise: "Fate",
            characters: ["Merlin"],
          },
        ],
      },
      {
        id: "mage_battle_mage",
        name: "Battle Mage",
        references: [
          {
            franchise: "Black Clover",
            characters: ["Yuno"],
          },
        ],
      },
    ],
  },

  // ======================================
  // SORCERER
  // ======================================

  {
    id: "sorcerer",
    name: "Sorcerer",
    description:
      "Conjuradores especializados em poderes sobrenaturais e magia de alto nível.",
    subclasses: [
      {
        id: "sorcerer_arcane",
        name: "Arcane Sorcerer",
        references: [
          {
            franchise: "Jujutsu Kaisen",
            characters: ["Gojo"],
          },
          {
            franchise: "That Time I Got Reincarnated as a Slime",
            characters: ["Rimuru"],
          },
        ],
      },
      {
        id: "sorcerer_cursed",
        name: "Cursed Sorcerer",
        references: [
          {
            franchise: "Jujutsu Kaisen",
            characters: ["Sukuna", "Mahito"],
          },
        ],
      },
      {
        id: "sorcerer_chaotic",
        name: "Chaotic Sorcerer",
        references: [
          {
            franchise: "Hunter × Hunter",
            characters: ["Hisoka"],
          },
          {
            franchise: "KonoSuba",
            characters: ["Megumin"],
          },
        ],
      },
    ],
  },

  // ======================================
  // CLERIC
  // ======================================

  {
    id: "cleric",
    name: "Cleric",
    description:
      "Usuários de poderes sagrados focados em cura, proteção e energia espiritual.",
    subclasses: [
      {
        id: "cleric_priest",
        name: "Priest",
        references: [
          {
            franchise: "Nanatsu no Taizai",
            characters: ["Elizabeth"],
          },
          {
            franchise: "Bleach",
            characters: ["Orihime"],
          },
        ],
      },
      {
        id: "cleric_exorcist",
        name: "Exorcist",
        references: [
          {
            franchise: "Blue Exorcist",
            characters: ["Rin"],
          },
          {
            franchise: "D.Gray-man",
            characters: ["Allen Walker"],
          },
          {
            franchise: "Jujutsu Kaisen",
            characters: ["Yuta"],
          },
        ],
      },
      {
        id: "cleric_oracle",
        name: "Oracle",
        references: [
          {
            franchise: "Saint Seiya",
            characters: ["Saori Kido"],
          },
        ],
      },
    ],
  },

  // ======================================
  // NECROMANCER
  // ======================================

  {
    id: "necromancer",
    name: "Necromancer",
    description:
      "Usuários de poderes relacionados à morte, espíritos e exércitos sobrenaturais.",
    subclasses: [
      {
        id: "necromancer_shadow_lord",
        name: "Shadow Lord",
        references: [
          {
            franchise: "Solo Leveling",
            characters: ["Sung Jin-Woo"],
          },
        ],
      },
      {
        id: "necromancer_dead_summoner",
        name: "Dead Summoner",
        references: [
          {
            franchise: "Overlord",
            characters: ["Ainz"],
          },
          {
            franchise: "Naruto",
            characters: ["Orochimaru"],
          },
        ],
      },
      {
        id: "necromancer_master_dead",
        name: "Master of the Dead",
        references: [
          {
            franchise: "One Piece",
            characters: ["Brook"],
          },
        ],
      },
    ],
  },

  // ======================================
  // DRUID
  // ======================================

  {
    id: "druid",
    name: "Druid",
    description:
      "Usuários ligados à natureza, animais e forças naturais.",
    subclasses: [
      {
        id: "druid_nature_warden",
        name: "Nature Warden",
        references: [
          {
            franchise: "Naruto",
            characters: ["Hashirama"],
          },
          {
            franchise: "Pokémon",
            characters: ["Celebi"],
          },
        ],
      },
      {
        id: "druid_shapeshifter",
        name: "Shapeshifter",
        references: [
          {
            franchise: "Adventure Time",
            characters: ["Jake"],
          },
          {
            franchise: "DC",
            characters: ["Beast Boy"],
          },
        ],
      },
      {
        id: "druid_wildspeaker",
        name: "Wildspeaker",
        references: [
          {
            franchise: "Princess Mononoke",
            characters: ["San"],
          },
        ],
      },
    ],
  },

  // ======================================
  // SUMMONER
  // ======================================

  {
    id: "summoner",
    name: "Summoner",
    description:
      "Especialistas em invocar criaturas, espíritos e entidades para lutar ao seu lado.",
    subclasses: [
      {
        id: "summoner_beast_master",
        name: "Beast Master",
        references: [
          {
            franchise: "Pokémon",
            characters: ["Ash"],
          },
        ],
      },
      {
        id: "summoner_spirit_master",
        name: "Spirit Master",
        references: [
          {
            franchise: "Shaman King",
            characters: ["Yoh"],
          },
          {
            franchise: "Yu-Gi-Oh!",
            characters: ["Jaden"],
          },
        ],
      },
      {
        id: "summoner_shadow",
        name: "Shadow Summoner",
        references: [
          {
            franchise: "Jujutsu Kaisen",
            characters: ["Megumi"],
          },
        ],
      },
    ],
  },

  // ======================================
  // PALADIN
  // ======================================

  {
    id: "paladin",
    name: "Paladin",
    description:
      "Guerreiros sagrados que combinam combate, proteção e poder divino.",
    subclasses: [
      {
        id: "paladin_templar",
        name: "Templar",
        references: [
          {
            franchise: "ULTRAKILL",
            characters: ["Gabriel"],
          },
          {
            franchise: "Hellsing",
            characters: ["Alexander Anderson"],
          },
        ],
      },
      {
        id: "paladin_crusader",
        name: "Crusader",
        references: [
          {
            franchise: "Nanatsu no Taizai",
            characters: ["Mael"],
          },
          {
            franchise: "Fate",
            characters: ["Gawain"],
          },
        ],
      },
      {
        id: "paladin_holy_champion",
        name: "Holy Champion",
        references: [
          {
            franchise: "Saint Seiya",
            characters: ["Seiya"],
          },
        ],
      },
    ],
  },

  // ======================================
  // ALCHEMIST
  // ======================================

  {
    id: "alchemist",
    name: "Alchemist",
    description:
      "Especialistas em transformação de matéria, ciência aplicada e alquimia.",
    subclasses: [
      {
        id: "alchemist_combat",
        name: "Combat Alchemist",
        references: [
          {
            franchise: "Fullmetal Alchemist",
            characters: ["Edward"],
          },
        ],
      },
      {
        id: "alchemist_medical",
        name: "Medical Alchemist",
        references: [
          {
            franchise: "Naruto",
            characters: ["Tsunade", "Sakura"],
          },
        ],
      },
      {
        id: "alchemist_transmuter",
        name: "Transmuter",
        references: [
          {
            franchise: "Fullmetal Alchemist",
            characters: ["Alphonse", "May Chang"],
          },
        ],
      },
    ],
  },

  // ======================================
  // REAPER
  // ======================================

  {
    id: "reaper",
    name: "Reaper",
    description:
      "Guerreiros espirituais ligados à morte, almas e combate sobrenatural.",
    subclasses: [
      {
        id: "reaper_spirit",
        name: "Spirit Reaper",
        references: [
          {
            franchise: "Bleach",
            characters: [
              "Ichigo",
              "Renji",
              "Byakuya",
              "Toshiro",
            ],
          },
        ],
      },
      {
        id: "reaper_soul",
        name: "Soul Reaper",
        references: [
          {
            franchise: "Bleach",
            characters: [
              "Rukia",
              "Shunsui",
              "Ukitake",
              "Unohana",
            ],
          },
        ],
      },
      {
        id: "reaper_dark",
        name: "Dark Reaper",
        references: [
          {
            franchise: "Soul Eater",
            characters: ["Maka"],
          },
        ],
      },
    ],
  },

  // ======================================
  // NINJA
  // ======================================

  {
    id: "ninja",
    name: "Ninja",
    description:
      "Combatentes furtivos especializados em mobilidade, técnicas ninja e ataques surpresa.",
    subclasses: [
      {
        id: "ninja_combat",
        name: "Combat Ninja",
        references: [
          {
            franchise: "Naruto",
            characters: ["Naruto", "Killer B"],
          },
        ],
      },
      {
        id: "ninja_elemental",
        name: "Elemental Ninja",
        references: [
          {
            franchise: "Naruto",
            characters: ["Minato", "Darui"],
          },
        ],
      },
      {
        id: "ninja_shadow",
        name: "Shadow Ninja",
        references: [
          {
            franchise: "Naruto",
            characters: ["Shino", "Sai"],
          },
        ],
      },
    ],
  },

  // ======================================
  // MONSTER HUNTER
  // ======================================

  {
    id: "monster_hunter",
    name: "Monster Hunter",
    description:
      "Caçadores especializados em criaturas monstruosas e ameaças sobrenaturais.",
    subclasses: [
      {
        id: "monster_hunter_beast_slayer",
        name: "Beast Slayer",
        references: [
          {
            franchise: "The Witcher",
            characters: ["Geralt"],
          },
        ],
      },
      {
        id: "monster_hunter_abomination",
        name: "Abomination Hunter",
        references: [
          {
            franchise: "Castlevania",
            characters: ["Trevor Belmont"],
          },
        ],
      },
      {
        id: "monster_hunter_supernatural",
        name: "Supernatural Hunter",
        references: [
          {
            franchise: "Supernatural",
            characters: [
              "Sam Winchester",
              "Dean Winchester",
            ],
          },
        ],
      },
    ],
  },

  // ======================================
  // ILLUSIONIST
  // ======================================

  {
    id: "illusionist",
    name: "Illusionist",
    description:
      "Especialistas em enganar os sentidos, manipular percepções e confundir adversários.",
    subclasses: [
      {
        id: "illusionist_master",
        name: "Illusion Master",
        references: [
          {
            franchise: "Bleach",
            characters: ["Aizen"],
          },
        ],
      },
      {
        id: "illusionist_mind_trickster",
        name: "Mind Trickster",
        references: [
          {
            franchise: "Bleach",
            characters: ["Shinji Hirako"],
          },
        ],
      },
    ],
  },

  // ======================================
  // ARTILLERIST
  // ======================================

  {
    id: "artillerist",
    name: "Artillerist",
    description:
      "Especialistas em armas pesadas, explosivos e poder de fogo.",
    subclasses: [
      {
        id: "artillerist_demolitionist",
        name: "Demolitionist",
        references: [
          {
            franchise: "My Hero Academia",
            characters: ["Bakugo"],
          },
          {
            franchise: "Nanatsu no Taizai",
            characters: ["Guila"],
          },
        ],
      },
      {
        id: "artillerist_heavy_gunner",
        name: "Heavy Gunner",
        references: [
          {
            franchise: "One Piece",
            characters: ["Franky"],
          },
        ],
      },
      {
        id: "artillerist_war_gunner",
        name: "War Gunner",
        references: [
          {
            franchise: "Mega Man",
            characters: ["Mega Man"],
          },
          {
            franchise: "Dragon Ball",
            characters: ["Android 16"],
          },
        ],
      },
    ],
  },

  // ======================================
  // GUARDIAN
  // ======================================

  {
    id: "guardian",
    name: "Guardian",
    description:
      "Defensores especializados em proteger aliados e resistir a ataques.",
    subclasses: [
      {
        id: "guardian_protector",
        name: "Protector",
        references: [
          {
            franchise: "The Rising of the Shield Hero",
            characters: ["Naofumi"],
          },
          {
            franchise: "Marvel",
            characters: ["Captain America"],
          },
        ],
      },
      {
        id: "guardian_sentinel",
        name: "Sentinel",
        references: [
          {
            franchise: "My Hero Academia",
            characters: ["Mirio Togata"],
          },
          {
            franchise: "Naruto",
            characters: ["Neji"],
          },
        ],
      },
    ],
  },

  // ======================================
  // BASTION
  // ======================================

  {
    id: "bastion",
    name: "Bastion",
    description:
      "Defensores extremamente resistentes que transformam durabilidade em poder.",
    subclasses: [
      {
        id: "bastion_fortress",
        name: "Fortress",
        references: [
          {
            franchise: "Dragon Ball",
            characters: ["Jiren"],
          },
          {
            franchise: "Hunter × Hunter",
            characters: ["Uvogin"],
          },
        ],
      },
      {
        id: "bastion_colossus",
        name: "Colossus",
        references: [
          {
            franchise: "One Piece",
            characters: ["Whitebeard"],
          },
        ],
      },
      {
        id: "bastion_titan",
        name: "Titan",
        references: [
          {
            franchise: "My Hero Academia",
            characters: ["All Might"],
          },
        ],
      },
    ],
  },

  // ======================================
  // COMMANDER
  // ======================================

  {
    id: "commander",
    name: "Commander",
    description:
      "Líderes capazes de transformar estratégia, liderança e coordenação em vantagem de combate.",
    subclasses: [
      {
        id: "commander_strategist",
        name: "Strategist",
        references: [
          {
            franchise: "Code Geass",
            characters: ["Lelouch"],
          },
        ],
      },
      {
        id: "commander_general",
        name: "General",
        references: [
          {
            franchise: "Attack on Titan",
            characters: ["Erwin"],
          },
        ],
      },
      {
        id: "commander_leader",
        name: "Leader",
        references: [
          {
            franchise: "Gurren Lagann",
            characters: ["Kamina"],
          },
        ],
      },
    ],
  },

  // ======================================
  // BARBARIAN
  // ======================================

  {
    id: "barbarian",
    name: "Barbarian",
    description:
      "Guerreiros de força física extrema que dependem de resistência, instinto e brutalidade.",
    subclasses: [
      {
        id: "barbarian_tribal",
        name: "Tribal Warrior",
        references: [
          {
            franchise: "One Piece",
            characters: ["Kaido", "Yamato"],
          },
        ],
      },
      {
        id: "barbarian_brute",
        name: "Brute",
        references: [
          {
            franchise: "Fullmetal Alchemist",
            characters: ["Alex Louis Armstrong"],
          },
          {
            franchise: "Hunter × Hunter",
            characters: ["Phinks"],
          },
        ],
      },
      {
        id: "barbarian_primal",
        name: "Primal Warrior",
        references: [
          {
            franchise: "Vinland Saga",
            characters: ["Thorkell"],
          },
          {
            franchise: "One Piece",
            characters: ["Jack"],
          },
        ],
      },
    ],
  },

  // ======================================
  // ENGINEER
  // ======================================

  {
    id: "engineer",
    name: "Engineer",
    description:
      "Inventores e especialistas em tecnologia, mecanismos e criação de equipamentos.",
    subclasses: [
      {
        id: "engineer_inventor",
        name: "Inventor",
        references: [
          {
            franchise: "Dragon Ball",
            characters: ["Bulma"],
          },
          {
            franchise: "Dr. Stone",
            characters: ["Senku"],
          },
        ],
      },
      {
        id: "engineer_mechanic",
        name: "Mechanic",
        references: [
          {
            franchise: "Fullmetal Alchemist",
            characters: ["Winry"],
          },
          {
            franchise: "My Hero Academia",
            characters: ["Mei Hatsume"],
          },
        ],
      },
      {
        id: "engineer_weaponsmith",
        name: "Weaponsmith",
        references: [
          {
            franchise: "Sonic",
            characters: ["Dr. Eggman"],
          },
        ],
      },
    ],
  },

  // ======================================
  // PSYCHIC
  // ======================================

  {
    id: "psychic",
    name: "Psychic",
    description:
      "Usuários de poderes mentais capazes de manipular pensamentos, energia e percepção.",
    subclasses: [
      {
        id: "psychic_telekinetic",
        name: "Telekinetic",
        references: [
          {
            franchise: "One Punch Man",
            characters: ["Tatsumaki"],
          },
        ],
      },
      {
        id: "psychic_mentalist",
        name: "Mentalist",
        references: [
          {
            franchise: "Original",
            characters: ["Pedro Filetti"],
          },
          {
            franchise: "Saiki K.",
            characters: ["Saiki"],
          },
        ],
      },
      {
        id: "psychic_power",
        name: "Psychic Power",
        references: [
          {
            franchise: "Mob Psycho 100",
            characters: ["Mob"],
          },
          {
            franchise: "One Punch Man",
            characters: ["Psykos"],
          },
          {
            franchise: "Pokémon",
            characters: ["Mewtwo"],
          },
        ],
      },
    ],
  },
];

// ========================================
// CLASSES SECRETAS
// ========================================

export const SECRET_CLASS_CATALOG: ClassCatalogEntry[] = [
  {
    id: "gambler",
    name: "Gambler",
    description:
      "Uma classe secreta baseada em risco, sorte e recompensas imprevisíveis.",
    subclasses: [
      {
        id: "gambler_jackpot",
        name: "Jackpot",
        references: [
          {
            franchise: "Jujutsu Kaisen",
            characters: ["Kinji Hakari"],
          },
        ],
      },
    ],
  },

  {
    id: "returned",
    name: "Returned",
    description:
      "Uma classe secreta para aqueles que desafiam o destino após retornar de situações impossíveis.",
    subclasses: [
      {
        id: "returned_survivor",
        name: "Survivor",
        references: [
          {
            franchise: "Re:Zero",
            characters: ["Subaru Natsuki"],
          },
        ],
      },
    ],
  },

  {
    id: "demon_hunter",
    name: "Demon Hunter",
    description:
      "Uma classe secreta especializada em caçar e enfrentar demônios.",
    subclasses: [
      {
        id: "demon_hunter_slayer",
        name: "Demon Slayer",
        references: [
          {
            franchise: "Devil May Cry",
            characters: ["Dante"],
          },
        ],
      },
    ],
  },

  {
    id: "spiral",
    name: "Spiral",
    description:
      "Uma classe secreta ligada ao poder da evolução, determinação e energia espiral.",
    subclasses: [
      {
        id: "spiral_spiral",
        name: "Spiral",
        references: [
          {
            franchise: "Gurren Lagann",
            characters: ["Simon"],
          },
        ],
      },
    ],
  },

  {
    id: "chaos",
    name: "Chaos",
    description:
      "Uma classe secreta capaz de representar criação, alteração da realidade e o poder do Chaos.",
    subclasses: [
      {
        id: "chaos_chaos",
        name: "Chaos",
        references: [
          {
            franchise: "Nanatsu no Taizai",
            characters: ["Arthur Pendragon"],
          },
        ],
      },
    ],
  },
];