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
// CANETA (ajuda a desenhar em unidades)
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
    this.g.fillCircle(this.X(x), this.Y(y), this.S(r));
    return this;
  }

  ring(x: number, y: number, r: number): this {
    this.g.strokeCircle(this.X(x), this.Y(y), this.S(r));
    return this;
  }

  line(x1: number, y1: number, x2: number, y2: number): this {
    this.g.lineBetween(this.X(x1), this.Y(y1), this.X(x2), this.Y(y2));
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
    this.g.fillPoints(this.toPoints(points), true);
    return this;
  }

  path(points: number[][]): this {
    this.g.strokePoints(this.toPoints(points), false);
    return this;
  }

  // Pedaço de círculo (usado em capuz e máscara).
  // Ângulos em graus: 0 = direita, 90 = baixo, 180 = esquerda, 270 = cima.
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
        startDeg + ((endDeg - startDeg) * i) / steps
      );

      points.push([x + Math.cos(angle) * r, y + Math.sin(angle) * r]);
    }

    return this.polygon(points);
  }
}

// ========================================
// CORPO E CABEÇA
// ========================================

// Usado só na prévia do registro.
// No jogo o corpo é o próprio sprite do Player.
export function drawCharacterBody(
  g: Graphics,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(g, x, y, size / 100);

  p.fill(0x3b82f6).roundRect(-50, -50, 100, 100, 25);
  p.stroke(3, 0xffffff).strokeRoundRect(-50, -50, 100, 100, 25);
}

export function drawCharacterHead(
  g: Graphics,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(g, x, y, size / 100);

  p.fill(0xdddddd).circle(0, -80, 28);
  p.stroke(3, 0xffffff).ring(0, -80, 28);
}

// ========================================
// ACESSÓRIOS ATRÁS DO CORPO
// (capas, mantos, aljavas)
// ========================================

export function drawClassBack(
  g: Graphics,
  classId: string,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(g, x, y, size / 100);

  switch (classId) {
    case "necromancer":
      // Pequeno manto escuro
      p.fill(0x29203d).roundRect(-60, -48, 120, 118, 24);
      break;

    case "archer":
      quiver(p, 1);
      break;

    case "ranger":
      // Capa curta + aljava do outro lado
      p.fill(0x365c3a).roundRect(-58, -48, 116, 112, 20);
      quiver(p, -1);
      break;
  }
}

// Aljava vista por cima do ombro.
// side = 1 (direita) ou -1 (esquerda).
function quiver(p: Pen, side: number): void {
  p.fill(0x8b5a2b).polygon([
    [side * 26, -62],
    [side * 40, -68],
    [side * 64, -6],
    [side * 50, 0],
  ]);

  // Penas das flechas
  p.stroke(3, 0xeeeeee)
    .line(side * 38, -68, side * 40, -88)
    .line(side * 45, -66, side * 49, -86);

  p.stroke(3, 0xb52b2b)
    .line(side * 40, -88, side * 41, -94)
    .line(side * 49, -86, side * 51, -92);
}

// ========================================
// ACESSÓRIOS NA FRENTE DO CORPO
// ========================================

export function drawClassFront(
  g: Graphics,
  classId: string,
  x: number,
  y: number,
  size: number
): void {
  const p = new Pen(g, x, y, size / 100);

  switch (classId) {
    // ====================================
    // CLASSES DE COMBATE
    // ====================================

    case "warrior":
      // Pequena ombreira de metal em um ombro
      p.fill(0x8c8f94).roundRect(-68, -52, 38, 28, 10);
      p.stroke(3, 0x4a4d52).strokeRoundRect(-68, -52, 38, 28, 10);
      p.fill(0xd4a017).circle(-58, -38, 3);
      break;

    case "knight":
      // Ombreiras maiores
      p.fill(0x7d8590)
        .roundRect(-74, -54, 44, 34, 12)
        .roundRect(30, -54, 44, 34, 12);

      p.stroke(3, 0x3f454d)
        .strokeRoundRect(-74, -54, 44, 34, 12)
        .strokeRoundRect(30, -54, 44, 34, 12);

      // Detalhe de armadura no peito
      p.fill(0x9aa3ad).roundRect(-24, -36, 48, 46, 12);

      p.stroke(3, 0x3f454d)
        .strokeRoundRect(-24, -36, 48, 46, 12)
        .line(0, -36, 0, 10);
      break;

    case "berserker":
      // Faixas nos braços (dos dois lados)
      p.fill(0x9b2c2c);

      for (const side of [-1, 1]) {
        p.rect(side * 50 - 8, -22, 16, 9);
        p.rect(side * 50 - 8, -6, 16, 9);
      }

      // Pequena proteção no antebraço
      p.fill(0x6b4f3a).roundRect(-60, 14, 20, 28, 6);
      p.stroke(2, 0x3b2a1d).strokeRoundRect(-60, 14, 20, 28, 6);
      break;

    case "paladin":
      // Símbolo sagrado dourado no peito
      p.fill(0xffd700).rect(-5, -32, 10, 44).rect(-17, -20, 34, 10);
      p.stroke(2, 0xffd700, 0.8).ring(0, -15, 22);
      break;

    case "monk":
      // Faixas nas duas mãos/antebraços
      p.fill(0xe8d9b5);

      for (const side of [-1, 1]) {
        p.rect(side * 50 - 9, 8, 18, 10);
        p.rect(side * 50 - 9, 22, 18, 10);
        p.rect(side * 50 - 9, 36, 18, 10);
      }
      break;

    case "assassin":
      // Meia máscara cobrindo a parte inferior do rosto
      p.fill(0x1c1c1c).sector(0, -80, 29, 10, 170);
      p.stroke(2, 0xb52b2b).line(-27.5, -75, 27.5, -75);
      break;

    case "rogue":
      // Capuz pequeno
      p.fill(0x2b2b2b).sector(0, -80, 31, 170, 370);

      // Cinto + adaga presa na cintura
      p.fill(0x4a3626).rect(-50, 26, 100, 8);
      p.fill(0x3e2723).rect(34, 30, 7, 12);
      p.fill(0x888888).rect(31, 41, 13, 3);
      p.fill(0xc9ced3).polygon([
        [34, 44],
        [41, 44],
        [37.5, 64],
      ]);
      break;

    // ====================================
    // CLASSES MÁGICAS
    // ====================================

    case "mage":
      // Capuz pontudo
      p.fill(0x4f46e5).sector(0, -80, 30, 180, 360);
      p.triangle(-24, -98, 3, -146, 24, -98);

      // Cristal no peito
      p.fill(0x7dd3fc).polygon([
        [0, -26],
        [9, -12],
        [0, 2],
        [-9, -12],
      ]);

      p.stroke(2, 0xffffff).path([
        [0, -26],
        [9, -12],
        [0, 2],
        [-9, -12],
        [0, -26],
      ]);
      break;

    case "sorcerer":
      // Orbe mágico perto do ombro
      p.fill(0xb388ff, 0.25).circle(62, -52, 18);
      p.fill(0x9b5de5).circle(62, -52, 10);
      p.fill(0xffffff, 0.8).circle(59, -55, 3);
      p.stroke(2, 0xe0c3ff).ring(62, -52, 10);
      break;

    case "cleric":
      // Colar com símbolo sagrado
      p.stroke(2, 0xe5c76b).path([
        [-24, -50],
        [-14, -26],
        [0, -18],
        [14, -26],
        [24, -50],
      ]);

      p.fill(0xffd700).rect(-2.5, -22, 5, 18).rect(-8, -17, 16, 5);
      break;

    case "necromancer":
      // Ombros do manto
      p.fill(0x3a2d57)
        .roundRect(-60, -52, 34, 20, 9)
        .roundRect(26, -52, 34, 20, 9);

      // Corrente + amuleto de caveira
      p.stroke(2, 0x6b5a8e).path([
        [-22, -50],
        [-12, -26],
        [0, -18],
        [12, -26],
        [22, -50],
      ]);

      p.fill(0xe8e8e8).circle(0, -14, 10).roundRect(-5, -8, 10, 8, 2);
      p.fill(0x1a1a1a).circle(-4, -15, 2.5).circle(4, -15, 2.5);
      break;

    case "druid":
      // Folhas e raminhos presos no ombro
      p.stroke(3, 0x6b4a2b).line(-62, -40, -36, -60);

      p.fill(0x4f772d)
        .circle(-54, -56, 8)
        .circle(-42, -64, 7)
        .circle(-62, -44, 7);

      p.fill(0x84a98c).circle(-47, -50, 5);

      // Pequeno colar natural
      p.stroke(2, 0x8b6b43).path([
        [-22, -50],
        [-12, -28],
        [0, -20],
        [12, -28],
        [22, -50],
      ]);

      p.fill(0x6a994e).circle(0, -14, 6);
      p.fill(0x386641).circle(0, -14, 3);
      break;

    // ====================================
    // CLASSES DE DISTÂNCIA
    // ====================================

    case "archer":
      // Alça da aljava cruzando o peito
      p.stroke(5, 0x5a3a1c).line(-34, -50, 34, 18);
      break;

    case "hunter":
      // Cinto + bolsa de caça + pequena faca
      p.fill(0x5b4636).rect(-50, 26, 100, 8);
      p.fill(0x795548).roundRect(-46, 32, 30, 30, 7);
      p.fill(0x5d4037).roundRect(-46, 32, 30, 12, 6);
      p.fill(0x3e2723).rect(32, 32, 7, 12);
      p.fill(0xc9ced3).polygon([
        [31, 44],
        [40, 44],
        [35.5, 62],
      ]);
      break;

    case "sharpshooter":
      // Cinto + equipamento de precisão
      p.fill(0x3a3a3a).rect(-50, 26, 100, 8);
      p.fill(0x666b73).roundRect(-46, 30, 22, 20, 4);

      // Bandoleira pequena com munição
      p.stroke(6, 0x4e3b2a).line(-34, -48, 34, 24);
      p.fill(0xd4a017);

      for (const t of [0.15, 0.35, 0.55, 0.75]) {
        p.circle(-34 + 68 * t, -48 + 72 * t, 3.5);
      }

      // Luneta/visor no ombro
      p.fill(0x555a60).roundRect(30, -62, 32, 10, 4);
      p.fill(0x7dd3fc).circle(64, -57, 6);
      p.stroke(2, 0xffffff).ring(64, -57, 6);
      break;

    case "ranger":
      // Gola da capa + broche
      p.fill(0x365c3a).roundRect(-32, -54, 64, 14, 7);
      p.fill(0xd4a017).circle(0, -45, 5);
      break;

    // ====================================
    // CLASSE SECRETA
    // ====================================

    case "gambler":
    case "apostador":
      // Colete / terno
      p.fill(0x1a1a1a)
        .triangle(-32, -50, -6, -50, -20, -12)
        .triangle(32, -50, 6, -50, 20, -12);

      p.fill(0xf1f1f1).triangle(-10, -50, 10, -50, 0, -16);

      // Ficha de aposta presa na roupa
      p.fill(0xb52b2b).circle(-26, 6, 10);
      p.stroke(2, 0xffffff).ring(-26, 6, 10).ring(-26, 6, 5);

      // Brinco dourado
      p.fill(0xffd700).circle(-29, -68, 4);
      break;
  }
}