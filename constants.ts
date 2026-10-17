export const CONFIG = {
  // Baseline Game Information
  title: {
    value: 'Eternal Overlord',
    type: 'string',
    label: 'Game Title',
    group: 'GAME',
  },
  baseCanvasWidth: {
    value: 1280,
    type: 'number',
    label: 'Base Canvas Width',
    group: 'GAME',
  },
  baseCanvasHeight: {
    value: 720,
    type: 'number',
    label: 'Base Canvas Height',
    group: 'GAME',
  },

  // System Constants
  targetFPS: {
    value: 60,
    type: 'number',
    label: 'Target FPS',
    group: 'SYSTEM',
  },
  stepMs: {
    value: 1000 / 60,
    type: 'number',
    label: 'Step MS',
    group: 'SYSTEM',
  },
  maxSubSteps: {
    value: 5,
    type: 'number',
    label: 'Max Sub Steps',
    group: 'SYSTEM',
  },

  // Theme Constants
  backgroundColor: {
    value: '#090a10',
    type: 'color',
    label: 'Background Color',
    group: 'THEME',
  },
  primaryColor: {
    value: '#ef4444',
    type: 'color',
    label: 'Primary Color',
    group: 'THEME',
  },
  fontFamily: {
    value: "'Cinzel', 'MedievalSharp', 'Cinzel Decorative', serif",
    type: 'string',
    label: 'Font Family',
    group: 'THEME',
  },

  // Audio Levels
  defaultMusicVolume: {
    value: 0.5,
    type: 'number',
    label: 'Default Music Volume',
    group: 'AUDIO',
  },
  defaultSfxVolume: {
    value: 0.6,
    type: 'number',
    label: 'Default SFX Volume',
    group: 'AUDIO',
  },

  // Gameplay & Balance Rules (Tunable)
  bossMaxHp: {
    value: 500,
    type: 'number',
    label: 'Boss Max HP',
    group: 'Rules',
  },
  playerSpeed: {
    value: 230,
    type: 'number',
    label: 'Boss Move Speed',
    group: 'Physics',
  },
  dashCooldown: {
    value: 2.2,
    type: 'number',
    label: 'Dash Cooldown (s)',
    group: 'Rules',
  },
  dashDuration: {
    value: 0.3,
    type: 'number',
    label: 'Dash I-Frame Duration (s)',
    group: 'Rules',
  },
  pickupRadius: {
    value: 130,
    type: 'number',
    label: 'Pickup Magnet Radius',
    group: 'Rules',
  },
  enemySpawnRateMultiplier: {
    value: 1.0,
    type: 'number',
    label: 'Spawn Multiplier',
    group: 'Rules',
  },
  ultimateCooldown: {
    value: 36.0,
    type: 'number',
    label: 'Ultimate Cooldown (s)',
    group: 'Rules',
  },
  screenShakeIntensity: {
    value: 1.0,
    type: 'number',
    label: 'Screen Shake Intensity',
    group: 'Visuals',
  },

  // Asset Aspect Ratios and Dimensions (from read_assets_metadata)
  assetDungeonFloorCryptAspectRatio: {
    value: 1024 / 784,
    type: 'number',
    label: 'Crypt Floor Aspect Ratio',
    group: 'ASSETS',
  },
  assetDungeonFloorInfernalAspectRatio: {
    value: 1024 / 965,
    type: 'number',
    label: 'Infernal Floor Aspect Ratio',
    group: 'ASSETS',
  },
  assetPillarAspectRatio: {
    value: 454 / 850,
    type: 'number',
    label: 'Pillar Aspect Ratio',
    group: 'ASSETS',
  },
  assetInfernalOrbAspectRatio: {
    value: 711 / 496,
    type: 'number',
    label: 'Infernal Orb Aspect Ratio',
    group: 'ASSETS',
  },
  assetFrostShardAspectRatio: {
    value: 536 / 539,
    type: 'number',
    label: 'Frost Shard Aspect Ratio',
    group: 'ASSETS',
  },
  assetLightningBoltAspectRatio: {
    value: 886 / 640,
    type: 'number',
    label: 'Lightning Bolt Aspect Ratio',
    group: 'ASSETS',
  },
  assetVoidBlackholeAspectRatio: {
    value: 862 / 628,
    type: 'number',
    label: 'Void Blackhole Aspect Ratio',
    group: 'ASSETS',
  },
  assetScytheSlashAspectRatio: {
    value: 833 / 680,
    type: 'number',
    label: 'Scythe Slash Aspect Ratio',
    group: 'ASSETS',
  },
  assetExpGemAspectRatio: {
    value: 579 / 578,
    type: 'number',
    label: 'Exp Gem Aspect Ratio',
    group: 'ASSETS',
  },
  assetGoldCoinAspectRatio: {
    value: 690 / 629,
    type: 'number',
    label: 'Gold Coin Aspect Ratio',
    group: 'ASSETS',
  },
  assetHealthPotionAspectRatio: {
    value: 537 / 659,
    type: 'number',
    label: 'Health Potion Aspect Ratio',
    group: 'ASSETS',
  },
  assetBossSoulAspectRatio: {
    value: 505 / 701,
    type: 'number',
    label: 'Boss Soul Aspect Ratio',
    group: 'ASSETS',
  },
  assetChestAspectRatio: {
    value: 815 / 680,
    type: 'number',
    label: 'Chest Aspect Ratio',
    group: 'ASSETS',
  },
  assetCardFrameAspectRatio: {
    value: 946 / 772,
    type: 'number',
    label: 'Card Frame Aspect Ratio',
    group: 'ASSETS',
  },
};

// Merge customized config values if present (injected by Playground)
const { playgroundConfig } = globalThis as {
  playgroundConfig?: Record<string, unknown>;
};
if (playgroundConfig) {
  for (const [key, value] of Object.entries(playgroundConfig)) {
    if (key in CONFIG) {
      Object.assign(CONFIG[key as keyof typeof CONFIG], { value });
    }
  }
}

export type ConfigKey = keyof typeof CONFIG;

export function getConfig<K extends ConfigKey>(
  key: K,
): (typeof CONFIG)[K]['value'] {
  return CONFIG[key].value;
}
