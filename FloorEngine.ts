// Procedural Dungeon Floor Texture Synthesizer & Caching Engine
// Implements 20 rich dungeon biomes with procedural tile variations,
// seamless geometric borders, ceremonial medallions, and offscreen caching.

export type FloorBiomeId =
  | 'ancient_weathered_cobblestone'
  | 'obsidian_basalt_magma'
  | 'cracked_castle_marble_gold'
  | 'glowing_runic_stone'
  | 'mossy_overgrown_ruins'
  | 'frozen_glacial_cobblestone'
  | 'volcanic_pyroclast_ash'
  | 'desert_sandstone_terracotta'
  | 'amethyst_geode_crystal'
  | 'corrupted_abyssal_void'
  | 'bloodstained_cathedral_marble'
  | 'forgotten_bone_crypt'
  | 'enchanted_forest_soil_stone'
  | 'sunken_temple_mosaics'
  | 'fortress_ironclad_flagstones'
  | 'arcane_celestial_star'
  | 'haunted_spectral_cathedral'
  | 'obsidian_mirror'
  | 'mineral_cavern_slabs'
  | 'gilded_golden_palace';

export interface BiomePalette {
  id: FloorBiomeId;
  name: string;
  bgDark: string;
  tileBase: string;
  tileBevelLight: string;
  tileBevelDark: string;
  grout: string;
  crack: string;
  accent: string;
  accentGlow: string;
  trimGold: string;
  mossLichen: string;
  medallionGlow: string;
  patternStyle: 'flagstone' | 'grid_marble' | 'hex_basalt' | 'brick_herringbone' | 'mosaic_ornate' | 'chiseled_slab';
  glowIntensity: number;
}

export const FLOOR_BIOMES: Record<FloorBiomeId, BiomePalette> = {
  ancient_weathered_cobblestone: {
    id: 'ancient_weathered_cobblestone',
    name: 'Ancient Weathered Cobblestone',
    bgDark: '#0b0f14',
    tileBase: '#1a222d',
    tileBevelLight: '#2a3545',
    tileBevelDark: '#10151c',
    grout: '#080b0f',
    crack: '#0a0d12',
    accent: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.25)',
    trimGold: '#94a3b8',
    mossLichen: '#1e3a2b',
    medallionGlow: 'rgba(56, 189, 248, 0.4)',
    patternStyle: 'flagstone',
    glowIntensity: 0.3,
  },
  obsidian_basalt_magma: {
    id: 'obsidian_basalt_magma',
    name: 'Obsidian Basalt with Magma Cracks',
    bgDark: '#0e0707',
    tileBase: '#181112',
    tileBevelLight: '#2a1a1c',
    tileBevelDark: '#0d0708',
    grout: '#050202',
    crack: '#ef4444',
    accent: '#f97316',
    accentGlow: 'rgba(239, 68, 68, 0.55)',
    trimGold: '#b45309',
    mossLichen: '#2d150b',
    medallionGlow: 'rgba(249, 115, 22, 0.65)',
    patternStyle: 'hex_basalt',
    glowIntensity: 0.8,
  },
  cracked_castle_marble_gold: {
    id: 'cracked_castle_marble_gold',
    name: 'Castle Marble with Gold Inlays',
    bgDark: '#0d0f14',
    tileBase: '#1c222b',
    tileBevelLight: '#333f4f',
    tileBevelDark: '#12171e',
    grout: '#090b0f',
    crack: '#d97706',
    accent: '#fbbf24',
    accentGlow: 'rgba(251, 191, 36, 0.35)',
    trimGold: '#f59e0b',
    mossLichen: '#1c2826',
    medallionGlow: 'rgba(245, 158, 11, 0.5)',
    patternStyle: 'grid_marble',
    glowIntensity: 0.5,
  },
  glowing_runic_stone: {
    id: 'glowing_runic_stone',
    name: 'Glowing Ancient Runic Stone',
    bgDark: '#090915',
    tileBase: '#14142b',
    tileBevelLight: '#26264d',
    tileBevelDark: '#0d0d1c',
    grout: '#060610',
    crack: '#06b6d4',
    accent: '#8b5cf6',
    accentGlow: 'rgba(6, 182, 212, 0.5)',
    trimGold: '#a78bfa',
    mossLichen: '#0d2836',
    medallionGlow: 'rgba(139, 92, 246, 0.6)',
    patternStyle: 'mosaic_ornate',
    glowIntensity: 0.85,
  },
  mossy_overgrown_ruins: {
    id: 'mossy_overgrown_ruins',
    name: 'Mossy Overgrown Ruin Pavement',
    bgDark: '#080e0a',
    tileBase: '#132018',
    tileBevelLight: '#22382b',
    tileBevelDark: '#0d1610',
    grout: '#050a07',
    crack: '#10b981',
    accent: '#34d399',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    trimGold: '#5eead4',
    mossLichen: '#064e3b',
    medallionGlow: 'rgba(52, 211, 153, 0.5)',
    patternStyle: 'flagstone',
    glowIntensity: 0.4,
  },
  frozen_glacial_cobblestone: {
    id: 'frozen_glacial_cobblestone',
    name: 'Frozen Glacial Cobblestone',
    bgDark: '#08101a',
    tileBase: '#102236',
    tileBevelLight: '#234466',
    tileBevelDark: '#0a1624',
    grout: '#050c14',
    crack: '#38bdf8',
    accent: '#7dd3fc',
    accentGlow: 'rgba(56, 189, 248, 0.5)',
    trimGold: '#e0f2fe',
    mossLichen: '#0c2e3d',
    medallionGlow: 'rgba(125, 211, 252, 0.6)',
    patternStyle: 'chiseled_slab',
    glowIntensity: 0.65,
  },
  volcanic_pyroclast_ash: {
    id: 'volcanic_pyroclast_ash',
    name: 'Volcanic Pyroclast Ash Flooring',
    bgDark: '#120a06',
    tileBase: '#1c120e',
    tileBevelLight: '#301f19',
    tileBevelDark: '#110a08',
    grout: '#080403',
    crack: '#ea580c',
    accent: '#f97316',
    accentGlow: 'rgba(234, 88, 12, 0.5)',
    trimGold: '#fdba74',
    mossLichen: '#291408',
    medallionGlow: 'rgba(249, 115, 22, 0.7)',
    patternStyle: 'hex_basalt',
    glowIntensity: 0.75,
  },
  desert_sandstone_terracotta: {
    id: 'desert_sandstone_terracotta',
    name: 'Desert Sandstone & Terracotta Tiles',
    bgDark: '#120e0a',
    tileBase: '#241a14',
    tileBevelLight: '#3d2c22',
    tileBevelDark: '#17100c',
    grout: '#0b0806',
    crack: '#c2410c',
    accent: '#d97706',
    accentGlow: 'rgba(217, 119, 6, 0.35)',
    trimGold: '#fbbf24',
    mossLichen: '#2b1c11',
    medallionGlow: 'rgba(251, 191, 36, 0.45)',
    patternStyle: 'brick_herringbone',
    glowIntensity: 0.35,
  },
  amethyst_geode_crystal: {
    id: 'amethyst_geode_crystal',
    name: 'Crystal-Infused Amethyst Geode Tiles',
    bgDark: '#0e0817',
    tileBase: '#1b122c',
    tileBevelLight: '#322252',
    tileBevelDark: '#110b1c',
    grout: '#08040d',
    crack: '#c084fc',
    accent: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.55)',
    trimGold: '#f0abfc',
    mossLichen: '#261238',
    medallionGlow: 'rgba(192, 132, 252, 0.65)',
    patternStyle: 'mosaic_ornate',
    glowIntensity: 0.75,
  },
  corrupted_abyssal_void: {
    id: 'corrupted_abyssal_void',
    name: 'Corrupted Abyssal Void Stone',
    bgDark: '#07050d',
    tileBase: '#100c21',
    tileBevelLight: '#211842',
    tileBevelDark: '#0a0715',
    grout: '#030208',
    crack: '#818cf8',
    accent: '#6366f1',
    accentGlow: 'rgba(99, 102, 241, 0.6)',
    trimGold: '#c7d2fe',
    mossLichen: '#150f2e',
    medallionGlow: 'rgba(129, 140, 248, 0.75)',
    patternStyle: 'hex_basalt',
    glowIntensity: 0.8,
  },
  bloodstained_cathedral_marble: {
    id: 'bloodstained_cathedral_marble',
    name: 'Bloodstained Royal Cathedral Marble',
    bgDark: '#10070a',
    tileBase: '#211016',
    tileBevelLight: '#3a1e28',
    tileBevelDark: '#140a0e',
    grout: '#0a0406',
    crack: '#e11d48',
    accent: '#f43f5e',
    accentGlow: 'rgba(225, 29, 72, 0.55)',
    trimGold: '#fda4af',
    mossLichen: '#2a0c14',
    medallionGlow: 'rgba(244, 63, 94, 0.7)',
    patternStyle: 'grid_marble',
    glowIntensity: 0.7,
  },
  forgotten_bone_crypt: {
    id: 'forgotten_bone_crypt',
    name: 'Forgotten Bone Crypt Pavement',
    bgDark: '#0c0d10',
    tileBase: '#1b1d22',
    tileBevelLight: '#2f333c',
    tileBevelDark: '#111216',
    grout: '#08080a',
    crack: '#94a3b8',
    accent: '#cbd5e1',
    accentGlow: 'rgba(203, 213, 225, 0.3)',
    trimGold: '#64748b',
    mossLichen: '#161e1b',
    medallionGlow: 'rgba(203, 213, 225, 0.45)',
    patternStyle: 'flagstone',
    glowIntensity: 0.35,
  },
  enchanted_forest_soil_stone: {
    id: 'enchanted_forest_soil_stone',
    name: 'Enchanted Forest Soil & Stone',
    bgDark: '#080d08',
    tileBase: '#131e13',
    tileBevelLight: '#233823',
    tileBevelDark: '#0e160e',
    grout: '#050805',
    crack: '#22c55e',
    accent: '#86efac',
    accentGlow: 'rgba(34, 197, 94, 0.45)',
    trimGold: '#bbf7d0',
    mossLichen: '#052e16',
    medallionGlow: 'rgba(134, 239, 172, 0.55)',
    patternStyle: 'flagstone',
    glowIntensity: 0.5,
  },
  sunken_temple_mosaics: {
    id: 'sunken_temple_mosaics',
    name: 'Sunken Temple Concentric Mosaics',
    bgDark: '#060e12',
    tileBase: '#0e1e27',
    tileBevelLight: '#1b384a',
    tileBevelDark: '#09141a',
    grout: '#04090c',
    crack: '#06b6d4',
    accent: '#22d3ee',
    accentGlow: 'rgba(6, 182, 212, 0.5)',
    trimGold: '#67e8f9',
    mossLichen: '#08252f',
    medallionGlow: 'rgba(34, 211, 238, 0.65)',
    patternStyle: 'mosaic_ornate',
    glowIntensity: 0.7,
  },
  fortress_ironclad_flagstones: {
    id: 'fortress_ironclad_flagstones',
    name: 'Worn Fortress Ironclad Flagstones',
    bgDark: '#0a0c10',
    tileBase: '#181b22',
    tileBevelLight: '#2c313d',
    tileBevelDark: '#101217',
    grout: '#07080a',
    crack: '#475569',
    accent: '#94a3b8',
    accentGlow: 'rgba(148, 163, 184, 0.3)',
    trimGold: '#cbd5e1',
    mossLichen: '#141c22',
    medallionGlow: 'rgba(148, 163, 184, 0.4)',
    patternStyle: 'chiseled_slab',
    glowIntensity: 0.3,
  },
  arcane_celestial_star: {
    id: 'arcane_celestial_star',
    name: 'Arcane Celestial Star Pavements',
    bgDark: '#070817',
    tileBase: '#101230',
    tileBevelLight: '#20245e',
    tileBevelDark: '#0b0c20',
    grout: '#04050d',
    crack: '#38bdf8',
    accent: '#818cf8',
    accentGlow: 'rgba(56, 189, 248, 0.6)',
    trimGold: '#c084fc',
    mossLichen: '#111333',
    medallionGlow: 'rgba(129, 140, 248, 0.75)',
    patternStyle: 'mosaic_ornate',
    glowIntensity: 0.85,
  },
  haunted_spectral_cathedral: {
    id: 'haunted_spectral_cathedral',
    name: 'Haunted Spectral Cathedral Tiles',
    bgDark: '#060d10',
    tileBase: '#0e1c22',
    tileBevelLight: '#1b343f',
    tileBevelDark: '#0a1318',
    grout: '#04080a',
    crack: '#2dd4bf',
    accent: '#5eead4',
    accentGlow: 'rgba(45, 212, 191, 0.5)',
    trimGold: '#99f6e4',
    mossLichen: '#072426',
    medallionGlow: 'rgba(94, 234, 212, 0.65)',
    patternStyle: 'grid_marble',
    glowIntensity: 0.6,
  },
  obsidian_mirror: {
    id: 'obsidian_mirror',
    name: 'Lustrous Obsidian Mirror Tiles',
    bgDark: '#050608',
    tileBase: '#0d1015',
    tileBevelLight: '#1e2530',
    tileBevelDark: '#080a0d',
    grout: '#020304',
    crack: '#64748b',
    accent: '#94a3b8',
    accentGlow: 'rgba(148, 163, 184, 0.4)',
    trimGold: '#e2e8f0',
    mossLichen: '#0c131a',
    medallionGlow: 'rgba(226, 232, 240, 0.5)',
    patternStyle: 'grid_marble',
    glowIntensity: 0.45,
  },
  mineral_cavern_slabs: {
    id: 'mineral_cavern_slabs',
    name: 'Underground Mineral Cavern Slabs',
    bgDark: '#0a0d0c',
    tileBase: '#161e1b',
    tileBevelLight: '#283732',
    tileBevelDark: '#0f1513',
    grout: '#060807',
    crack: '#14b8a6',
    accent: '#2dd4bf',
    accentGlow: 'rgba(20, 184, 166, 0.45)',
    trimGold: '#5eead4',
    mossLichen: '#0d2822',
    medallionGlow: 'rgba(45, 212, 191, 0.55)',
    patternStyle: 'chiseled_slab',
    glowIntensity: 0.5,
  },
  gilded_golden_palace: {
    id: 'gilded_golden_palace',
    name: 'Gilded Golden Palace Mosaic Tiles',
    bgDark: '#100b06',
    tileBase: '#20160d',
    tileBevelLight: '#3a2919',
    tileBevelDark: '#150f09',
    grout: '#090603',
    crack: '#f59e0b',
    accent: '#fbbf24',
    accentGlow: 'rgba(245, 158, 11, 0.5)',
    trimGold: '#fde68a',
    mossLichen: '#26180b',
    medallionGlow: 'rgba(251, 191, 36, 0.7)',
    patternStyle: 'mosaic_ornate',
    glowIntensity: 0.75,
  },
};

// Seeded Pseudo-Random Number Generator for reproducible variation
export class SeededPRNG {
  private s: number;
  constructor(seed: number) {
    this.s = seed % 2147483647;
    if (this.s <= 0) this.s += 2147483646;
  }
  next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  intRange(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

export class FloorEngine {
  private cachedCanvas: HTMLCanvasElement | null = null;
  private cachedCtx: CanvasRenderingContext2D | null = null;
  private currentBiome: BiomePalette;
  private currentSeed: number = 1337;
  private arenaW: number;
  private arenaH: number;

  constructor(arenaW = 2400, arenaH = 1800, biomeId: FloorBiomeId = 'obsidian_basalt_magma') {
    this.arenaW = arenaW;
    this.arenaH = arenaH;
    this.currentBiome = FLOOR_BIOMES[biomeId] || FLOOR_BIOMES.obsidian_basalt_magma;
  }

  public setBiome(biomeId: FloorBiomeId, seed = Math.floor(Math.random() * 100000)) {
    this.currentBiome = FLOOR_BIOMES[biomeId] || FLOOR_BIOMES.obsidian_basalt_magma;
    this.currentSeed = seed;
    this.regenerateFloor();
  }

  public getBiomeName(): string {
    return this.currentBiome.name;
  }

  public getBiomeId(): FloorBiomeId {
    return this.currentBiome.id;
  }

  public regenerateFloor() {
    if (!this.cachedCanvas) {
      this.cachedCanvas = document.createElement('canvas');
      this.cachedCanvas.width = this.arenaW;
      this.cachedCanvas.height = this.arenaH;
      this.cachedCtx = this.cachedCanvas.getContext('2d');
    }

    const ctx = this.cachedCtx;
    if (!ctx) return;

    const prng = new SeededPRNG(this.currentSeed);
    const p = this.currentBiome;
    const tileSize = 128; // standard modular top-down tile size

    // 1. Deep Dark Base Wash
    ctx.fillStyle = p.bgDark;
    ctx.fillRect(0, 0, this.arenaW, this.arenaH);

    const cols = Math.ceil(this.arenaW / tileSize);
    const rows = Math.ceil(this.arenaH / tileSize);
    const centerX = this.arenaW / 2;
    const centerY = this.arenaH / 2;

    // 2. Render Individual Procedural Tiles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * tileSize;
        const y = r * tileSize;
        const distFromCenter = Math.hypot(x + tileSize / 2 - centerX, y + tileSize / 2 - centerY);

        // Deterministic variation selection
        const tileRoll = prng.next();
        const tileType =
          tileRoll < 0.45
            ? 'PRISTINE'
            : tileRoll < 0.65
            ? 'CRACKED'
            : tileRoll < 0.8
            ? 'CHIPPED_CORNER'
            : tileRoll < 0.92
            ? 'MOSS_OVERLAY'
            : 'RUNIC_ENGRAVING';

        this.drawTile(ctx, x, y, tileSize, p, tileType, prng, distFromCenter);
      }
    }

    // 3. Render Large Concentric Ceremonial Medallion in Center
    this.drawCeremonialMedallion(ctx, centerX, centerY, 380, p, prng);

    // 4. Render Corner Sanctuaries / Quadrant Floor Runes
    const cornerOffset = 340;
    this.drawCornerSigil(ctx, cornerOffset, cornerOffset, 160, p, prng);
    this.drawCornerSigil(ctx, this.arenaW - cornerOffset, cornerOffset, 160, p, prng);
    this.drawCornerSigil(ctx, cornerOffset, this.arenaH - cornerOffset, 160, p, prng);
    this.drawCornerSigil(ctx, this.arenaW - cornerOffset, this.arenaH - cornerOffset, 160, p, prng);

    // 5. Render Outer Arena Border Trim
    this.drawArenaOuterBorder(ctx, this.arenaW, this.arenaH, 48, p);
  }

  private drawTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    p: BiomePalette,
    type: string,
    prng: SeededPRNG,
    distCenter: number
  ) {
    const pad = 2;
    const innerW = size - pad * 2;
    const innerH = size - pad * 2;
    const ix = x + pad;
    const iy = y + pad;

    // Base Stone Fill
    ctx.fillStyle = p.tileBase;
    ctx.fillRect(ix, iy, innerW, innerH);

    // Bevel 3D Lighting (Top & Left light, Bottom & Right dark)
    ctx.fillStyle = p.tileBevelLight;
    ctx.fillRect(ix, iy, innerW, 3);
    ctx.fillRect(ix, iy, 3, innerH);

    ctx.fillStyle = p.tileBevelDark;
    ctx.fillRect(ix, iy + innerH - 3, innerW, 3);
    ctx.fillRect(ix + innerW - 3, iy, 3, innerH);

    // Micro Surface Noise / Texture Grain
    ctx.fillStyle = prng.next() > 0.5 ? p.tileBevelLight : p.tileBevelDark;
    const grainCount = prng.intRange(4, 10);
    for (let g = 0; g < grainCount; g++) {
      const gx = ix + prng.range(4, innerW - 8);
      const gy = iy + prng.range(4, innerH - 8);
      const gw = prng.range(2, 6);
      const gh = prng.range(2, 5);
      ctx.fillRect(gx, gy, gw, gh);
    }

    // Grout Line Border
    ctx.strokeStyle = p.grout;
    ctx.lineWidth = 2;
    ctx.strokeRect(ix, iy, innerW, innerH);

    // Specialized Variations
    if (type === 'CRACKED') {
      // Procedural Jagged Fissure
      ctx.beginPath();
      let cx = ix + prng.range(8, innerW - 8);
      let cy = iy + prng.range(8, innerH - 8);
      ctx.moveTo(cx, cy);

      const segments = prng.intRange(3, 6);
      for (let s = 0; s < segments; s++) {
        cx += prng.range(-18, 18);
        cy += prng.range(-18, 18);
        ctx.lineTo(cx, cy);
      }
      ctx.strokeStyle = p.crack;
      ctx.lineWidth = prng.range(1.5, 2.5);
      ctx.stroke();

      // Subtle magma or runic glow in crack
      if (p.glowIntensity > 0.4) {
        ctx.strokeStyle = p.accent;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else if (type === 'CHIPPED_CORNER') {
      // Corner chunk missing with deep dark void/grout
      const corner = prng.intRange(0, 3);
      ctx.fillStyle = p.grout;
      ctx.beginPath();
      if (corner === 0) {
        ctx.moveTo(ix, iy);
        ctx.lineTo(ix + 16, iy);
        ctx.lineTo(ix, iy + 16);
      } else if (corner === 1) {
        ctx.moveTo(ix + innerW, iy);
        ctx.lineTo(ix + innerW - 16, iy);
        ctx.lineTo(ix + innerW, iy + 16);
      } else if (corner === 2) {
        ctx.moveTo(ix, iy + innerH);
        ctx.lineTo(ix + 16, iy + innerH);
        ctx.lineTo(ix, iy + innerH - 16);
      } else {
        ctx.moveTo(ix + innerW, iy + innerH);
        ctx.lineTo(ix + innerW - 16, iy + innerH);
        ctx.lineTo(ix + innerW, iy + innerH - 16);
      }
      ctx.closePath();
      ctx.fill();
    } else if (type === 'MOSS_OVERLAY') {
      // Crevice lichen / crystal cluster
      ctx.fillStyle = p.mossLichen;
      const patchCount = prng.intRange(3, 7);
      for (let m = 0; m < patchCount; m++) {
        const mx = ix + prng.range(4, innerW - 12);
        const my = iy + prng.range(4, innerH - 12);
        const mr = prng.range(4, 10);
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'RUNIC_ENGRAVING') {
      // Ancient Mystical Engraved Glyph
      const glyphCX = ix + innerW / 2;
      const glyphCY = iy + innerH / 2;
      ctx.save();
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const glyphStyle = prng.intRange(0, 4);
      if (glyphStyle === 0) {
        // Star rune
        ctx.arc(glyphCX, glyphCY, 14, 0, Math.PI * 2);
        ctx.moveTo(glyphCX - 12, glyphCY);
        ctx.lineTo(glyphCX + 12, glyphCY);
        ctx.moveTo(glyphCX, glyphCY - 12);
        ctx.lineTo(glyphCX, glyphCY + 12);
      } else if (glyphStyle === 1) {
        // Diamond rune
        ctx.moveTo(glyphCX, glyphCY - 16);
        ctx.lineTo(glyphCX + 14, glyphCY);
        ctx.lineTo(glyphCX, glyphCY + 16);
        ctx.lineTo(glyphCX - 14, glyphCY);
        ctx.closePath();
      } else if (glyphStyle === 2) {
        // Triskelion / Tri-arc
        ctx.arc(glyphCX, glyphCY, 12, 0, Math.PI * 1.5);
        ctx.moveTo(glyphCX, glyphCY - 16);
        ctx.lineTo(glyphCX, glyphCY + 16);
      } else {
        // Concentric squares
        ctx.strokeRect(glyphCX - 12, glyphCY - 12, 24, 24);
        ctx.strokeRect(glyphCX - 6, glyphCY - 6, 12, 12);
      }
      ctx.stroke();

      // Ambient glyph center glow dot
      ctx.fillStyle = p.accentGlow;
      ctx.beginPath();
      ctx.arc(glyphCX, glyphCY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawCeremonialMedallion(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    p: BiomePalette,
    prng: SeededPRNG
  ) {
    ctx.save();

    // 1. Soft Background Glow Halo
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.1);
    grad.addColorStop(0, p.medallionGlow);
    grad.addColorStop(0.7, p.accentGlow);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Heavy Runic Stone Rim
    ctx.strokeStyle = p.trimGold;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary inner concentric circle
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 24, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Radiating Sun Rays / Geometric Star Spokes
    const spokes = 16;
    ctx.strokeStyle = p.trimGold;
    ctx.lineWidth = 2.5;
    for (let i = 0; i < spokes; i++) {
      const angle = (i / spokes) * Math.PI * 2;
      const x1 = cx + Math.cos(angle) * (radius - 24);
      const y1 = cy + Math.sin(angle) * (radius - 24);
      const x2 = cx + Math.cos(angle) * radius;
      const y2 = cy + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 4. Inscribed Concentric 8-Point Star / Octagram
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const innerAngle = angle + Math.PI / 8;
      const rOuter = radius * 0.75;
      const rInner = radius * 0.45;

      const ox = cx + Math.cos(angle) * rOuter;
      const oy = cy + Math.sin(angle) * rOuter;
      const ix = cx + Math.cos(innerAngle) * rInner;
      const iy = cy + Math.sin(innerAngle) * rInner;

      if (i === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.stroke();

    // 5. Center Core Seal & Darkened Altar Plate
    ctx.fillStyle = p.bgDark;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = p.trimGold;
    ctx.lineWidth = 5;
    ctx.stroke();

    // Center Mystical Eye / Overlord Seal Symbol
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawCornerSigil(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    p: BiomePalette,
    prng: SeededPRNG
  ) {
    ctx.save();
    // Concentric Diamond Sigil
    ctx.strokeStyle = p.trimGold;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx + radius, cy);
    ctx.lineTo(cx, cy + radius);
    ctx.lineTo(cx - radius, cy);
    ctx.closePath();
    ctx.stroke();

    // Inner Inscribed Circle
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
    ctx.stroke();

    // Center Cross
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.45, cy);
    ctx.lineTo(cx + radius * 0.45, cy);
    ctx.moveTo(cx, cy - radius * 0.45);
    ctx.lineTo(cx, cy + radius * 0.45);
    ctx.stroke();

    ctx.restore();
  }

  private drawArenaOuterBorder(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    borderSize: number,
    p: BiomePalette
  ) {
    ctx.save();
    // Outer Void Shroud / Shadow Vignette
    ctx.strokeStyle = p.grout;
    ctx.lineWidth = borderSize;
    ctx.strokeRect(borderSize / 2, borderSize / 2, w - borderSize, h - borderSize);

    // Golden / Runic Perimeter Trim Line
    ctx.strokeStyle = p.trimGold;
    ctx.lineWidth = 4;
    ctx.strokeRect(borderSize, borderSize, w - borderSize * 2, h - borderSize * 2);

    ctx.strokeStyle = p.accentGlow;
    ctx.lineWidth = 8;
    ctx.strokeRect(borderSize, borderSize, w - borderSize * 2, h - borderSize * 2);
    ctx.restore();
  }

  public render(ctx: CanvasRenderingContext2D, camX: number, camY: number, viewW: number, viewH: number) {
    if (!this.cachedCanvas) {
      this.regenerateFloor();
    }

    if (this.cachedCanvas) {
      // Highly optimized single clipped/tiled blit from the offscreen cached buffer
      const sx = Math.max(0, Math.floor(camX));
      const sy = Math.max(0, Math.floor(camY));
      const sw = Math.min(this.arenaW - sx, viewW);
      const sh = Math.min(this.arenaH - sy, viewH);

      if (sw > 0 && sh > 0) {
        ctx.drawImage(this.cachedCanvas, sx, sy, sw, sh, sx, sy, sw, sh);
      }
    }
  }
}

// Map each boss character to their signature preferred floor biomes
export function getRecommendedBiomeForBoss(bossId: string): FloorBiomeId {
  switch (bossId) {
    case 'demon_monarch':
      return 'obsidian_basalt_magma';
    case 'lich_lord':
      return 'forgotten_bone_crypt';
    case 'vampire_queen':
      return 'bloodstained_cathedral_marble';
    case 'shadow_reaper':
      return 'corrupted_abyssal_void';
    case 'cursed_golem':
      return 'mineral_cavern_slabs';
    default:
      return 'ancient_weathered_cobblestone';
  }
}

// All 20 Biome IDs for easy rotation or selection
export const ALL_BIOME_IDS: FloorBiomeId[] = [
  'ancient_weathered_cobblestone',
  'obsidian_basalt_magma',
  'cracked_castle_marble_gold',
  'glowing_runic_stone',
  'mossy_overgrown_ruins',
  'frozen_glacial_cobblestone',
  'volcanic_pyroclast_ash',
  'desert_sandstone_terracotta',
  'amethyst_geode_crystal',
  'corrupted_abyssal_void',
  'bloodstained_cathedral_marble',
  'forgotten_bone_crypt',
  'enchanted_forest_soil_stone',
  'sunken_temple_mosaics',
  'fortress_ironclad_flagstones',
  'arcane_celestial_star',
  'haunted_spectral_cathedral',
  'obsidian_mirror',
  'mineral_cavern_slabs',
  'gilded_golden_palace',
];
