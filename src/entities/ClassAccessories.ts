import Phaser from "phaser";

type Graphics = Phaser.GameObjects.Graphics;

// ========================================
// MODELO DO PERSONAGEM (em "unidades")
// ========================================
//
// Tudo aqui é desenhado numa grade onde:
//
//   - o corpo é um quadrado de 100x100 (de -50 a +50)
//   - a cabeça é um círculo de raio 28 em (0, -80)
//
// O parâmetro "size" é a largura real do corpo em pixels.
// Assim o MESMO desenho serve para a prévia do registro
// (size = 120) e para o Player no jogo (size = 28).
//
// x, y = centro do corpo.

// ========================================
// CANETA
// ========================================

class Pen {
  constructor(
    private g: Graphics,
    private cx: number,
    private cy: number,
    private u: number
  ) {}

  private X(v: number): number {
    return this.cx + v * this.u;
  }

  private Y(v: number): number {
    return this.cy + v * this.u;
  }

  private S(v: number): number {
    return v * this.u;
  }

  private toPoints(points: number[][]): Phaser.Math.Vector2[] {
    return points.map(
      (p) => new Phaser.Math.Vector2(this.X(p[0]), this.Y(p[1]))
    );
  }

  fill(color: number, alpha = 1): this {
    this.g.fillStyle(color, alpha);
    return this;
  }

  stroke(width: number, color: number, alpha = 1): this {
    this.g.lineStyle(Math.max(1, this.S(width)), color, alpha);
    return this;
  }

  rect(x: number, y: number, w: number, h: number): this {
    this.g.fillRect(this.X(x), this.Y(y), this.S(w), this.S(h));
    return this;
  }

  roundRect(x: number, y: number, w: number, h: number, r: number): this {
    this.g.fillRoundedRect(
      this.X(x),
      this.Y(y),
      this.S(w),
      this.S(h),
      this.S(r)
    );

    return this;
  }

  strokeRoundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): this {
    this.g.strokeRoundedRect(
      this.X(x),
      this.Y(y),
      this.S(w),
      this.S(h),
      this.S(r)
    );

    return this;
  }

  circle(x: number, y: number, r: number): this {
    this.g.fillCircle(
      this.X(x),
      this.Y(y),
      this.S(r)
    );

    return this;
  }

  ring(x: number, y: number, r: number): this {
    this.g.strokeCircle(
      this.X(x),
      this.Y(y),
      this.S(r)
    );

    return this;
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): this {
    this.g.lineBetween(
      this.X(x1),
      this.Y(y1),
      this.X(x2),
      this.Y(y2)
    );

    return this;
  }

  triangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): this {
    this.g.fillTriangle(
      this.X(x1),
      this.Y(y1),
      this.X(x2),
      this.Y(y2),
      this.X(x3),
      this.Y(y3)
    );

    return this;
  }

  polygon(points: number[][]): this {
    this.g.fillPoints(
      this.toPoints(points),
      true
    );

    return this;
  }

  path(points: number[][]): this {
    this.g.strokePoints(
      this.toPoints(points),
      false
    );

    return this;
  }

  sector(
    x: number,
    y: number,
    r: number,
    startDeg: number,
    endDeg: number
  ): this {
    const steps = 14;
    const points: number[][] = [];

    for (let i = 0; i <= steps; i++) {
      const angle = Phaser.Math.DegToRad(
        startDeg +
          ((endDeg - startDeg) * i) /
            steps
      );

      points.push([
        x + Math.cos(angle) * r,
        y + Math.sin(angle) * r,
      ]);
    }

    return this.polygon(points);
  }
}

// ========================================
// CORPO E CABEÇA
// ========================================

export function drawCharacterBody(
  g: Graphics,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(
    g,
    x,
    y,
    size / 100
  );

  p.fill(0x3b82f6)
    .roundRect(
      -50,
      -50,
      100,
      100,
      25
    );

  p.stroke(
    3,
    0xffffff
  ).strokeRoundRect(
    -50,
    -50,
    100,
    100,
    25
  );
}

export function drawCharacterHead(
  g: Graphics,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(
    g,
    x,
    y,
    size / 100
  );

  p.fill(0xdddddd)
    .circle(
      0,
      -80,
      28
    );

  p.stroke(
    3,
    0xffffff
  ).ring(
    0,
    -80,
    28
  );
}

// ========================================
// ACESSÓRIOS DAS CLASSES
// ========================================
//
// Estes desenhos são usados apenas para
// os equipamentos iniciais das classes.
//
// As versões realmente fiéis às referências
// poderão existir futuramente como itens raros.

// ========================================
// EQUIPAMENTOS ATRÁS
// ========================================

export function drawEquipmentBack(
  g: Graphics,
  armorId: string,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(
    g,
    x,
    y,
    size / 100
  );

  switch (armorId) {
    // ====================================
    // CAVALEIRO
    // ====================================

    case "knight_initial_chest":
      // Pequena aba de tecido nas costas.
      p.fill(0x26384f)
        .roundRect(
          -42,
          -34,
          84,
          82,
          14
        );
      break;

    // ====================================
    // BERSERKER
    // ====================================

    case "berserker_mechanical_gauntlet":
      // Correia mecânica atrás do braço.
      p.fill(0x424242)
        .roundRect(
          -62,
          5,
          20,
          40,
          5
        );

      p.stroke(
        2,
        0x222222
      ).strokeRoundRect(
        -62,
        5,
        20,
        40,
        5
      );
      break;

    // ====================================
    // ASSASSINO
    // ====================================

    case "assassin_hooded_coat":
      p.fill(0x171717)
        .roundRect(
          -58,
          -48,
          116,
          112,
          20
        );

      p.fill(0x292929)
        .roundRect(
          -45,
          -48,
          90,
          20,
          8
        );
      break;

    // ====================================
    // CAÇADOR
    // ====================================

    case "hunter_outfit":
      p.fill(0x66513d)
        .roundRect(
          -56,
          -42,
          112,
          105,
          18
        );

      p.fill(0x47392b)
        .roundRect(
          -45,
          20,
          90,
          35,
          8
        );
      break;

    // ====================================
    // PATRULHEIRO
    // ====================================

    case "ranger_cape":
      p.fill(0x344b3a)
        .roundRect(
          -62,
          -45,
          124,
          112,
          20
        );

      p.fill(0x4d6650)
        .triangle(
          -48,
          48,
          0,
          78,
          48,
          48
        );
      break;

    // ====================================
    // NECROMANTE
    // ====================================

    case "necromancer_shadow_mantle":
      p.fill(0x29203d)
        .roundRect(
          -60,
          -48,
          120,
          118,
          24
        );

      p.fill(0x171321)
        .triangle(
          -58,
          38,
          0,
          78,
          58,
          38
        );
      break;
  }
}

// ========================================
// ACESSÓRIOS NA FRENTE
// ========================================

export function drawEquipmentFront(
  g: Graphics,
  armorId: string,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(
    g,
    x,
    y,
    size / 100
  );

  switch (armorId) {
    // ====================================
    // GUERREIRO
    // ====================================

    case "warrior_training_shoulder":
      p.fill(0x87919e)
        .roundRect(
          -16,
          -10,
          11,
          8,
          3
        );

      p.stroke(
        1,
        0x303640
      ).strokeRoundRect(
        -16,
        -10,
        11,
        8,
        3
      );

      p.fill(0xd4a017)
        .circle(
          -11,
          -6,
          1.5
        );
      break;

    // ====================================
    // CAVALEIRO
    // ====================================

    case "knight_initial_chest":
      // Peitoral simples.
      p.fill(0x737b86)
        .roundRect(
          -23,
          -34,
          46,
          48,
          9
        );

      p.stroke(
        2,
        0x343940
      ).strokeRoundRect(
        -23,
        -34,
        46,
        48,
        9
      );

      // Brasão próximo ao ombro.
      p.fill(0xd4a017)
        .circle(
          -29,
          -35,
          5
        );

      p.fill(0x243b5a)
        .circle(
          -29,
          -35,
          2.5
        );
      break;

    // ====================================
    // BERSERKER
    // ====================================

    case "berserker_mechanical_gauntlet":
      // Braço esquerdo.
      p.fill(0x4a4a4a)
        .roundRect(
          -64,
          4,
          21,
          39,
          5
        );

      p.stroke(
        2,
        0x202020
      ).strokeRoundRect(
        -64,
        4,
        21,
        39,
        5
      );

      // Placas.
      p.fill(0x777777)
        .roundRect(
          -62,
          8,
          17,
          8,
          3
        )
        .roundRect(
          -62,
          21,
          17,
          8,
          3
        );

      // Pequenos detalhes vermelhos.
      p.fill(0xb52b2b)
        .circle(
          -53,
          12,
          2
        )
        .circle(
          -53,
          25,
          2
        );
      break;

    // ====================================
    // DUELISTA
    // ====================================

    case "duelist_card_belt":
      // Cinto.
      p.fill(0x3b2a20)
        .roundRect(
          -52,
          25,
          104,
          9,
          3
        );

      p.stroke(
        1,
        0x20150f
      ).strokeRoundRect(
        -52,
        25,
        104,
        9,
        3
      );

      // Fivela.
      p.fill(0xd4a017)
        .rect(
          -6,
          25,
          12,
          9
        );

      // Cartas.
      p.fill(0xf1f1f1)
        .roundRect(
          20,
          27,
          10,
          17,
          2
        )
        .roundRect(
          31,
          25,
          10,
          17,
          2
        )
        .roundRect(
          42,
          27,
          10,
          17,
          2
        );

      p.fill(0xb52b2b)
        .circle(
          25,
          35,
          2
        )
        .circle(
          36,
          33,
          2
        )
        .circle(
          47,
          35,
          2
        );
      break;

    // ====================================
    // ESPADACHIM
    // ====================================

    case "swordsman_red_scarf":
      p.fill(0xb52b2b)
        .roundRect(
          -30,
          -45,
          60,
          9,
          4
        );

      p.fill(0x8f2020)
        .triangle(
          17,
          -38,
          46,
          -20,
          25,
          -8
        );
      break;

    // ====================================
    // LUTADOR
    // ====================================

    case "fighter_hand_wraps":
      p.fill(0xe8d9b5);

      for (const side of [-1, 1]) {
        p.rect(
          side * 53 - 8,
          5,
          16,
          8
        );

        p.rect(
          side * 53 - 8,
          16,
          16,
          8
        );

        p.rect(
          side * 53 - 8,
          27,
          16,
          8
        );
      }
      break;

    // ====================================
    // MONGE
    // ====================================

    case "monk_body_wraps":
      p.fill(0xd8c39b);

      // Faixas diagonais no corpo.
      p.stroke(
        5,
        0xd8c39b
      )
        .line(
          -38,
          -42,
          38,
          5
        )
        .line(
          -38,
          -15,
          38,
          32
        )
        .line(
          -38,
          12,
          38,
          59
        );

      // Pequenas faixas nos braços.
      p.rect(
        -62,
        3,
        18,
        8
      );

      p.rect(
        44,
        3,
        18,
        8
      );
      break;

    // ====================================
    // ASSASSINO
    // ====================================

    case "assassin_hooded_coat":
      // Gola.
      p.fill(0x202020)
        .roundRect(
          -32,
          -46,
          64,
          18,
          8
        );

      // Parte inferior do rosto/máscara.
      p.fill(0x151515)
        .roundRect(
          -22,
          -27,
          44,
          13,
          5
        );

      p.stroke(
        1,
        0x6e1d1d
      ).strokeRoundRect(
        -22,
        -27,
        44,
        13,
        5
      );
      break;

    // ====================================
    // LADINO
    // ====================================

    case "rogue_simple_belt":
      p.fill(0x4a3626)
        .roundRect(
          -52,
          25,
          104,
          9,
          3
        );

      p.fill(0xd4a017)
        .rect(
          -6,
          25,
          12,
          9
        );

      p.fill(0x795548)
        .roundRect(
          28,
          31,
          20,
          15,
          3
        );
      break;

    // ====================================
    // ARQUEIRO
    // ====================================

    case "archer_glove":
      // Luva no braço esquerdo.
      p.fill(0xeeeeee)
        .roundRect(
          -64,
          -4,
          20,
          35,
          5
        );

      p.stroke(
        1,
        0x999999
      ).strokeRoundRect(
        -64,
        -4,
        20,
        35,
        5
      );

      p.fill(0x777777)
        .rect(
          -62,
          5,
          16,
          4
        )
        .rect(
          -62,
          14,
          16,
          4
        );
      break;

    // ====================================
    // CAÇADOR
    // ====================================

    case "hunter_outfit":
      // Colete.
      p.fill(0x725a40)
        .roundRect(
          -28,
          -36,
          56,
          62,
          10
        );

      p.stroke(
        2,
        0x493a29
      ).strokeRoundRect(
        -28,
        -36,
        56,
        62,
        10
      );

      // Cinto.
      p.fill(0x493525)
        .rect(
          -50,
          25,
          100,
          8
        );

      // Bolsa.
      p.fill(0x795548)
        .roundRect(
          -46,
          32,
          24,
          22,
          5
        );
      break;

    // ====================================
    // ATIRADOR
    // ====================================

    case "sharpshooter_slingshot":
      // Cinto.
      p.fill(0x3a3a3a)
        .rect(
          -52,
          25,
          104,
          9
        );

      // Bolsinha.
      p.fill(0x666b73)
        .roundRect(
          24,
          30,
          23,
          19,
          4
        );

      // Estilingue.
      p.stroke(
        3,
        0x6b4226
      )
        .line(
          45,
          28,
          57,
          10
        )
        .line(
          57,
          10,
          66,
          29
        );

      p.stroke(
        1,
        0xd4a017
      ).line(
        57,
        10,
        57,
        27
      );
      break;

    // ====================================
    // PATRULHEIRO
    // ====================================

    case "ranger_cape":
      // Broche.
      p.fill(0xd4a017)
        .circle(
          0,
          -39,
          5
        );

      p.stroke(
        1,
        0xffe27a
      ).ring(
        0,
        -39,
        3
      );

      // Pequeno escudo no peito.
      p.fill(0x6b7280)
        .polygon([
          [-10, -22],
          [10, -22],
          [14, -5],
          [0, 10],
          [-14, -5],
        ]);

      p.stroke(
        2,
        0x333840
      ).path([
        [-10, -22],
        [10, -22],
        [14, -5],
        [0, 10],
        [-14, -5],
        [-10, -22],
      ]);
      break;

    // ====================================
    // MAGO
    // ====================================

    case "mage_arcane_pendant":
      p.stroke(
        2,
        0x8b6fd8
      ).path([
        [-18, -46],
        [-10, -28],
        [0, -20],
        [10, -28],
        [18, -46],
      ]);

      p.fill(0x7dd3fc)
        .polygon([
          [0, -24],
          [7, -13],
          [0, -3],
          [-7, -13],
        ]);

      p.stroke(
        1,
        0xffffff
      ).path([
        [0, -24],
        [7, -13],
        [0, -3],
        [-7, -13],
        [0, -24],
      ]);
      break;

    // ====================================
    // FEITICEIRO
    // ====================================

    case "sorcerer_magic_ring":
      p.fill(0xb388ff)
        .circle(
          49,
          19,
          5
        );

      p.stroke(
        2,
        0xe0c3ff
      ).ring(
        49,
        19,
        8
      );
      break;

    // ====================================
    // CLÉRIGO
    // ====================================

    case "cleric_sacred_necklace":
      p.stroke(
        2,
        0xe5c76b
      ).path([
        [-22, -48],
        [-12, -28],
        [0, -18],
        [12, -28],
        [22, -48],
      ]);

      p.fill(0xffd700)
        .rect(
          -3,
          -23,
          6,
          18
        )
        .rect(
          -9,
          -17,
          18,
          5
        );
      break;

    // ====================================
    // NECROMANTE
    // ====================================

    case "necromancer_shadow_mantle":
      p.fill(0x3a2d57)
        .roundRect(
          -60,
          -52,
          34,
          20,
          9
        )
        .roundRect(
          26,
          -52,
          34,
          20,
          9
        );

      p.stroke(
        2,
        0x6b5a8e
      ).path([
        [-22, -50],
        [-12, -26],
        [0, -18],
        [12, -26],
        [22, -50],
      ]);

      p.fill(0xe8e8e8)
        .circle(
          0,
          -14,
          10
        );

      p.fill(0x1a1a1a)
        .circle(
          -4,
          -15,
          2.5
        )
        .circle(
          4,
          -15,
          2.5
        );
      break;

    // ====================================
    // DRUIDA
    // ====================================

    case "druid_nature_pendant":
      p.stroke(
        2,
        0x8b6b43
      ).path([
        [-22, -48],
        [-12, -28],
        [0, -18],
        [12, -28],
        [22, -48],
      ]);

      p.fill(0x6a994e)
        .circle(
          0,
          -13,
          7
        );

      p.fill(0x386641)
        .circle(
          0,
          -13,
          3
        );
      break;

    // ====================================
    // INVOCADOR
    // ====================================

    case "summoner_talisman":
      p.fill(0x25204a)
        .roundRect(
          -11,
          -24,
          22,
          26,
          5
        );

      p.stroke(
        2,
        0x7c5cff
      ).strokeRoundRect(
        -11,
        -24,
        22,
        26,
        5
      );

      p.fill(0x9b87ff)
        .circle(
          0,
          -11,
          5
        );
      break;

    // ====================================
    // PALADINO
    // ====================================

    case "paladin_sacred_medal":
      p.stroke(
        2,
        0xd4a017
      ).path([
        [-20, -48],
        [-10, -27],
        [0, -19],
        [10, -27],
        [20, -48],
      ]);

      p.fill(0xffd700)
        .circle(
          0,
          -12,
          9
        );

      p.fill(0xffffff)
        .rect(
          -2,
          -19,
          4,
          14
        )
        .rect(
          -6,
          -15,
          12,
          4
        );
      break;

    // ====================================
    // SECRET - APOSTADOR
    // ====================================

    case "gambler_lucky_token":
    case "apostador_lucky_token":
      p.fill(0x1a1a1a)
        .triangle(
          -32,
          -50,
          -6,
          -50,
          -20,
          -12
        )
        .triangle(
          32,
          -50,
          6,
          -50,
          20,
          -12
        );

      p.fill(0xf1f1f1)
        .triangle(
          -10,
          -50,
          10,
          -50,
          0,
          -16
        );

      p.fill(0xb52b2b)
        .circle(
          -26,
          6,
          10
        );

      p.stroke(
        2,
        0xffffff
      ).ring(
        -26,
        6,
        10
      ).ring(
        -26,
        6,
        5
      );

      p.fill(0xffd700)
        .circle(
          -29,
          -68,
          4
        );
      break;
  }
}

// ========================================
// COMPATIBILIDADE COM A PRÉVIA DAS CLASSES
// ========================================
//
// Mantemos essas funções para o sistema de
// registro/prévia continuar funcionando.
//
// Aqui o desenho é baseado no ID da classe,
// enquanto os equipamentos reais usam os IDs
// dos itens acima.

// ========================================
// ACESSÓRIOS ATRÁS DA CLASSE
// ========================================

export function drawClassBack(
  g: Graphics,
  classId: string,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(
    g,
    x,
    y,
    size / 100
  );

  switch (classId) {
    case "assassin":
      p.fill(0x171717)
        .roundRect(
          -58,
          -48,
          116,
          112,
          20
        );
      break;

    case "hunter":
      p.fill(0x66513d)
        .roundRect(
          -56,
          -42,
          112,
          105,
          18
        );
      break;

    case "ranger":
      p.fill(0x344b3a)
        .roundRect(
          -62,
          -45,
          124,
          112,
          20
        );
      break;

    case "necromancer":
      p.fill(0x29203d)
        .roundRect(
          -60,
          -48,
          120,
          118,
          24
        );
      break;

    // ====================================
    // NOVAS CLASSES
    // ====================================

    case "alchemist":
      p.fill(0x315c45)
        .roundRect(-56, -40, 112, 105, 18);
      p.fill(0x8fc9a0)
        .roundRect(-43, -28, 86, 12, 5);
      p.fill(0x263d32)
        .roundRect(-35, 4, 70, 44, 10);
      break;

    case "reaper":
      p.fill(0x201b2b)
        .roundRect(-60, -48, 120, 116, 22);
      p.fill(0x100e18)
        .triangle(-58, 30, 0, 80, 58, 30);
      p.fill(0x62516f)
        .triangle(-44, -42, 0, -18, 44, -42);
      break;

    case "ninja":
      p.fill(0x171923)
        .roundRect(-56, -45, 112, 108, 16);
      p.fill(0x35394b)
        .triangle(-48, 35, 0, 66, 48, 35);
      p.fill(0x9f2537)
        .roundRect(-48, -36, 96, 8, 3);
      break;

    case "monster_hunter":
      p.fill(0x554431)
        .roundRect(-59, -44, 118, 110, 16);
      p.fill(0x34332d)
        .roundRect(-44, -24, 88, 74, 10);
      p.fill(0x9a7845)
        .roundRect(-54, 20, 108, 12, 4);
      break;

    case "illusionist":
      p.fill(0x35264f)
        .roundRect(-57, -46, 114, 110, 20);
      p.fill(0x7556a8)
        .triangle(-50, 30, 0, 72, 50, 30);
      p.fill(0xb9a0f4)
        .circle(-34, -20, 4)
        .circle(34, -20, 4);
      break;

    case "artillerist":
      p.fill(0x424b55)
        .roundRect(-58, -42, 116, 108, 16);
      p.fill(0x78838c)
        .roundRect(-48, -24, 18, 58, 5)
        .roundRect(30, -24, 18, 58, 5);
      p.fill(0x252a30)
        .roundRect(-30, 18, 60, 28, 6);
      break;

    case "guardian":
      p.fill(0x345b68)
        .roundRect(-62, -46, 124, 114, 20);
      p.fill(0x6b9da5)
        .roundRect(-46, -30, 92, 70, 14);
      p.fill(0xd4a017)
        .circle(0, -20, 7);
      break;

    case "bastion":
      p.fill(0x414b5a)
        .roundRect(-64, -46, 128, 116, 18);
      p.fill(0x697687)
        .roundRect(-50, -30, 100, 72, 10);
      p.stroke(3, 0x252b35)
        .line(-42, -12, 42, -12)
        .line(-42, 8, 42, 8);
      break;

    case "commander":
      p.fill(0x343e59)
        .roundRect(-58, -44, 116, 108, 18);
      p.fill(0x8e3b45)
        .triangle(-48, -32, 0, -8, 48, -32);
      p.fill(0xd4a017)
        .roundRect(-44, 20, 88, 10, 4);
      break;

    case "barbarian":
      p.fill(0x67432f)
        .roundRect(-60, -42, 120, 108, 18);
      p.fill(0x9b6540)
        .triangle(-48, -32, -25, -52, -12, -28)
        .triangle(48, -32, 25, -52, 12, -28);
      p.fill(0x432b23)
        .roundRect(-44, 18, 88, 18, 5);
      break;

    case "engineer":
      p.fill(0x46534a)
        .roundRect(-58, -42, 116, 108, 16);
      p.fill(0x777b70)
        .roundRect(-46, -24, 24, 48, 5)
        .roundRect(22, -24, 24, 48, 5);
      p.fill(0xd4a017)
        .circle(0, 20, 8);
      break;

    case "psychic":
      p.fill(0x392d59)
        .roundRect(-58, -44, 116, 110, 20);
      p.fill(0x7964b5, 0.8)
        .circle(-32, -18, 8)
        .circle(32, -18, 8);
      p.stroke(2, 0xc7b8ff)
        .path([[-38, 12], [0, 34], [38, 12]]);
      break;

    case "unknown":
      p.fill(0x242424)
        .roundRect(-60, -48, 120, 116, 20);
      p.fill(0x555555)
        .triangle(-48, 24, 0, 72, 48, 24);
      p.fill(0xb8b8b8)
        .circle(0, -20, 6);
      break;
  }
}

// ========================================
// ACESSÓRIOS DA CLASSE NA FRENTE
// ========================================

export function drawClassFront(
  g: Graphics,
  classId: string,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(
    g,
    x,
    y,
    size / 100
  );

  switch (classId) {
    // ====================================
    // GUERREIRO
    // ====================================

    case "warrior":
      p.fill(0x8c8f94)
        .roundRect(
          -68,
          -52,
          38,
          28,
          10
        );

      p.stroke(
        3,
        0x4a4d52
      ).strokeRoundRect(
        -68,
        -52,
        38,
        28,
        10
      );

      p.fill(0xd4a017)
        .circle(
          -58,
          -38,
          3
        );
      break;

    // ====================================
    // CAVALEIRO
    // ====================================

    case "knight":
      p.fill(0x737b86)
        .roundRect(
          -24,
          -36,
          48,
          48,
          10
        );

      p.stroke(
        3,
        0x3f454d
      ).strokeRoundRect(
        -24,
        -36,
        48,
        48,
        10
      );

      p.fill(0xd4a017)
        .circle(
          -31,
          -38,
          5
        );
      break;

    // ====================================
    // BERSERKER
    // ====================================

    case "berserker":
      p.fill(0x4a4a4a)
        .roundRect(
          -64,
          4,
          21,
          39,
          5
        );

      p.stroke(
        2,
        0x202020
      ).strokeRoundRect(
        -64,
        4,
        21,
        39,
        5
      );

      p.fill(0x777777)
        .roundRect(
          -62,
          8,
          17,
          8,
          3
        )
        .roundRect(
          -62,
          21,
          17,
          8,
          3
        );

      p.fill(0xb52b2b)
        .circle(
          -53,
          12,
          2
        )
        .circle(
          -53,
          25,
          2
        );
      break;

    // ====================================
    // DUELISTA
    // ====================================

    case "duelist":
      p.fill(0x3b2a20)
        .roundRect(
          -52,
          25,
          104,
          9,
          3
        );

      p.fill(0xf1f1f1)
        .roundRect(
          20,
          27,
          10,
          17,
          2
        )
        .roundRect(
          31,
          25,
          10,
          17,
          2
        )
        .roundRect(
          42,
          27,
          10,
          17,
          2
        );
      break;

    // ====================================
    // ESPADACHIM
    // ====================================

    case "swordsman":
      p.fill(0xb52b2b)
        .roundRect(
          -30,
          -45,
          60,
          9,
          4
        );

      p.fill(0x8f2020)
        .triangle(
          17,
          -38,
          46,
          -20,
          25,
          -8
        );
      break;

    // ====================================
    // LUTADOR
    // ====================================

    case "fighter":
      p.fill(0xe8d9b5);

      for (const side of [-1, 1]) {
        p.rect(
          side * 53 - 8,
          5,
          16,
          8
        );

        p.rect(
          side * 53 - 8,
          16,
          16,
          8
        );
      }
      break;

    // ====================================
    // MONGE
    // ====================================

    case "monk":
      p.stroke(
        5,
        0xd8c39b
      )
        .line(
          -38,
          -42,
          38,
          5
        )
        .line(
          -38,
          -15,
          38,
          32
        );

      p.fill(0xd8c39b)
        .rect(
          -62,
          3,
          18,
          8
        )
        .rect(
          44,
          3,
          18,
          8
        );
      break;

    // ====================================
    // ASSASSINO
    // ====================================

    case "assassin":
      p.fill(0x171717)
        .sector(
          0,
          -80,
          34,
          180,
          360
        );

      p.fill(0x151515)
        .roundRect(
          -22,
          -27,
          44,
          13,
          5
        );
      break;

    // ====================================
    // LADINO
    // ====================================

    case "rogue":
      p.fill(0x4a3626)
        .roundRect(
          -52,
          25,
          104,
          9,
          3
        );

      p.fill(0xd4a017)
        .rect(
          -6,
          25,
          12,
          9
        );

      p.fill(0x795548)
        .roundRect(
          28,
          31,
          20,
          15,
          3
        );
      break;

    // ====================================
    // ARQUEIRO
    // ====================================

    case "archer":
      p.fill(0xeeeeee)
        .roundRect(
          -64,
          -4,
          20,
          35,
          5
        );

      p.stroke(
        2,
        0x5a3a1c
      ).line(
        -34,
        -50,
        34,
        18
      );
      break;

    // ====================================
    // CAÇADOR
    // ====================================

    case "hunter":
      p.fill(0x725a40)
        .roundRect(
          -28,
          -36,
          56,
          62,
          10
        );

      p.fill(0x493525)
        .rect(
          -50,
          25,
          100,
          8
        );
      break;

    // ====================================
    // ATIRADOR
    // ====================================

    case "sharpshooter":
      p.fill(0x3a3a3a)
        .rect(
          -52,
          25,
          104,
          9
        );

      p.fill(0x666b73)
        .roundRect(
          24,
          30,
          23,
          19,
          4
        );

      p.stroke(
        3,
        0x6b4226
      )
        .line(
          45,
          28,
          57,
          10
        )
        .line(
          57,
          10,
          66,
          29
        );
      break;

    // ====================================
    // PATRULHEIRO
    // ====================================

    case "ranger":
      p.fill(0x4d6650)
        .roundRect(
          -32,
          -48,
          64,
          14,
          7
        );

      p.fill(0xd4a017)
        .circle(
          0,
          -40,
          5
        );
      break;

    // ====================================
    // MAGO
    // ====================================

    case "mage":
      p.fill(0x4f46e5)
        .sector(
          0,
          -80,
          30,
          180,
          360
        );

      p.triangle(
        -24,
        -98,
        3,
        -146,
        24,
        -98
      );

      p.fill(0x7dd3fc)
        .polygon([
          [0, -26],
          [9, -12],
          [0, 2],
          [-9, -12],
        ]);
      break;

    // ====================================
    // FEITICEIRO
    // ====================================

    case "sorcerer":
      p.fill(0xb388ff, 0.25)
        .circle(
          62,
          -52,
          18
        );

      p.fill(0x9b5de5)
        .circle(
          62,
          -52,
          10
        );

      p.fill(0xffffff, 0.8)
        .circle(
          59,
          -55,
          3
        );
      break;

    // ====================================
    // CLÉRIGO
    // ====================================

    case "cleric":
      p.stroke(
        2,
        0xe5c76b
      ).path([
        [-24, -50],
        [-14, -26],
        [0, -18],
        [14, -26],
        [24, -50],
      ]);

      p.fill(0xffd700)
        .rect(
          -2.5,
          -22,
          5,
          18
        )
        .rect(
          -8,
          -17,
          16,
          5
        );
      break;

    // ====================================
    // NECROMANTE
    // ====================================

    case "necromancer":
      p.fill(0x3a2d57)
        .roundRect(
          -60,
          -52,
          34,
          20,
          9
        )
        .roundRect(
          26,
          -52,
          34,
          20,
          9
        );

      p.fill(0xe8e8e8)
        .circle(
          0,
          -14,
          10
        );
      break;

    // ====================================
    // DRUIDA
    // ====================================

    case "druid":
      p.stroke(
        3,
        0x6b4a2b
      ).line(
        -62,
        -40,
        -36,
        -60
      );

      p.fill(0x4f772d)
        .circle(
          -54,
          -56,
          8
        )
        .circle(
          -42,
          -64,
          7
        )
        .circle(
          -62,
          -44,
          7
        );

      p.fill(0x6a994e)
        .circle(
          0,
          -14,
          6
        );
      break;

    // ====================================
    // INVOCADOR
    // ====================================

    case "summoner":
      p.fill(0x25204a)
        .roundRect(
          -11,
          -24,
          22,
          26,
          5
        );

      p.stroke(
        2,
        0x7c5cff
      ).strokeRoundRect(
        -11,
        -24,
        22,
        26,
        5
      );

      p.fill(0x9b87ff)
        .circle(
          0,
          -11,
          5
        );
      break;

    // ====================================
    // PALADINO
    // ====================================

    case "paladin":
      p.fill(0xffd700)
        .circle(
          0,
          -12,
          9
        );

      p.fill(0xffffff)
        .rect(
          -2,
          -19,
          4,
          14
        )
        .rect(
          -6,
          -15,
          12,
          4
        );
      break;

    // ====================================
    // CLASSE SECRETA
    // ====================================

    case "gambler":
    case "apostador":
      p.fill(0x1a1a1a)
        .triangle(
          -32,
          -50,
          -6,
          -50,
          -20,
          -12
        )
        .triangle(
          32,
          -50,
          6,
          -50,
          20,
          -12
        );

      p.fill(0xb52b2b)
        .circle(
          -26,
          6,
          10
        );

      p.stroke(
        2,
        0xffffff
      ).ring(
        -26,
        6,
        10
      );
      break;

    // ====================================
    // NOVAS CLASSES
    // ====================================

    case "alchemist":
      // Frascos e cinto de poções.
      p.fill(0x315c45)
        .roundRect(-42, 22, 84, 10, 4);

      p.fill(0x54d6a0)
        .roundRect(-38, 0, 12, 22, 4)
        .roundRect(26, -4, 12, 26, 4);

      p.fill(0x263d32)
        .roundRect(-39, -4, 14, 6, 2)
        .roundRect(25, -8, 14, 6, 2);

      p.fill(0xe0c878)
        .circle(-32, 10, 3)
        .circle(32, 8, 3);
      break;

    case "reaper":
      // Símbolo sombrio no peito.
      p.fill(0x201b2b)
        .roundRect(-28, -28, 56, 48, 12);

      p.fill(0xaaa0bd)
        .circle(0, -12, 9);

      p.fill(0x201b2b)
        .circle(-3, -14, 2)
        .circle(3, -14, 2);

      p.stroke(3, 0x8b789f)
        .line(-16, -40, 0, -25)
        .line(16, -40, 0, -25);
      break;

    case "ninja":
      // Faixa e máscara.
      p.fill(0x9f2537)
        .roundRect(-32, -43, 64, 8, 3);

      p.fill(0x171923)
        .roundRect(-22, -27, 44, 13, 4);

      p.fill(0xe5e5e5)
        .circle(-9, -31, 2)
        .circle(9, -31, 2);

      p.fill(0x35394b)
        .roundRect(-38, 24, 76, 7, 3);
      break;

    case "monster_hunter":
      // Peitoral reforçado e troféu.
      p.fill(0x554431)
        .roundRect(-29, -34, 58, 56, 9);

      p.stroke(2, 0x292923)
        .strokeRoundRect(-29, -34, 58, 56, 9);

      p.fill(0x9a7845)
        .triangle(-18, -28, -4, -46, 2, -22)
        .triangle(18, -28, 4, -46, -2, -22);

      p.fill(0xc3a56b)
        .circle(0, -8, 6);
      break;

    case "illusionist":
      // Broche mágico.
      p.fill(0x7556a8)
        .circle(0, -12, 12);

      p.fill(0xd8caff)
        .polygon([
          [0, -22],
          [7, -12],
          [0, -2],
          [-7, -12],
        ]);

      p.stroke(2, 0xb9a0f4)
        .path([
          [-28, -34],
          [-18, -18],
          [-28, -2],
        ])
        .path([
          [28, -34],
          [18, -18],
          [28, -2],
        ]);
      break;

    case "artillerist":
      // Placas metálicas e núcleo de energia.
      p.fill(0x78838c)
        .roundRect(-34, -30, 24, 38, 5)
        .roundRect(10, -30, 24, 38, 5);

      p.stroke(2, 0x252a30)
        .strokeRoundRect(-34, -30, 24, 38, 5)
        .strokeRoundRect(10, -30, 24, 38, 5);

      p.fill(0xd4a017)
        .circle(0, -10, 8);

      p.fill(0xffe8a3)
        .circle(0, -10, 3);
      break;

    case "guardian":
      // Emblema protetor.
      p.fill(0x6b9da5)
        .polygon([
          [-15, -28],
          [15, -28],
          [18, -10],
          [0, 7],
          [-18, -10],
        ]);

      p.stroke(2, 0xd0e6e7)
        .path([
          [-15, -28],
          [15, -28],
          [18, -10],
          [0, 7],
          [-18, -10],
          [-15, -28],
        ]);

      p.fill(0xd4a017)
        .circle(0, -12, 4);
      break;

    case "bastion":
      // Placa de armadura pesada.
      p.fill(0x697687)
        .roundRect(-34, -32, 68, 48, 8);

      p.stroke(3, 0x252b35)
        .strokeRoundRect(-34, -32, 68, 48, 8);

      p.fill(0x414b5a)
        .rect(-4, -29, 8, 42)
        .rect(-29, -5, 58, 7);

      p.fill(0xd4a017)
        .circle(0, -2, 4);
      break;

    case "commander":
      // Insígnia de comando.
      p.fill(0x8e3b45)
        .triangle(-22, -30, 22, -30, 0, -6);

      p.fill(0xd4a017)
        .circle(0, -20, 5);

      p.stroke(2, 0xd4a017)
        .line(-28, -36, -28, -22)
        .line(28, -36, 28, -22);

      p.fill(0x343e59)
        .roundRect(-34, 22, 68, 9, 3);
      break;

    case "barbarian":
      // Proteção rústica e presas.
      p.fill(0x9b6540)
        .roundRect(-30, -30, 60, 36, 8);

      p.fill(0xe8d9b5)
        .triangle(-20, -28, -10, -28, -17, -12)
        .triangle(20, -28, 10, -28, 17, -12);

      p.fill(0x67432f)
        .roundRect(-42, 24, 84, 9, 4);
      break;

    case "engineer":
      // Ferramentas e engrenagem.
      p.fill(0x777b70)
        .roundRect(-38, -26, 16, 34, 4)
        .roundRect(22, -26, 16, 34, 4);

      p.fill(0xd4a017)
        .circle(0, -10, 11);

      p.fill(0x46534a)
        .circle(0, -10, 5);

      p.stroke(2, 0xd4a017)
        .line(-8, -10, 8, -10)
        .line(0, -18, 0, -2);
      break;

    case "psychic":
      // Símbolo mental e energia psíquica.
      p.fill(0x7964b5)
        .circle(0, -12, 12);

      p.fill(0xc7b8ff)
        .circle(0, -12, 5);

      p.stroke(2, 0xc7b8ff)
        .path([
          [-28, -32],
          [-18, -18],
          [-28, -4],
        ])
        .path([
          [28, -32],
          [18, -18],
          [28, -4],
        ]);
      break;

    case "unknown":
      // Emblema misterioso.
      p.fill(0x555555)
        .circle(0, -14, 13);

      p.fill(0x242424)
        .circle(0, -14, 8);

      p.fill(0xb8b8b8)
        .circle(0, -14, 3);

      p.stroke(2, 0x777777)
        .path([
          [-22, -34],
          [-12, -22],
          [-22, -10],
        ])
        .path([
          [22, -34],
          [12, -22],
          [22, -10],
        ]);
      break;
  }
}

/* ========================================
 * ACESSÓRIOS EXCLUSIVOS DE SUBCLASSE
 * ========================================
 *
 * Estes acessórios são independentes dos
 * acessórios iniciais das classes.
 *
 * IMPORTANTE:
 * - Escolher uma subclasse não equipa o item.
 * - O sistema de inventário controla o desbloqueio
 *   e a equipagem.
 * - Os IDs são independentes dos IDs de classe.
 * - A estrutura permite adicionar acessórios
 *   raros e lendários futuramente.
 */

export type SubclassAccessoryRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary";

export type SubclassAccessoryUnlockType =
  | "subclass"
  | "quest"
  | "achievement"
  | "progression";

export interface SubclassAccessoryDefinition {
  id: string;
  subclassId: string;
  name: string;
  description: string;
  rarity: SubclassAccessoryRarity;
  unlockType: SubclassAccessoryUnlockType;
  unlockedByDefault: boolean;
}

/**
 * Catálogo inicial de acessórios de subclasse.
 *
 * Os acessórios começam bloqueados.
 * O sistema responsável pela progressão deverá
 * liberar o acessório quando necessário.
 */
export const SUBCLASS_ACCESSORY_CATALOG:
  SubclassAccessoryDefinition[] = [
    {
      id: "accessory_subclass_warrior_samurai",
      subclassId: "warrior_samurai",
      name: "Insígnia do Samurai",
      description:
        "Uma insígnia de disciplina e domínio da espada.",
      rarity: "rare",
      unlockType: "subclass",
      unlockedByDefault: false,
    },
    {
      id: "accessory_subclass_knight_royal_knight",
      subclassId: "knight_royal_knight",
      name: "Brasão do Cavaleiro Real",
      description:
        "Um brasão que representa honra e lealdade.",
      rarity: "rare",
      unlockType: "subclass",
      unlockedByDefault: false,
    },
    {
      id: "accessory_subclass_mage_elementalist",
      subclassId: "mage_elementalist",
      name: "Núcleo Elemental",
      description:
        "Um cristal que canaliza o poder dos elementos.",
      rarity: "epic",
      unlockType: "subclass",
      unlockedByDefault: false,
    },
    {
      id: "accessory_subclass_psychic_power",
      subclassId: "psychic_power",
      name: "Foco Psíquico",
      description:
        "Um foco que intensifica a concentração mental.",
      rarity: "epic",
      unlockType: "subclass",
      unlockedByDefault: false,
    },
  ];

/**
 * Consulta um acessório pelo ID.
 */
export function getSubclassAccessory(
  accessoryId: string
): SubclassAccessoryDefinition | undefined {
  return SUBCLASS_ACCESSORY_CATALOG.find(
    (accessory) => accessory.id === accessoryId
  );
}

/**
 * Consulta o acessório associado a uma subclasse.
 *
 * Retornar a definição não significa que o item
 * foi desbloqueado ou equipado.
 */
export function getSubclassAccessoryBySubclass(
  subclassId: string
): SubclassAccessoryDefinition | undefined {
  return SUBCLASS_ACCESSORY_CATALOG.find(
    (accessory) => accessory.subclassId === subclassId
  );
}

/**
 * Desenha o acessório exclusivo atrás do personagem.
 *
 * Pode ser utilizado tanto na prévia quanto no jogo.
 * O tamanho é convertido para as mesmas unidades
 * usadas pelos desenhos existentes.
 */
export function drawSubclassAccessoryBack(
  g: Graphics,
  subclassId: string,
  x: number,
  y: number,
  size: number
): void {
  if (!subclassId) return;

  const p = new Pen(g, x, y, size / 100);

  switch (subclassId) {
    case "warrior_samurai":
      // Tecido de ombro inspirado em armaduras samurais.
      p.fill(0x7f1d1d)
        .triangle(
          -44, -40,
          -18, -30,
          -48, 38
        )
        .triangle(
          44, -40,
          18, -30,
          48, 38
        );

      p.fill(0xd4a017)
        .circle(-36, -27, 3)
        .circle(36, -27, 3);
      break;

    case "knight_royal_knight":
      // Manto real com acabamento dourado.
      p.fill(0x243b5a)
        .roundRect(-55, -44, 110, 105, 18);

      p.fill(0xd4a017)
        .triangle(-48, 35, 0, 76, 48, 35);

      p.stroke(2, 0xf5d782)
        .path([
          [-28, -32],
          [0, -10],
          [28, -32],
        ]);
      break;

    case "mage_elementalist":
      // Manto com energia elemental.
      p.fill(0x243b8a)
        .roundRect(-55, -44, 110, 105, 18);

      p.fill(0x38bdf8, 0.9)
        .circle(-35, -20, 5)
        .circle(35, -20, 5);

      p.fill(0xf97316, 0.9)
        .circle(-35, 8, 4)
        .circle(35, 8, 4);

      p.fill(0x34d399, 0.9)
        .circle(0, 32, 5);
      break;

    case "psychic_power":
      // Manto com marcas de energia mental.
      p.fill(0x392d59)
        .roundRect(-55, -44, 110, 105, 20);

      p.stroke(3, 0xc7b8ff)
        .path([
          [-35, -20],
          [-18, -5],
          [-35, 10],
        ])
        .path([
          [35, -20],
          [18, -5],
          [35, 10],
        ]);

      p.fill(0x7964b5, 0.9)
        .circle(0, 28, 7);
      break;

    default:
      // Base genérica para novas subclasses.
      // O desenho varia conforme o ID, permitindo
      // suportar subclasses sem alterar este arquivo.
      {
        let hash = 0;

        for (let i = 0; i < subclassId.length; i++) {
          hash = (
            hash * 31 + subclassId.charCodeAt(i)
          ) | 0;
        }

        const palette = [
          0x4f46e5,
          0x7c2d12,
          0x166534,
          0x6b21a8,
          0x155e75,
          0x7f1d1d,
          0x374151,
          0x854d0e,
        ];

        const color =
          palette[Math.abs(hash) % palette.length];

        p.fill(color)
          .roundRect(-53, -43, 106, 101, 18);

        p.fill(0x171717, 0.45)
          .triangle(-48, 28, 0, 72, 48, 28);

        p.fill(0xd4a017)
          .circle(0, -22, 5);
      }
      break;
  }
}

/**
 * Desenha o acessório exclusivo na frente.
 *
 * A função não equipa nem desbloqueia o acessório:
 * ela apenas desenha o visual solicitado.
 */
export function drawSubclassAccessoryFront(
  g: Graphics,
  subclassId: string,
  x: number,
  y: number,
  size: number
): void {
  if (!subclassId) return;

  const p = new Pen(g, x, y, size / 100);

  switch (subclassId) {
    case "warrior_samurai":
      // Emblema vermelho e dourado.
      p.fill(0x7f1d1d)
        .polygon([
          [-15, -28],
          [15, -28],
          [12, -8],
          [0, 5],
          [-12, -8],
        ]);

      p.stroke(2, 0xd4a017)
        .path([
          [-15, -28],
          [15, -28],
          [12, -8],
          [0, 5],
          [-12, -8],
          [-15, -28],
        ]);

      p.fill(0xffd166)
        .circle(0, -15, 4);

      p.stroke(2, 0xd4a017)
        .line(-22, -35, 22, -35);
      break;

    case "knight_royal_knight":
      // Brasão real com gema central.
      p.fill(0x243b5a)
        .polygon([
          [-18, -31],
          [18, -31],
          [16, -8],
          [0, 8],
          [-16, -8],
        ]);

      p.stroke(2, 0xd4a017)
        .path([
          [-18, -31],
          [18, -31],
          [16, -8],
          [0, 8],
          [-16, -8],
          [-18, -31],
        ]);

      p.fill(0xf5d782)
        .polygon([
          [0, -26],
          [7, -16],
          [0, -7],
          [-7, -16],
        ]);

      p.stroke(2, 0xd4a017)
        .line(-25, -35, -25, -18)
        .line(25, -35, 25, -18);
      break;

    case "mage_elementalist":
      // Cristal com cores elementais.
      p.fill(0x38bdf8)
        .polygon([
          [0, -31],
          [12, -14],
          [0, 3],
          [-12, -14],
        ]);

      p.fill(0xf97316)
        .triangle(-9, -18, -2, -27, -2, -10);

      p.fill(0x34d399)
        .triangle(9, -18, 2, -27, 2, -10);

      p.stroke(2, 0xe0f2fe)
        .path([
          [0, -31],
          [12, -14],
          [0, 3],
          [-12, -14],
          [0, -31],
        ]);

      p.fill(0xffffff, 0.9)
        .circle(0, -15, 3);
      break;

    case "psychic_power":
      // Símbolo psíquico com núcleo luminoso.
      p.fill(0x7964b5)
        .circle(0, -15, 13);

      p.stroke(2, 0xc7b8ff)
        .ring(0, -15, 13);

      p.fill(0xe9ddff)
        .polygon([
          [0, -26],
          [6, -15],
          [0, -4],
          [-6, -15],
        ]);

      p.stroke(2, 0xc7b8ff)
        .path([
          [-25, -29],
          [-17, -15],
          [-25, -1],
        ])
        .path([
          [25, -29],
          [17, -15],
          [25, -1],
        ]);
      break;

    default:
      // Emblema genérico para novas subclasses.
      {
        let hash = 0;

        for (let i = 0; i < subclassId.length; i++) {
          hash = (
            hash * 31 + subclassId.charCodeAt(i)
          ) | 0;
        }

        const palette = [
          0x4f46e5,
          0x7c2d12,
          0x166534,
          0x6b21a8,
          0x155e75,
          0x7f1d1d,
          0x374151,
          0x854d0e,
        ];

        const color =
          palette[Math.abs(hash) % palette.length];

        p.fill(color)
          .polygon([
            [0, -30],
            [13, -15],
            [0, 2],
            [-13, -15],
          ]);

        p.stroke(2, 0xffffff)
          .path([
            [0, -30],
            [13, -15],
            [0, 2],
            [-13, -15],
            [0, -30],
          ]);

        p.fill(0xffd166)
          .circle(0, -15, 4);

        p.stroke(2, 0xffffff, 0.75)
          .line(-23, -29, -15, -18)
          .line(23, -29, 15, -18);
      }
      break;
  }
}
