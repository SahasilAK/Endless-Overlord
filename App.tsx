// tslint:disable
/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App as AndroidApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import {
  Play,
  RotateCw,
  Volume2,
  VolumeX,
  Shield,
  Zap,
  Sparkles,
  Trophy,
  Heart,
  Skull,
  Crosshair,
  Flame,
  Snowflake,
  Activity,
  Menu,
  X,
  Package,
  BookOpen,
  ShoppingBag,
  RefreshCw,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  Award,
  Clock,
  Swords,
  Target,
  Settings,
  Star,
  CheckCircle,
  Sliders,
  Layers,
  Plus,
  Compass,
  Database,
  Save,
  Trash2,
  Check,
  HardDrive,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { getConfig } from './constants';
import BackgroundMusic from './utils/BackgroundMusic';
import {
  createFixedStepper,
  formatTime,
  GameState,
  MenuOverlay,
  Overlay,
  prepareCanvas,
  useAssets,
  useAutoFocus,
  useInput,
  useIsMobile,
  gameAudio,
  clamp,
} from './utils/helper';
import {
  usePlayground,
  usePlaygroundGameLifecycle,
  useRpc,
} from './utils/usePlayground';
import {
  SpriteRenderer,
  SpriteActionConfig,
  SpriteAnimationState,
} from './SpriteRenderer';
import {
  UndeadProceduralRenderer,
  SummonAnimationAction,
  SummonRenderState,
} from './UndeadProceduralRenderer';
import {
  FloorEngine,
  FloorBiomeId,
  getRecommendedBiomeForBoss,
  ALL_BIOME_IDS,
  FLOOR_BIOMES,
} from './FloorEngine';
import {
  ALL_BOSS_SKILLS,
  BossSkillDef,
  generateCharacterDraftPool,
  getBossSkills,
  SkillCategory,
  SkillRarity,
  CharacterSkillTreeNode,
  CharacterProgressionData,
  CharacterMilestoneUltimate,
  TreeBranchType,
  DEMON_TREE_ACTIVE_SKILLS,
  DEMON_TREE_PASSIVES,
  ALL_DEMON_TREE_NODES,
  DEMON_MILESTONE_ULTIMATES,
  LICH_TREE_ACTIVE_SKILLS,
  LICH_TREE_PASSIVES,
  ALL_LICH_TREE_NODES,
  LICH_MILESTONE_ULTIMATES,
  VAMPIRE_TREE_ACTIVE_SKILLS,
  VAMPIRE_TREE_PASSIVES,
  ALL_VAMPIRE_TREE_NODES,
  VAMPIRE_MILESTONE_ULTIMATES,
  REAPER_TREE_ACTIVE_SKILLS,
  REAPER_TREE_PASSIVES,
  ALL_REAPER_TREE_NODES,
  REAPER_MILESTONE_ULTIMATES,
  GOLEM_TREE_ACTIVE_SKILLS,
  GOLEM_TREE_PASSIVES,
  ALL_GOLEM_TREE_NODES,
  GOLEM_MILESTONE_ULTIMATES,
  ALL_CHARACTER_NODES,
  calculateCharacterSkillPoints,
  getCharacterBranches,
} from './skillsData';

// --- ALL SPRITESHEET & STATIC ASSETS MANIFEST ---
const ASSETS_MANIFEST: Record<string, string> = {
  floor_crypt: 'assets/images/dungeon_floor_crypt.png',
  floor_infernal: 'assets/images/dungeon_floor_infernal.png',
  pillar: 'assets/images/dungeon_pillar_obstacle.png',

  spell_infernal_orb: 'assets/images/spell_infernal_orb.png',
  spell_frost_shard: 'assets/images/spell_frost_shard.png',
  spell_lightning_bolt: 'assets/images/spell_lightning_bolt.png',
  spell_void_blackhole: 'assets/images/spell_void_blackhole.png',
  weapon_scythe_slash: 'assets/images/weapon_scythe_slash.png',

  item_experience_gem: 'assets/images/item_experience_gem.png',
  item_gold_coin: 'assets/images/item_gold_coin.png',
  item_health_potion: 'assets/images/item_health_potion.png',
  item_boss_soul: 'assets/images/item_boss_soul.png',
  item_treasure_chest: 'assets/images/item_treasure_chest.png',
  ui_skill_card_frame: 'assets/images/ui_skill_card_frame.png',

  boss_demon_monarch_idle: 'assets/images/boss_demon_monarch_idle.png',
  boss_demon_monarch_run: 'assets/images/boss_demon_monarch_run.png',
  boss_demon_monarch_attack: 'assets/images/boss_demon_monarch_attack.png',
  boss_demon_monarch_hurt: 'assets/images/boss_demon_monarch_hurt.png',
  boss_demon_monarch_death: 'assets/images/boss_demon_monarch_death.png',

  boss_lich_lord_idle: 'assets/images/boss_lich_lord_idle.png',
  boss_lich_lord_run: 'assets/images/boss_lich_lord_run.png',
  boss_lich_lord_attack: 'assets/images/boss_lich_lord_attack.png',
  boss_lich_lord_hurt: 'assets/images/boss_lich_lord_hurt.png',
  boss_lich_lord_death: 'assets/images/boss_lich_lord_death.png',

  boss_vampire_queen_idle: 'assets/images/boss_vampire_queen_idle.png',
  boss_vampire_queen_run: 'assets/images/boss_vampire_queen_run.png',
  boss_vampire_queen_attack: 'assets/images/boss_vampire_queen_attack.png',
  boss_vampire_queen_hurt: 'assets/images/boss_vampire_queen_hurt.png',
  boss_vampire_queen_death: 'assets/images/boss_vampire_queen_death.png',

  boss_shadow_reaper_idle: 'assets/images/boss_shadow_reaper_idle.png',
  boss_shadow_reaper_run: 'assets/images/boss_shadow_reaper_run.png',
  boss_shadow_reaper_attack: 'assets/images/boss_shadow_reaper_attack.png',
  boss_shadow_reaper_hurt: 'assets/images/boss_shadow_reaper_hurt.png',
  boss_shadow_reaper_death: 'assets/images/boss_shadow_reaper_death.png',

  boss_cursed_golem_idle: 'assets/images/boss_cursed_golem_idle.png',
  boss_cursed_golem_run: 'assets/images/boss_cursed_golem_run.png',
  boss_cursed_golem_attack: 'assets/images/boss_cursed_golem_attack.png',
  boss_cursed_golem_hurt: 'assets/images/boss_cursed_golem_hurt.png',
  boss_cursed_golem_death: 'assets/images/boss_cursed_golem_death.png',

  enemy_swordsman_idle: 'assets/images/enemy_swordsman_idle.png',
  enemy_swordsman_run: 'assets/images/enemy_swordsman_run.png',
  enemy_swordsman_attack: 'assets/images/enemy_swordsman_attack.png',
  enemy_swordsman_hurt: 'assets/images/enemy_swordsman_hurt.png',
  enemy_swordsman_death: 'assets/images/enemy_swordsman_death.png',

  enemy_archer_idle: 'assets/images/enemy_archer_idle.png',
  enemy_archer_run: 'assets/images/enemy_archer_run.png',
  enemy_archer_attack: 'assets/images/enemy_archer_attack.png',
  enemy_archer_hurt: 'assets/images/enemy_archer_hurt.png',
  enemy_archer_death: 'assets/images/enemy_archer_death.png',

  enemy_mage_idle: 'assets/images/enemy_mage_idle.png',
  enemy_mage_run: 'assets/images/enemy_mage_run.png',
  enemy_mage_attack: 'assets/images/enemy_mage_attack.png',
  enemy_mage_hurt: 'assets/images/enemy_mage_hurt.png',
  enemy_mage_death: 'assets/images/enemy_mage_death.png',

  enemy_paladin_idle: 'assets/images/enemy_paladin_idle.png',
  enemy_paladin_run: 'assets/images/enemy_paladin_run.png',
  enemy_paladin_attack: 'assets/images/enemy_paladin_attack.png',
  enemy_paladin_hurt: 'assets/images/enemy_paladin_hurt.png',
  enemy_paladin_death: 'assets/images/enemy_paladin_death.png',

  enemy_rogue_idle: 'assets/images/enemy_rogue_idle.png',
  enemy_rogue_run: 'assets/images/enemy_rogue_run.png',
  enemy_rogue_attack: 'assets/images/enemy_rogue_attack.png',
  enemy_rogue_hurt: 'assets/images/enemy_rogue_hurt.png',
  enemy_rogue_death: 'assets/images/enemy_rogue_death.png',

  enemy_berserker_idle: 'assets/images/enemy_berserker_idle.png',
  enemy_berserker_run: 'assets/images/enemy_berserker_run.png',
  enemy_berserker_attack: 'assets/images/enemy_berserker_attack.png',
  enemy_berserker_hurt: 'assets/images/enemy_berserker_hurt.png',
  enemy_berserker_death: 'assets/images/enemy_berserker_death.png',

  invader_grand_inquisitor_idle: 'assets/images/invader_grand_inquisitor_idle.png',
  invader_grand_inquisitor_run: 'assets/images/invader_grand_inquisitor_run.png',
  invader_grand_inquisitor_attack: 'assets/images/invader_grand_inquisitor_attack.png',
  invader_grand_inquisitor_hurt: 'assets/images/invader_grand_inquisitor_hurt.png',
  invader_grand_inquisitor_death: 'assets/images/invader_grand_inquisitor_death.png',

  invader_dragon_slayer_idle: 'assets/images/invader_dragon_slayer_idle.png',
  invader_dragon_slayer_run: 'assets/images/invader_dragon_slayer_run.png',
  invader_dragon_slayer_attack: 'assets/images/invader_dragon_slayer_attack.png',
  invader_dragon_slayer_hurt: 'assets/images/invader_dragon_slayer_hurt.png',
  invader_dragon_slayer_death: 'assets/images/invader_dragon_slayer_death.png',

  invader_royal_archmage_idle: 'assets/images/invader_royal_archmage_idle.png',
  invader_royal_archmage_run: 'assets/images/invader_royal_archmage_run.png',
  invader_royal_archmage_attack: 'assets/images/invader_royal_archmage_attack.png',
  invader_royal_archmage_hurt: 'assets/images/invader_royal_archmage_hurt.png',
  invader_royal_archmage_death: 'assets/images/invader_royal_archmage_death.png',
};

export type MeleeWeaponType =
  | 'greatsword'
  | 'scythe'
  | 'hammer'
  | 'blade'
  | 'volcanic_greatsword'
  | 'obsidian_executioner'
  | 'cursed_zweihander';

export type ControlScheme = 'AUTO' | 'KEYBOARD' | 'TOUCH';

// Character Archetypes Definitions
export type BossClassId =
  | 'demon_monarch'
  | 'lich_lord'
  | 'vampire_queen'
  | 'shadow_reaper'
  | 'cursed_golem';

// Ability Tray Slot Definition
export interface HudSkillSlot {
  id: string;
  name: string;
  category: string;
  level: number;
  color: string;
  keyBadge: string;
  cdRemaining: number;
  cdMax: number;
  cdProgress: number; // 0 -> 1
  isReady: boolean;
  resourceCost?: number;
  canCastResource?: boolean;
  slotIndex?: number;
}

// Floating Speech Bark Definition
export interface SpeechBark {
  id: string;
  speaker: 'boss' | 'hero';
  speakerName: string;
  text: string;
  targetId?: string;
  x: number;
  y: number;
  timer: number;
  maxDuration: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Voice Line Database
const BOSS_KILL_LINES = [
  'Pathetic mortals!',
  'Kneel before the Infernal Sovereign!',
  'Your ashes shall pave my underworld throne!',
  'Rise and serve your new master!',
  'The hellfire abyss welcomes another fool!',
  'Your vitality feeds my eternal flame!',
  'Mwahahaha! Ha-ha-ha!',
];

const BOSS_ULTIMATE_LINES = [
  'Witness Hellblade Judgment!',
  'Awaken, Armies of the Damned!',
  'Rain of a Thousand Blades falls upon you!',
  'The Infernal Apocalypse begins now!',
  'Drown in absolute Cryostasis!',
];

const BOSS_START_LINES = [
  'The infernal abyss hungers for fresh blood! Slay them all!',
  'Tremble, mortal crusaders! The Demon Monarch reigns!',
  'You dare disturb the sanctum of the Overlord?!',
];

const HERO_SPAWN_LINES = [
  'For the Golden Realm! Slay the Dungeon Lord!',
  'Purge the foul demon! Cleanse this crypt!',
  'Champions, advance! Cleanse this dungeon!',
  'By the Holy Light, darkness shall fall!',
];

const HERO_DEATH_LINES = [
  'Impossible... the infernal blade...',
  'The realm... will fall to darkness...',
  'Aargh... my soul is slipping away...',
  'You cannot conquer... the Golden light...',
];

export interface MilestonePerk {
  levelReq: number;
  id: string;
  name: string;
  desc: string;
}

export interface BossClassData {
  id: BossClassId;
  name: string;
  title: string;
  desc: string;
  resourceName: string;
  resourceType: 'fury' | 'essence' | 'blood' | 'void' | 'earth';
  isMelee: boolean;
  hpMod: number;
  speedMod: number;
  damageMod: number;
  startSkill: string;
  ultimateName: string;
  ultimateDesc: string;
  color: string;
  spritePrefix: string;
  themeGradient: string;
  milestones: MilestonePerk[];
}

const BOSS_CLASSES: BossClassData[] = [
  {
    id: 'demon_monarch',
    name: 'Demon Monarch',
    title: 'Lord of the Hellfire Abyss & Infernal Sword Emperor',
    desc: 'Brutal greatsword emperor wielding blazing infernal blade arts, volcanic ground cleaves, and sweeping flame shockwaves powered by Infernal Fury.',
    resourceName: 'Infernal Fury',
    resourceType: 'fury',
    isMelee: true,
    hpMod: 1.35,
    speedMod: 1.0,
    damageMod: 1.35,
    startSkill: 'dm_swords_infernal_cleave',
    ultimateName: 'Hellblade Judgment',
    ultimateDesc: 'Calls down a colossal flaming greatsword from the heavens that detonates in cascading magma shockwaves.',
    color: '#ef4444',
    spritePrefix: 'boss_demon_monarch',
    themeGradient: 'from-red-950 via-red-900 to-black',
    milestones: [
      { levelReq: 50, id: 'dm_ult_hellblade_judgment', name: 'Hellblade Judgment', desc: 'Unlocks Level 50 Milestone Ultimate: Colossal flaming sword sky crash.' },
      { levelReq: 100, id: 'dm_ult_demon_kings_awakening', name: "Demon King's Awakening", desc: 'Unlocks Level 100 Milestone Ultimate: True giant demon form with flaming greatsword.' },
      { levelReq: 150, id: 'dm_ult_thousand_blades', name: 'Rain of a Thousand Blades', desc: 'Unlocks Level 150 Milestone Ultimate: Infernal greatsword rain shredding whole arena.' },
      { levelReq: 200, id: 'dm_ult_infernal_apocalypse', name: 'Infernal Apocalypse', desc: 'Unlocks Level 200 Milestone Ultimate: Massive arena lava fissure cataclysm with tectonic sword strikes.' },
      { levelReq: 250, id: 'dm_ult_throne_of_eternal_flame', name: 'Throne of Eternal Flame', desc: 'Unlocks Level 250 Milestone Ultimate: True Monarch ascension and infinite fury.' },
    ],
  },
  {
    id: 'lich_lord',
    name: 'Lich Lord',
    title: 'Supreme Necromancer & Undead Commander',
    desc: 'Supreme commander of the undead crypt. Harvests Soul Essence from slain foes to summon 10 specialized minion types and cast 50 active spells across 5 branches.',
    resourceName: 'Soul Essence',
    resourceType: 'essence',
    isMelee: false,
    hpMod: 1.15,
    speedMod: 1.05,
    damageMod: 1.35,
    startSkill: 'lich_spell_grave_frost',
    ultimateName: 'Army of the Damned',
    ultimateDesc: 'Awakens an insurmountable circle of skeletal guardians, marksmen, and frost eruptions.',
    color: '#06b6d4',
    spritePrefix: 'boss_lich_lord',
    themeGradient: 'from-cyan-950 via-slate-900 to-black',
    milestones: [
      { levelReq: 50, id: 'ult_army_of_damned', name: 'Army of the Damned', desc: 'Unlocks Level 50 Milestone Ultimate: Summons 12 Skeletal Warriors with Frost Nova eruptions.' },
      { levelReq: 100, id: 'ult_ossuary_dragon', name: 'Ossuary Dragon Awakening', desc: 'Unlocks Level 100 Milestone Ultimate: Calls a colossal flying Skeletal Dragon.' },
      { levelReq: 150, id: 'ult_eternal_winter_court', name: 'Eternal Winter Court', desc: 'Unlocks Level 150 Milestone Ultimate: 8s Screen Deep-Freeze & Arch-Lich Apparitions.' },
      { levelReq: 200, id: 'ult_black_star_eclipse', name: 'Black Star Eclipse', desc: 'Unlocks Level 200 Milestone Ultimate: Supermassive Event Horizon executing enemies.' },
      { levelReq: 250, id: 'ult_world_grave_awakening', name: 'World Grave Awakening', desc: 'Unlocks Level 250 Milestone Ultimate: Screen-wide army of darkness resurrection.' },
    ],
  },
  {
    id: 'vampire_queen',
    name: 'Vampire Queen',
    title: 'Empress of Blood & Shadows',
    desc: 'Aristocratic blood monarch wielding swift ruby rapier flourishes, seeking needle barrages, and loyal swarms of vampiric bats powered by Blood Essence.',
    resourceName: 'Blood Essence',
    resourceType: 'blood',
    isMelee: true,
    hpMod: 1.15,
    speedMod: 1.18,
    damageMod: 1.3,
    startSkill: 'vq_sorc_crimson_needle',
    ultimateName: 'Crimson Masquerade',
    ultimateDesc: 'Spectral vampire dancers materialize across the entire arena, slashing and draining 35% HP from all invaders.',
    color: '#ec4899',
    spritePrefix: 'boss_vampire_queen',
    themeGradient: 'from-pink-950 via-rose-950 to-black',
    milestones: [
      { levelReq: 50, id: 'vq_ult_crimson_masquerade', name: 'Crimson Masquerade', desc: 'Unlocks Level 50 Milestone Ultimate: Spectral vampire dancers slash and drain arena.' },
      { levelReq: 100, id: 'vq_ult_night_of_thousand_wings', name: 'Night of a Thousand Wings', desc: 'Unlocks Level 100 Milestone Ultimate: Massive bat storm blanket covering battlefield.' },
      { levelReq: 150, id: 'vq_ult_sanguine_cathedral', name: 'Sanguine Cathedral', desc: 'Unlocks Level 150 Milestone Ultimate: Vampiric territory draining heroes and boosting queen.' },
      { levelReq: 200, id: 'vq_ult_scarlet_moon_coronation', name: 'Scarlet Moon Coronation', desc: 'Unlocks Level 200 Milestone Ultimate: Blood moon unleashing 20 crimson orbital strikes.' },
      { levelReq: 250, id: 'vq_ult_eternal_blood_empress', name: 'Eternal Blood Empress', desc: 'Unlocks Level 250 Milestone Ultimate: True ancient vampire queen ascension with blood wings.' },
    ],
  },
  {
    id: 'shadow_reaper',
    name: 'Shadow Reaper',
    title: 'Harbinger of the Void Singularity & Spectral Executioner',
    desc: 'Swift umbral executioner wielding obsidian spectral scythes, responsive shadowstep teleports, and active AI shadow clones powered by Reaper’s Marks.',
    resourceName: "Reaper's Marks",
    resourceType: 'void',
    isMelee: true,
    hpMod: 1.1,
    speedMod: 1.25,
    damageMod: 1.4,
    startSkill: 'sr_scythe_crescent_reap',
    ultimateName: 'Dance of Ten Thousand Cuts',
    ultimateDesc: 'Rapid sequence of screen-wide scythe attacks, mass Soul Marking, and void afterimage blitz.',
    color: '#a855f7',
    spritePrefix: 'boss_shadow_reaper',
    themeGradient: 'from-purple-950 via-slate-950 to-black',
    milestones: [
      { levelReq: 50, id: 'sr_ult_dance_ten_thousand_cuts', name: 'Dance of Ten Thousand Cuts', desc: 'Unlocks Level 50 Milestone Ultimate: Rapid sequence of screen-wide scythe attacks.' },
      { levelReq: 100, id: 'sr_ult_night_without_footsteps', name: 'Night Without Footsteps', desc: 'Unlocks Level 100 Milestone Ultimate: Untargetable spectral state with afterimage assault.' },
      { levelReq: 150, id: 'sr_ult_umbral_labyrinth', name: 'Umbral Labyrinth', desc: 'Unlocks Level 150 Milestone Ultimate: Shadow maze slowing enemies and enabling chained teleports.' },
      { levelReq: 200, id: 'sr_ult_harvest_of_names', name: 'Harvest of Names', desc: 'Unlocks Level 200 Milestone Ultimate: Mass execution marking and chain reaping.' },
      { levelReq: 250, id: 'sr_ult_eclipse_reaper', name: 'Eclipse Reaper', desc: 'Unlocks Level 250 Milestone Ultimate: Colossal spectral executioner transformation with massive scythe waves.' },
    ],
  },
  {
    id: 'cursed_golem',
    name: 'Cursed Golem',
    title: 'Primordial Titan of Bedrock & Gravitic Ruin',
    desc: 'Colossal ancient earth behemoth wielding granite titan punches, rolling boulders, runic barriers, and gravitic cataclysms powered by Runic Charge.',
    resourceName: 'Runic Charge',
    resourceType: 'earth',
    isMelee: true,
    hpMod: 1.65,
    speedMod: 0.85,
    damageMod: 1.3,
    startSkill: 'cg_phys_titan_punch',
    ultimateName: 'Colossus Awakening',
    ultimateDesc: 'Grows into a giant awakened titan, tearing the arena with seismic shockwaves, falling meteoric boulders, and gravitic implosions.',
    color: '#10b981',
    spritePrefix: 'boss_cursed_golem',
    themeGradient: 'from-emerald-950 via-slate-900 to-black',
    milestones: [
      { levelReq: 50, id: 'cg_ult_colossus_awakening', name: 'Colossus Awakening', desc: 'Unlocks Level 50 Milestone Ultimate: Colossus awakening with giant fists and earth shockwaves.' },
      { levelReq: 100, id: 'cg_ult_faultline_dominion', name: 'Faultline Dominion', desc: 'Unlocks Level 100 Milestone Ultimate: Splits arena with earthquakes and boulder rain.' },
      { levelReq: 150, id: 'cg_ult_heart_of_mountain', name: 'Heart of the Mountain', desc: 'Unlocks Level 150 Milestone Ultimate: Absorbs damage and retaliates with kinetic blast.' },
      { levelReq: 200, id: 'cg_ult_gravitic_cataclysm', name: 'Gravitic Cataclysm', desc: 'Unlocks Level 200 Milestone Ultimate: Massive gravitational compression explosion.' },
      { levelReq: 250, id: 'cg_ult_worldstone_avatar', name: 'Worldstone Avatar', desc: 'Unlocks Level 250 Milestone Ultimate: True Worldstone titan combining slams, vortexes, and shields.' },
    ],
  },
];

// Persistent Character Progression Structure
export interface CharacterProgression {
  level: number;
  exp: number;
  nextExp: number;
  unlockedPerks: string[];
  treeData?: CharacterProgressionData;
  lichData?: CharacterProgressionData; // backwards compatibility alias
}

export type AllCharacterProgression = Record<BossClassId, CharacterProgression>;

// Full Persistent Storage Schema Definition (Key: 'eternal_overlord_save_v1')
export const SAVE_STORAGE_KEY = 'eternal_overlord_save_v1';

export interface GameStatsRecord {
  highScore: number;
  highestWave: number;
  totalKills: number;
  totalRuns: number;
  bossesSlain: number;
  bestRunDuration: number;
  highestDamage: number;
}

export interface PlayerSettingsRecord {
  autoAttack: boolean;
  sfxVolume: number;
  musicVolume: number;
  sfxMuted: boolean;
  musicMuted: boolean;
  screenShake: boolean;
  damageDensity: 'FULL' | 'REDUCED' | 'OFF';
  highContrast: boolean;
  controlScheme: ControlScheme;
}

export interface EternalOverlordSaveV1 {
  version: number;
  lastPlayed: number;
  activeBossId: BossClassId;
  currencies: {
    souls: number;
    gold: number;
  };
  stats: GameStatsRecord;
  characters: Record<BossClassId, CharacterProgression>;
  soulAltar: Record<string, number>;
  settings: PlayerSettingsRecord;
  unlockedCodex?: string[];
}

const DEFAULT_DEMON_DATA: CharacterProgressionData = {
  skillPoints: 0,
  allocatedSkills: {
    dm_swords_infernal_cleave: 1,
    dm_swords_hellfire_cross_slash: 1,
    dm_swords_blazing_thrust: 1,
    dm_swords_berserker_spin: 1,
    dm_phys_skullbreaker_slam: 1,
    dm_pas_ember_blooded: 1,
    dm_pas_tyrants_grip: 1,
  },
  abilityMastery: {
    dm_swords_infernal_cleave: { exp: 0, rank: 1 },
    dm_swords_hellfire_cross_slash: { exp: 0, rank: 1 },
    dm_swords_blazing_thrust: { exp: 0, rank: 1 },
    dm_swords_berserker_spin: { exp: 0, rank: 1 },
    dm_phys_skullbreaker_slam: { exp: 0, rank: 1 },
  },
  loadout: [
    'dm_swords_infernal_cleave',
    'dm_swords_hellfire_cross_slash',
    'dm_swords_blazing_thrust',
    'dm_swords_berserker_spin',
    'dm_phys_skullbreaker_slam',
  ],
  unlockedUltimates: ['dm_ult_hellblade_judgment'],
};

const DEFAULT_LICH_DATA: CharacterProgressionData = {
  skillPoints: 0,
  allocatedSkills: {
    lich_summon_bone_sentinel: 1,
    lich_spell_grave_frost: 1,
    lich_sorc_witchfire_orb: 1,
    lich_dark_soul_siphon: 1,
    lich_rit_reanimate_fallen: 1,
    lich_pas_essence_vessel: 1,
    lich_pas_soul_harvester: 1,
  },
  abilityMastery: {
    lich_summon_bone_sentinel: { exp: 0, rank: 1 },
    lich_spell_grave_frost: { exp: 0, rank: 1 },
    lich_sorc_witchfire_orb: { exp: 0, rank: 1 },
    lich_dark_soul_siphon: { exp: 0, rank: 1 },
    lich_rit_reanimate_fallen: { exp: 0, rank: 1 },
  },
  loadout: [
    'lich_spell_grave_frost',
    'lich_summon_bone_sentinel',
    'lich_sorc_witchfire_orb',
    'lich_dark_soul_siphon',
    'lich_rit_reanimate_fallen',
  ],
  unlockedUltimates: ['ult_army_of_damned'],
};

const DEFAULT_VAMPIRE_DATA: CharacterProgressionData = {
  skillPoints: 0,
  allocatedSkills: {
    vq_sorc_crimson_needle: 1,
    vq_hunt_royal_fang: 1,
    vq_bat_swarm: 1,
    vq_mist_crimson_mist: 1,
    vq_rit_blood_covenant: 1,
    vq_pas_aristocratic_hunger: 1,
    vq_pas_crimson_circulation: 1,
  },
  abilityMastery: {
    vq_sorc_crimson_needle: { exp: 0, rank: 1 },
    vq_hunt_royal_fang: { exp: 0, rank: 1 },
    vq_bat_swarm: { exp: 0, rank: 1 },
    vq_mist_crimson_mist: { exp: 0, rank: 1 },
    vq_rit_blood_covenant: { exp: 0, rank: 1 },
  },
  loadout: [
    'vq_sorc_crimson_needle',
    'vq_hunt_royal_fang',
    'vq_bat_swarm',
    'vq_mist_crimson_mist',
    'vq_rit_blood_covenant',
  ],
  unlockedUltimates: ['vq_ult_crimson_masquerade'],
};

const DEFAULT_REAPER_DATA: CharacterProgressionData = {
  skillPoints: 0,
  allocatedSkills: {
    sr_scythe_crescent_reap: 1,
    sr_move_shadowstep: 1,
    sr_clone_whispering_shade: 1,
    sr_soul_mark: 1,
    sr_art_deaths_embrace: 1,
    sr_pas_silent_footsteps: 1,
    sr_pas_scythe_discipline: 1,
  },
  abilityMastery: {
    sr_scythe_crescent_reap: { exp: 0, rank: 1 },
    sr_move_shadowstep: { exp: 0, rank: 1 },
    sr_clone_whispering_shade: { exp: 0, rank: 1 },
    sr_soul_mark: { exp: 0, rank: 1 },
    sr_art_deaths_embrace: { exp: 0, rank: 1 },
  },
  loadout: [
    'sr_scythe_crescent_reap',
    'sr_move_shadowstep',
    'sr_clone_whispering_shade',
    'sr_soul_mark',
    'sr_art_deaths_embrace',
  ],
  unlockedUltimates: ['sr_ult_dance_ten_thousand_cuts'],
};

const DEFAULT_GOLEM_DATA: CharacterProgressionData = {
  skillPoints: 0,
  allocatedSkills: {
    cg_phys_titan_punch: 1,
    cg_phys_stonebreaker: 1,
    cg_magic_stone_spike: 1,
    cg_rune_rune_of_crushing: 1,
    cg_fort_granite_skin: 1,
    cg_pas_granite_endurance: 1,
    cg_pas_colossal_strength: 1,
  },
  abilityMastery: {
    cg_phys_titan_punch: { exp: 0, rank: 1 },
    cg_phys_stonebreaker: { exp: 0, rank: 1 },
    cg_magic_stone_spike: { exp: 0, rank: 1 },
    cg_rune_rune_of_crushing: { exp: 0, rank: 1 },
    cg_fort_granite_skin: { exp: 0, rank: 1 },
  },
  loadout: [
    'cg_phys_titan_punch',
    'cg_phys_stonebreaker',
    'cg_magic_stone_spike',
    'cg_rune_rune_of_crushing',
    'cg_fort_granite_skin',
  ],
  unlockedUltimates: ['cg_ult_colossus_awakening'],
};

const DEFAULT_PROG: CharacterProgression = {
  level: 1,
  exp: 0,
  nextExp: 80,
  unlockedPerks: [],
};

function getDefaultTreeData(bossId: BossClassId): CharacterProgressionData {
  if (bossId === 'demon_monarch') {
    return { ...DEFAULT_DEMON_DATA };
  }
  if (bossId === 'vampire_queen') {
    return { ...DEFAULT_VAMPIRE_DATA };
  }
  if (bossId === 'shadow_reaper') {
    return { ...DEFAULT_REAPER_DATA };
  }
  if (bossId === 'cursed_golem') {
    return { ...DEFAULT_GOLEM_DATA };
  }
  return { ...DEFAULT_LICH_DATA };
}

function createDefaultSave(): EternalOverlordSaveV1 {
  const characters: Record<BossClassId, CharacterProgression> = {
    demon_monarch: { level: 1, exp: 0, nextExp: 80, unlockedPerks: [], treeData: getDefaultTreeData('demon_monarch') },
    lich_lord: { level: 1, exp: 0, nextExp: 80, unlockedPerks: [], treeData: getDefaultTreeData('lich_lord') },
    vampire_queen: { level: 1, exp: 0, nextExp: 80, unlockedPerks: [], treeData: getDefaultTreeData('vampire_queen') },
    shadow_reaper: { level: 1, exp: 0, nextExp: 80, unlockedPerks: [], treeData: getDefaultTreeData('shadow_reaper') },
    cursed_golem: { level: 1, exp: 0, nextExp: 80, unlockedPerks: [], treeData: getDefaultTreeData('cursed_golem') },
  };

  return {
    version: 1,
    lastPlayed: Date.now(),
    activeBossId: 'demon_monarch',
    currencies: { souls: 0, gold: 0 },
    stats: {
      highScore: 0,
      highestWave: 1,
      totalKills: 0,
      totalRuns: 0,
      bossesSlain: 0,
      bestRunDuration: 0,
      highestDamage: 0,
    },
    characters,
    soulAltar: {},
    settings: {
      autoAttack: true,
      sfxVolume: 0.8,
      musicVolume: 0.5,
      sfxMuted: false,
      musicMuted: false,
      screenShake: true,
      damageDensity: 'FULL',
      highContrast: false,
      controlScheme: 'AUTO',
    },
    unlockedCodex: BESTIARY.map((b) => b.id),
  };
}

function loadOrMigrateSaveData(): EternalOverlordSaveV1 {
  const defaultSave = createDefaultSave();
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(SAVE_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const merged: EternalOverlordSaveV1 = {
          version: 1,
          lastPlayed: parsed.lastPlayed || Date.now(),
          activeBossId: (parsed.activeBossId && BOSS_CLASSES.some((b) => b.id === parsed.activeBossId))
            ? parsed.activeBossId
            : defaultSave.activeBossId,
          currencies: {
            souls: typeof parsed.currencies?.souls === 'number' ? Math.max(0, parsed.currencies.souls) : (parsed.souls || 0),
            gold: typeof parsed.currencies?.gold === 'number' ? Math.max(0, parsed.currencies.gold) : (parsed.gold || 0),
          },
          stats: {
            highScore: Math.max(0, parsed.stats?.highScore ?? parsed.highScore ?? 0),
            highestWave: Math.max(1, parsed.stats?.highestWave ?? parsed.highestWave ?? 1),
            totalKills: Math.max(0, parsed.stats?.totalKills ?? parsed.totalKills ?? 0),
            totalRuns: Math.max(0, parsed.stats?.totalRuns ?? parsed.totalRuns ?? 0),
            bossesSlain: Math.max(0, parsed.stats?.bossesSlain ?? parsed.bossesSlain ?? 0),
            bestRunDuration: Math.max(0, parsed.stats?.bestRunDuration ?? parsed.bestRunDuration ?? 0),
            highestDamage: Math.max(0, parsed.stats?.highestDamage ?? parsed.highestDamage ?? 0),
          },
          characters: { ...defaultSave.characters },
          soulAltar: parsed.soulAltar || parsed.meta || {},
          settings: {
            autoAttack: parsed.settings?.autoAttack ?? true,
            sfxVolume: parsed.settings?.sfxVolume ?? 0.8,
            musicVolume: parsed.settings?.musicVolume ?? 0.5,
            sfxMuted: parsed.settings?.sfxMuted ?? false,
            musicMuted: parsed.settings?.musicMuted ?? false,
            screenShake: parsed.settings?.screenShake ?? true,
            damageDensity: parsed.settings?.damageDensity ?? 'FULL',
            highContrast: parsed.settings?.highContrast ?? false,
            controlScheme: parsed.settings?.controlScheme || 'AUTO',
          },
          unlockedCodex: parsed.unlockedCodex || defaultSave.unlockedCodex,
        };

        BOSS_CLASSES.forEach((b) => {
          const charInSave = parsed.characters?.[b.id];
          if (charInSave) {
            const defaultTree = getDefaultTreeData(b.id);
            const savedTree = charInSave.treeData || charInSave.lichData || defaultTree;
            merged.characters[b.id] = {
              level: Math.max(1, charInSave.level || 1),
              exp: Math.max(0, charInSave.exp || 0),
              nextExp: Math.max(80, charInSave.nextExp || 80),
              unlockedPerks: Array.isArray(charInSave.unlockedPerks) ? charInSave.unlockedPerks : [],
              treeData: {
                skillPoints: typeof savedTree.skillPoints === 'number' ? savedTree.skillPoints : 0,
                allocatedSkills: { ...defaultTree.allocatedSkills, ...(savedTree.allocatedSkills || {}) },
                abilityMastery: { ...defaultTree.abilityMastery, ...(savedTree.abilityMastery || {}) },
                loadout: (Array.isArray(savedTree.loadout) && savedTree.loadout.length === 5)
                  ? savedTree.loadout
                  : [...defaultTree.loadout],
                unlockedUltimates: Array.isArray(savedTree.unlockedUltimates)
                  ? savedTree.unlockedUltimates
                  : [...defaultTree.unlockedUltimates],
              },
            };
          }
        });

        return merged;
      }
    }

    // Legacy migration checks
    if (typeof localStorage !== 'undefined') {
      const legacyProg = localStorage.getItem('eternal_overlord_char_progression');
      const legacySouls = localStorage.getItem('eternal_overlord_souls');
      const legacyMeta = localStorage.getItem('eternal_overlord_meta');
      const legacyHighestWave = localStorage.getItem('eternal_overlord_highest_wave');
      const legacyAutoAttack = localStorage.getItem('eternal_overlord_auto_attack');

      if (legacyProg || legacySouls || legacyMeta || legacyHighestWave) {
        if (legacySouls) defaultSave.currencies.souls = parseInt(legacySouls, 10) || 0;
        if (legacyHighestWave) defaultSave.stats.highestWave = parseInt(legacyHighestWave, 10) || 1;
        if (legacyMeta) {
          try { defaultSave.soulAltar = JSON.parse(legacyMeta); } catch {}
        }
        if (legacyAutoAttack !== null) {
          defaultSave.settings.autoAttack = legacyAutoAttack === 'true';
        }
        if (legacyProg) {
          try {
            const parsedProg = JSON.parse(legacyProg);
            BOSS_CLASSES.forEach((b) => {
              if (parsedProg[b.id]) {
                const defaultTree = getDefaultTreeData(b.id);
                const pChar = parsedProg[b.id];
                const tData = pChar.treeData || pChar.lichData || defaultTree;
                defaultSave.characters[b.id] = {
                  level: pChar.level || 1,
                  exp: pChar.exp || 0,
                  nextExp: pChar.nextExp || 80,
                  unlockedPerks: pChar.unlockedPerks || [],
                  treeData: {
                    skillPoints: tData.skillPoints || 0,
                    allocatedSkills: { ...defaultTree.allocatedSkills, ...(tData.allocatedSkills || {}) },
                    abilityMastery: { ...defaultTree.abilityMastery, ...(tData.abilityMastery || {}) },
                    loadout: tData.loadout && tData.loadout.length === 5 ? tData.loadout : defaultTree.loadout,
                    unlockedUltimates: tData.unlockedUltimates || defaultTree.unlockedUltimates,
                  },
                };
              }
            });
          } catch {}
        }
        try {
          localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(defaultSave));
        } catch {}
      }
    }
  } catch (err) {
    console.warn('[SaveManager] Error parsing save file, initializing fresh save profile.', err);
  }
  return defaultSave;
}

// Merchant Shop Item Definitions
export interface MerchantShopItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  baseCost: number;
  effectType: 'heal' | 'haste' | 'might' | 'maxHp' | 'magnet' | 'resource';
  color: string;
}

const MERCHANT_ITEMS: MerchantShopItem[] = [
  {
    id: 'blood_elixir',
    name: 'Demonic Blood Elixir',
    category: 'Potion',
    desc: 'Immediately restores +250 Boss HP to sustain your infernal onslaught.',
    baseCost: 35,
    effectType: 'heal',
    color: '#ef4444',
  },
  {
    id: 'resource_flask',
    name: 'Infernal Wrath / Essence Flask',
    category: 'Resource',
    desc: 'Instantly grants +100 Fury/Essence and +30 Max Resource capacity.',
    baseCost: 40,
    effectType: 'resource',
    color: '#f97316',
  },
  {
    id: 'nether_haste',
    name: 'Nether Haste Relic',
    category: 'Relic',
    desc: '+10% Faster skill & attack cooldowns for the rest of this run.',
    baseCost: 50,
    effectType: 'haste',
    color: '#06b6d4',
  },
  {
    id: 'overlord_might',
    name: 'Overlord Wrath Essence',
    category: 'Elixir',
    desc: '+12% Total damage output across all weapons, spells, and summons.',
    baseCost: 55,
    effectType: 'might',
    color: '#f59e0b',
  },
  {
    id: 'titan_shield',
    name: 'Titan Core Blessing',
    category: 'Buff',
    desc: 'Permanently increases Boss Max HP by +60 and restores that health.',
    baseCost: 45,
    effectType: 'maxHp',
    color: '#10b981',
  },
  {
    id: 'soul_magnet',
    name: 'Abyssal Magnet Shard',
    category: 'Relic',
    desc: '+35% Orb, gem, and currency pickup attraction radius.',
    baseCost: 30,
    effectType: 'magnet',
    color: '#a855f7',
  },
];

// Permanent Meta Upgrades (Soul Altar)
interface MetaUpgrade {
  id: string;
  name: string;
  desc: string;
  costBase: number;
  costScale: number;
  maxLevel: number;
  icon: string;
  effectLabel: string;
}

const META_UPGRADES: MetaUpgrade[] = [
  { id: 'vigor', name: 'Titan Vigor', desc: 'Increases boss maximum health pool.', costBase: 10, costScale: 1.6, maxLevel: 10, icon: 'Heart', effectLabel: '+15% Max HP / Rank' },
  { id: 'might', name: 'Overlord Might', desc: 'Empowers all physical cleaves & spells.', costBase: 12, costScale: 1.6, maxLevel: 10, icon: 'Zap', effectLabel: '+12% Damage / Rank' },
  { id: 'swiftness', name: 'Hellish Swiftness', desc: 'Increases combat movement velocity.', costBase: 8, costScale: 1.5, maxLevel: 8, icon: 'Activity', effectLabel: '+8% Move Speed / Rank' },
  { id: 'haste', name: 'Dark Haste', desc: 'Accelerates skill & weapon recovery.', costBase: 15, costScale: 1.8, maxLevel: 8, icon: 'Sparkles', effectLabel: '-7% Cooldowns / Rank' },
  { id: 'magnet', name: 'Soul Magnet', desc: 'Expands the orb collection radius.', costBase: 6, costScale: 1.4, maxLevel: 6, icon: 'Crosshair', effectLabel: '+25% Magnet Radius / Rank' },
  { id: 'greed', name: 'Hoard Greed', desc: 'Grants extra starting gold and drops.', costBase: 10, costScale: 1.5, maxLevel: 8, icon: 'Trophy', effectLabel: '+50 Gold & +15% Drops' },
];

// Bestiary Data
const BESTIARY = [
  { id: 'swordsman', name: 'Royal Swordsman', role: 'Melee Vanguard', desc: 'Standard foot soldier wielding an iron broadsword. Attacks in close-range 120° arcs.', hp: 'Low-Mid', danger: 'Low' },
  { id: 'archer', name: 'Imperial Marksman', role: 'Ranged Kiter', desc: 'Keeps distance and fires high-velocity piercing arrows from afar.', hp: 'Low', danger: 'Medium' },
  { id: 'mage', name: 'Battle Sorcerer', role: 'Ranged Spellcaster', desc: 'Casts tracking arcane projectiles that erupt on contact.', hp: 'Low', danger: 'Medium' },
  { id: 'paladin', name: 'Holy Crusader', role: 'Heavy Defender', desc: 'High armor juggernaut with crushing warhammer slams that stagger.', hp: 'Very High', danger: 'High' },
  { id: 'rogue', name: 'Shadow Assassin', role: 'Agile Stalker', desc: 'Extremely swift flanker with rapid dual daggers and poison strikes.', hp: 'Low', danger: 'High' },
  { id: 'berserker', name: 'Blood Berserker', role: 'Furious Charger', desc: 'Frenzied warrior wielding dual battle axes with unrelenting momentum.', hp: 'High', danger: 'High' },
  { id: 'boss_grand_inquisitor', name: 'Grand Inquisitor', role: 'Invasion Champion (Boss)', desc: 'Holy zealot commanding divine smites, wide golden arcs, and sacred judgments.', hp: 'Extreme', danger: 'Boss' },
  { id: 'boss_dragon_slayer', name: 'Dragon Slayer', role: 'Invasion Champion (Boss)', desc: 'Legendary knight clad in dragon armor wielding a great dragon blade.', hp: 'Colossal', danger: 'Boss' },
  { id: 'boss_royal_archmage', name: 'Royal Archmage', role: 'Invasion Champion (Boss)', desc: 'Master of elemental devastation, casting arcane barrages and storm barriers.', hp: 'Extreme', danger: 'Boss' },
];

// --- CHARACTER SELECTION AVATAR PORTRAIT COMPONENT ---
interface BossAvatarPortraitProps {
  boss: BossClassData;
  isSelected: boolean;
  progression: CharacterProgression;
  onClick: () => void;
  assets: Record<string, HTMLImageElement | null>;
}

function BossAvatarPortrait({
  boss,
  isSelected,
  progression,
  onClick,
  assets,
}: BossAvatarPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animFrame = 0;
    let frameTimer = 0;
    let curFrame = 0;
    const totalFrames = 4;
    const frameW = 512;
    const frameH = 512;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imgKey = `${boss.spritePrefix}_idle`;
      const img = assets[imgKey];

      if (img && img.complete && img.naturalWidth > 0) {
        const sX = (curFrame % totalFrames) * frameW;
        const sY = 0;
        const pad = 4;
        ctx.drawImage(
          img,
          sX,
          sY,
          frameW,
          frameH,
          pad,
          pad,
          canvas.width - pad * 2,
          canvas.height - pad * 2
        );
      } else {
        ctx.fillStyle = boss.color;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 8, 0, Math.PI * 2);
        ctx.fill();
      }

      frameTimer += 1 / 60;
      if (frameTimer >= 0.16) {
        frameTimer = 0;
        curFrame = (curFrame + 1) % totalFrames;
      }

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [boss.spritePrefix, boss.color, assets]);

  const glowThemes: Record<BossClassId, { bg: string; border: string; activeRing: string; activeShadow: string }> = {
    demon_monarch: {
      bg: 'from-red-950/90 via-red-900/60 to-black',
      border: 'border-red-600/60',
      activeRing: 'ring-red-400 border-amber-400',
      activeShadow: 'shadow-[0_0_25px_rgba(239,68,68,0.8)]',
    },
    lich_lord: {
      bg: 'from-cyan-950/90 via-slate-900/70 to-black',
      border: 'border-cyan-500/60',
      activeRing: 'ring-cyan-300 border-cyan-400',
      activeShadow: 'shadow-[0_0_25px_rgba(6,182,212,0.7)]',
    },
    vampire_queen: {
      bg: 'from-rose-950/90 via-pink-950/60 to-black',
      border: 'border-pink-500/60',
      activeRing: 'ring-rose-300 border-rose-400',
      activeShadow: 'shadow-[0_0_25px_rgba(244,63,94,0.7)]',
    },
    shadow_reaper: {
      bg: 'from-purple-950/90 via-slate-950/70 to-black',
      border: 'border-purple-500/60',
      activeRing: 'ring-purple-300 border-purple-400',
      activeShadow: 'shadow-[0_0_25px_rgba(168,85,247,0.7)]',
    },
    cursed_golem: {
      bg: 'from-emerald-950/90 via-slate-950/70 to-black',
      border: 'border-emerald-500/60',
      activeRing: 'ring-emerald-300 border-emerald-400',
      activeShadow: 'shadow-[0_0_25px_rgba(16,185,129,0.7)]',
    },
  };

  const theme = glowThemes[boss.id] || glowThemes.demon_monarch;

  return (
    <button
      type="button"
      onClick={() => {
        gameAudio.playCrispClick();
        onClick();
      }}
      onMouseEnter={() => gameAudio.playHoverMicroTone()}
      className={`group relative flex flex-col items-center gap-1.5 transition-all duration-200 outline-none select-none cursor-pointer ${
        isSelected ? 'scale-110 z-10' : 'hover:scale-105 opacity-80 hover:opacity-100'
      }`}>
      <div
        className={`relative w-[72px] h-[72px] sm:w-[78px] sm:h-[78px] rounded-2xl p-1 bg-gradient-to-b ${theme.bg} border-2 transition-all flex items-center justify-center overflow-hidden ${
          isSelected
            ? `${theme.activeRing} ring-2 ${theme.activeShadow} ring-offset-1 ring-offset-black`
            : `${theme.border} hover:border-amber-400/80 shadow-lg`
        }`}>
        <div
          className="absolute inset-0 opacity-40 blur-sm pointer-events-none rounded-2xl"
          style={{ backgroundColor: boss.color }}
        />

        <canvas
          ref={canvasRef}
          width={96}
          height={96}
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        />

        {isSelected && (
          <div className="absolute inset-0 pointer-events-none rounded-2xl border border-amber-300/80 ring-1 ring-inset ring-amber-400/40" />
        )}

        <div className="absolute bottom-1 right-1 z-20 bg-slate-950/95 border border-amber-500/80 text-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded shadow-md whitespace-nowrap font-mono tracking-tight leading-tight">
          Lv.{progression.level}
        </div>
      </div>

      <span
        className={`text-[11px] font-black tracking-wide whitespace-nowrap transition-colors ${
          isSelected ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] font-bold' : 'text-slate-400 group-hover:text-slate-200'
        }`}>
        {boss.name}
      </span>
    </button>
  );
}

// --- DEV ASSET & ANIMATION GALLERY COMPONENT ---
interface AssetGalleryViewerProps {
  assets: Record<string, HTMLImageElement | null>;
  getSpriteRenderer: (prefix: string) => SpriteRenderer;
}

function AssetGalleryViewer({ assets, getSpriteRenderer }: AssetGalleryViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [category, setCategory] = useState<'SUMMONS' | 'BOSSES' | 'ENEMIES' | 'CHAMPIONS' | 'SPELLS_FX'>('SUMMONS');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('bone_sentinel');
  const [selectedAction, setSelectedAction] = useState<SummonAnimationAction>('IDLE');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [facingRight, setFacingRight] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1.8);

  const CATEGORY_ITEMS: Record<string, Array<{ id: string; name: string; desc: string; isProcedural?: boolean; spritePrefix?: string; staticAssetKey?: string }>> = {
    SUMMONS: [
      { id: 'bone_sentinel', name: 'Bone Sentinel', desc: 'Armored skeleton warrior with horned helm, skull shield & swinging iron broadsword.', isProcedural: true },
      { id: 'crypt_archer', name: 'Crypt Archer', desc: 'Slender skeleton archer drawing composite bone bow with bone arrow & quiver.', isProcedural: true },
      { id: 'grave_spearman', name: 'Grave Spearman', desc: 'Armored skeleton thrusting a long pointed bone pike with flowing banner.', isProcedural: true },
      { id: 'grave_hound', name: 'Grave Hound', desc: 'Quadruped skeletal wolf running on all 4 legs, lunging and snapping glowing jaws.', isProcedural: true },
      { id: 'bone_mage', name: 'Bone Mage', desc: 'Skeletal sorcerer in tattered robes with skull staff casting necrotic bolts.', isProcedural: true },
      { id: 'ossuary_guardian', name: 'Ossuary Guardian', desc: 'Heavy armored fortress skeleton with massive spiked tower shield and greaves.', isProcedural: true },
      { id: 'wight_captain', name: 'Wight Captain', desc: 'Ancient wraith warlord with glowing violet spectral crown and twin swords.', isProcedural: true },
      { id: 'corpse_collector', name: 'Corpse Collector', desc: 'Hunched hooded ghoul carrying a soul sack and green necrotic lantern.', isProcedural: true },
      { id: 'dread_abomination', name: 'Dread Abomination', desc: 'Massive stitched multi-limbed flesh/bone titan with heavy double ground slams.', isProcedural: true },
      { id: 'skeletal_dragon', name: 'Skeletal Dragon', desc: 'Colossal flying skeletal dragon with flapping bony wings and necrotic frost breath.', isProcedural: true },
      { id: 'vampire_bat', name: 'Vampire Bat', desc: 'Swift flapping vampire bat swarm with glowing ruby eyes.', isProcedural: true },
      { id: 'crimson_familiar', name: 'Crimson Familiar', desc: 'Winged royal familiar bat casting blood needle darts.', isProcedural: true },
      { id: 'nightwing_sentinel', name: 'Nightwing Gargoyle', desc: 'Stone gargoyle sentinel with spread wings diving on foes.', isProcedural: true },
      { id: 'blood_seraph', name: 'Blood Seraph', desc: '6-winged crimson angel of pure liquid blood with floating blood halo.', isProcedural: true },
      { id: 'shadow_clone', name: 'Shadow Clone', desc: 'Translucent amethyst ninja-wraith wielding a spectral scythe.', isProcedural: true },
      { id: 'ash_clone', name: 'Ash Doppelganger', desc: 'Fiery burning ember silhouette mirroring greatsword swings.', isProcedural: true },
      { id: 'golem_minion', name: 'Living Stone Golem', desc: 'Miniature granite construct with glowing emerald runic eyes.', isProcedural: true },
    ],
    BOSSES: [
      { id: 'boss_demon_monarch', name: 'Demon Monarch', desc: 'Lord of the Hellfire Abyss wielding volcanic blade arcs and magma fissures.', spritePrefix: 'boss_demon_monarch' },
      { id: 'boss_lich_lord', name: 'Lich Lord', desc: 'Supreme Necromancer commanding 10 undead minion types and frost spells.', spritePrefix: 'boss_lich_lord' },
      { id: 'boss_vampire_queen', name: 'Vampire Queen', desc: 'Empress of Blood wielding swift ruby rapier flourishes and bat swarms.', spritePrefix: 'boss_vampire_queen' },
      { id: 'boss_shadow_reaper', name: 'Shadow Reaper', desc: 'Harbinger of the Void Singularity with obsidian spectral scythes & shadow clones.', spritePrefix: 'boss_shadow_reaper' },
      { id: 'boss_cursed_golem', name: 'Cursed Golem', desc: 'Colossal Primordial Titan of Bedrock with granite fists and runic barriers.', spritePrefix: 'boss_cursed_golem' },
    ],
    ENEMIES: [
      { id: 'enemy_swordsman', name: 'Royal Swordsman', desc: 'Kingdom vanguard foot soldier with broadsword and shield.', spritePrefix: 'enemy_swordsman' },
      { id: 'enemy_archer', name: 'Imperial Marksman', desc: 'Elven marksman firing high-velocity piercing arrows from afar.', spritePrefix: 'enemy_archer' },
      { id: 'enemy_mage', name: 'Battle Sorcerer', desc: 'Arcane academy spellcaster casting tracking fire and magic orbs.', spritePrefix: 'enemy_mage' },
      { id: 'enemy_paladin', name: 'Holy Crusader', desc: 'Heavy armor juggernaut with crushing warhammer and holy aura.', spritePrefix: 'enemy_paladin' },
      { id: 'enemy_rogue', name: 'Shadow Assassin', desc: 'Swift dual-dagger flanker with poison blades and shadow dash.', spritePrefix: 'enemy_rogue' },
      { id: 'enemy_berserker', name: 'Blood Berserker', desc: 'Frenzied barbarian dual-wielding heavy battle axes.', spritePrefix: 'enemy_berserker' },
    ],
    CHAMPIONS: [
      { id: 'invader_grand_inquisitor', name: 'Grand Inquisitor', desc: 'Invasion boss commanding divine smites, wide golden arcs, and judgments.', spritePrefix: 'invader_grand_inquisitor' },
      { id: 'invader_dragon_slayer', name: 'Dragon Slayer', desc: 'Legendary dragon knight clad in dragon scales with greatsword.', spritePrefix: 'invader_dragon_slayer' },
      { id: 'invader_royal_archmage', name: 'Royal Archmage', desc: 'Master of elemental devastation casting storms and arcane barrages.', spritePrefix: 'invader_royal_archmage' },
    ],
    SPELLS_FX: [
      { id: 'spell_infernal_orb', name: 'Infernal Orb', desc: 'Concentrated solar fire projectile orb.', staticAssetKey: 'spell_infernal_orb' },
      { id: 'spell_frost_shard', name: 'Frost Shard', desc: 'Piercing jagged glacial icicle projectile.', staticAssetKey: 'spell_frost_shard' },
      { id: 'spell_lightning_bolt', name: 'Lightning Bolt', desc: 'Instantaneous black lightning arc.', staticAssetKey: 'spell_lightning_bolt' },
      { id: 'spell_void_blackhole', name: 'Void Blackhole', desc: 'Supermassive gravitational singularity.', staticAssetKey: 'spell_void_blackhole' },
      { id: 'weapon_scythe_slash', name: 'Scythe Slash Arc', desc: 'Wide sweeping spectral blade arc texture.', staticAssetKey: 'weapon_scythe_slash' },
      { id: 'item_treasure_chest', name: 'Treasure Chest', desc: 'Ancient gilded crypt treasure chest.', staticAssetKey: 'item_treasure_chest' },
    ],
  };

  const currentList = CATEGORY_ITEMS[category] || CATEGORY_ITEMS.SUMMONS;
  const currentEntity = currentList.find((item) => item.id === selectedEntityId) || currentList[0];

  useEffect(() => {
    let animFrame = 0;
    let timer = 0;
    let spriteAnimState: SpriteAnimationState = {
      currentAction: selectedAction,
      currentFrame: 0,
      timer: 0,
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background grid for pixel art inspection
      ctx.fillStyle = '#090a10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Center crosshair
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 20;

      if (currentEntity.isProcedural) {
        // Render via UndeadProceduralRenderer
        const renderState: SummonRenderState = {
          type: currentEntity.id,
          action: selectedAction,
          animTimer: timer,
          facingRight: facingRight,
          scale: scale * (currentEntity.id === 'skeletal_dragon' ? 1.6 : currentEntity.id === 'dread_abomination' || currentEntity.id === 'ossuary_guardian' ? 1.3 : 1.0),
          hurtFlash: selectedAction === 'HURT' ? (Math.sin(timer * 12) > 0 ? 0.8 : 0) : 0,
          deathProgress: selectedAction === 'DEATH' ? (Math.sin(timer * 2) + 1) * 0.5 : 0,
        };
        UndeadProceduralRenderer.draw(ctx, renderState, cx, cy);
      } else if (currentEntity.spritePrefix) {
        // Spritesheet rendering
        const renderer = getSpriteRenderer(currentEntity.spritePrefix);
        spriteAnimState.currentAction = selectedAction;
        const bw = 100 * scale;
        const bh = 100 * scale;
        renderer.draw(ctx, spriteAnimState, cx - bw / 2, cy - bh / 2, bw, bh, assets, !facingRight);
        if (isPlaying) {
          spriteAnimState = renderer.getNextState(spriteAnimState, (1 / 60) * playbackSpeed);
        }
      } else if (currentEntity.staticAssetKey) {
        // Static Asset
        const img = assets[currentEntity.staticAssetKey];
        if (img && img.complete && img.naturalWidth > 0) {
          const drawW = 120 * scale;
          const drawH = 120 * scale;
          ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(cx, cy, 30 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (isPlaying) {
        timer += (1 / 60) * playbackSpeed;
      }

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [category, selectedEntityId, selectedAction, isPlaying, playbackSpeed, facingRight, scale, currentEntity, assets, getSpriteRenderer]);

  return (
    <div className="w-full flex flex-col gap-3.5 text-xs text-white">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap gap-1.5 justify-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
        {(['SUMMONS', 'BOSSES', 'ENEMIES', 'CHAMPIONS', 'SPELLS_FX'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              gameAudio.playCrispClick();
              setCategory(cat);
              const firstItem = CATEGORY_ITEMS[cat][0];
              if (firstItem) setSelectedEntityId(firstItem.id);
            }}
            className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
              category === cat
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow ring-1 ring-amber-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}>
            {cat === 'SUMMONS' ? 'Undead Summons (10+)' : cat === 'BOSSES' ? 'Overlord Bosses (5)' : cat === 'ENEMIES' ? 'Enemy Archetypes (6)' : cat === 'CHAMPIONS' ? 'Boss Champions (3)' : 'Spells & FX'}
          </button>
        ))}
      </div>

      {/* Main Split Inspector View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Left: Entity List Grid */}
        <div className="md:col-span-5 bg-slate-900/95 border border-slate-800 p-3 rounded-2xl max-h-[360px] overflow-y-auto flex flex-col gap-1.5">
          <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider mb-1">
            Select Model to Inspect:
          </span>
          {currentList.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                gameAudio.playCrispClick();
                setSelectedEntityId(item.id);
              }}
              className={`p-2.5 rounded-xl border text-left flex flex-col transition-all cursor-pointer ${
                selectedEntityId === item.id
                  ? 'bg-red-950/90 border-red-500 text-white shadow'
                  : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
              }`}>
              <div className="flex justify-between items-center">
                <span className="font-black text-xs text-amber-200">{item.name}</span>
                {item.isProcedural && (
                  <span className="text-[9px] bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono px-1 rounded">
                    Procedural
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.desc}</span>
            </button>
          ))}
        </div>

        {/* Right: Live Animation Stage & Control Panel */}
        <div className="md:col-span-7 bg-slate-900/95 border border-red-600/40 p-3.5 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div>
              <div className="font-black text-sm text-amber-300">{currentEntity.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">ID: {currentEntity.id}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFacingRight((f) => !f)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-black text-amber-300 cursor-pointer">
                Flip: {facingRight ? 'Right' : 'Left'}
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                  isPlaying ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="w-full h-[180px] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative shadow-inner">
            <canvas ref={canvasRef} width={360} height={200} className="w-full h-full object-contain" />
          </div>

          {/* Animation Action Selector Buttons */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase">Live Animation State:</span>
            <div className="flex flex-wrap gap-1">
              {(['IDLE', 'RUN', 'ATTACK', 'HURT', 'DEATH'] as const).map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setSelectedAction(act);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    selectedAction === act
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow ring-1 ring-amber-300'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}>
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* Speed & Scale Controls */}
          <div className="flex items-center justify-between text-[10px] bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">Speed:</span>
              {[0.5, 1.0, 2.0].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                    playbackSpeed === spd ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                  {spd}x
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">Zoom:</span>
              {[1.2, 1.8, 2.5].map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => setScale(sc)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                    scale === sc ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                  {sc}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const canvasWidth = (getConfig('baseCanvasWidth') as number) || 1280;
  const canvasHeight = (getConfig('baseCanvasHeight') as number) || 720;
  const { sdk, isReady } = usePlayground();
  const [exitChat] = useRpc('exitChat');
  const { assets, isReady: assetsReady } = useAssets(ASSETS_MANIFEST);
  const [gameState, setGameState] = useState<GameState>({
    status: 'START',
    score: 0,
    level: 1,
  });
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepperRef = useRef<ReturnType<typeof createFixedStepper>>();
  const lastCancelRef = useRef(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    stepperRef.current = createFixedStepper(
      getConfig('stepMs') as number,
      getConfig('maxSubSteps') as number
    );
  }, []);

  // --- PERSISTENT SAVE MANAGER INITIALIZATION & STATE ---
  const [saveProfile, setSaveProfile] = useState<EternalOverlordSaveV1>(() => loadOrMigrateSaveData());
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number>(() => saveProfile.lastPlayed || Date.now());
  const [manualSaveIndicator, setManualSaveIndicator] = useState<boolean>(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // --- AUDIO STATES ---
  const [sfxMuted, setSfxMuted] = useState<boolean>(saveProfile.settings.sfxMuted);
  const [musicMuted, setMusicMuted] = useState<boolean>(saveProfile.settings.musicMuted);
  const [sfxVolume, setSfxVolume] = useState<number>(saveProfile.settings.sfxVolume ?? 0.8);
  const [musicVolume, setMusicVolume] = useState<number>(saveProfile.settings.musicVolume ?? 0.5);
  const [currentBgmUrl, setCurrentBgmUrl] = useState('assets/audio/bgm_dungeon_combat.mp3');

  // --- SETTINGS STATES ---
  const [screenShakeEnabled, setScreenShakeEnabled] = useState<boolean>(saveProfile.settings.screenShake);
  const [highContrast, setHighContrast] = useState<boolean>(saveProfile.settings.highContrast);
  const [damageDensity, setDamageDensity] = useState<'FULL' | 'REDUCED' | 'OFF'>(saveProfile.settings.damageDensity);
  const [autoAttackEnabled, setAutoAttackEnabled] = useState<boolean>(saveProfile.settings.autoAttack);
  const [controlScheme, setControlScheme] = useState<ControlScheme>(saveProfile.settings.controlScheme || 'AUTO');
  const [detectedInputMode, setDetectedInputMode] = useState<'TOUCH' | 'KEYBOARD'>(() => {
    if (typeof window !== 'undefined' && (navigator.maxTouchPoints > 0 || ('ontouchstart' in window))) {
      return 'TOUCH';
    }
    return 'KEYBOARD';
  });

  // Effective Touch HUD visibility
  const showTouchHUD = controlScheme === 'TOUCH' || (controlScheme === 'AUTO' && (Capacitor.isNativePlatform() || detectedInputMode === 'TOUCH' || isMobile));

  // Dynamic Input Mode Detection & Zero-Interruption Seamless Switching
  useEffect(() => {
    const handleTouchActivity = () => {
      setDetectedInputMode((prev) => (prev !== 'TOUCH' ? 'TOUCH' : prev));
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        setDetectedInputMode('TOUCH');
      } else if (e.pointerType === 'mouse') {
        setDetectedInputMode('KEYBOARD');
      }
    };

    const handleKeyDown = () => {
      setDetectedInputMode((prev) => (prev !== 'KEYBOARD' ? 'KEYBOARD' : prev));
    };

    window.addEventListener('touchstart', handleTouchActivity, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchActivity);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-pause when application goes to background (Visibility Change / Packaging readiness)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (gameStateRef.current.status === 'PLAYING') {
          setIsGameMenuOpen(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // --- SELECTED BOSS STATE ---
  const [selectedBoss, setSelectedBoss] = useState<BossClassId>(saveProfile.activeBossId || 'demon_monarch');
  const [treeSelectedBoss, setTreeSelectedBoss] = useState<BossClassId>(saveProfile.activeBossId || 'demon_monarch');

  // --- PERSISTENT PROGRESSION SLICES ---
  const [charProgression, setCharProgression] = useState<AllCharacterProgression>(saveProfile.characters);
  const [highestWaveRecord, setHighestWaveRecord] = useState<number>(saveProfile.stats.highestWave);
  const [souls, setSouls] = useState<number>(saveProfile.currencies.souls);
  const [metaLevels, setMetaLevels] = useState<Record<string, number>>(saveProfile.soulAltar);
  const [globalStats, setGlobalStats] = useState<GameStatsRecord>(saveProfile.stats);

  // Initialize GameAudio with loaded volume and mute state
  useEffect(() => {
    gameAudio.setVolume(sfxVolume);
    gameAudio.setMuted(sfxMuted);
  }, []);

  // Centralized Master Save Writer
  const commitSaveProfile = useCallback((patch: Partial<EternalOverlordSaveV1>) => {
    setSaveProfile((prev) => {
      const updated: EternalOverlordSaveV1 = {
        ...prev,
        ...patch,
        version: 1,
        lastPlayed: Date.now(),
        settings: {
          ...prev.settings,
          ...(patch.settings || {}),
        },
        stats: {
          ...prev.stats,
          ...(patch.stats || {}),
        },
        currencies: {
          ...prev.currencies,
          ...(patch.currencies || {}),
        },
      };

      try {
        localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(updated));
        // Backwards compatibility legacy synchronization
        localStorage.setItem('eternal_overlord_char_progression', JSON.stringify(updated.characters));
        localStorage.setItem('eternal_overlord_souls', updated.currencies.souls.toString());
        localStorage.setItem('eternal_overlord_meta', JSON.stringify(updated.soulAltar));
        localStorage.setItem('eternal_overlord_highest_wave', updated.stats.highestWave.toString());
        localStorage.setItem('eternal_overlord_auto_attack', updated.settings.autoAttack.toString());
      } catch (err) {
        console.warn('[SaveManager] Failed to write localStorage payload', err);
      }

      setLastSavedTimestamp(updated.lastPlayed);
      return updated;
    });
  }, []);

  const triggerManualSave = useCallback(() => {
    gameAudio.playConfirmSelect();
    commitSaveProfile({
      activeBossId: selectedBoss,
      characters: charProgression,
      currencies: { souls, gold: 0 },
      soulAltar: metaLevels,
      stats: { ...globalStats, highestWave: Math.max(globalStats.highestWave, highestWaveRecord) },
      settings: {
        autoAttack: autoAttackEnabled,
        sfxVolume,
        musicVolume,
        sfxMuted,
        musicMuted,
        screenShake: screenShakeEnabled,
        damageDensity,
        highContrast,
        controlScheme,
      },
    });
    setManualSaveIndicator(true);
    setTimeout(() => setManualSaveIndicator(false), 2500);
  }, [commitSaveProfile, selectedBoss, charProgression, souls, metaLevels, globalStats, highestWaveRecord, autoAttackEnabled, sfxVolume, musicVolume, sfxMuted, musicMuted, screenShakeEnabled, damageDensity, highContrast, controlScheme]);

  const resetAllSaveData = useCallback(() => {
    try {
      localStorage.removeItem(SAVE_STORAGE_KEY);
      localStorage.removeItem('eternal_overlord_char_progression');
      localStorage.removeItem('eternal_overlord_souls');
      localStorage.removeItem('eternal_overlord_meta');
      localStorage.removeItem('eternal_overlord_highest_wave');
      localStorage.removeItem('eternal_overlord_auto_attack');
    } catch {}

    const fresh = createDefaultSave();
    setSaveProfile(fresh);
    setCharProgression(fresh.characters);
    setHighestWaveRecord(1);
    setSouls(0);
    setMetaLevels({});
    setGlobalStats(fresh.stats);
    setSelectedBoss('demon_monarch');
    setTreeSelectedBoss('demon_monarch');
    setAutoAttackEnabled(true);
    setSfxVolume(0.8);
    setMusicVolume(0.5);
    setSfxMuted(false);
    setMusicMuted(false);
    setScreenShakeEnabled(true);
    setDamageDensity('FULL');
    setHighContrast(false);
    setControlScheme('AUTO');
    setLastSavedTimestamp(Date.now());
    setShowResetConfirmModal(false);

    try {
      localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(fresh));
    } catch {}

    gameAudio.playVictoryFanfare();
  }, []);

  const handleControlSchemeChange = (scheme: ControlScheme) => {
    setControlScheme(scheme);
    commitSaveProfile({
      settings: {
        ...saveProfile.settings,
        controlScheme: scheme,
      },
    });
    gameAudio.playConfirmSelect();
  };

  const toggleAutoAttack = (val?: boolean) => {
    setAutoAttackEnabled((prev) => {
      const next = typeof val === 'boolean' ? val : !prev;
      commitSaveProfile({
        settings: {
          ...saveProfile.settings,
          autoAttack: next,
          sfxVolume,
          musicVolume,
          sfxMuted,
          musicMuted,
          screenShake: screenShakeEnabled,
          damageDensity,
          highContrast,
        },
      });
      return next;
    });
  };

  const handleSfxVolumeChange = (vol: number) => {
    setSfxVolume(vol);
    gameAudio.setVolume(vol);
    commitSaveProfile({
      settings: { ...saveProfile.settings, sfxVolume: vol },
    });
  };

  const handleMusicVolumeChange = (vol: number) => {
    setMusicVolume(vol);
    commitSaveProfile({
      settings: { ...saveProfile.settings, musicVolume: vol },
    });
  };

  const handleToggleSfxMute = () => {
    const next = !sfxMuted;
    setSfxMuted(next);
    gameAudio.setMuted(next);
    commitSaveProfile({
      settings: { ...saveProfile.settings, sfxMuted: next },
    });
  };

  const handleToggleMusicMute = () => {
    const next = !musicMuted;
    setMusicMuted(next);
    commitSaveProfile({
      settings: { ...saveProfile.settings, musicMuted: next },
    });
  };

  const handleToggleScreenShake = () => {
    const next = !screenShakeEnabled;
    setScreenShakeEnabled(next);
    commitSaveProfile({
      settings: { ...saveProfile.settings, screenShake: next },
    });
  };

  const handleToggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    commitSaveProfile({
      settings: { ...saveProfile.settings, highContrast: next },
    });
  };

  const handleCycleDamageDensity = () => {
    const next: 'FULL' | 'REDUCED' | 'OFF' = damageDensity === 'FULL' ? 'REDUCED' : damageDensity === 'REDUCED' ? 'OFF' : 'FULL';
    setDamageDensity(next);
    commitSaveProfile({
      settings: { ...saveProfile.settings, damageDensity: next },
    });
  };

  const saveMeta = (newSouls: number, newMeta: Record<string, number>) => {
    setSouls(newSouls);
    setMetaLevels(newMeta);
    commitSaveProfile({
      currencies: { ...saveProfile.currencies, souls: newSouls },
      soulAltar: newMeta,
    });
  };

  const saveCharacterProgression = (updated: AllCharacterProgression) => {
    setCharProgression(updated);
    commitSaveProfile({
      characters: updated,
    });
  };

  const saveHighestWave = (wave: number) => {
    if (wave > highestWaveRecord) {
      setHighestWaveRecord(wave);
      setGlobalStats((prev) => ({ ...prev, highestWave: wave }));
      commitSaveProfile({
        stats: { ...globalStats, highestWave: wave },
      });
    }
  };

  // --- APP OVERLAY VIEWS ---
  const [activeTab, setActiveTab] = useState<
    'BOSS_SELECT' | 'SKILL_TREE' | 'ABILITY_LOADOUT' | 'SOUL_ALTAR' | 'BESTIARY' | 'DEV_GALLERY' | 'SETTINGS'
  >('BOSS_SELECT');
  const [treeBranchFilter, setTreeBranchFilter] = useState<TreeBranchType>('SWORDSMANSHIP');
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [draftOptions, setDraftOptions] = useState<string[]>([]);
  const [rerollCount, setRerollCount] = useState(2);
  const [isMerchantOpen, setIsMerchantOpen] = useState(false);
  const [merchantPurchases, setMerchantPurchases] = useState<Record<string, number>>({});

  // Map the Android hardware Back gesture to the existing in-game pause/menu.
  // Prevent the system from quitting a run unexpectedly.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let disposed = false;
    let backHandle: { remove: () => Promise<void> } | undefined;
    void AndroidApp.addListener('backButton', () => {
      const status = gameStateRef.current.status;
      if (isDraftOpen || isMerchantOpen) {
        return; // Don't discard a forced level-up/shop selection.
      }
      if (status === 'PLAYING') {
        setIsGameMenuOpen((open) => !open);
      } else if (status === 'START') {
        void AndroidApp.exitApp();
      } else if (status === 'GAME_OVER' || status === 'VICTORY') {
        setGameState((prev) => ({...prev, status: 'START'}));
      }
    }).then((handle) => {
      if (disposed) void handle.remove();
      else backHandle = handle;
    });
    return () => {
      disposed = true;
      if (backHandle) void backHandle.remove();
    };
  }, [isDraftOpen, isMerchantOpen]);


  // In-run state for UI
  const [hudHp, setHudHp] = useState({ current: 500, max: 500, ghost: 500 });
  const [hudExp, setHudExp] = useState({ current: 0, needed: 100, level: 1 });
  const [hudGold, setHudGold] = useState(0);
  const [hudSoulsGained, setHudSoulsGained] = useState(0);
  const [hudWave, setHudWave] = useState(1);
  const [hudWaveTimer, setHudWaveTimer] = useState(0);
  const [hudBossSpawned, setHudBossSpawned] = useState(false);
  const [hudBossCount, setHudBossCount] = useState(0);
  const [hudEnemyCount, setHudEnemyCount] = useState(0);
  const [hudKills, setHudKills] = useState(0);

  // Dedicated Resource Bar for Active Boss (Fury / Essence / Blood / Void / Earth)
  const [hudResource, setHudResource] = useState({ current: 0, max: 100, name: 'Infernal Fury', color: '#ef4444' });
  const [hudMinionCount, setHudMinionCount] = useState(0);

  // Dedicated Top 5-Slot Ability Tray States
  const [hudDash, setHudDash] = useState({
    cdRemaining: 0,
    cdMax: 2.2,
    isReady: true,
  });
  const [hudUltimate, setHudUltimate] = useState({
    cdRemaining: 0,
    cdMax: 36,
    chargePct: 0,
    isReady: false,
    name: 'Hellblade Judgment',
    desc: 'Cataclysmic Greatsword Crash',
  });
  const [hudAbilitySlots, setHudAbilitySlots] = useState<HudSkillSlot[]>([]);

  // Character EXP Progression Tracker for HUD & Summary
  const [hudCharExp, setHudCharExp] = useState({
    level: 1,
    exp: 0,
    nextExp: 80,
    gainedThisRun: 0,
  });

  // Run Summary Stats State
  const [runSummary, setRunSummary] = useState({
    wavesSurvived: 1,
    highestWave: 1,
    enemiesDefeated: 0,
    bossesDefeated: 0,
    goldCollected: 0,
    soulsHarvested: 0,
    runTime: 0,
    damageDealt: 0,
    charExpGained: 0,
    newCharLevel: 1,
    isNewRecord: false,
  });

  // Input bindings
  const inputRef = useInput(canvasRef, true, {
    width: canvasWidth,
    height: canvasHeight,
  });

  // Mobile virtual joystick and buttons ref
  const virtualControlsRef = useRef({
    dx: 0,
    dy: 0,
    dash: false,
    ultimate: false,
    attack: false,
    slot1: false,
    slot2: false,
    slot3: false,
    slot4: false,
    slot5: false,
  });

  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // --- GAME ENGINE SIMULATION REFS (HIGH FREQUENCY 60 FPS) ---
  const simRef = useRef({
    arenaW: 2400,
    arenaH: 1800,
    theme: 'infernal' as 'crypt' | 'infernal',
    floorEngine: new FloorEngine(2400, 1800, 'obsidian_basalt_magma'),
    currentBiomeId: 'obsidian_basalt_magma' as FloorBiomeId,
    
    camX: 600,
    camY: 450,
    screenShake: 0,
    hitstop: 0,
    runTime: 0,

    boss: {
      x: 1200,
      y: 900,
      w: 88,
      h: 88,
      vx: 0,
      vy: 0,
      hp: 500,
      ghostHp: 500,
      maxHp: 500,
      speed: 230,
      armorReduction: 0,
      facingRight: true,
      aimAngle: 0,
      dashTimer: 0,
      dashCooldownTimer: 0,
      dashDuration: 0.3,
      dashCooldown: 2.2,
      isInvulnerable: false,
      ultimateTimer: 36.0,
      ultimateCooldown: 36.0,
      attackActionTimer: 0,
      basicAttackTimer: 0,
      basicAttackCooldown: 0.85,
      classData: BOSS_CLASSES[0],
      anim: { currentAction: 'IDLE', currentFrame: 0, timer: 0 } as SpriteAnimationState,
      kills: 0,
      killStreak: 0,
      bossesSlain: 0,
      damageDealt: 0,
      damageTaken: 0,
      hurtTimer: 0,
      totalGoldGained: 0,
      charExpGainedThisRun: 0,
      activePerks: new Set<string>(),
      auraTimer: 0,

      // Character Resource (Fury for Demon Monarch, Essence for Lich Lord)
      resource: 0,
      maxResource: 100,
      resourceRegenTimer: 0,
      active5Loadout: [] as string[],
      active5Cooldowns: [0, 0, 0, 0, 0],
      active5MaxCooldowns: [1.2, 2.0, 1.5, 3.0, 2.5],
      transformationTimer: 0,
      wingsTimer: 0,
    },

    meleeSwings: [] as Array<{
      id: string;
      skillId: string;
      originX: number;
      originY: number;
      baseAngle: number;
      startAngle: number;
      endAngle: number;
      arcSpan: number;
      radius: number;
      duration: number;
      timer: number;
      damage: number;
      color: string;
      trailColor: string;
      coreColor: string;
      weaponType: MeleeWeaponType;
      slashImgKey?: string;
      hitEnemies: Set<string>;
      facingRight: boolean;
      lifeSteal?: number;
      pull?: boolean;
    }>,

    skills: new Map<string, { level: number; timer: number }>(),

    exp: 0,
    expNeeded: 50,
    bossLevel: 1,
    gold: 0,
    soulsGained: 0,
    wave: 1,
    waveDuration: 45,
    waveTimer: 0,
    isWaveBossSpawned: false,
    nextSpawnTimer: 0,
    roamingHeroCooldown: 12,

    enemies: [] as any[],
    projectiles: [] as any[],
    particles: [] as any[],
    pickups: [] as any[],
    pillars: [] as any[],
    damageNumbers: [] as any[],
    telegraphs: [] as any[],
    speechBarks: [] as SpeechBark[],
    enemySlashes: [] as Array<{
      id: string;
      x: number;
      y: number;
      angle: number;
      radius: number;
      color: string;
      timer: number;
      duration: number;
    }>,
    summons: [] as Array<{
      id: string;
      type: BossSkillDef['summonType'];
      skillId: string;
      x: number;
      y: number;
      vx: number;
      vy: number;
      hp: number;
      maxHp: number;
      damage: number;
      speed: number;
      attackTimer: number;
      attackCooldown: number;
      lifeTime: number;
      facingRight: boolean;
      orbitAngle?: number;
      orbitRadius?: number;
      rank?: number;
      action?: SummonAnimationAction;
      animTimer?: number;
      hurtTimer?: number;
    }>,
    orbitSwords: [] as Array<{
      id: string;
      skillId: string;
      angle: number;
      radius: number;
      speed: number;
      damage: number;
      color: string;
    }>,
    groundDecals: [] as Array<{
      id: string;
      type: 'fire_trail' | 'magma_fissure' | 'permafrost' | 'necropolis' | 'throne_zone';
      x: number;
      y: number;
      radius: number;
      damage: number;
      timer: number;
      duration: number;
      color: string;
    }>,

    bossVoiceCooldown: 0,
    heroVoiceCooldown: 0,

    shopPurchases: {} as Record<string, number>,

    perkHpMult: 1,
    perkDamageMult: 1,
    perkSpeedMult: 1,
    perkHasteMult: 1,
    perkMagnetMult: 1,
    perkStartingGold: 0,
    maxMinionCap: 15,
  });

  // Sprite Renderers Cache
  const spriteRenderersRef = useRef<Record<string, SpriteRenderer>>({});

  const getSpriteRenderer = useCallback((spritePrefix: string) => {
    if (spriteRenderersRef.current[spritePrefix]) {
      return spriteRenderersRef.current[spritePrefix];
    }
    const configs: Record<string, SpriteActionConfig> = {
      IDLE: {
        imageUrl: `${spritePrefix}_idle`,
        totalFrames: 4,
        frameWidth: 512,
        frameHeight: 512,
        fps: 8,
      },
      RUN: {
        imageUrl: `${spritePrefix}_run`,
        totalFrames: 16,
        frameWidth: 512,
        frameHeight: 512,
        fps: 16,
      },
      ATTACK: {
        imageUrl: `${spritePrefix}_attack`,
        totalFrames: 16,
        frameWidth: 512,
        frameHeight: 512,
        fps: 18,
      },
      HURT: {
        imageUrl: `${spritePrefix}_hurt`,
        totalFrames: 16,
        frameWidth: 512,
        frameHeight: 512,
        fps: 10,
      },
      DEATH: {
        imageUrl: `${spritePrefix}_death`,
        totalFrames: 16,
        frameWidth: 512,
        frameHeight: 512,
        fps: 10,
        loop: false,
      },
    };
    const renderer = new SpriteRenderer(configs);
    spriteRenderersRef.current[spritePrefix] = renderer;
    return renderer;
  }, []);

  // Helper to trigger voice lines with Web Speech API & speech barks
  const triggerVoiceLine = useCallback((
    speaker: 'boss' | 'hero',
    text: string,
    speakerName: string,
    x: number,
    y: number,
    targetId?: string
  ) => {
    const sim = simRef.current;
    if (speaker === 'boss' && sim.bossVoiceCooldown > 0) return;
    if (speaker === 'hero' && sim.heroVoiceCooldown > 0) return;

    if (speaker === 'boss') {
      sim.bossVoiceCooldown = 3.2;
    } else {
      sim.heroVoiceCooldown = 2.8;
    }

    sim.speechBarks.push({
      id: `bark_${Date.now()}_${Math.random()}`,
      speaker,
      speakerName,
      text,
      targetId,
      x,
      y,
      timer: 2.8,
      maxDuration: 2.8,
      color: speaker === 'boss' ? '#fed7aa' : '#fef08a',
      bgColor: speaker === 'boss' ? 'rgba(30, 10, 10, 0.94)' : 'rgba(15, 23, 42, 0.94)',
      borderColor: speaker === 'boss' ? '#ef4444' : '#f59e0b',
    });

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !gameAudio.getMuteState()) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (speaker === 'boss') {
          utterance.pitch = 0.4;
          utterance.rate = 0.85;
          utterance.volume = 0.9;
        } else {
          utterance.pitch = 1.2;
          utterance.rate = 1.1;
          utterance.volume = 0.8;
        }
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  }, []);

  // Persistent Character EXP & Skill Points Awarding Helper
  const awardPersistentCharExp = useCallback((amount: number) => {
    setCharProgression((prev) => {
      const curProg = prev[selectedBoss] || { ...DEFAULT_PROG };
      let newLevel = curProg.level;
      let newExp = curProg.exp + amount;
      let newNextExp = curProg.nextExp;
      let unlocked = [...curProg.unlockedPerks];

      let levelGained = 0;
      while (newExp >= newNextExp) {
        newExp -= newNextExp;
        newLevel += 1;
        levelGained += 1;
        newNextExp = Math.floor(80 * Math.pow(1.08, newLevel - 1) + newLevel * 15);

        const bClass = BOSS_CLASSES.find((b) => b.id === selectedBoss);
        if (bClass) {
          bClass.milestones.forEach((m) => {
            if (newLevel >= m.levelReq && !unlocked.includes(m.id)) {
              unlocked.push(m.id);
              gameAudio.playVictoryFanfare();
            }
          });
        }
      }

      let updatedTree = curProg.treeData ? { ...curProg.treeData } : getDefaultTreeData(selectedBoss);
      if (updatedTree && levelGained > 0) {
        // Calculate newly awarded skill points (2 pts per level + 1 bonus every 10 levels)
        const totalCalculated = calculateCharacterSkillPoints(newLevel);
        const alreadySpent = Object.values(updatedTree.allocatedSkills).reduce((a, b) => a + (b - 1), 0);
        updatedTree.skillPoints = Math.max(0, totalCalculated - alreadySpent);
      }

      const updated = {
        ...prev,
        [selectedBoss]: {
          level: newLevel,
          exp: newExp,
          nextExp: newNextExp,
          unlockedPerks: unlocked,
          treeData: updatedTree,
          lichData: selectedBoss === 'lich_lord' ? updatedTree : curProg.lichData,
        },
      };

      commitSaveProfile({
        characters: updated,
      });

      simRef.current.boss.charExpGainedThisRun += amount;
      setHudCharExp({
        level: newLevel,
        exp: newExp,
        nextExp: newNextExp,
        gainedThisRun: simRef.current.boss.charExpGainedThisRun,
      });

      return updated;
    });
  }, [selectedBoss, commitSaveProfile]);

  // Skill Mastery Progression Tracker
  const recordAbilityCombatUsage = useCallback((skillNodeId: string, expGain = 10) => {
    setCharProgression((prev) => {
      const charData = prev[selectedBoss];
      const tree = charData?.treeData;
      if (!tree) return prev;

      const curMastery = tree.abilityMastery[skillNodeId] || { exp: 0, rank: 1 };
      let newRank = curMastery.rank;
      let newExp = curMastery.exp + expGain;
      const rankThreshold = newRank * 60;

      if (newExp >= rankThreshold && newRank < 20) {
        newExp -= rankThreshold;
        newRank += 1;
        gameAudio.playPowerupChime();
      }

      const updatedMastery = {
        ...tree.abilityMastery,
        [skillNodeId]: { exp: newExp, rank: newRank },
      };

      const updatedTree = { ...tree, abilityMastery: updatedMastery };
      const updatedAll = {
        ...prev,
        [selectedBoss]: {
          ...charData,
          treeData: updatedTree,
          lichData: selectedBoss === 'lich_lord' ? updatedTree : charData.lichData,
        },
      };

      commitSaveProfile({
        characters: updatedAll,
      });

      return updatedAll;
    });
  }, [selectedBoss, commitSaveProfile]);

  // --- INITIALIZE GAME RUN ---
  const initGame = useCallback(() => {
    gameAudio.playConfirmSelect();
    const classData = BOSS_CLASSES.find((b) => b.id === selectedBoss) || BOSS_CLASSES[0];
    const curProg = charProgression[selectedBoss] || { ...DEFAULT_PROG };
    const charTreeData = curProg.treeData || curProg.lichData || getDefaultTreeData(selectedBoss);

    const charLvl = curProg.level;
    const charHpMult = 1 + (charLvl - 1) * 0.02;
    const charDmgMult = 1 + (charLvl - 1) * 0.015;
    const charSpeedMult = 1 + (charLvl - 1) * 0.005;
    const charArmorReduction = Math.min(0.4, (charLvl - 1) * 0.003);

    const vigorLvl = metaLevels['vigor'] || 0;
    const mightLvl = metaLevels['might'] || 0;
    const swiftLvl = metaLevels['swiftness'] || 0;
    const hasteLvl = metaLevels['haste'] || 0;
    const magnetLvl = metaLevels['magnet'] || 0;
    const greedLvl = metaLevels['greed'] || 0;

    const perkHpMult = (1 + vigorLvl * 0.15) * charHpMult;
    const perkDamageMult = (1 + mightLvl * 0.12) * charDmgMult;
    const perkSpeedMult = (1 + swiftLvl * 0.08) * charSpeedMult;
    const perkHasteMult = Math.max(0.4, 1 - hasteLvl * 0.07);
    const perkMagnetMult = 1 + magnetLvl * 0.25;
    const startingGold = greedLvl * 50;

    const baseHp = (getConfig('bossMaxHp') as number) * classData.hpMod * perkHpMult;
    const baseSpeed = (getConfig('playerSpeed') as number) * classData.speedMod * perkSpeedMult;
    const dashCooldown = getConfig('dashCooldown') as number;
    const ultimateCooldown = getConfig('ultimateCooldown') as number;

    const sim = simRef.current;
    sim.perkHpMult = perkHpMult;
    sim.perkDamageMult = perkDamageMult;
    sim.perkSpeedMult = perkSpeedMult;
    sim.perkHasteMult = perkHasteMult;
    sim.perkMagnetMult = perkMagnetMult;
    sim.perkStartingGold = startingGold;
    sim.maxMinionCap = 14;
    sim.runTime = 0;

    sim.theme = selectedBoss === 'demon_monarch' ? 'infernal' : (selectedBoss === 'lich_lord' ? 'crypt' : 'crypt');
    sim.arenaW = 2400;
    sim.arenaH = 1800;
    
    // Choose signature or procedural biome for the run with unique seed
    const chosenBiome = getRecommendedBiomeForBoss(selectedBoss);
    const runSeed = Math.floor(Math.random() * 1000000) + 1;
    sim.currentBiomeId = chosenBiome;
    sim.floorEngine.setBiome(chosenBiome, runSeed);

    sim.camX = 1200 - canvasWidth / 2;
    sim.camY = 900 - canvasHeight / 2;
    sim.screenShake = 0;
    sim.hitstop = 0;

    const activePerks = new Set<string>();
    classData.milestones.forEach((m) => {
      if (charLvl >= m.levelReq) activePerks.add(m.id);
    });

    const active5 = [...charTreeData.loadout];
    const initial5Cds: number[] = [];
    const initial5MaxCds: number[] = [];
    active5.forEach((nodeId) => {
      const nodeDef = ALL_CHARACTER_NODES[nodeId] || ALL_BOSS_SKILLS[nodeId];
      const baseCd = nodeDef ? (nodeDef.cooldown || (nodeDef as any).baseCooldown || 2.5) : 2.5;
      const actualCd = baseCd * perkHasteMult;
      initial5Cds.push(0);
      initial5MaxCds.push(actualCd);
    });

    const initialResource = classData.id === 'demon_monarch' ? 25 : (classData.id === 'vampire_queen' ? 40 : (classData.id === 'shadow_reaper' ? 30 : (classData.id === 'cursed_golem' ? 35 : 100)));

    sim.boss = {
      x: 1200,
      y: 900,
      w: 88,
      h: 88,
      vx: 0,
      vy: 0,
      hp: baseHp,
      ghostHp: baseHp,
      maxHp: baseHp,
      speed: baseSpeed,
      armorReduction: charArmorReduction,
      facingRight: true,
      aimAngle: 0,
      dashTimer: 0,
      dashCooldownTimer: 0,
      dashDuration: getConfig('dashDuration') as number,
      dashCooldown: dashCooldown,
      isInvulnerable: false,
      ultimateTimer: ultimateCooldown * 0.5,
      ultimateCooldown: ultimateCooldown,
      attackActionTimer: 0,
      basicAttackTimer: 0,
      basicAttackCooldown: selectedBoss === 'demon_monarch' ? 0.75 : (selectedBoss === 'shadow_reaper' ? 0.7 : 0.95),
      classData,
      anim: { currentAction: 'IDLE', currentFrame: 0, timer: 0 },
      kills: 0,
      killStreak: 0,
      bossesSlain: 0,
      damageDealt: 0,
      damageTaken: 0,
      hurtTimer: 0,
      totalGoldGained: startingGold,
      charExpGainedThisRun: 0,
      activePerks,
      auraTimer: 0,

      resource: initialResource,
      maxResource: 100,
      resourceRegenTimer: 0,
      active5Loadout: active5,
      active5Cooldowns: initial5Cds,
      active5MaxCooldowns: initial5MaxCds,
      transformationTimer: 0,
      wingsTimer: 0,
    };

    sim.skills.clear();
    active5.forEach((skillId) => {
      sim.skills.set(skillId, { level: 1, timer: 0 });
    });

    sim.exp = 0;
    sim.expNeeded = 60;
    sim.bossLevel = 1;
    sim.gold = startingGold;
    sim.soulsGained = 0;
    sim.wave = 1;
    sim.waveTimer = 0;
    sim.isWaveBossSpawned = false;
    sim.nextSpawnTimer = 0;
    sim.roamingHeroCooldown = 15;

    sim.meleeSwings = [];
    sim.enemies = [];
    sim.projectiles = [];
    sim.particles = [];
    sim.pickups = [];
    sim.damageNumbers = [];
    sim.telegraphs = [];
    sim.speechBarks = [];
    sim.enemySlashes = [];
    sim.summons = [];
    sim.orbitSwords = [];
    sim.groundDecals = [];
    sim.bossVoiceCooldown = 0;
    sim.heroVoiceCooldown = 0;
    sim.shopPurchases = {};
    setMerchantPurchases({});

    const startLine = BOSS_START_LINES[Math.floor(Math.random() * BOSS_START_LINES.length)];
    setTimeout(() => {
      triggerVoiceLine('boss', startLine, classData.name, sim.boss.x, sim.boss.y);
      gameAudio.playBossLaughter();
    }, 400);

    sim.pillars = [];
    const pillarCount = 14;
    for (let i = 0; i < pillarCount; i++) {
      const px = 250 + Math.random() * (sim.arenaW - 500);
      const py = 250 + Math.random() * (sim.arenaH - 500);
      if (Math.hypot(px - 1200, py - 900) > 220) {
        sim.pillars.push({
          id: `pillar_${i}`,
          x: px,
          y: py,
          w: 52,
          h: 96,
          hp: 300,
          maxHp: 300,
        });
      }
    }

    setHudHp({ current: baseHp, max: baseHp, ghost: baseHp });
    setHudExp({ current: 0, needed: 60, level: 1 });
    setHudResource({ current: initialResource, max: 100, name: classData.resourceName, color: classData.color });
    setHudMinionCount(0);
    setHudCharExp({
      level: curProg.level,
      exp: curProg.exp,
      nextExp: curProg.nextExp,
      gainedThisRun: 0,
    });
    setHudGold(startingGold);
    setHudSoulsGained(0);
    setHudWave(1);
    setHudWaveTimer(0);
    setHudBossSpawned(false);
    setHudBossCount(0);
    setHudEnemyCount(0);
    setHudKills(0);
    setRerollCount(2);

    const maxDashCd = dashCooldown * perkHasteMult;
    setHudDash({
      cdRemaining: 0,
      cdMax: maxDashCd,
      isReady: true,
    });

    const isUltReady = sim.boss.ultimateTimer <= 0;
    setHudUltimate({
      cdRemaining: sim.boss.ultimateTimer,
      cdMax: sim.boss.ultimateCooldown,
      chargePct: Math.floor((1 - sim.boss.ultimateTimer / sim.boss.ultimateCooldown) * 100),
      isReady: isUltReady,
      name: classData.ultimateName,
      desc: classData.ultimateDesc,
    });

    // Initialize 5 active hud slots
    const initialSlots: HudSkillSlot[] = active5.map((skillId, idx) => {
      const def = ALL_CHARACTER_NODES[skillId] || ALL_BOSS_SKILLS[skillId];
      const maxCd = initial5MaxCds[idx] || 2.0;
      return {
        id: skillId,
        name: def ? def.name : skillId,
        category: def ? (def as any).branch || (def as any).category : 'Active',
        level: charTreeData.allocatedSkills[skillId] || 1,
        color: def ? def.color : classData.color,
        keyBadge: `${idx + 1}`,
        cdRemaining: 0,
        cdMax: maxCd,
        cdProgress: 1,
        isReady: true,
        resourceCost: def ? (def as any).resourceCost || (def as any).furyCost || (def as any).essenceCost || 0 : 0,
        canCastResource: true,
        slotIndex: idx,
      };
    });
    setHudAbilitySlots(initialSlots);

    setIsGameMenuOpen(false);
    setIsDraftOpen(false);
    setIsMerchantOpen(false);
    setCurrentBgmUrl(selectedBoss === 'demon_monarch' ? 'assets/audio/bgm_boss_invasion.mp3' : 'assets/audio/bgm_dungeon_combat.mp3');

    setGameState({
      status: 'PLAYING',
      score: 0,
      level: 1,
    });

    gameAudio.playPowerupChime();
    if (sdk) {
      sdk.startGame();
    }
  }, [selectedBoss, charProgression, metaLevels, canvasWidth, canvasHeight, sdk, triggerVoiceLine]);

  usePlaygroundGameLifecycle(gameState, sdk);

  const hasAutoplayed = useRef(false);
  useEffect(() => {
    if (
      !hasAutoplayed.current &&
      new URLSearchParams(window.location.search).has('autoplay')
    ) {
      hasAutoplayed.current = true;
      initGame();
    }
  }, [initGame]);

  // --- BOSS ULTIMATE ABILITY TRIGGER ---
  const triggerBossUltimate = useCallback(() => {
    const sim = simRef.current;
    if (sim.boss.ultimateTimer > 0 || sim.boss.hp <= 0) return;

    sim.boss.ultimateTimer = sim.boss.ultimateCooldown;
    if (screenShakeEnabled) {
      sim.screenShake = 16 * (getConfig('screenShakeIntensity') as number);
    }
    gameAudio.playBossLaughter();
    gameAudio.playChiptuneExplosion();

    const boss = sim.boss;
    const classId = boss.classData.id;

    const ultLine = BOSS_ULTIMATE_LINES[Math.floor(Math.random() * BOSS_ULTIMATE_LINES.length)];
    triggerVoiceLine('boss', ultLine, boss.classData.name, boss.x, boss.y);

    if (classId === 'demon_monarch') {
      gameAudio.playGunshotBlast();
      // Level Milestone Ultimates for Demon Monarch
      const curLvl = charProgression.demon_monarch?.level || 1;

      // 1. Colossal Hellblade Judgment Crash
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const dist = 140 + Math.random() * 320;
        const tx = boss.x + Math.cos(angle) * dist;
        const ty = boss.y + Math.sin(angle) * dist;

        sim.telegraphs.push({
          type: 'circle',
          x: tx,
          y: ty,
          radius: 110,
          timer: 0.3 + (i % 4) * 0.12,
          color: 'rgba(239, 68, 68, 0.55)',
          onTrigger: () => {
            gameAudio.playSwordClash();
            sim.enemies.forEach((en) => {
              if (Math.hypot(en.x - tx, en.y - ty) < 125) {
                const dmg = 280 * sim.perkDamageMult;
                en.hp -= dmg;
                boss.damageDealt += dmg;
                en.isHurt = true;
                en.hurtTimer = 0.3;
                sim.damageNumbers.push({
                  x: en.x,
                  y: en.y,
                  val: Math.floor(dmg),
                  color: '#ef4444',
                  life: 0.85,
                });
              }
            });
            for (let p = 0; p < 25; p++) {
              sim.particles.push({
                x: tx,
                y: ty,
                vx: (Math.random() - 0.5) * 360,
                vy: (Math.random() - 0.5) * 360,
                radius: 5 + Math.random() * 6,
                color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
                life: 0.6,
              });
            }
          },
        });
      }

      // If Lv 100+, activate 12s giant Demon King transformation
      if (curLvl >= 100) {
        boss.transformationTimer = 12.0;
      }

      // Grant full fury
      boss.resource = boss.maxResource;

    } else if (classId === 'lich_lord') {
      gameAudio.playPowerupChime();
      const playerLevel = charProgression.lich_lord?.level || 1;

      // Spawn 10 circle skeletal warriors
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const dist = 60 + Math.random() * 40;
        sim.summons.push({
          id: `ult_sum_${Date.now()}_${i}`,
          type: i % 2 === 0 ? 'bone_sentinel' : 'crypt_archer',
          skillId: 'lich_summon_bone_sentinel',
          x: boss.x + Math.cos(angle) * dist,
          y: boss.y + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          hp: 350,
          maxHp: 350,
          damage: 65 * sim.perkDamageMult,
          speed: 180,
          attackTimer: 0,
          attackCooldown: 1.0,
          lifeTime: 25,
          facingRight: true,
          orbitAngle: angle,
          orbitRadius: 80,
        });
      }

      if (playerLevel >= 100) {
        sim.summons.push({
          id: `ult_dragon_${Date.now()}`,
          type: 'skeletal_dragon',
          skillId: 'lich_summon_skeletal_dragon',
          x: boss.x,
          y: boss.y - 120,
          vx: 0,
          vy: 0,
          hp: 1200,
          maxHp: 1200,
          damage: 150 * sim.perkDamageMult,
          speed: 240,
          attackTimer: 0,
          attackCooldown: 1.5,
          lifeTime: 30,
          facingRight: true,
        });
      }

      sim.enemies.forEach((en) => {
        en.frozenTimer = 5.0;
        const dmg = 150 * sim.perkDamageMult;
        en.hp -= dmg;
        boss.damageDealt += dmg;
        sim.damageNumbers.push({
          x: en.x,
          y: en.y,
          val: Math.floor(dmg),
          color: '#38bdf8',
          life: 0.8,
        });
      });

      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        sim.projectiles.push({
          type: 'frost_shard',
          x: boss.x,
          y: boss.y,
          vx: Math.cos(angle) * 480,
          vy: Math.sin(angle) * 480,
          damage: 110 * sim.perkDamageMult,
          life: 1.6,
          pierce: 99,
          w: 28,
          h: 28,
        });
      }
    } else if (classId === 'vampire_queen') {
      gameAudio.playPotionGulp();
      const playerLevel = charProgression.vampire_queen?.level || 1;
      let totalDrained = 0;

      // 1. Spectral Vampire Dancers & 35% Arena HP Drain
      sim.enemies.forEach((en) => {
        const drain = en.hp * 0.35 + 100;
        const dmg = drain * sim.perkDamageMult;
        en.hp -= dmg;
        boss.damageDealt += dmg;
        totalDrained += drain * 0.5;
        en.isHurt = true;
        en.hurtTimer = 0.3;
        sim.damageNumbers.push({
          x: en.x,
          y: en.y,
          val: Math.floor(dmg),
          color: '#ec4899',
          life: 0.85,
        });
      });

      // 2. Night of a Thousand Wings Bat Swarm
      const batCount = playerLevel >= 100 ? 24 : 14;
      for (let i = 0; i < batCount; i++) {
        const angle = (i / batCount) * Math.PI * 2;
        sim.summons.push({
          id: `vq_ult_bat_${Date.now()}_${i}`,
          type: 'vampire_bat',
          skillId: 'vq_bat_swarm',
          x: boss.x + Math.cos(angle) * 70,
          y: boss.y + Math.sin(angle) * 70,
          vx: Math.cos(angle) * 260,
          vy: Math.sin(angle) * 260,
          hp: 250,
          maxHp: 250,
          damage: 75 * sim.perkDamageMult,
          speed: 240,
          attackTimer: 0,
          attackCooldown: 0.6,
          lifeTime: 18,
          facingRight: true,
          orbitAngle: angle,
          orbitRadius: 90,
        });
      }

      // 3. Level 150+ Sanguine Cathedral Ground Decal
      if (playerLevel >= 150) {
        sim.groundDecals.push({
          id: `vq_ult_cathedral_${Date.now()}`,
          type: 'throne_zone',
          x: boss.x,
          y: boss.y,
          radius: 350,
          damage: 120 * sim.perkDamageMult,
          timer: 12.0,
          duration: 12.0,
          color: '#ec4899',
        });
      }

      // 4. Level 200+ Scarlet Moon Orbital Lasers
      if (playerLevel >= 200) {
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2;
          const dist = 100 + Math.random() * 300;
          const tx = boss.x + Math.cos(angle) * dist;
          const ty = boss.y + Math.sin(angle) * dist;
          sim.telegraphs.push({
            type: 'circle',
            x: tx,
            y: ty,
            radius: 90,
            timer: 0.2 + (i % 4) * 0.15,
            color: 'rgba(236, 72, 153, 0.6)',
            onTrigger: () => {
              gameAudio.playGunshotBlast();
              sim.enemies.forEach((en) => {
                if (Math.hypot(en.x - tx, en.y - ty) < 100) {
                  const dmg = 260 * sim.perkDamageMult;
                  en.hp -= dmg;
                  boss.damageDealt += dmg;
                  totalDrained += dmg * 0.3;
                  sim.damageNumbers.push({
                    x: en.x,
                    y: en.y,
                    val: Math.floor(dmg),
                    color: '#f43f5e',
                    life: 0.8,
                  });
                }
              });
            },
          });
        }
      }

      // 5. Level 250+ Blood Empress Wings & Transformation
      if (playerLevel >= 250) {
        boss.transformationTimer = 15.0;
        boss.wingsTimer = 15.0;
      }

      boss.hp = Math.min(boss.maxHp, boss.hp + totalDrained);
      boss.resource = boss.maxResource;
      gameAudio.playPotionGulp();
    } else if (classId === 'shadow_reaper') {
      gameAudio.playArcadeLaser();
      gameAudio.playGunshotBlast();
      const playerLevel = charProgression.shadow_reaper?.level || 1;

      // 1. Dance of Ten Thousand Cuts: 16 rapid screen-wide scythe sweeps in all directions
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const tx = boss.x + Math.cos(angle) * 260;
        const ty = boss.y + Math.sin(angle) * 260;
        sim.telegraphs.push({
          type: 'circle',
          x: tx,
          y: ty,
          radius: 120,
          timer: 0.15 + (i % 4) * 0.1,
          color: 'rgba(168, 85, 247, 0.65)',
          onTrigger: () => {
            gameAudio.playSwordClash();
            sim.enemies.forEach((en) => {
              if (Math.hypot(en.x - tx, en.y - ty) < 130) {
                const dmg = 240 * sim.perkDamageMult;
                en.hp -= dmg;
                boss.damageDealt += dmg;
                en.isHurt = true;
                en.hurtTimer = 0.25;
                sim.damageNumbers.push({
                  x: en.x,
                  y: en.y,
                  val: Math.floor(dmg),
                  color: '#c084fc',
                  life: 0.8,
                });
              }
            });
            for (let p = 0; p < 18; p++) {
              sim.particles.push({
                x: tx,
                y: ty,
                vx: (Math.random() - 0.5) * 320,
                vy: (Math.random() - 0.5) * 320,
                radius: 4 + Math.random() * 5,
                color: Math.random() > 0.5 ? '#a855f7' : '#c084fc',
                life: 0.5,
              });
            }
          },
        });
      }

      // 2. Level 100+ Night Without Footsteps: Summons 6 active shadow afterimages
      const cloneCount = playerLevel >= 100 ? 6 : 2;
      for (let i = 0; i < cloneCount; i++) {
        const angle = (i / cloneCount) * Math.PI * 2;
        sim.summons.push({
          id: `sr_ult_clone_${Date.now()}_${i}`,
          type: 'shadow_clone',
          skillId: 'sr_clone_whispering_shade',
          x: boss.x + Math.cos(angle) * 90,
          y: boss.y + Math.sin(angle) * 90,
          vx: 0,
          vy: 0,
          hp: 450,
          maxHp: 450,
          damage: 90 * sim.perkDamageMult,
          speed: 260,
          attackTimer: 0,
          attackCooldown: 0.7,
          lifeTime: 20,
          facingRight: true,
          rank: 5,
        });
      }

      // 3. Level 150+ Umbral Labyrinth Decal
      if (playerLevel >= 150) {
        sim.groundDecals.push({
          id: `sr_ult_labyrinth_${Date.now()}`,
          type: 'necropolis',
          x: boss.x,
          y: boss.y,
          radius: 380,
          damage: 130 * sim.perkDamageMult,
          timer: 14.0,
          duration: 14.0,
          color: '#9333ea',
        });
      }

      // 4. Level 200+ Harvest of Names: Marks all enemies and executes those under 35% HP
      if (playerLevel >= 200) {
        sim.enemies.forEach((en) => {
          if (en.hp < en.maxHp * 0.35 && !en.isBoss) {
            en.hp = 0;
            boss.kills += 1;
            boss.resource = Math.min(boss.maxResource, boss.resource + 20);
            sim.damageNumbers.push({
              x: en.x,
              y: en.y,
              val: 999,
              color: '#a855f7',
              life: 1.0,
            });
          } else {
            const dmg = 200 * sim.perkDamageMult;
            en.hp -= dmg;
            boss.damageDealt += dmg;
          }
        });
      }

      // 5. Level 250+ Eclipse Reaper transformation
      if (playerLevel >= 250) {
        boss.transformationTimer = 16.0;
      }

      // Restore full Marks
      boss.resource = boss.maxResource;
    } else if (classId === 'cursed_golem') {
      gameAudio.playJumpLandingThud();
      gameAudio.playMeleePunch();
      const playerLevel = charProgression.cursed_golem?.level || 1;

      // 1. Level 50 Milestone: Colossus Awakening (Giant transformation + 4 concentric shockwaves)
      boss.transformationTimer = 14.0;
      boss.resource = boss.maxResource;

      for (let r = 1; r <= 4; r++) {
        sim.telegraphs.push({
          type: 'circle',
          x: boss.x,
          y: boss.y,
          radius: r * 140,
          timer: r * 0.2,
          color: 'rgba(16, 185, 129, 0.55)',
          onTrigger: () => {
            gameAudio.playJumpLandingThud();
            gameAudio.playFootstepStone();
            sim.enemies.forEach((en) => {
              if (Math.hypot(en.x - boss.x, en.y - boss.y) < r * 140 + 40) {
                const dmg = 200 * sim.perkDamageMult;
                en.hp -= dmg;
                boss.damageDealt += dmg;
                en.stunnedTimer = 2.2;
                en.isHurt = true;
                en.hurtTimer = 0.3;
                sim.damageNumbers.push({
                  x: en.x,
                  y: en.y,
                  val: Math.floor(dmg),
                  color: '#34d399',
                  life: 0.85,
                });
              }
            });
            for (let p = 0; p < 20; p++) {
              sim.particles.push({
                x: boss.x + (Math.random() - 0.5) * (r * 280),
                y: boss.y + (Math.random() - 0.5) * (r * 280),
                vx: (Math.random() - 0.5) * 300,
                vy: (Math.random() - 0.5) * 300,
                radius: 5 + Math.random() * 6,
                color: Math.random() > 0.5 ? '#10b981' : '#059669',
                life: 0.55,
              });
            }
          },
        });
      }

      // 2. Level 100 Milestone: Faultline Dominion (Falling meteoric boulders across screen)
      if (playerLevel >= 100) {
        for (let b = 0; b < 12; b++) {
          const angle = (b / 12) * Math.PI * 2;
          const dist = 120 + Math.random() * 260;
          const bx = boss.x + Math.cos(angle) * dist;
          const by = boss.y + Math.sin(angle) * dist;
          sim.telegraphs.push({
            type: 'circle',
            x: bx,
            y: by,
            radius: 85,
            timer: 0.3 + (b % 4) * 0.15,
            color: 'rgba(5, 150, 105, 0.6)',
            onTrigger: () => {
              gameAudio.playChiptuneExplosion();
              sim.enemies.forEach((en) => {
                if (Math.hypot(en.x - bx, en.y - by) < 95) {
                  const dmg = 240 * sim.perkDamageMult;
                  en.hp -= dmg;
                  boss.damageDealt += dmg;
                  sim.damageNumbers.push({
                    x: en.x,
                    y: en.y,
                    val: Math.floor(dmg),
                    color: '#10b981',
                    life: 0.8,
                  });
                }
              });
            },
          });
        }
      }

      // 3. Level 150 Milestone: Heart of the Mountain (Lingering seismic tremor field)
      if (playerLevel >= 150) {
        sim.groundDecals.push({
          id: `cg_ult_tremor_${Date.now()}`,
          type: 'magma_fissure',
          x: boss.x,
          y: boss.y,
          radius: 360,
          damage: 130 * sim.perkDamageMult,
          timer: 14.0,
          duration: 14.0,
          color: '#10b981',
        });
      }

      // 4. Level 200 Milestone: Gravitic Cataclysm (Vacuum pull + implosion)
      if (playerLevel >= 200) {
        sim.enemies.forEach((en) => {
          const dx = boss.x - en.x;
          const dy = boss.y - en.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 20) {
            en.x += (dx / dist) * 200;
            en.y += (dy / dist) * 200;
          }
          const dmg = 220 * sim.perkDamageMult;
          en.hp -= dmg;
          boss.damageDealt += dmg;
        });
      }

      // 5. Level 250 Milestone: Worldstone Avatar (Spawns 4 Living Stone mini-golems)
      if (playerLevel >= 250) {
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          sim.summons.push({
            id: `cg_ult_golem_${Date.now()}_${i}`,
            type: 'golem_minion',
            skillId: 'cg_magic_living_stone',
            x: boss.x + Math.cos(angle) * 80,
            y: boss.y + Math.sin(angle) * 80,
            vx: 0,
            vy: 0,
            hp: 600,
            maxHp: 600,
            damage: 95 * sim.perkDamageMult,
            speed: 190,
            attackTimer: 0,
            attackCooldown: 0.8,
            lifeTime: 25,
            facingRight: true,
          });
        }
      }
    }
  }, [triggerVoiceLine, screenShakeEnabled, charProgression]);

  // --- DRAFT / LEVEL UP SYSTEM DRAWING EXCLUSIVELY FROM ACTIVE CHARACTER'S 50-SKILL POOL ---
  const generateDraftPool = useCallback(() => {
    return generateCharacterDraftPool(selectedBoss, simRef.current.skills, 3);
  }, [selectedBoss]);

  const triggerSkillDraft = useCallback(() => {
    const chosen = generateDraftPool();
    if (chosen.length === 0) {
      simRef.current.boss.hp = Math.min(simRef.current.boss.maxHp, simRef.current.boss.hp + 120);
      simRef.current.gold += 60;
      return;
    }
    gameAudio.playLevelUpStinger();
    setDraftOptions(chosen);
    setIsDraftOpen(true);
  }, [generateDraftPool]);

  const handleRerollDraft = () => {
    if (rerollCount > 0 || simRef.current.gold >= 20) {
      gameAudio.playConfirmSelect();
      if (rerollCount > 0) {
        setRerollCount((c) => c - 1);
      } else {
        simRef.current.gold -= 20;
        setHudGold(simRef.current.gold);
      }
      const newPool = generateDraftPool();
      setDraftOptions(newPool);
    } else {
      gameAudio.playErrorBuzz();
    }
  };

  const selectSkillUpgrade = (skillId: string) => {
    const sim = simRef.current;
    const cur = sim.skills.get(skillId);
    const def = ALL_CHARACTER_NODES[skillId] || ALL_BOSS_SKILLS[skillId];

    if (!cur) {
      sim.skills.set(skillId, { level: 1, timer: 0 });
    } else {
      cur.level = Math.min((def as any)?.maxRank || (def as any)?.maxLevel || 5, cur.level + 1);
    }

    if (def) {
      if ((def as any).hpBonus) {
        sim.boss.maxHp += (def as any).hpBonus;
        sim.boss.hp = Math.min(sim.boss.maxHp, sim.boss.hp + (def as any).hpBonus);
      }
      if ((def as any).armorBonus) {
        sim.boss.armorReduction = Math.min(0.65, sim.boss.armorReduction + (def as any).armorBonus);
      }
      if ((def as any).speedBonus) {
        sim.boss.speed += (getConfig('playerSpeed') as number) * (def as any).speedBonus;
      }
    }

    gameAudio.playPowerupChime();
    setIsDraftOpen(false);
  };

  // --- SPAWN ENEMY WITH DYNAMIC SCALING ---
  const spawnEnemy = (type: string, isElite = false, isBoss = false) => {
    const sim = simRef.current;
    const boss = sim.boss;

    const playerCharLvl = charProgression[selectedBoss]?.level || 1;
    const enemyLevel = Math.max(1, sim.wave + Math.floor(playerCharLvl * 0.4) + (isBoss ? 5 : 0));

    const angle = Math.random() * Math.PI * 2;
    const spawnDist = 780 + Math.random() * 160;
    const sx = clamp(boss.x + Math.cos(angle) * spawnDist, 100, sim.arenaW - 100);
    const sy = clamp(boss.y + Math.sin(angle) * spawnDist, 100, sim.arenaH - 100);

    const levelHpScale = 1 + (enemyLevel - 1) * 0.16;
    const levelDmgScale = 1 + (enemyLevel - 1) * 0.12;

    let baseHp = 130;
    let speed = 135;
    let baseDamage = 18;
    let spritePrefix = 'enemy_swordsman';
    let size = 70;
    let expValue = 12;
    let goldValue = 4;

    if (type === 'archer') {
      spritePrefix = 'enemy_archer';
      baseHp = 100;
      speed = 125;
      baseDamage = 16;
      expValue = 14;
      goldValue = 5;
    } else if (type === 'mage') {
      spritePrefix = 'enemy_mage';
      baseHp = 115;
      speed = 110;
      baseDamage = 22;
      expValue = 16;
      goldValue = 6;
    } else if (type === 'paladin') {
      spritePrefix = 'enemy_paladin';
      baseHp = 280;
      speed = 92;
      baseDamage = 28;
      size = 80;
      expValue = 24;
      goldValue = 10;
    } else if (type === 'rogue') {
      spritePrefix = 'enemy_rogue';
      baseHp = 110;
      speed = 210;
      baseDamage = 25;
      expValue = 15;
      goldValue = 7;
    } else if (type === 'berserker') {
      spritePrefix = 'enemy_berserker';
      baseHp = 190;
      speed = 180;
      baseDamage = 30;
      size = 76;
      expValue = 20;
      goldValue = 8;
    } else if (type === 'boss_grand_inquisitor') {
      spritePrefix = 'invader_grand_inquisitor';
      baseHp = 3800;
      speed = 118;
      baseDamage = 48;
      size = 114;
      isBoss = true;
      expValue = 220;
      goldValue = 75;
    } else if (type === 'boss_dragon_slayer') {
      spritePrefix = 'invader_dragon_slayer';
      baseHp = 4600;
      speed = 130;
      baseDamage = 54;
      size = 118;
      isBoss = true;
      expValue = 260;
      goldValue = 90;
    } else if (type === 'boss_royal_archmage') {
      spritePrefix = 'invader_royal_archmage';
      baseHp = 3400;
      speed = 105;
      baseDamage = 44;
      size = 110;
      isBoss = true;
      expValue = 240;
      goldValue = 85;
    }

    let hp = baseHp * levelHpScale;
    let damage = baseDamage * levelDmgScale;

    if (isElite && !isBoss) {
      hp *= 2.4;
      size *= 1.25;
      damage *= 1.4;
      expValue *= 3;
      goldValue *= 3;
    }

    let attackRange = 56;
    let windupDuration = 0.26;
    let slashColor = '#e2e8f0';
    let heroDisplayName = 'Hero Swordsman';

    if (type === 'rogue') {
      attackRange = 48;
      slashColor = '#a855f7';
      heroDisplayName = 'Rogue Assassin';
    } else if (type === 'berserker') {
      attackRange = 62;
      slashColor = '#ef4444';
      heroDisplayName = 'Berserker Champion';
    } else if (type === 'paladin') {
      attackRange = 70;
      slashColor = '#fbbf24';
      heroDisplayName = 'Holy Paladin';
    } else if (type === 'boss_grand_inquisitor') {
      attackRange = 82;
      slashColor = '#f59e0b';
      heroDisplayName = 'Grand Inquisitor';
    } else if (type === 'boss_dragon_slayer') {
      attackRange = 88;
      slashColor = '#f97316';
      heroDisplayName = 'Dragon Slayer';
    } else if (type === 'boss_royal_archmage') {
      attackRange = 360;
      heroDisplayName = 'Royal Archmage';
    } else if (type === 'archer') {
      attackRange = 340;
      heroDisplayName = 'Royal Archer';
    } else if (type === 'mage') {
      attackRange = 300;
      heroDisplayName = 'Battle Mage';
    }

    const enId = `en_${Date.now()}_${Math.random()}`;

    if (isBoss) {
      gameAudio.playHeroBattleCry();
      const line = HERO_SPAWN_LINES[Math.floor(Math.random() * HERO_SPAWN_LINES.length)];
      triggerVoiceLine('hero', line, heroDisplayName, sx, sy, enId);
    } else if (isElite && Math.random() < 0.35) {
      const line = HERO_SPAWN_LINES[Math.floor(Math.random() * HERO_SPAWN_LINES.length)];
      triggerVoiceLine('hero', line, heroDisplayName, sx, sy, enId);
    }

    sim.enemies.push({
      id: enId,
      type,
      name: heroDisplayName,
      level: enemyLevel,
      spritePrefix,
      x: sx,
      y: sy,
      w: size,
      h: size,
      hp,
      maxHp: hp,
      speed,
      damage,
      expValue,
      goldValue,
      isElite,
      isBoss,
      isRanged: type === 'archer' || type === 'mage' || type === 'boss_royal_archmage',
      attackRange,
      windupDuration,
      slashColor,
      facingRight: sx < boss.x,
      anim: { currentAction: 'RUN', currentFrame: 0, timer: 0 } as SpriteAnimationState,
      attackCooldown: 1.4 + Math.random() * 0.6,
      attackTimer: Math.random() * 0.8,
      frozenTimer: 0,
      stunnedTimer: 0,
      isHurt: false,
      hurtTimer: 0,
    });
  };

  // --- TRIGGER MELEE WEAPON SWING ---
  const triggerMeleeSwing = (
    skillId: string,
    level: number,
    color: string,
    trailColor: string,
    coreColor: string,
    slashImgKey: string | undefined,
    baseRadius: number,
    baseDmg: number,
    weaponType: MeleeWeaponType,
    extraOptions: {
      lifeSteal?: number;
      pull?: boolean;
      aimAngle?: number;
      furyGain?: number;
      createFissure?: boolean;
      fissureRadius?: number;
      screenShakeAmount?: number;
    } = {}
  ) => {
    const sim = simRef.current;
    const boss = sim.boss;
    const perkDamage = sim.perkDamageMult;

    boss.anim.currentAction = 'ATTACK';
    boss.anim.timer = 0;
    boss.anim.currentFrame = 0;
    boss.attackActionTimer = 0.22;

    let aimAngle = boss.facingRight ? 0 : Math.PI;
    if (extraOptions.aimAngle !== undefined) {
      aimAngle = extraOptions.aimAngle;
      boss.facingRight = Math.cos(aimAngle) >= 0;
    } else if (sim.enemies.length > 0) {
      let closest = sim.enemies[0];
      let minDist = Math.hypot(closest.x - boss.x, closest.y - boss.y);
      for (let i = 1; i < sim.enemies.length; i++) {
        const d = Math.hypot(sim.enemies[i].x - boss.x, sim.enemies[i].y - boss.y);
        if (d < minDist) {
          minDist = d;
          closest = sim.enemies[i];
        }
      }
      if (minDist < 420) {
        aimAngle = Math.atan2(closest.y - boss.y, closest.x - boss.x);
        boss.facingRight = Math.cos(aimAngle) >= 0;
      }
    }
    boss.aimAngle = aimAngle;

    let radius = clamp(baseRadius + (level - 1) * 8, 80, 135);
    if (boss.transformationTimer > 0) radius *= 1.45;

    let dmg = (baseDmg + level * 22) * perkDamage;

    const arcSpan = weaponType.includes('zweihander') ? Math.PI * 1.1 : Math.PI * 0.9;
    const duration = weaponType.includes('executioner') ? 0.22 : 0.18;

    const sweepDir = boss.facingRight ? 1 : -1;
    const startAngle = aimAngle - (arcSpan * 0.5) * sweepDir;
    const endAngle = aimAngle + (arcSpan * 0.5) * sweepDir;

    gameAudio.playSwordClash();

    // Spawn sparks and blade trail particles
    const tipDist = radius * 0.9;
    for (let p = 0; p < 8; p++) {
      const pAngle = startAngle + (endAngle - startAngle) * (p / 8);
      sim.particles.push({
        x: boss.x + Math.cos(pAngle) * tipDist,
        y: boss.y + Math.sin(pAngle) * tipDist,
        vx: (Math.random() - 0.5) * 160 + Math.cos(aimAngle) * 80,
        vy: (Math.random() - 0.5) * 160 + Math.sin(aimAngle) * 80,
        radius: 3 + Math.random() * 3,
        color: Math.random() > 0.4 ? '#f97316' : '#ef4444',
        life: 0.35,
      });
    }

    if (extraOptions.createFissure) {
      const fissureX = boss.x + Math.cos(aimAngle) * (radius * 0.85);
      const fissureY = boss.y + Math.sin(aimAngle) * (radius * 0.85);
      const fRad = extraOptions.fissureRadius || 80;
      sim.groundDecals.push({
        id: `fissure_${Date.now()}_${Math.random()}`,
        type: 'magma_fissure',
        x: fissureX,
        y: fissureY,
        radius: fRad,
        damage: dmg * 0.4,
        timer: 4.5,
        duration: 4.5,
        color: '#ef4444',
      });
      if (screenShakeEnabled && (extraOptions.screenShakeAmount || 0) > 0) {
        sim.screenShake = Math.max(sim.screenShake, extraOptions.screenShakeAmount!);
      }
    }

    // Gain Infernal Fury for Demon Monarch
    if (boss.classData.id === 'demon_monarch') {
      const gain = extraOptions.furyGain || 8;
      boss.resource = Math.min(boss.maxResource, boss.resource + gain);
    } else if (boss.classData.id === 'shadow_reaper') {
      const gain = extraOptions.furyGain || 8;
      boss.resource = Math.min(boss.maxResource, boss.resource + gain);
    } else if (boss.classData.id === 'cursed_golem') {
      const gain = extraOptions.furyGain || 10;
      boss.resource = Math.min(boss.maxResource, boss.resource + gain);
    }

    sim.meleeSwings.push({
      id: `swing_${Date.now()}_${Math.random()}`,
      skillId,
      originX: boss.x,
      originY: boss.y,
      baseAngle: aimAngle,
      startAngle,
      endAngle,
      arcSpan,
      radius,
      duration,
      timer: duration,
      damage: dmg,
      color,
      trailColor,
      coreColor,
      weaponType,
      slashImgKey,
      hitEnemies: new Set<string>(),
      facingRight: boss.facingRight,
      lifeSteal: extraOptions.lifeSteal,
      pull: extraOptions.pull,
    });
  };

  // --- MASTER CASTING & ABILITY FIRING ENGINE ---
  const castAbility = (
    skillNodeId: string,
    slotIndex?: number,
    manualAim?: { angle: number; worldX: number; worldY: number }
  ) => {
    const sim = simRef.current;
    const boss = sim.boss;
    const def = (ALL_CHARACTER_NODES[skillNodeId] || ALL_BOSS_SKILLS[skillNodeId]) as any;
    if (!def) return;

    // Resource Cost Validation
    const cost = def.resourceCost || def.furyCost || def.essenceCost || 0;
    if (cost > 0) {
      if (boss.resource < cost) {
        return; // Not enough resource
      }
      boss.resource -= cost;
    }

    const perkDamage = sim.perkDamageMult;
    const treeData = charProgression[selectedBoss]?.treeData;
    const rank = treeData?.allocatedSkills[skillNodeId] || 1;
    const masteryRank = treeData?.abilityMastery[skillNodeId]?.rank || 1;
    const scaledDamage = ((def.damage || def.baseDamage || 65) + rank * 16 + masteryRank * 8) * perkDamage;

    recordAbilityCombatUsage(skillNodeId, 8);

    // =========================================================================
    // 100% MELEE GREATSWORD COMBAT DISPATCH FOR DEMON MONARCH
    // =========================================================================
    if (selectedBoss === 'demon_monarch') {
      // Determine greatsword style based on ability flavor
      let greatswordType: 'greatsword' | 'volcanic_greatsword' | 'obsidian_executioner' | 'cursed_zweihander' = 'greatsword';
      if (skillNodeId.includes('volcanic') || skillNodeId.includes('magma') || skillNodeId.includes('fissure') || skillNodeId.includes('quake')) {
        greatswordType = 'volcanic_greatsword';
      } else if (skillNodeId.includes('execution') || skillNodeId.includes('decapitation') || skillNodeId.includes('skullbreaker') || skillNodeId.includes('verdict')) {
        greatswordType = 'obsidian_executioner';
      } else if (skillNodeId.includes('cross') || skillNodeId.includes('zweihander') || skillNodeId.includes('tempest') || skillNodeId.includes('dance') || skillNodeId.includes('flurry')) {
        greatswordType = 'cursed_zweihander';
      }

      // Ground Cleaves, Fissures, and Seismic Slams
      if (def.effectType === 'decal' || skillNodeId.includes('fissure') || skillNodeId.includes('slam') || skillNodeId.includes('stomp') || skillNodeId.includes('break')) {
        const aimAngle = manualAim?.angle ?? (boss.facingRight ? 0 : Math.PI);
        const strikeDist = 85;
        const targetX = boss.x + Math.cos(aimAngle) * strikeDist;
        const targetY = boss.y + Math.sin(aimAngle) * strikeDist;

        // Perform physical ground slam melee swing
        triggerMeleeSwing(
          skillNodeId,
          rank,
          '#ef4444',
          '#f97316',
          '#ffffff',
          'weapon_scythe_slash',
          110,
          scaledDamage,
          greatswordType,
          {
            aimAngle,
            furyGain: 14,
            createFissure: true,
            fissureRadius: 90 + rank * 8,
            screenShakeAmount: 8,
          }
        );
        gameAudio.playGunshotBlast();
        return;
      }

      // Spinning Blade Whirlwinds
      if (skillNodeId.includes('whirl') || skillNodeId.includes('spin') || skillNodeId.includes('tempest')) {
        triggerMeleeSwing(
          skillNodeId,
          rank,
          '#ef4444',
          '#ea580c',
          '#ffffff',
          'weapon_scythe_slash',
          115,
          scaledDamage,
          'cursed_zweihander',
          {
            pull: true,
            furyGain: 15,
            aimAngle: manualAim?.angle,
          }
        );
        gameAudio.playSwordClash();
        return;
      }

      // Lunges & Thrusts
      if (skillNodeId.includes('thrust') || skillNodeId.includes('lunge') || skillNodeId.includes('dash') || skillNodeId.includes('sprint')) {
        const aimAngle = manualAim?.angle ?? (boss.facingRight ? 0 : Math.PI);
        const lungeDist = 120;
        boss.x = clamp(boss.x + Math.cos(aimAngle) * lungeDist, 80, sim.arenaW - 80);
        boss.y = clamp(boss.y + Math.sin(aimAngle) * lungeDist, 80, sim.arenaH - 80);

        triggerMeleeSwing(
          skillNodeId,
          rank,
          '#f97316',
          '#dc2626',
          '#ffffff',
          'weapon_scythe_slash',
          105,
          scaledDamage,
          'greatsword',
          {
            aimAngle,
            furyGain: 12,
            screenShakeAmount: 4,
          }
        );
        gameAudio.playSwordClash();
        return;
      }

      // Summons (Ash Mirages & Orbiting Greatswords)
      if (def.effectType === 'summon' || def.summonType === 'ash_clone') {
        gameAudio.playPowerupChime();
        const angle = manualAim ? manualAim.angle : Math.random() * Math.PI * 2;
        sim.summons.push({
          id: `ash_mirage_${Date.now()}_${Math.random()}`,
          type: 'ash_clone',
          skillId: skillNodeId,
          x: boss.x + Math.cos(angle) * 65,
          y: boss.y + Math.sin(angle) * 65,
          vx: 0,
          vy: 0,
          hp: 380 + rank * 50,
          maxHp: 380 + rank * 50,
          damage: scaledDamage * 0.8,
          speed: 210,
          attackTimer: 0,
          attackCooldown: 0.85,
          lifeTime: 22,
          facingRight: true,
          action: 'IDLE',
          animTimer: 0,
        });
        return;
      }

      // Orbiting Greatswords
      if (def.effectType === 'orbit' || skillNodeId.includes('arsenal') || skillNodeId.includes('orbit')) {
        gameAudio.playSwordClash();
        const swordCount = 4;
        for (let i = 0; i < swordCount; i++) {
          const oAngle = (i / swordCount) * Math.PI * 2;
          sim.telegraphs.push({
            type: 'circle',
            x: boss.x + Math.cos(oAngle) * 90,
            y: boss.y + Math.sin(oAngle) * 90,
            radius: 45,
            timer: 0.2,
            color: 'rgba(239, 68, 68, 0.4)',
            onTrigger: () => {
              sim.enemies.forEach((en) => {
                if (Math.hypot(en.x - boss.x, en.y - boss.y) < 130) {
                  en.hp -= scaledDamage * 0.6;
                  boss.damageDealt += scaledDamage * 0.6;
                  en.isHurt = true;
                  en.hurtTimer = 0.2;
                }
              });
            },
          });
        }
        return;
      }

      // Default Melee Greatsword Strike for all other Monarch abilities
      triggerMeleeSwing(
        skillNodeId,
        rank,
        '#ef4444',
        '#f97316',
        '#ffffff',
        'weapon_scythe_slash',
        100,
        scaledDamage,
        greatswordType,
        {
          aimAngle: manualAim?.angle,
          furyGain: 10,
          lifeSteal: skillNodeId.includes('bloodforged') ? 0.25 : undefined,
        }
      );
      return;
    }

    // 1. MELEE CLEAVES & STONE PUNCHES (Other Characters)
    if (def.effectType === 'melee_cleave') {
      const isReaper = selectedBoss === 'shadow_reaper';
      const isGolem = selectedBoss === 'cursed_golem';
      triggerMeleeSwing(
        skillNodeId,
        rank,
        def.color || (isReaper ? '#a855f7' : (isGolem ? '#10b981' : '#ef4444')),
        isReaper ? '#c084fc' : (isGolem ? '#34d399' : '#f97316'),
        '#ffffff',
        'weapon_scythe_slash',
        isGolem ? 105 : (isReaper ? 95 : 90),
        scaledDamage,
        isGolem ? 'hammer' : (isReaper ? 'scythe' : 'greatsword'),
        {
          lifeSteal: def.lifeSteal || (skillNodeId.includes('bloodforged') || skillNodeId.includes('reaper_leech') ? 0.25 : undefined),
          pull: def.tags?.includes('Pull') || skillNodeId.includes('grasp') || isReaper || isGolem,
          aimAngle: manualAim?.angle,
          furyGain: def.furyGain || (isGolem ? 12 : (isReaper ? 10 : 6)),
        }
      );
      return;
    }

    // 2. SUMMON ENTITIES (All Minions, Ash Clones & Shadow Clones)
    if (def.effectType === 'summon' || def.summonType) {
      const sType = def.summonType || (selectedBoss === 'shadow_reaper' ? 'shadow_clone' : 'bone_sentinel');
      const maxAllowed = Math.min(sim.maxMinionCap, 2 + Math.floor(rank / 4));
      const currentCount = sim.summons.filter((s) => s.type === sType).length;

      if (currentCount < maxAllowed) {
        if (sType === 'vampire_bat') {
          gameAudio.playBatScreech();
        } else if (sType === 'bone_mage') {
          gameAudio.playNecroticSpellCast();
        } else if (sType === 'skeletal_dragon') {
          gameAudio.playDragonRoarBreath();
        } else {
          gameAudio.playPowerupChime();
        }

        const angle = manualAim ? manualAim.angle : Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 40;

        let minionHp = 220 + rank * 45;
        let minionSpeed = 170;
        let attackCd = 1.1;

        if (sType === 'bone_sentinel') {
          minionHp = 280 + rank * 50;
          minionSpeed = 160;
          attackCd = 1.0;
        } else if (sType === 'crypt_archer') {
          minionHp = 180 + rank * 35;
          minionSpeed = 180;
          attackCd = 1.4;
        } else if (sType === 'grave_spearman') {
          minionHp = 260 + rank * 45;
          minionSpeed = 165;
          attackCd = 1.1;
        } else if (sType === 'grave_hound') {
          minionHp = 200 + rank * 40;
          minionSpeed = 240;
          attackCd = 0.8;
        } else if (sType === 'bone_mage') {
          minionHp = 210 + rank * 38;
          minionSpeed = 150;
          attackCd = 1.6;
        } else if (sType === 'ossuary_guardian') {
          minionHp = 500 + rank * 80;
          minionSpeed = 120;
          attackCd = 1.8;
        } else if (sType === 'wight_captain') {
          minionHp = 380 + rank * 60;
          minionSpeed = 190;
          attackCd = 0.9;
        } else if (sType === 'corpse_collector') {
          minionHp = 260 + rank * 45;
          minionSpeed = 175;
          attackCd = 1.3;
        } else if (sType === 'dread_abomination') {
          minionHp = 650 + rank * 100;
          minionSpeed = 130;
          attackCd = 2.0;
        } else if (sType === 'skeletal_dragon') {
          minionHp = 850 + rank * 120;
          minionSpeed = 210;
          attackCd = 1.8;
        } else if (sType === 'ash_clone') {
          minionHp = 350 + rank * 60;
          minionSpeed = 220;
          attackCd = 0.85;
        } else if (sType === 'shadow_clone') {
          minionHp = 380 + rank * 55;
          minionSpeed = 240;
          attackCd = 0.75;
        }

        sim.summons.push({
          id: `sum_${Date.now()}_${Math.random()}`,
          type: sType,
          skillId: skillNodeId,
          x: boss.x + Math.cos(angle) * dist,
          y: boss.y + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          hp: minionHp,
          maxHp: minionHp,
          damage: scaledDamage,
          speed: minionSpeed,
          attackTimer: 0,
          attackCooldown: attackCd,
          lifeTime: sType === 'skeletal_dragon' ? 35 : sType === 'dread_abomination' ? 30 : 25,
          facingRight: true,
          rank,
          action: 'IDLE',
          animTimer: 0,
        });

        for (let p = 0; p < 14; p++) {
          sim.particles.push({
            x: boss.x,
            y: boss.y,
            vx: (Math.random() - 0.5) * 180,
            vy: (Math.random() - 0.5) * 180,
            radius: 4,
            color: def.color || '#38bdf8',
            life: 0.45,
          });
        }
      }
      return;
    }

    // 3. TARGETED STRIKES / EXPLOSIONS / METEORS
    if (def.effectType === 'strike') {
      const strikeX = manualAim ? manualAim.worldX : (sim.enemies[0]?.x || boss.x + (boss.facingRight ? 120 : -120));
      const strikeY = manualAim ? manualAim.worldY : (sim.enemies[0]?.y || boss.y);
      const radius = 75 + rank * 8;

      sim.telegraphs.push({
        type: 'circle',
        x: strikeX,
        y: strikeY,
        radius,
        timer: 0.22,
        color: (def.color || '#ef4444') + '66',
        onTrigger: () => {
          gameAudio.playGunshotBlast();
          sim.enemies.forEach((en) => {
            if (Math.hypot(en.x - strikeX, en.y - strikeY) < radius + 25) {
              en.hp -= scaledDamage;
              boss.damageDealt += scaledDamage;
              en.isHurt = true;
              en.hurtTimer = 0.22;
              if (damageDensity !== 'OFF') {
                sim.damageNumbers.push({
                  x: en.x,
                  y: en.y,
                  val: Math.floor(scaledDamage),
                  color: def.color || '#ef4444',
                  life: 0.7,
                });
              }
            }
          });
          for (let p = 0; p < 20; p++) {
            sim.particles.push({
              x: strikeX,
              y: strikeY,
              vx: (Math.random() - 0.5) * 280,
              vy: (Math.random() - 0.5) * 280,
              radius: 4 + Math.random() * 4,
              color: def.color || '#f97316',
              life: 0.5,
            });
          }
        },
      });
      return;
    }

    // 4. NOVAS & CONCENTRIC PULSES
    if (def.effectType === 'nova') {
      gameAudio.playGunshotBlast();
      const count = 12 + rank * 2;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        sim.projectiles.push({
          type: def.element === 'frost' ? 'frost_shard' : 'infernal_orb',
          x: boss.x,
          y: boss.y,
          vx: Math.cos(angle) * 440,
          vy: Math.sin(angle) * 440,
          damage: scaledDamage,
          life: 1.5,
          w: 26,
          h: 26,
        });
      }
      return;
    }

    // 5. DECALS (Fissures, Scorched Ground, Magma Pools)
    if (def.effectType === 'decal') {
      sim.groundDecals.push({
        id: `decal_${Date.now()}_${Math.random()}`,
        type: 'magma_fissure',
        x: manualAim ? manualAim.worldX : boss.x,
        y: manualAim ? manualAim.worldY : boss.y,
        radius: 85 + rank * 10,
        damage: scaledDamage * 0.45,
        timer: 6.0 + rank * 0.5,
        duration: 6.0 + rank * 0.5,
        color: def.color || '#ea580c',
      });
      return;
    }

    // 6. CHAIN ABILITIES (Molten Chains, Soul Siphon)
    if (def.effectType === 'chain' || def.effectType === 'curse') {
      gameAudio.playSwordClash();
      let targets = [...sim.enemies].sort(
        (a, b) => Math.hypot(a.x - boss.x, a.y - boss.y) - Math.hypot(b.x - boss.x, b.y - boss.y)
      ).slice(0, 5 + Math.floor(rank / 3));

      targets.forEach((t) => {
        t.hp -= scaledDamage;
        boss.damageDealt += scaledDamage;
        t.isHurt = true;
        t.hurtTimer = 0.2;
        if (damageDensity !== 'OFF') {
          sim.damageNumbers.push({
            x: t.x,
            y: t.y,
            val: Math.floor(scaledDamage),
            color: def.color || '#f97316',
            life: 0.7,
          });
        }
      });
      return;
    }

    // 7. DEFAULT: Multi-Shot Projectiles & Blade Waves
    gameAudio.playArcadeLaser();
    let baseAngle = boss.facingRight ? 0 : Math.PI;
    if (manualAim) {
      baseAngle = manualAim.angle;
      boss.facingRight = Math.cos(baseAngle) >= 0;
    } else if (sim.enemies.length > 0) {
      const sorted = [...sim.enemies].sort(
        (a, b) => Math.hypot(a.x - boss.x, a.y - boss.y) - Math.hypot(b.x - boss.x, b.y - boss.y)
      );
      const target = sorted[0];
      baseAngle = target ? Math.atan2(target.y - boss.y, target.x - boss.x) : baseAngle;
    }

    const count = (def.projectileCount || 3) + Math.floor(rank / 4);
    const spread = 0.28 * count;

    for (let i = 0; i < count; i++) {
      const angle = baseAngle - spread / 2 + (i / Math.max(1, count - 1)) * spread;
      sim.projectiles.push({
        type: def.element === 'frost' ? 'frost_shard' : 'infernal_orb',
        x: boss.x,
        y: boss.y,
        vx: Math.cos(angle) * 460,
        vy: Math.sin(angle) * 460,
        damage: scaledDamage,
        life: 1.6,
        pierce: def.pierce || (rank >= 10 ? 4 : 2),
        w: 28,
        h: 28,
      });
    }
  };

  // --- MAIN SIMULATION UPDATE LOOP ---
  const update = (dt: number) => {
    if (gameState.status !== 'PLAYING') return;
    if (isDraftOpen || isMerchantOpen || isGameMenuOpen) return;

    const sim = simRef.current;
    const boss = sim.boss;
    const input = inputRef.current;
    const virt = virtualControlsRef.current;

    sim.runTime += dt;

    if (sim.hitstop > 0) {
      sim.hitstop -= dt;
      return;
    }

    if (boss.transformationTimer > 0) {
      boss.transformationTimer = Math.max(0, boss.transformationTimer - dt);
    }

    // Passive Resource Management
    boss.resourceRegenTimer += dt;
    if (boss.resourceRegenTimer >= 1.0) {
      boss.resourceRegenTimer = 0;
      if (boss.classData.id === 'lich_lord') {
        boss.resource = Math.min(boss.maxResource, boss.resource + 4);
      } else if (boss.classData.id === 'vampire_queen') {
        boss.resource = Math.min(boss.maxResource, boss.resource + 3);
      } else if (boss.classData.id === 'shadow_reaper') {
        boss.resource = Math.min(boss.maxResource, boss.resource + 2);
      } else if (boss.classData.id === 'cursed_golem') {
        boss.resource = Math.min(boss.maxResource, boss.resource + 3);
      }
    }

    // Ghost HP catchup animation
    if (boss.ghostHp > boss.hp) {
      boss.ghostHp = Math.max(boss.hp, boss.ghostHp - dt * 220);
    } else {
      boss.ghostHp = boss.hp;
    }

    // --- 1. BOSS MOVEMENT & DASH ---
    let moveX = 0;
    let moveY = 0;

    if (input.actions.left) moveX -= 1;
    if (input.actions.right) moveX += 1;
    if (input.actions.up) moveY -= 1;
    if (input.actions.down) moveY += 1;

    if (virt.dx !== 0 || virt.dy !== 0) {
      moveX = virt.dx;
      moveY = virt.dy;
    }

    const moveMag = Math.hypot(moveX, moveY);
    if (moveMag > 0.1) {
      const normX = moveX / moveMag;
      const normY = moveY / moveMag;
      let curSpeed = boss.speed;
      if (boss.dashTimer > 0) curSpeed *= 2.8;

      boss.vx = normX * curSpeed;
      boss.vy = normY * curSpeed;
      boss.facingRight = normX >= 0;

      if (boss.attackActionTimer <= 0 && boss.hurtTimer <= 0) {
        boss.anim.currentAction = 'RUN';
      }
    } else {
      boss.vx = 0;
      boss.vy = 0;
      if (boss.dashTimer <= 0 && boss.hurtTimer <= 0 && boss.attackActionTimer <= 0) {
        boss.anim.currentAction = 'IDLE';
      }
    }

    if (boss.attackActionTimer > 0) {
      boss.attackActionTimer -= dt;
      boss.anim.currentAction = 'ATTACK';
    }

    const isDashRequested = input.actions.confirm || virt.dash;
    if (isDashRequested && boss.dashCooldownTimer <= 0 && boss.dashTimer <= 0) {
      boss.dashTimer = boss.dashDuration;
      boss.dashCooldownTimer = boss.dashCooldown * sim.perkHasteMult;
      boss.isInvulnerable = true;
      gameAudio.playRetroJump();

      // Shadow Reaper gains Reaper's Marks on dash/dodge
      if (boss.classData.id === 'shadow_reaper') {
        boss.resource = Math.min(boss.maxResource, boss.resource + 10);
      }

      for (let p = 0; p < 12; p++) {
        sim.particles.push({
          x: boss.x + (Math.random() - 0.5) * 30,
          y: boss.y + (Math.random() - 0.5) * 30,
          vx: -boss.vx * 0.3,
          vy: -boss.vy * 0.3,
          radius: 8,
          color: boss.classData.color,
          life: 0.3,
        });
      }
    }

    if (boss.dashTimer > 0) {
      boss.dashTimer -= dt;
      boss.isInvulnerable = true;
      if (boss.dashTimer <= 0) {
        boss.isInvulnerable = false;
      }
    }
    if (boss.dashCooldownTimer > 0) {
      boss.dashCooldownTimer -= dt;
    }

    if (boss.hurtTimer > 0) {
      boss.hurtTimer -= dt;
      if (boss.hurtTimer > 0 && boss.attackActionTimer <= 0) {
        boss.anim.currentAction = 'HURT';
      }
    }

    if (boss.ultimateTimer > 0) {
      boss.ultimateTimer = Math.max(0, boss.ultimateTimer - dt);
    }
    if (virt.ultimate) {
      triggerBossUltimate();
      virt.ultimate = false;
    }

    boss.x = clamp(boss.x + boss.vx * dt, 60, sim.arenaW - 60);
    boss.y = clamp(boss.y + boss.vy * dt, 60, sim.arenaH - 60);

    sim.pillars.forEach((pil) => {
      const dx = boss.x - pil.x;
      const dy = boss.y - pil.y;
      const dist = Math.hypot(dx, dy);
      const minD = boss.w / 2 + pil.w / 2;
      if (dist < minD && dist > 0) {
        boss.x = pil.x + (dx / dist) * minD;
        boss.y = pil.y + (dy / dist) * minD;
      }
    });

    const bossRenderer = getSpriteRenderer(boss.classData.spritePrefix);
    boss.anim = bossRenderer.getNextState(boss.anim, dt);

    // --- 2. CAMERA TRACKING & SCREEN SHAKE ---
    const targetCamX = boss.x - canvasWidth / 2;
    const targetCamY = boss.y - canvasHeight / 2;
    sim.camX += (targetCamX - sim.camX) * 0.12;
    sim.camY += (targetCamY - sim.camY) * 0.12;
    sim.camX = clamp(sim.camX, 0, Math.max(0, sim.arenaW - canvasWidth));
    sim.camY = clamp(sim.camY, 0, Math.max(0, sim.arenaH - canvasHeight));

    if (sim.screenShake > 0) {
      sim.screenShake = Math.max(0, sim.screenShake - dt * 25);
    }

    // --- 3. WAVE TIMER & ENEMY SPAWNER ---
    sim.waveTimer += dt;
    const spawnMult = getConfig('enemySpawnRateMultiplier') as number;

    const isBossWave = sim.wave % 5 === 0;
    if (isBossWave && !sim.isWaveBossSpawned && sim.waveTimer > 2.5) {
      sim.isWaveBossSpawned = true;
      setCurrentBgmUrl('assets/audio/bgm_boss_invasion.mp3');

      const bossTypes = ['boss_grand_inquisitor', 'boss_dragon_slayer', 'boss_royal_archmage'];
      const numBossesToSpawn = sim.wave >= 15 ? 3 : sim.wave >= 10 ? 2 : 1;

      for (let b = 0; b < numBossesToSpawn; b++) {
        const typeIndex = (Math.floor(sim.wave / 5) - 1 + b) % bossTypes.length;
        spawnEnemy(bossTypes[typeIndex], true, true);
      }

      gameAudio.playVictoryFanfare();
      if (screenShakeEnabled) {
        sim.screenShake = 12 * (getConfig('screenShakeIntensity') as number);
      }
    }

    if (!isBossWave) {
      sim.roamingHeroCooldown -= dt;
      if (sim.roamingHeroCooldown <= 0) {
        sim.roamingHeroCooldown = 18;
        const roamChance = 0.15 + Math.min(0.15, sim.wave * 0.02);
        if (Math.random() < roamChance) {
          const bossTypes = ['boss_grand_inquisitor', 'boss_dragon_slayer', 'boss_royal_archmage'];
          const randomBoss = bossTypes[Math.floor(Math.random() * bossTypes.length)];
          spawnEnemy(randomBoss, false, true);
        }
      }
    }

    sim.nextSpawnTimer -= dt;
    const targetEnemyCap = Math.min(180, 25 + sim.wave * 12);
    if (sim.nextSpawnTimer <= 0 && sim.enemies.length < targetEnemyCap) {
      sim.nextSpawnTimer = Math.max(0.2, (1.8 - sim.wave * 0.08) / spawnMult);
      const enemyPool = ['swordsman', 'swordsman', 'archer', 'berserker'];
      if (sim.wave >= 2) enemyPool.push('mage', 'rogue');
      if (sim.wave >= 3) enemyPool.push('paladin');

      const randType = enemyPool[Math.floor(Math.random() * enemyPool.length)];
      const isElite = Math.random() < 0.12 + sim.wave * 0.02;
      spawnEnemy(randType, isElite, false);
    }

    if (sim.waveTimer >= sim.waveDuration) {
      sim.wave += 1;
      saveHighestWave(sim.wave);
      sim.waveTimer = 0;
      sim.isWaveBossSpawned = false;
      sim.roamingHeroCooldown = 12;
      gameAudio.playPowerupChime();

      awardPersistentCharExp(50 + sim.wave * 15);

      if (sim.wave % 2 === 0) {
        setIsMerchantOpen(true);
      }
    }

    // --- 4. INDEPENDENT BASIC ATTACK & 5-SLOT ABILITIES ENGINE ---
    const isPointerAttacking = input.pointer.down;
    const isVirtualAttacking = virt.attack;
    const isManualAttackActive = isPointerAttacking || isVirtualAttacking;

    let manualAimInfo: { angle: number; worldX: number; worldY: number } | undefined = undefined;
    if (isManualAttackActive) {
      const mouseWorldX = sim.camX + input.pointer.x;
      const mouseWorldY = sim.camY + input.pointer.y;
      const aimAngle = Math.atan2(mouseWorldY - boss.y, mouseWorldX - boss.x);
      manualAimInfo = { angle: aimAngle, worldX: mouseWorldX, worldY: mouseWorldY };
      boss.facingRight = Math.cos(aimAngle) >= 0;
    }

    // Basic attack for melee characters continues auto-attacking independently
    boss.basicAttackTimer += dt;
    if (boss.classData.id === 'demon_monarch' && boss.basicAttackTimer >= boss.basicAttackCooldown) {
      boss.basicAttackTimer = 0;
      triggerMeleeSwing(
        'dm_swords_infernal_cleave',
        1,
        '#ef4444',
        '#f97316',
        '#ffffff',
        'weapon_scythe_slash',
        95,
        85,
        'greatsword',
        { furyGain: 8, aimAngle: manualAimInfo?.angle }
      );
    } else if (boss.classData.id === 'vampire_queen' && boss.basicAttackTimer >= boss.basicAttackCooldown) {
      boss.basicAttackTimer = 0;
      triggerMeleeSwing(
        'vq_hunt_royal_fang',
        1,
        '#ec4899',
        '#f43f5e',
        '#ffffff',
        'weapon_scythe_slash',
        88,
        78,
        'blade',
        { lifeSteal: 0.25, furyGain: 8, aimAngle: manualAimInfo?.angle }
      );
    } else if (boss.classData.id === 'shadow_reaper' && boss.basicAttackTimer >= boss.basicAttackCooldown) {
      boss.basicAttackTimer = 0;
      triggerMeleeSwing(
        'sr_scythe_crescent_reap',
        1,
        '#a855f7',
        '#c084fc',
        '#ffffff',
        'weapon_scythe_slash',
        105,
        90,
        'scythe',
        { furyGain: 10, pull: true, aimAngle: manualAimInfo?.angle }
      );
    } else if (boss.classData.id === 'cursed_golem' && boss.basicAttackTimer >= boss.basicAttackCooldown) {
      boss.basicAttackTimer = 0;
      triggerMeleeSwing(
        'cg_phys_titan_punch',
        1,
        '#10b981',
        '#34d399',
        '#ffffff',
        'weapon_scythe_slash',
        105,
        95,
        'hammer',
        { furyGain: 12, pull: true, aimAngle: manualAimInfo?.angle }
      );
    } else if (boss.classData.id === 'lich_lord' && boss.basicAttackTimer >= boss.basicAttackCooldown) {
      boss.basicAttackTimer = 0;
      // Lich Lord staff raise & tracking necrotic bolt
      gameAudio.playNecroticSpellCast();
      boss.anim.currentAction = 'ATTACK';
      boss.anim.timer = 0;
      boss.anim.currentFrame = 0;
      boss.attackActionTimer = 0.22;

      let boltAngle = boss.facingRight ? 0 : Math.PI;
      if (manualAimInfo) {
        boltAngle = manualAimInfo.angle;
      } else if (sim.enemies.length > 0) {
        let nearest = sim.enemies[0];
        let nd = Math.hypot(nearest.x - boss.x, nearest.y - boss.y);
        for (let ei = 1; ei < sim.enemies.length; ei++) {
          const d = Math.hypot(sim.enemies[ei].x - boss.x, sim.enemies[ei].y - boss.y);
          if (d < nd) {
            nd = d;
            nearest = sim.enemies[ei];
          }
        }
        if (nearest) {
          boltAngle = Math.atan2(nearest.y - boss.y, nearest.x - boss.x);
        }
      }

      sim.projectiles.push({
        type: 'frost_shard',
        x: boss.x + (boss.facingRight ? 24 : -24),
        y: boss.y - 18,
        vx: Math.cos(boltAngle) * 480,
        vy: Math.sin(boltAngle) * 480,
        damage: 85 * sim.perkDamageMult,
        life: 1.8,
        pierce: 3,
        w: 26,
        h: 26,
      });

      // Staff crystal flare particles
      for (let p = 0; p < 8; p++) {
        sim.particles.push({
          x: boss.x + (boss.facingRight ? 24 : -24),
          y: boss.y - 18,
          vx: (Math.random() - 0.5) * 160,
          vy: (Math.random() - 0.5) * 160,
          radius: 3.5,
          color: '#38bdf8',
          life: 0.4,
        });
      }
    }

    // Update 5-slot cooldowns
    for (let slotIdx = 0; slotIdx < boss.active5Loadout.length; slotIdx++) {
      if (boss.active5Cooldowns[slotIdx] > 0) {
        boss.active5Cooldowns[slotIdx] = Math.max(0, boss.active5Cooldowns[slotIdx] - dt);
      }
    }

    // Check manual key presses for Slots 1-5 or mobile virtual buttons
    const slotKeysTriggered = [
      virt.slot1,
      virt.slot2,
      virt.slot3,
      virt.slot4,
      virt.slot5,
    ];

    for (let slotIdx = 0; slotIdx < boss.active5Loadout.length; slotIdx++) {
      const skillId = boss.active5Loadout[slotIdx];
      if (!skillId) continue;

      const isReady = boss.active5Cooldowns[slotIdx] <= 0;
      const isTriggered = slotKeysTriggered[slotIdx];

      if (autoAttackEnabled) {
        if (isReady) {
          boss.active5Cooldowns[slotIdx] = boss.active5MaxCooldowns[slotIdx] || 2.5;
          castAbility(skillId, slotIdx, manualAimInfo);
        }
      } else {
        if (isReady && (isTriggered || (slotIdx === 0 && isManualAttackActive))) {
          boss.active5Cooldowns[slotIdx] = boss.active5MaxCooldowns[slotIdx] || 2.5;
          castAbility(skillId, slotIdx, manualAimInfo);
        }
      }
    }

    // Reset virtual slot triggers
    virt.slot1 = false;
    virt.slot2 = false;
    virt.slot3 = false;
    virt.slot4 = false;
    virt.slot5 = false;

    // --- 5. ACTIVE MELEE SWING ARCS SIMULATION ---
    for (let sIdx = sim.meleeSwings.length - 1; sIdx >= 0; sIdx--) {
      const swing = sim.meleeSwings[sIdx];
      swing.timer -= dt;
      swing.originX = boss.x;
      swing.originY = boss.y;

      sim.enemies.forEach((en) => {
        if (swing.hitEnemies.has(en.id)) return;

        const dx = en.x - swing.originX;
        const dy = en.y - swing.originY;
        const dist = Math.hypot(dx, dy);

        if (dist <= swing.radius + en.w / 2) {
          const enemyAngle = Math.atan2(dy, dx);
          let angleDiff = Math.abs(enemyAngle - swing.baseAngle);
          while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

          if (angleDiff <= swing.arcSpan / 2 + 0.25) {
            swing.hitEnemies.add(en.id);
            en.hp -= swing.damage;
            boss.damageDealt += swing.damage;
            en.isHurt = true;
            en.hurtTimer = 0.22;
            gameAudio.playHeroHurtGrunt();

            if (swing.lifeSteal) {
              boss.hp = Math.min(boss.maxHp, boss.hp + swing.damage * swing.lifeSteal);
            }

            if (swing.pull) {
              en.x += (swing.originX - en.x) * 0.25;
              en.y += (swing.originY - en.y) * 0.25;
            }

            if (damageDensity !== 'OFF') {
              sim.damageNumbers.push({
                x: en.x,
                y: en.y - 12,
                val: Math.floor(swing.damage),
                color: swing.color,
                life: 0.8,
              });
            }
          }
        }
      });

      if (swing.timer <= 0) {
        sim.meleeSwings.splice(sIdx, 1);
      }
    }

    // --- 5B. SUMMONS & MINIONS SIMULATION ---
    for (let sumIdx = sim.summons.length - 1; sumIdx >= 0; sumIdx--) {
      const sum = sim.summons[sumIdx];
      sum.lifeTime -= dt;
      sum.attackTimer += dt;
      if (!sum.animTimer) sum.animTimer = 0;
      sum.animTimer += dt;

      if (sum.hurtTimer && sum.hurtTimer > 0) {
        sum.hurtTimer -= dt;
      }

      let target: any = null;
      let minDist = 500;
      sim.enemies.forEach((en) => {
        const d = Math.hypot(en.x - sum.x, en.y - sum.y);
        if (d < minDist) {
          minDist = d;
          target = en;
        }
      });

      if (target) {
        const dx = target.x - sum.x;
        const dy = target.y - sum.y;
        const dist = Math.hypot(dx, dy);
        sum.facingRight = dx >= 0;

        const isRangedMinion = sum.type === 'crypt_archer' || sum.type === 'bone_mage' || sum.type === 'skeletal_dragon';
        const desiredDist = isRangedMinion ? 220 : 38;

        if (dist > desiredDist) {
          sum.vx = (dx / dist) * sum.speed;
          sum.vy = (dy / dist) * sum.speed;
          sum.action = 'RUN';
        } else {
          sum.vx = 0;
          sum.vy = 0;
          if (sum.attackTimer >= sum.attackCooldown) {
            sum.attackTimer = 0;
            sum.action = 'ATTACK';

            if (sum.type === 'crypt_archer') {
              // Shoot bone arrow with bow twang audio
              gameAudio.playBowTwang();
              const angle = Math.atan2(dy, dx);
              sim.projectiles.push({
                type: 'frost_shard',
                x: sum.x + (sum.facingRight ? 18 : -18),
                y: sum.y - 6,
                vx: Math.cos(angle) * 440,
                vy: Math.sin(angle) * 440,
                damage: sum.damage,
                life: 1.4,
                pierce: 2,
                w: 22,
                h: 22,
              });
            } else if (sum.type === 'bone_mage') {
              // Cast necrotic frost orb
              gameAudio.playNecroticSpellCast();
              const angle = Math.atan2(dy, dx);
              sim.projectiles.push({
                type: 'frost_shard',
                x: sum.x,
                y: sum.y - 12,
                vx: Math.cos(angle) * 360,
                vy: Math.sin(angle) * 360,
                damage: sum.damage * 1.3,
                life: 1.8,
                pierce: 3,
                w: 26,
                h: 26,
              });
            } else if (sum.type === 'skeletal_dragon') {
              // Dragon absolute zero frost breath
              gameAudio.playDragonRoarBreath();
              target.hp -= sum.damage * 1.5;
              boss.damageDealt += sum.damage * 1.5;
              target.frozenTimer = 3.0;
              target.isHurt = true;
              target.hurtTimer = 0.3;
              // Screen particles
              for (let p = 0; p < 8; p++) {
                sim.particles.push({
                  x: target.x + (Math.random() - 0.5) * 40,
                  y: target.y + (Math.random() - 0.5) * 40,
                  vx: (Math.random() - 0.5) * 120,
                  vy: (Math.random() - 0.5) * 120,
                  radius: 4,
                  color: '#38bdf8',
                  life: 0.5,
                });
              }
            } else if (sum.type === 'grave_hound') {
              gameAudio.playBoneClatter();
              target.hp -= sum.damage;
              boss.damageDealt += sum.damage;
              target.isHurt = true;
              target.hurtTimer = 0.2;
            } else if (sum.type === 'vampire_bat') {
              gameAudio.playBatScreech();
              target.hp -= sum.damage;
              boss.damageDealt += sum.damage;
              boss.hp = Math.min(boss.maxHp, boss.hp + sum.damage * 0.25);
              target.isHurt = true;
              target.hurtTimer = 0.2;
            } else if (sum.type === 'dread_abomination' || sum.type === 'ossuary_guardian') {
              gameAudio.playHeavyTitanSlam();
              target.hp -= sum.damage;
              boss.damageDealt += sum.damage;
              target.stunnedTimer = 1.2;
              target.isHurt = true;
              target.hurtTimer = 0.3;
            } else {
              gameAudio.playSwordClash();
              target.hp -= sum.damage;
              boss.damageDealt += sum.damage;
              target.isHurt = true;
              target.hurtTimer = 0.2;
            }

            if (damageDensity !== 'OFF') {
              sim.damageNumbers.push({
                x: target.x,
                y: target.y - 10,
                val: Math.floor(sum.damage),
                color: '#38bdf8',
                life: 0.6,
              });
            }
          } else {
            if (sum.attackTimer > 0.4) {
              sum.action = 'IDLE';
            }
          }
        }
      } else {
        if (sum.orbitAngle === undefined) sum.orbitAngle = Math.random() * Math.PI * 2;
        sum.orbitAngle += dt * 1.8;
        const targetX = boss.x + Math.cos(sum.orbitAngle) * (sum.orbitRadius || 70);
        const targetY = boss.y + Math.sin(sum.orbitAngle) * (sum.orbitRadius || 70);
        sum.vx = (targetX - sum.x) * 3;
        sum.vy = (targetY - sum.y) * 3;
        sum.facingRight = sum.vx >= 0;
        sum.action = Math.hypot(sum.vx, sum.vy) > 10 ? 'RUN' : 'IDLE';
      }

      sum.x += sum.vx * dt;
      sum.y += sum.vy * dt;

      if (sum.lifeTime <= 0 || sum.hp <= 0) {
        sim.summons.splice(sumIdx, 1);
      }
    }

    // --- 5D. GROUND DECALS SIMULATION ---
    for (let dIdx = sim.groundDecals.length - 1; dIdx >= 0; dIdx--) {
      const dec = sim.groundDecals[dIdx];
      dec.timer -= dt;

      sim.enemies.forEach((en) => {
        if (Math.hypot(en.x - dec.x, en.y - dec.y) < dec.radius) {
          const tickDmg = dec.damage * dt;
          en.hp -= tickDmg;
          boss.damageDealt += tickDmg;
          en.isHurt = true;
          en.hurtTimer = 0.1;
        }
      });

      if (dec.timer <= 0) {
        sim.groundDecals.splice(dIdx, 1);
      }
    }

    // --- 6. TELEGRAPHS SIMULATION ---
    for (let i = sim.telegraphs.length - 1; i >= 0; i--) {
      const tel = sim.telegraphs[i];
      tel.timer -= dt;
      if (tel.timer <= 0) {
        if (tel.onTrigger) tel.onTrigger();
        sim.telegraphs.splice(i, 1);
      }
    }

    // --- 7. PROJECTILES SIMULATION ---
    for (let i = sim.projectiles.length - 1; i >= 0; i--) {
      const p = sim.projectiles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.x < 0 || p.x > sim.arenaW || p.y < 0 || p.y > sim.arenaH) {
        if (p.type !== 'void_blackhole') {
          sim.projectiles.splice(i, 1);
          continue;
        }
      }

      if (!p.isEnemy) {
        for (let eIdx = sim.enemies.length - 1; eIdx >= 0; eIdx--) {
          const en = sim.enemies[eIdx];
          if (Math.hypot(en.x - p.x, en.y - p.y) < en.w / 2 + p.w / 2) {
            en.hp -= p.damage;
            boss.damageDealt += p.damage;
            en.isHurt = true;
            en.hurtTimer = 0.2;
            if (damageDensity !== 'OFF') {
              sim.damageNumbers.push({
                x: en.x,
                y: en.y,
                val: Math.floor(p.damage),
                color: p.type === 'frost_shard' ? '#38bdf8' : '#f97316',
                life: 0.7,
              });
            }

            if (p.pierce && p.pierce > 0) {
              p.pierce -= 1;
            } else if (p.type !== 'void_blackhole') {
              p.life = 0;
              break;
            }
          }
        }
      }

      if (p.life <= 0 && p.type !== 'void_blackhole') {
        sim.projectiles.splice(i, 1);
      }
    }

    // --- 8. ENEMIES SIMULATION & FURY / ESSENCE REWARD ON KILL ---
    for (let i = sim.enemies.length - 1; i >= 0; i--) {
      const en = sim.enemies[i];

      if (en.isHurt) {
        en.hurtTimer -= dt;
        if (en.hurtTimer <= 0) {
          en.isHurt = false;
        }
      }

      if (en.frozenTimer > 0) en.frozenTimer -= dt;
      if (en.stunnedTimer > 0) en.stunnedTimer -= dt;

      if (en.hp <= 0) {
        sim.boss.kills += 1;
        sim.boss.killStreak += 1;

        // Reward Infernal Fury or Soul Essence
        const resGained = en.isBoss ? (boss.classData.id === 'cursed_golem' ? 50 : 45) : en.isElite ? 20 : (boss.classData.id === 'cursed_golem' ? 8 : 6);
        boss.resource = Math.min(boss.maxResource, boss.resource + resGained);

        boss.ultimateTimer = Math.max(0, boss.ultimateTimer - (en.isBoss ? 4.0 : en.isElite ? 1.5 : 0.4));
        awardPersistentCharExp(en.expValue || 12);

        if (en.isBoss) {
          gameAudio.playHeroDefeatShout();
          gameAudio.playBossLaughter();
          const heroDeathLine = HERO_DEATH_LINES[Math.floor(Math.random() * HERO_DEATH_LINES.length)];
          triggerVoiceLine('hero', heroDeathLine, en.name, en.x, en.y);
          
          setTimeout(() => {
            const bossKillLine = BOSS_KILL_LINES[Math.floor(Math.random() * BOSS_KILL_LINES.length)];
            triggerVoiceLine('boss', bossKillLine, boss.classData.name, boss.x, boss.y);
          }, 700);
        }

        setGameState((prev) => ({ ...prev, score: prev.score + (en.isBoss ? 500 : en.isElite ? 80 : 15) }));

        sim.pickups.push({
          type: 'exp',
          x: en.x,
          y: en.y,
          val: en.expValue || 12,
          radius: 18,
        });

        if (Math.random() < 0.4 || en.isElite || en.isBoss) {
          sim.pickups.push({
            type: 'gold',
            x: en.x + (Math.random() - 0.5) * 20,
            y: en.y + (Math.random() - 0.5) * 20,
            val: en.goldValue || 4,
            radius: 16,
          });
        }

        if (en.isBoss) {
          sim.boss.bossesSlain += 1;
          sim.pickups.push({
            type: 'soul',
            x: en.x + 30,
            y: en.y,
            val: 8 + sim.wave * 2,
            radius: 22,
          });
        }

        for (let p = 0; p < (en.isBoss ? 30 : 8); p++) {
          sim.particles.push({
            x: en.x,
            y: en.y,
            vx: (Math.random() - 0.5) * 220,
            vy: (Math.random() - 0.5) * 220,
            radius: 3 + Math.random() * 4,
            color: boss.classData.color,
            life: 0.45,
          });
        }

        sim.enemies.splice(i, 1);
        continue;
      }

      if (en.frozenTimer <= 0 && en.stunnedTimer <= 0) {
        const dx = boss.x - en.x;
        const dy = boss.y - en.y;
        const dist = Math.hypot(dx, dy);

        let speed = en.speed;
        if (en.frozenTimer > 0) speed *= 0.5;

        if (en.isRanged) {
          if (dist < 260) {
            en.x -= (dx / (dist || 1)) * speed * dt;
            en.y -= (dy / (dist || 1)) * speed * dt;
            en.anim.currentAction = 'RUN';
          } else if (dist > 380) {
            en.x += (dx / (dist || 1)) * speed * dt;
            en.y += (dy / (dist || 1)) * speed * dt;
            en.anim.currentAction = 'RUN';
          } else {
            en.anim.currentAction = 'IDLE';
          }
          en.facingRight = dx >= 0;

          en.attackTimer += dt;
          if (en.attackTimer >= en.attackCooldown) {
            en.attackTimer = 0;
            const angle = Math.atan2(dy, dx);
            if (en.type === 'archer') {
              gameAudio.playBowTwang();
            } else {
              gameAudio.playArcadeLaser();
            }
            sim.projectiles.push({
              type: 'hero_arrow',
              isEnemy: true,
              x: en.x,
              y: en.y,
              vx: Math.cos(angle) * 380,
              vy: Math.sin(angle) * 380,
              damage: en.damage,
              life: 2.5,
              w: 24,
              h: 12,
            });
          }
        } else {
          en.attackTimer += dt;
          if (dist > en.attackRange) {
            en.x += (dx / (dist || 1)) * speed * dt;
            en.y += (dy / (dist || 1)) * speed * dt;
            en.anim.currentAction = 'RUN';
          } else {
            en.anim.currentAction = 'ATTACK';
            if (en.attackTimer >= en.attackCooldown && !boss.isInvulnerable) {
              en.attackTimer = 0;
          const effectiveDmg = en.damage * (1 - boss.armorReduction);
          boss.hp -= effectiveDmg;
          boss.hurtTimer = 0.25;

          // Cursed Golem gains Runic Charge and retaliates when taking damage
          if (boss.classData.id === 'cursed_golem') {
            boss.resource = Math.min(boss.maxResource, boss.resource + 4);
            if (Math.random() < 0.35) {
              gameAudio.playFootstepStone();
              sim.enemies.forEach((other) => {
                if (Math.hypot(other.x - boss.x, other.y - boss.y) < 140) {
                  other.hp -= 40 * sim.perkDamageMult;
                  boss.damageDealt += 40 * sim.perkDamageMult;
                }
              });
            }
          }
              if (damageDensity !== 'OFF') {
                sim.damageNumbers.push({
                  x: boss.x,
                  y: boss.y - 20,
                  val: Math.floor(effectiveDmg),
                  color: '#f87171',
                  life: 0.8,
                });
              }
            }
          }
          en.facingRight = dx >= 0;
        }

        en.x = clamp(en.x, 60, sim.arenaW - 60);
        en.y = clamp(en.y, 60, sim.arenaH - 60);
      }

      const enRenderer = getSpriteRenderer(en.spritePrefix);
      if (en.isHurt) en.anim.currentAction = 'HURT';
      en.anim = enRenderer.getNextState(en.anim, dt);
    }

    // --- 9. ENEMY PROJECTILE HITS ON BOSS ---
    for (let i = sim.projectiles.length - 1; i >= 0; i--) {
      const p = sim.projectiles[i];
      if (!p.isEnemy) continue;
      if (Math.hypot(boss.x - p.x, boss.y - p.y) < boss.w / 2 + p.w / 2) {
        if (!boss.isInvulnerable) {
          const effectiveDmg = p.damage * (1 - boss.armorReduction);
          boss.hp -= effectiveDmg;
          boss.hurtTimer = 0.25;
          gameAudio.playShieldBlock();
        }
        sim.projectiles.splice(i, 1);
      }
    }

    // --- 10. PICKUPS ---
    const magnetRadius = (getConfig('pickupRadius') as number) * sim.perkMagnetMult;
    for (let i = sim.pickups.length - 1; i >= 0; i--) {
      const p = sim.pickups[i];
      const d = Math.hypot(boss.x - p.x, boss.y - p.y);

      if (d < magnetRadius) {
        const speed = 420 * (1 - d / magnetRadius + 0.35);
        p.x += ((boss.x - p.x) / d) * speed * dt;
        p.y += ((boss.y - p.y) / d) * speed * dt;
      }

      if (d < boss.w / 2 + p.radius) {
        if (p.type === 'exp') {
          sim.exp += p.val;
          gameAudio.playCoinPickup();
          if (sim.exp >= sim.expNeeded) {
            sim.exp -= sim.expNeeded;
            sim.expNeeded = Math.floor(sim.expNeeded * 1.35 + 20);
            sim.bossLevel += 1;
            triggerSkillDraft();
          }
        } else if (p.type === 'gold') {
          sim.gold += p.val;
          sim.boss.totalGoldGained += p.val;
          gameAudio.playCoinPickup();
        } else if (p.type === 'soul') {
          sim.soulsGained += p.val;
          saveMeta(souls + p.val, metaLevels);
          gameAudio.playPowerupChime();
        }
        sim.pickups.splice(i, 1);
      }
    }

    // --- 11. PARTICLES & SPEECH BARKS ---
    for (let i = sim.speechBarks.length - 1; i >= 0; i--) {
      const sb = sim.speechBarks[i];
      sb.timer -= dt;
      if (sb.timer <= 0) sim.speechBarks.splice(i, 1);
    }

    for (let i = sim.particles.length - 1; i >= 0; i--) {
      const pt = sim.particles[i];
      pt.life -= dt;
      if (pt.vx) pt.x += pt.vx * dt;
      if (pt.vy) pt.y += pt.vy * dt;
      if (pt.life <= 0) sim.particles.splice(i, 1);
    }

    // Adaptive particle capping for smooth 60 FPS performance on mobile
    const maxParticles = showTouchHUD ? 45 : 140;
    if (sim.particles.length > maxParticles) {
      sim.particles.splice(0, sim.particles.length - maxParticles);
    }

    for (let i = sim.damageNumbers.length - 1; i >= 0; i--) {
      const dn = sim.damageNumbers[i];
      dn.life -= dt;
      dn.y -= 35 * dt;
      if (dn.life <= 0) sim.damageNumbers.splice(i, 1);
    }

    // --- 12. BOSS HEALTH LOSS & DEATH ---
    if (boss.hp <= 0) {
      boss.hp = 0;
      const isNew = sim.wave > highestWaveRecord;
      const finalWave = Math.max(sim.wave, highestWaveRecord);
      saveHighestWave(sim.wave);

      const charProg = charProgression[selectedBoss] || { ...DEFAULT_PROG };

      // Update global lifetime stats & persist immediately
      setGlobalStats((prev) => {
        const updatedStats: GameStatsRecord = {
          highScore: Math.max(prev.highScore, gameStateRef.current.score),
          highestWave: Math.max(prev.highestWave, finalWave),
          totalKills: prev.totalKills + boss.kills,
          totalRuns: prev.totalRuns + 1,
          bossesSlain: prev.bossesSlain + boss.bossesSlain,
          bestRunDuration: Math.max(prev.bestRunDuration, sim.runTime),
          highestDamage: Math.max(prev.highestDamage, Math.floor(boss.damageDealt)),
        };

        commitSaveProfile({
          stats: updatedStats,
          currencies: { ...saveProfile.currencies, souls: souls + sim.soulsGained },
        });

        return updatedStats;
      });

      setRunSummary({
        wavesSurvived: sim.wave,
        highestWave: finalWave,
        enemiesDefeated: boss.kills,
        bossesDefeated: boss.bossesSlain,
        goldCollected: boss.totalGoldGained,
        soulsHarvested: sim.soulsGained,
        runTime: sim.runTime,
        damageDealt: boss.damageDealt,
        charExpGained: boss.charExpGainedThisRun,
        newCharLevel: charProg.level,
        isNewRecord: isNew,
      });

      setGameState((prev) => ({ ...prev, status: 'GAME_OVER' }));
      gameAudio.playDefeatMotif();
    }

    const currentBosses = sim.enemies.filter((e) => e.isBoss).length;

    // --- 13. SYNC REACT HUD METRICS & 5-SLOT ABILITY TRAY ---
    setHudHp({ current: Math.max(0, boss.hp), max: boss.maxHp, ghost: boss.ghostHp });
    setHudExp({ current: sim.exp, needed: sim.expNeeded, level: sim.bossLevel });
    setHudResource({ current: Math.floor(boss.resource), max: boss.maxResource, name: boss.classData.resourceName, color: boss.classData.color });
    setHudMinionCount(sim.summons.length);
    setHudGold(sim.gold);
    setHudSoulsGained(sim.soulsGained);
    setHudWave(sim.wave);
    setHudWaveTimer(sim.waveTimer);
    setHudBossSpawned(currentBosses > 0);
    setHudBossCount(currentBosses);
    setHudEnemyCount(sim.enemies.length);
    setHudKills(boss.kills);

    const maxDashCd = boss.dashCooldown * sim.perkHasteMult;
    setHudDash({
      cdRemaining: Math.max(0, boss.dashCooldownTimer),
      cdMax: maxDashCd,
      isReady: boss.dashCooldownTimer <= 0,
    });

    const isUltNowReady = boss.ultimateTimer <= 0;
    const chargePct = Math.floor(clamp(1 - boss.ultimateTimer / boss.ultimateCooldown, 0, 1) * 100);
    setHudUltimate({
      cdRemaining: Math.max(0, boss.ultimateTimer),
      cdMax: boss.ultimateCooldown,
      chargePct,
      isReady: isUltNowReady,
      name: boss.classData.ultimateName,
      desc: boss.classData.ultimateDesc,
    });

    // Sync 5 Active Slots
    const updatedSlots: HudSkillSlot[] = boss.active5Loadout.map((skillId, idx) => {
      const def = (ALL_CHARACTER_NODES[skillId] || ALL_BOSS_SKILLS[skillId]) as any;
      const curCd = boss.active5Cooldowns[idx] || 0;
      const maxCd = boss.active5MaxCooldowns[idx] || 2.0;
      const cost = def ? (def.resourceCost || def.furyCost || def.essenceCost || 0) : 0;
      const canCast = boss.resource >= cost;
      const isRdy = curCd <= 0.02;

      return {
        id: skillId,
        name: def ? def.name : skillId,
        category: def ? (def.branch || def.category) : 'Active',
        level: charProgression[selectedBoss]?.treeData?.allocatedSkills[skillId] || 1,
        color: def ? def.color : boss.classData.color,
        keyBadge: `${idx + 1}`,
        cdRemaining: curCd,
        cdMax: maxCd,
        cdProgress: clamp(1 - curCd / maxCd, 0, 1),
        isReady: isRdy,
        resourceCost: cost,
        canCastResource: canCast,
        slotIndex: idx,
      };
    });
    setHudAbilitySlots(updatedSlots);
  };

  // --- DRAWING CANVAS SCENE ---
  const draw = (ctx: CanvasRenderingContext2D) => {
    prepareCanvas(ctx, canvasWidth, canvasHeight);

    ctx.fillStyle = '#06070b';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const sim = simRef.current;
    const boss = sim.boss;

    ctx.save();

    if (sim.screenShake > 0 && screenShakeEnabled) {
      const shakeX = (Math.random() - 0.5) * sim.screenShake;
      const shakeY = (Math.random() - 0.5) * sim.screenShake;
      ctx.translate(shakeX, shakeY);
    }

    ctx.translate(-Math.round(sim.camX), -Math.round(sim.camY));

      // --- 1. PROCEDURAL RICH FLOOR BIOME RENDERING (CACHED BITMAP BLIT) ---
      sim.floorEngine.render(ctx, sim.camX, sim.camY, canvasWidth, canvasHeight);

      // Render physical melee weapon swing arcs with weapons in hand
      sim.meleeSwings.forEach((swing) => {
        ctx.save();
        const progress = 1 - swing.timer / swing.duration;
        const currentAngle = swing.startAngle + (swing.endAngle - swing.startAngle) * progress;

        // 1. Trail crescent glow
        ctx.strokeStyle = swing.trailColor;
        ctx.lineWidth = 14 * (1 - progress * 0.7);
        ctx.lineCap = 'round';
        ctx.shadowColor = swing.color;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(
          swing.originX,
          swing.originY,
          swing.radius,
          swing.startAngle,
          currentAngle,
          !swing.facingRight
        );
        ctx.stroke();

        // 2. Core inner fiery/spectral blade edge
        ctx.strokeStyle = swing.coreColor;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 3. Render physical weapon held in hand swinging through the arc
        const weaponX = swing.originX + Math.cos(currentAngle) * (swing.radius * 0.75);
        const weaponY = swing.originY + Math.sin(currentAngle) * (swing.radius * 0.75);
        ctx.translate(weaponX, weaponY);
        ctx.rotate(currentAngle + (swing.facingRight ? Math.PI / 4 : -Math.PI / 4));

        if (swing.weaponType === 'greatsword') {
          // Monarch's Hellblade: Double-edged demonic greatsword with horned crossguard & flaming fuller
          ctx.fillStyle = '#f97316';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, -38);
          ctx.lineTo(9, -24);
          ctx.lineTo(6, 12);
          ctx.lineTo(-6, 12);
          ctx.lineTo(-9, -24);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Glowing inner fuller groove
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(-2, -28, 4, 34);

          // Horned Demonic Crossguard & Hilt
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.moveTo(-16, 12);
          ctx.lineTo(-12, 16);
          ctx.lineTo(12, 16);
          ctx.lineTo(16, 12);
          ctx.lineTo(0, 10);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#451a03';
          ctx.fillRect(-3, 16, 6, 14);
          // Spiked Pommel
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.arc(0, 31, 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (swing.weaponType === 'volcanic_greatsword') {
          // Volcanic Greatsword: Jagged molten basalt stone blade with glowing lava seams
          ctx.fillStyle = '#292524';
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -42);
          ctx.lineTo(11, -30);
          ctx.lineTo(8, -14);
          ctx.lineTo(12, 0);
          ctx.lineTo(8, 14);
          ctx.lineTo(-8, 14);
          ctx.lineTo(-12, 0);
          ctx.lineTo(-8, -14);
          ctx.lineTo(-11, -30);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Molten basalt glowing veins
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -36);
          ctx.lineTo(3, -20);
          ctx.lineTo(-2, -4);
          ctx.lineTo(1, 10);
          ctx.stroke();

          // Heavy Basalt Crossguard
          ctx.fillStyle = '#44403c';
          ctx.fillRect(-15, 14, 30, 6);
          ctx.fillStyle = '#1c1917';
          ctx.fillRect(-4, 20, 8, 14);
        } else if (swing.weaponType === 'obsidian_executioner') {
          // Obsidian Executioner: Massive heavy square-tipped chopping blade with glowing crimson runes
          ctx.fillStyle = '#09090b';
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-10, -40);
          ctx.lineTo(10, -40);
          ctx.lineTo(10, 14);
          ctx.lineTo(-10, 14);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Crimson Runes down the spine
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-2, -32, 4, 8);
          ctx.fillRect(-2, -18, 4, 8);
          ctx.fillRect(-2, -4, 4, 8);

          // Iron Crossguard & Pommel
          ctx.fillStyle = '#3f3f46';
          ctx.fillRect(-14, 14, 28, 5);
          ctx.fillStyle = '#18181b';
          ctx.fillRect(-3, 19, 6, 15);
          ctx.fillStyle = '#71717a';
          ctx.fillRect(-5, 34, 10, 4);
        } else if (swing.weaponType === 'cursed_zweihander') {
          // Cursed Zweihander: Ultra-long flamberge wavy blade with side-ring parrying hooks
          ctx.fillStyle = '#f97316';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -48);
          ctx.lineTo(7, -36);
          ctx.lineTo(4, -24);
          ctx.lineTo(7, -12);
          ctx.lineTo(5, 12);
          ctx.lineTo(-5, 12);
          ctx.lineTo(-7, -12);
          ctx.lineTo(-4, -24);
          ctx.lineTo(-7, -36);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Parrying Lug Hooks
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(-12, -8, 24, 3);

          // Wide Zweihander Crossguard & Double-Hand Grip
          ctx.fillStyle = '#581c87';
          ctx.fillRect(-18, 12, 36, 5);
          ctx.fillStyle = '#3b0764';
          ctx.fillRect(-3, 17, 6, 18);
        } else if (swing.weaponType === 'scythe') {
          // Spectral Amethyst Scythe curved blade & staff
          ctx.strokeStyle = '#581c87';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(-16, 26);
          ctx.lineTo(8, -18);
          ctx.stroke();

          // Glowing curved amethyst scythe blade
          ctx.fillStyle = '#c084fc';
          ctx.strokeStyle = '#f3e8ff';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(8, -18);
          ctx.quadraticCurveTo(32, -28, 28, 4);
          ctx.quadraticCurveTo(20, -12, 8, -18);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else if (swing.weaponType === 'blade') {
          // Ruby Rapier needle blade with ornate bell guard
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -36);
          ctx.lineTo(0, 10);
          ctx.stroke();

          // Ruby Bell Guard & Pommel
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(0, 10, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#881337';
          ctx.fillRect(-2, 15, 4, 8);
        } else if (swing.weaponType === 'hammer') {
          // Colossal Granite Titan Fist / Stone Hammer
          ctx.fillStyle = '#059669';
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2;
          ctx.fillRect(-14, -20, 28, 24);
          ctx.strokeRect(-14, -20, 28, 24);
          // Handle
          ctx.fillStyle = '#064e3b';
          ctx.fillRect(-4, 4, 8, 18);
        }

        ctx.restore();
      });

    // --- 2. GROUND DECALS & TELEGRAPHS ---
    sim.groundDecals.forEach((dec) => {
      ctx.save();
      // Molten fissure / Cathedral / Labyrinth animated texture
      const pulse = Math.sin(Date.now() * 0.006 + dec.x) * 0.2 + 0.8;
      ctx.fillStyle = dec.color + '25';
      ctx.strokeStyle = dec.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(dec.x, dec.y, dec.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Interior animated runic cracks
      ctx.beginPath();
      ctx.moveTo(dec.x - dec.radius * 0.6, dec.y);
      ctx.lineTo(dec.x + dec.radius * 0.6, dec.y);
      ctx.moveTo(dec.x, dec.y - dec.radius * 0.6);
      ctx.lineTo(dec.x, dec.y + dec.radius * 0.6);
      ctx.strokeStyle = dec.color + '66';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });

    // Orbiting Weapons & Shields (Hellfire Greatswords, Boneshields, Bat Nightguards, Granite Boulders)
    if (boss.classData.id === 'demon_monarch' && boss.activePerks.has('dm_ult_demon_kings_awakening')) {
      const nowTime = Date.now() * 0.004;
      for (let i = 0; i < 3; i++) {
        const oAngle = nowTime + (i / 3) * Math.PI * 2;
        const ox = boss.x + Math.cos(oAngle) * 90;
        const oy = boss.y + Math.sin(oAngle) * 90;
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(oAngle + Math.PI / 2);
        ctx.fillStyle = '#f97316';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.fillRect(-3, -16, 6, 32);
        ctx.restore();
      }
    } else if (boss.classData.id === 'cursed_golem') {
      const nowTime = Date.now() * 0.003;
      for (let i = 0; i < 4; i++) {
        const oAngle = nowTime + (i / 4) * Math.PI * 2;
        const ox = boss.x + Math.cos(oAngle) * 85;
        const oy = boss.y + Math.sin(oAngle) * 85;
        ctx.save();
        ctx.fillStyle = '#059669';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ox, oy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    sim.telegraphs.forEach((tel) => {
      ctx.save();
      ctx.fillStyle = tel.color || 'rgba(239, 68, 68, 0.35)';
      ctx.strokeStyle = boss.classData.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tel.x, tel.y, Math.max(0, tel.radius), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    // --- 3. GROUND ITEMS / PICKUPS ---
    const nowTime = Date.now() * 0.005;
    sim.pickups.forEach((p) => {
      const floatOffsetY = Math.sin(nowTime + p.x) * 3;
      let pImg = assets['item_experience_gem'];
      if (p.type === 'gold') pImg = assets['item_gold_coin'];
      if (p.type === 'soul') pImg = assets['item_boss_soul'];

      if (pImg && pImg.complete && pImg.naturalWidth > 0) {
        ctx.drawImage(pImg, Math.round(p.x - p.radius), Math.round(p.y - p.radius + floatOffsetY), Math.round(p.radius * 2), Math.round(p.radius * 2));
      } else {
        ctx.fillStyle = p.type === 'exp' ? '#10b981' : p.type === 'gold' ? '#eab308' : '#ef4444';
        ctx.beginPath();
        ctx.arc(p.x, p.y + floatOffsetY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // --- 4. Y-SORTED ENTITY RENDERING ---
    const renderQueue: Array<{ type: string; baseY: number; data: any }> = [];

    sim.pillars.forEach((pil) => renderQueue.push({ type: 'pillar', baseY: pil.y + pil.h / 2, data: pil }));
    sim.enemies.forEach((en) => renderQueue.push({ type: 'enemy', baseY: en.y + en.h / 2, data: en }));
    sim.summons.forEach((sum) => renderQueue.push({ type: 'summon', baseY: sum.y + 20, data: sum }));
    renderQueue.push({ type: 'boss', baseY: boss.y + boss.h / 2, data: boss });

    renderQueue.sort((a, b) => a.baseY - b.baseY);

    renderQueue.forEach((item) => {
      if (item.type === 'pillar') {
        const pil = item.data;
        const pilImg = assets['pillar'];
        if (pilImg && pilImg.complete && pilImg.naturalWidth > 0) {
          ctx.drawImage(pilImg, Math.round(pil.x - pil.w / 2), Math.round(pil.y - pil.h / 2), Math.round(pil.w), Math.round(pil.h));
        } else {
          ctx.fillStyle = '#475569';
          ctx.fillRect(pil.x - pil.w / 2, pil.y - pil.h / 2, pil.w, pil.h);
        }
      } else if (item.type === 'enemy') {
        const en = item.data;
        ctx.save();
        if (en.isHurt) ctx.filter = 'brightness(2.0)';
        if (en.frozenTimer > 0) ctx.filter = 'hue-rotate(180deg) brightness(1.2)';

        const enRenderer = getSpriteRenderer(en.spritePrefix);
        enRenderer.draw(ctx, en.anim, en.x - en.w / 2, en.y - en.h / 2, en.w, en.h, assets, !en.facingRight);
        ctx.restore();

        const hpPct = clamp(en.hp / en.maxHp, 0, 1);
        const topY = en.y - en.h / 2 - 10;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(Math.round(en.x - en.w / 2), Math.round(topY), Math.round(en.w), 5);
        ctx.fillStyle = en.isBoss ? '#f59e0b' : en.isElite ? '#ec4899' : '#ef4444';
        ctx.fillRect(Math.round(en.x - en.w / 2), Math.round(topY), Math.round(en.w * hpPct), 5);
      } else if (item.type === 'boss') {
        ctx.save();
        if (boss.isInvulnerable) ctx.globalAlpha = 0.65 + Math.sin(Date.now() * 0.02) * 0.25;

        // Ambient Elemental Aura
        const auraGrad = ctx.createRadialGradient(boss.x, boss.y, 8, boss.x, boss.y, boss.w * 0.9);
        auraGrad.addColorStop(0, boss.classData.id === 'demon_monarch' ? '#ef444455' : '#06b6d444');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, boss.w * 0.9, 0, Math.PI * 2);
        ctx.fill();

        const bossScale = boss.transformationTimer > 0 ? 1.4 : 1.0;
        const bw = boss.w * bossScale;
        const bh = boss.h * bossScale;

        const bossRenderer = getSpriteRenderer(boss.classData.spritePrefix);
        bossRenderer.draw(ctx, boss.anim, boss.x - bw / 2, boss.y - bh / 2, bw, bh, assets, !boss.facingRight);
        ctx.restore();
      } else if (item.type === 'summon') {
        const sum = item.data;
        const renderState: SummonRenderState = {
          type: sum.type || 'bone_sentinel',
          action: sum.action || 'IDLE',
          animTimer: sum.animTimer || 0,
          facingRight: sum.facingRight !== false,
          scale: sum.type === 'skeletal_dragon' ? 1.8 : sum.type === 'dread_abomination' || sum.type === 'ossuary_guardian' ? 1.4 : 1.0,
          hurtFlash: sum.hurtTimer && sum.hurtTimer > 0 ? 0.8 : 0,
        };
        UndeadProceduralRenderer.draw(ctx, renderState, sum.x, sum.y);
      }
    });

    // --- 5. SPELLS & PROJECTILES ---
    sim.projectiles.forEach((p) => {
      ctx.save();
      const angle = Math.atan2(p.vy || 0, p.vx || 1);

      if (p.type === 'frost_shard') {
        const shardImg = assets['spell_frost_shard'];
        if (shardImg && shardImg.complete && shardImg.naturalWidth > 0) {
          ctx.translate(p.x, p.y);
          ctx.rotate(angle);
          ctx.drawImage(shardImg, -p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);
        }
      } else if (p.type === 'infernal_orb') {
        const orbImg = assets['spell_infernal_orb'];
        if (orbImg && orbImg.complete && orbImg.naturalWidth > 0) {
          ctx.translate(p.x, p.y);
          ctx.rotate(angle);
          ctx.drawImage(orbImg, -p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (p.type === 'hero_arrow') {
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-10, -2, 20, 4);
      }
      ctx.restore();
    });

    // --- 6. PARTICLES & FLOATING DAMAGE NUMBERS ---
    sim.particles.forEach((pt) => {
      ctx.fillStyle = pt.color || '#fff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(0, pt.radius), 0, Math.PI * 2);
      ctx.fill();
    });

    if (damageDensity !== 'OFF') {
      sim.damageNumbers.forEach((dn) => {
        ctx.save();
        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle = dn.color || '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(dn.val.toString(), dn.x, dn.y);
        ctx.fillText(dn.val.toString(), dn.x, dn.y);
        ctx.restore();
      });
    }

    // --- 7. DIALOGUE SPEECH BARKS ---
    sim.speechBarks.forEach((sb) => {
      ctx.save();
      const floatY = sb.y - 70;
      ctx.font = 'bold 11px sans-serif';
      const textMetrics = ctx.measureText(sb.text);
      const boxW = Math.max(140, textMetrics.width + 24);
      const boxH = 40;
      const boxX = sb.x - boxW / 2;
      const boxY = floatY - boxH;

      ctx.fillStyle = sb.bgColor;
      ctx.strokeStyle = sb.borderColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = sb.speaker === 'boss' ? '#f97316' : '#fde047';
      ctx.fillText(`[${sb.speakerName.toUpperCase()}]`, boxX + 12, boxY + 14);

      ctx.font = 'italic 11px sans-serif';
      ctx.fillStyle = sb.color;
      ctx.fillText(`"${sb.text}"`, boxX + 12, boxY + 30);
      ctx.restore();
    });

    ctx.restore();
  };

  // --- RAF GAME LOOP ---
  const updateRef = useRef(update);
  const drawRef = useRef(draw);
  updateRef.current = update;
  drawRef.current = draw;

  useEffect(() => {
    let raf = 0;
    const loop = (time: number) => {
      if (inputRef.current) {
        const cancelPressed = inputRef.current.actions.cancel;
        if (cancelPressed && !lastCancelRef.current) {
          const currentStatus = gameStateRef.current.status;
          if (currentStatus === 'PLAYING') {
            setIsGameMenuOpen((prev) => !prev);
          } else if (currentStatus === 'START') {
            void exitChat({});
          } else if (['GAME_OVER', 'VICTORY'].includes(currentStatus)) {
            setGameState((prev) => ({ ...prev, status: 'START' }));
          }
        }
        lastCancelRef.current = cancelPressed;
      }

      stepperRef.current?.(time, (dt) => updateRef.current(dt));
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) drawRef.current(ctx);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keyboard input bindings for PC: Keys 1, 2, 3, 4, 5 for ability slots
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current.status !== 'PLAYING') return;
      if (isDraftOpen || isMerchantOpen) return;

      const key = e.key.toLowerCase();
      if (key === 'escape' || key === 'p') {
        e.preventDefault();
        setIsGameMenuOpen((prev) => !prev);
      } else if (key === 'r' || key === 'f') {
        e.preventDefault();
        triggerBossUltimate();
      } else if (['1', '2', '3', '4', '5'].includes(key)) {
        e.preventDefault();
        const slotIdx = parseInt(key, 10) - 1;
        const sim = simRef.current;
        const skillId = sim.boss.active5Loadout[slotIdx];
        if (skillId && sim.boss.active5Cooldowns[slotIdx] <= 0) {
          sim.boss.active5Cooldowns[slotIdx] = sim.boss.active5MaxCooldowns[slotIdx] || 2.5;
          castAbility(skillId, slotIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDraftOpen, isMerchantOpen, triggerBossUltimate]);

  // Skill purchase and respec helpers
  const buyCharacterSkillRank = (bossId: BossClassId, nodeId: string) => {
    const charData = charProgression[bossId];
    const tree = charData?.treeData;
    if (!tree) return;
    const node = ALL_CHARACTER_NODES[nodeId];
    if (!node) return;

    const curRank = tree.allocatedSkills[nodeId] || 1;
    if (curRank >= node.maxRank) return;
    if (tree.skillPoints < 1) {
      gameAudio.playErrorBuzz();
      return;
    }

    const updatedAllocated = { ...tree.allocatedSkills, [nodeId]: curRank + 1 };
    const updatedTree: CharacterProgressionData = {
      ...tree,
      skillPoints: tree.skillPoints - 1,
      allocatedSkills: updatedAllocated,
    };

    const updatedAll = {
      ...charProgression,
      [bossId]: { ...charData, treeData: updatedTree, lichData: bossId === 'lich_lord' ? updatedTree : charData.lichData },
    };

    saveCharacterProgression(updatedAll);
    gameAudio.playPowerupChime();
  };

  const respecCharacterSkills = (bossId: BossClassId) => {
    const charData = charProgression[bossId];
    const tree = charData?.treeData;
    if (!tree) return;

    const totalPoints = calculateCharacterSkillPoints(charData.level);
    const activeNodes =
      bossId === 'demon_monarch'
        ? DEMON_TREE_ACTIVE_SKILLS
        : bossId === 'vampire_queen'
        ? VAMPIRE_TREE_ACTIVE_SKILLS
        : bossId === 'shadow_reaper'
        ? REAPER_TREE_ACTIVE_SKILLS
        : bossId === 'cursed_golem'
        ? GOLEM_TREE_ACTIVE_SKILLS
        : LICH_TREE_ACTIVE_SKILLS;
    const passiveNodes =
      bossId === 'demon_monarch'
        ? DEMON_TREE_PASSIVES
        : bossId === 'vampire_queen'
        ? VAMPIRE_TREE_PASSIVES
        : bossId === 'shadow_reaper'
        ? REAPER_TREE_PASSIVES
        : bossId === 'cursed_golem'
        ? GOLEM_TREE_PASSIVES
        : LICH_TREE_PASSIVES;

    const initialAllocated: Record<string, number> = {};
    activeNodes.forEach((n) => (initialAllocated[n.id] = 1));
    passiveNodes.forEach((n) => (initialAllocated[n.id] = 1));

    const updatedTree: CharacterProgressionData = {
      ...tree,
      skillPoints: totalPoints,
      allocatedSkills: initialAllocated,
    };

    const updatedAll = {
      ...charProgression,
      [bossId]: { ...charData, treeData: updatedTree, lichData: bossId === 'lich_lord' ? updatedTree : charData.lichData },
    };

    saveCharacterProgression(updatedAll);
    gameAudio.playConfirmSelect();
  };

  const equipAbilityToSlot = (bossId: BossClassId, nodeId: string, slotIdx: number) => {
    const charData = charProgression[bossId];
    const tree = charData?.treeData;
    if (!tree) return;

    const newLoadout = [...tree.loadout] as [string, string, string, string, string];
    newLoadout[slotIdx] = nodeId;

    const updatedTree: CharacterProgressionData = { ...tree, loadout: newLoadout };
    const updatedAll = {
      ...charProgression,
      [bossId]: { ...charData, treeData: updatedTree, lichData: bossId === 'lich_lord' ? updatedTree : charData.lichData },
    };

    saveCharacterProgression(updatedAll);
    gameAudio.playConfirmSelect();
  };

  const startButtonRef = useAutoFocus<HTMLButtonElement>(gameState.status === 'START');

  // Active tree skills for inspected character
  const activeTreeBossData = charProgression[treeSelectedBoss] || { ...DEFAULT_PROG, treeData: getDefaultTreeData(treeSelectedBoss) };
  const treeNodesActive =
    treeSelectedBoss === 'demon_monarch'
      ? DEMON_TREE_ACTIVE_SKILLS
      : treeSelectedBoss === 'vampire_queen'
      ? VAMPIRE_TREE_ACTIVE_SKILLS
      : treeSelectedBoss === 'shadow_reaper'
      ? REAPER_TREE_ACTIVE_SKILLS
      : treeSelectedBoss === 'cursed_golem'
      ? GOLEM_TREE_ACTIVE_SKILLS
      : LICH_TREE_ACTIVE_SKILLS;
  const treeNodesPassive =
    treeSelectedBoss === 'demon_monarch'
      ? DEMON_TREE_PASSIVES
      : treeSelectedBoss === 'vampire_queen'
      ? VAMPIRE_TREE_PASSIVES
      : treeSelectedBoss === 'shadow_reaper'
      ? REAPER_TREE_PASSIVES
      : treeSelectedBoss === 'cursed_golem'
      ? GOLEM_TREE_PASSIVES
      : LICH_TREE_PASSIVES;
  const treeBranches = getCharacterBranches(treeSelectedBoss);

  return (
    <div
      className={`fixed inset-0 overflow-hidden touch-none flex flex-col items-center justify-between bg-slate-950 text-white select-none ${highContrast ? 'contrast-125' : ''}`}
      style={{
        fontFamily: getConfig('fontFamily') as string,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}>
      
      {/* Background Music Player */}
      <BackgroundMusic
        url={currentBgmUrl}
        isPlaying={gameState.status === 'PLAYING' && !isDraftOpen && !isMerchantOpen}
        isMuted={musicMuted}
      />

      {/* Loading Screen */}
      {!assetsReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-red-500 font-bold">
          <Flame size={64} className="animate-pulse text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
          <div className="text-2xl md:text-3xl tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-amber-400 to-orange-500 font-black mt-4">
            AWAKENING INFERNAL OVERLORD...
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IN-GAME TOP HUD & DEDICATED RESOURCE BAR + 5-SLOT ABILITY TRAY */}
      {/* ========================================================================= */}
      {gameState.status === 'PLAYING' && (
        <header className="w-full bg-slate-950/95 border-b-2 border-red-600/40 px-2 sm:px-4 py-2 flex flex-wrap items-center justify-between z-20 shrink-0 text-xs shadow-[0_4px_30px_rgba(0,0,0,0.9)] backdrop-blur-md gap-2 sm:gap-3">
          {/* Left: Boss Status Cluster (HP, EXP, Fury / Essence) */}
          <div className="flex items-center gap-2 min-w-[190px] sm:min-w-[240px]">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-950 to-slate-900 border-2 border-red-500/80 flex items-center justify-center shadow-md">
                {selectedBoss === 'demon_monarch' ? (
                  <Flame size={20} className="text-red-400 drop-shadow" />
                ) : selectedBoss === 'vampire_queen' ? (
                  <Heart size={20} className="text-pink-400 drop-shadow" />
                ) : selectedBoss === 'shadow_reaper' ? (
                  <Crosshair size={20} className="text-purple-400 drop-shadow" />
                ) : (
                  <Skull size={20} className="text-cyan-400 drop-shadow" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-black text-[9px] font-black px-1 rounded-full border border-black font-mono">
                Lv.{hudExp.level}
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-[130px]">
              <div className="flex justify-between items-center text-[11px] font-black text-amber-300 gap-1">
                <span className="tracking-wider whitespace-nowrap truncate">{BOSS_CLASSES.find((b) => b.id === selectedBoss)?.name}</span>
                <span className="font-mono text-white/90 text-[10px] whitespace-nowrap">{Math.floor(hudHp.current)}/{Math.floor(hudHp.max)}</span>
              </div>
              
              {/* HP Bar */}
              <div className="w-full bg-slate-900 h-2.5 rounded-md border border-red-900/80 overflow-hidden relative shadow-inner">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-700 via-red-500 to-amber-400 transition-all duration-75 shadow-sm"
                  style={{ width: `${clamp((hudHp.current / hudHp.max) * 100, 0, 100)}%` }}
                />
              </div>

              {/* DEDICATED INFERNAL FURY / SOUL ESSENCE / REAPER MARKS RESOURCE BAR */}
              <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-amber-200">
                <span className="font-black text-[8px] uppercase tracking-wider text-amber-400">{hudResource.name}:</span>
                <span>{hudResource.current}/{hudResource.max}</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full border border-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${
                    selectedBoss === 'demon_monarch'
                      ? 'bg-gradient-to-r from-orange-600 via-red-500 to-amber-300 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      : selectedBoss === 'vampire_queen'
                      ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-red-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                      : selectedBoss === 'shadow_reaper'
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-300 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                      : selectedBoss === 'cursed_golem'
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-300 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  }`}
                  style={{ width: `${clamp((hudResource.current / hudResource.max) * 100, 0, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CENTER: 5-SLOT ABILITY LOADOUT TRAY (KEYS 1..5, COOLDOWNS & RESOURCE BADGES) */}
          {/* ========================================================================= */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-slate-950/90 border border-red-500/40 px-2 sm:px-3 py-1 rounded-2xl shadow-xl backdrop-blur-lg">
            {/* Auto-Cast Toggle Button */}
            <button
              type="button"
              onClick={() => {
                gameAudio.playCrispClick();
                toggleAutoAttack();
              }}
              title="Toggle Auto-Cast vs Manual Keybinds (1-5)"
              className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-[9px] sm:text-[10px] font-black transition-all cursor-pointer shadow select-none ${
                autoAttackEnabled
                  ? 'bg-red-950/90 border-red-500 text-amber-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
              <Zap size={11} className={autoAttackEnabled ? 'text-amber-400' : 'text-slate-500'} />
              <span>{autoAttackEnabled ? 'AUTO' : 'MANUAL'}</span>
            </button>

            {/* Render 5-Slot Ability Tray */}
            {hudAbilitySlots.map((slot, idx) => (
              <div
                key={slot.id || idx}
                onClick={() => {
                  const sim = simRef.current;
                  if (sim.boss.active5Cooldowns[idx] <= 0) {
                    sim.boss.active5Cooldowns[idx] = sim.boss.active5MaxCooldowns[idx] || 2.5;
                    castAbility(slot.id, idx);
                  }
                }}
                title={`[Key ${idx + 1}] ${slot.name} (Cost: ${slot.resourceCost || 0})`}
                className={`relative group flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 transition-all select-none cursor-pointer overflow-hidden ${
                  slot.isReady && slot.canCastResource
                    ? 'bg-slate-900/90 border-red-400/80 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95'
                    : 'bg-slate-950 border-slate-800 opacity-70'
                }`}>
                {/* Cooldown Sweep */}
                {!slot.isReady && (
                  <div
                    className="absolute inset-x-0 bottom-0 bg-slate-950/85 z-10 transition-all pointer-events-none"
                    style={{ height: `${clamp((slot.cdRemaining / slot.cdMax) * 100, 0, 100)}%` }}
                  />
                )}

                {/* Keybinding Badge */}
                <div className="absolute top-0.5 right-0.5 z-20 bg-slate-950/95 border border-red-500/80 text-amber-300 text-[8px] font-black px-1 rounded font-mono leading-none shadow">
                  {idx + 1}
                </div>

                {/* Resource Cost Badge */}
                {slot.resourceCost && slot.resourceCost > 0 ? (
                  <div className="absolute top-0.5 left-0.5 z-20 bg-red-950 text-amber-300 text-[7px] font-black px-1 rounded border border-red-700 font-mono">
                    {slot.resourceCost}
                  </div>
                ) : null}

                {/* Icon */}
                <div className="z-0">
                  {slot.category === 'SWORDSMANSHIP' || slot.name.includes('Cleave') || slot.name.includes('Slash') || slot.name.includes('Thrust') ? (
                    <Swords size={15} className="text-red-400" />
                  ) : slot.category === 'HELLFIRE' || slot.name.includes('Fire') || slot.name.includes('Flame') || slot.name.includes('Magma') ? (
                    <Flame size={15} className="text-orange-400" />
                  ) : slot.category === 'PHYSICAL_ATTACKS' || slot.name.includes('Slam') || slot.name.includes('Quake') ? (
                    <Shield size={15} className="text-amber-400" />
                  ) : (
                    <Zap size={15} className="text-yellow-400" />
                  )}
                </div>

                {/* Star Level Rank */}
                <div className="absolute bottom-0.5 inset-x-0 flex items-center justify-center gap-0.5 z-20">
                  <span className="text-[7px] font-mono text-amber-300 font-black">R.{slot.level}</span>
                </div>
              </div>
            ))}

            {/* Dash Ability [SPACE] */}
            <div
              onClick={() => {
                const sim = simRef.current;
                if (sim.boss.dashCooldownTimer <= 0 && sim.boss.dashTimer <= 0) {
                  sim.boss.dashTimer = sim.boss.dashDuration;
                  sim.boss.dashCooldownTimer = sim.boss.dashCooldown * sim.perkHasteMult;
                  sim.boss.isInvulnerable = true;
                  gameAudio.playRetroJump();
                }
              }}
              title="Dash [SPACE]"
              className="relative group flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 transition-all select-none cursor-pointer overflow-hidden bg-slate-900/90 border-red-400/80 shadow hover:scale-105 active:scale-95">
              <Activity size={15} className="text-amber-300" />
              <div className="absolute top-0.5 right-0.5 bg-slate-950 text-amber-300 text-[8px] font-black px-1 rounded font-mono">
                {isMobile ? 'DASH' : 'SPC'}
              </div>
            </div>

            {/* Ultimate [R / F] */}
            <div
              onClick={triggerBossUltimate}
              title={`Ultimate: ${hudUltimate.name} [R / F]`}
              className={`relative group flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 transition-all select-none cursor-pointer overflow-hidden ${
                hudUltimate.isReady
                  ? 'bg-gradient-to-br from-red-800 to-amber-600 border-amber-300 ring-2 ring-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse hover:scale-110'
                  : 'bg-slate-950 border-red-900/60 opacity-80'
              }`}>
              <Zap size={16} className={hudUltimate.isReady ? 'text-amber-300 fill-amber-300' : 'text-red-400'} />
              <div className="absolute top-0.5 right-0.5 bg-slate-950 text-amber-300 text-[8px] font-black px-1 rounded font-mono">
                {isMobile ? 'ULT' : 'R'}
              </div>
            </div>
          </div>

          {/* Right: Wave Badge & Pause Button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 px-2.5 py-1 rounded-xl shadow-inner">
              <span className="text-[9px] text-amber-300 uppercase font-black">Wave</span>
              <span className="text-sm font-black text-amber-400 font-mono leading-none">{hudWave}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                gameAudio.playCrispClick();
                setIsGameMenuOpen(true);
              }}
              className="p-1.5 sm:p-2 bg-slate-900 hover:bg-slate-800 border border-red-600/40 rounded-xl text-amber-300 transition-all hover:scale-105 active:scale-95 shadow cursor-pointer">
              <Settings size={16} />
            </button>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* ACTIVE GAME CANVAS */}
      {/* ========================================================================= */}
      <div className="flex-1 w-full min-h-0 flex items-center justify-center bg-black relative">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            aspectRatio: `${canvasWidth} / ${canvasHeight}`,
            width: `min(100%, calc(100vh * ${canvasWidth} / ${canvasHeight}))`,
          }}
          className="h-auto max-w-full max-h-full border-x border-slate-900 shadow-2xl"
        />

        {/* MOBILE & TOUCHSCREEN ON-SCREEN GAMING HUD (DYNAMICALLY DETECTED OR OVERRIDDEN) */}
        {showTouchHUD && gameState.status === 'PLAYING' && !isDraftOpen && !isMerchantOpen && !isGameMenuOpen && (
          <div className="absolute inset-0 pointer-events-none flex justify-between items-end p-4 sm:p-6 pb-[calc(env(safe-area-inset-bottom,12px)+8px)] pl-[calc(env(safe-area-inset-left,12px)+8px)] pr-[calc(env(safe-area-inset-right,12px)+8px)] z-30 select-none touch-none">
            {/* 1. Virtual Analog Touch Joystick (Bottom-Left) */}
            <div
              className="pointer-events-auto w-32 h-32 sm:w-36 sm:h-36 bg-slate-950/75 border-2 border-red-500/60 rounded-full flex items-center justify-center relative touch-none select-none shadow-[0_0_25px_rgba(239,68,68,0.35)] backdrop-blur-md transition-opacity duration-150"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                const rect = e.currentTarget.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const rawX = e.clientX - cx;
                const rawY = e.clientY - cy;
                const maxDist = rect.width * 0.38;
                const dist = Math.hypot(rawX, rawY);
                const clampedDist = Math.min(dist, maxDist);
                const angle = Math.atan2(rawY, rawX);
                const kx = Math.cos(angle) * clampedDist;
                const ky = Math.sin(angle) * clampedDist;

                const normDist = dist / maxDist;
                if (normDist > 0.12) {
                  const normX = (rawX / dist) * Math.min(1, (normDist - 0.12) / 0.88);
                  const normY = (rawY / dist) * Math.min(1, (normDist - 0.12) / 0.88);
                  virtualControlsRef.current.dx = clamp(normX, -1, 1);
                  virtualControlsRef.current.dy = clamp(normY, -1, 1);
                } else {
                  virtualControlsRef.current.dx = 0;
                  virtualControlsRef.current.dy = 0;
                }
                setJoystickPos({ x: kx, y: ky, active: true });
              }}
              onPointerMove={(e) => {
                if (e.buttons > 0 || e.pressure > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const cx = rect.left + rect.width / 2;
                  const cy = rect.top + rect.height / 2;
                  const rawX = e.clientX - cx;
                  const rawY = e.clientY - cy;
                  const maxDist = rect.width * 0.38;
                  const dist = Math.hypot(rawX, rawY);
                  const clampedDist = Math.min(dist, maxDist);
                  const angle = Math.atan2(rawY, rawX);
                  const kx = Math.cos(angle) * clampedDist;
                  const ky = Math.sin(angle) * clampedDist;

                  const normDist = dist / maxDist;
                  if (normDist > 0.12) {
                    const normX = (rawX / dist) * Math.min(1, (normDist - 0.12) / 0.88);
                    const normY = (rawY / dist) * Math.min(1, (normDist - 0.12) / 0.88);
                    virtualControlsRef.current.dx = clamp(normX, -1, 1);
                    virtualControlsRef.current.dy = clamp(normY, -1, 1);
                  } else {
                    virtualControlsRef.current.dx = 0;
                    virtualControlsRef.current.dy = 0;
                  }
                  setJoystickPos({ x: kx, y: ky, active: true });
                }
              }}
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }
                virtualControlsRef.current.dx = 0;
                virtualControlsRef.current.dy = 0;
                setJoystickPos({ x: 0, y: 0, active: false });
              }}
              onPointerCancel={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }
                virtualControlsRef.current.dx = 0;
                virtualControlsRef.current.dy = 0;
                setJoystickPos({ x: 0, y: 0, active: false });
              }}>
              {/* Outer Directional Crosshair Guides */}
              <div className="absolute inset-2 rounded-full border border-red-500/20 pointer-events-none" />
              <div className="absolute w-full h-[1px] bg-red-500/20 pointer-events-none" />
              <div className="absolute h-full w-[1px] bg-red-500/20 pointer-events-none" />

              {/* Glowing Thumb Knob */}
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br from-red-600 via-orange-600 to-amber-700 border-2 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] pointer-events-none transition-transform duration-75 flex items-center justify-center ${
                  joystickPos.active ? 'scale-110' : ''
                }`}
                style={{
                  transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                }}>
                <div className="w-4 h-4 rounded-full bg-amber-200/80 shadow-inner" />
              </div>
            </div>

            {/* 2. Action Cluster (Bottom-Right) */}
            <div className="pointer-events-auto flex flex-col items-end gap-2.5 touch-none select-none">
              {/* Top Row: Auto-Attack Toggle Pill & Slots 1-5 Arc */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-red-500/40 backdrop-blur-md shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    gameAudio.playCrispClick();
                    toggleAutoAttack();
                  }}
                  className={`px-2 py-1 rounded-xl text-[9px] font-black flex items-center gap-1 transition-all border ${
                    autoAttackEnabled
                      ? 'bg-red-950 text-amber-300 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                  <Zap size={10} className={autoAttackEnabled ? 'text-amber-400' : 'text-slate-500'} />
                  <span>{autoAttackEnabled ? 'AUTO' : 'MANUAL'}</span>
                </button>

                {/* 5 Ability Slot Mini Action Buttons */}
                {hudAbilitySlots.map((slot, idx) => (
                  <button
                    key={slot.id || idx}
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      (virtualControlsRef.current as any)[`slot${idx + 1}`] = true;
                      const sim = simRef.current;
                      if (sim.boss.active5Cooldowns[idx] <= 0) {
                        sim.boss.active5Cooldowns[idx] = sim.boss.active5MaxCooldowns[idx] || 2.5;
                        castAbility(slot.id, idx);
                      }
                    }}
                    className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex flex-col items-center justify-center overflow-hidden transition-all active:scale-90 ${
                      slot.isReady && slot.canCastResource
                        ? 'bg-slate-900/90 border-red-400 text-amber-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-slate-950 border-slate-800 opacity-60 text-slate-500'
                    }`}>
                    {/* Cooldown Sweep */}
                    {!slot.isReady && (
                      <div
                        className="absolute inset-x-0 bottom-0 bg-slate-950/85 pointer-events-none"
                        style={{ height: `${clamp((slot.cdRemaining / slot.cdMax) * 100, 0, 100)}%` }}
                      />
                    )}
                    {/* Slot badge */}
                    <span className="absolute top-0.5 left-0.5 text-[7px] font-mono font-black text-amber-300 leading-none">
                      {idx + 1}
                    </span>
                    {/* Resource cost */}
                    {slot.resourceCost && slot.resourceCost > 0 ? (
                      <span className="absolute top-0.5 right-0.5 text-[7px] font-mono font-bold text-red-400 leading-none">
                        {slot.resourceCost}
                      </span>
                    ) : null}
                    <div className="z-10 mt-1">
                      {slot.category === 'SWORDSMANSHIP' || slot.name.includes('Cleave') || slot.name.includes('Slash') ? (
                        <Swords size={14} className="text-red-400" />
                      ) : slot.category === 'HELLFIRE' || slot.name.includes('Fire') ? (
                        <Flame size={14} className="text-orange-400" />
                      ) : (
                        <Zap size={14} className="text-amber-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Bottom Row: Main Primary Attack, Dash & Ultimate Cluster */}
              <div className="flex items-center gap-2.5">
                {/* Dash Button */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    virtualControlsRef.current.dash = true;
                    const sim = simRef.current;
                    if (sim.boss.dashCooldownTimer <= 0 && sim.boss.dashTimer <= 0) {
                      sim.boss.dashTimer = sim.boss.dashDuration;
                      sim.boss.dashCooldownTimer = sim.boss.dashCooldown * sim.perkHasteMult;
                      sim.boss.isInvulnerable = true;
                      gameAudio.playRetroJump();
                    }
                  }}
                  onPointerUp={() => {
                    virtualControlsRef.current.dash = false;
                  }}
                  className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 flex flex-col items-center justify-center overflow-hidden transition-transform active:scale-90 shadow-xl backdrop-blur-md ${
                    hudDash.isReady
                      ? 'bg-slate-900/90 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
                  }`}>
                  {!hudDash.isReady && (
                    <div
                      className="absolute inset-x-0 bottom-0 bg-slate-950/85 pointer-events-none"
                      style={{ height: `${clamp((hudDash.cdRemaining / hudDash.cdMax) * 100, 0, 100)}%` }}
                    />
                  )}
                  <Activity size={20} className="z-10" />
                  <span className="text-[8px] font-black z-10 font-mono tracking-tight leading-none mt-0.5">DASH</span>
                </button>

                {/* Ultimate Button */}
                <button
                  type="button"
                  onClick={() => {
                    triggerBossUltimate();
                  }}
                  className={`relative w-14 h-14 sm:w-15 sm:h-15 rounded-full border-2 flex flex-col items-center justify-center overflow-hidden transition-all active:scale-90 shadow-xl backdrop-blur-md ${
                    hudUltimate.isReady
                      ? 'bg-gradient-to-br from-red-700 via-orange-600 to-amber-500 border-amber-300 text-white ring-2 ring-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse'
                      : 'bg-slate-950 border-red-900/60 text-red-400/80 opacity-80'
                  }`}>
                  {!hudUltimate.isReady && (
                    <div
                      className="absolute inset-x-0 bottom-0 bg-slate-950/85 pointer-events-none"
                      style={{ height: `${clamp((hudUltimate.cdRemaining / hudUltimate.cdMax) * 100, 0, 100)}%` }}
                    />
                  )}
                  <Zap size={20} className={hudUltimate.isReady ? 'fill-white text-white z-10' : 'text-red-400 z-10'} />
                  <span className="text-[8px] font-black z-10 font-mono leading-none mt-0.5">
                    {hudUltimate.isReady ? 'READY' : `${hudUltimate.chargePct}%`}
                  </span>
                </button>

                {/* Primary Attack Button (Large, prominent) */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    virtualControlsRef.current.attack = true;
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    virtualControlsRef.current.attack = false;
                  }}
                  onPointerCancel={(e) => {
                    e.preventDefault();
                    virtualControlsRef.current.attack = false;
                  }}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-950 active:from-red-500 border-2 border-amber-400 text-white flex flex-col items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.7)] transition-transform active:scale-90 backdrop-blur-md">
                  <Swords size={24} className="text-amber-200 drop-shadow" />
                  <span className="text-[9px] font-black text-amber-300 font-mono tracking-wider mt-0.5">ATTACK</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MAIN MENU / LOBBY (DARK GOTHIC LUXURY TABS ARCHITECTURE) */}
      {/* ========================================================================= */}
      {gameState.status === 'START' && (
        <MenuOverlay tone="neutral" zIndex={40}>
          <div className="w-full max-w-4xl bg-slate-950/95 border-2 border-red-600/50 rounded-3xl p-5 md:p-6 shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col items-center backdrop-blur-xl ring-1 ring-red-500/20">
            {/* Cinematic Title */}
            <div className="text-center mb-2">
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-red-400 mb-1 flex items-center justify-center gap-2 whitespace-nowrap">
                <span>✦</span> INFERNAL SWORD EMPEROR & DUNGEON OVERLORDS <span>✦</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-orange-400 to-red-600 tracking-wider text-center drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)] leading-tight">
                ETERNAL OVERLORD
              </h1>
            </div>

            {/* Persistent Profile & Cloud-Sync Status Indicator Bar */}
            <div className="w-full bg-slate-900/80 border border-red-500/30 rounded-2xl px-3.5 py-2 mb-3.5 flex flex-wrap items-center justify-between gap-2 shadow-inner text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="absolute w-4 h-4 rounded-full bg-emerald-500/30 animate-ping" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-slate-300">
                  <Database size={13} className="text-emerald-400" />
                  <span className="font-black text-white text-[11px]">Profile Synced:</span>
                  <span className="text-amber-300 text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    v1.0 Local Storage
                  </span>
                </div>
              </div>

              {/* Lifetime Stats Pill */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 flex-wrap">
                <span className="text-amber-300 font-bold">Wave {highestWaveRecord} Best</span>
                <span>•</span>
                <span>{globalStats.totalKills.toLocaleString()} Kills</span>
                <span>•</span>
                <span>{globalStats.bossesSlain} Slain</span>
                <span>•</span>
                <span>{globalStats.totalRuns} Runs</span>
              </div>

              {/* Manual Save Trigger Button */}
              <button
                type="button"
                onClick={triggerManualSave}
                title="Force manual save profile to localStorage"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer border ${
                  manualSaveIndicator
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-amber-400/50'
                }`}>
                {manualSaveIndicator ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span>SAVED!</span>
                  </>
                ) : (
                  <>
                    <Save size={12} className="text-amber-400" />
                    <span>SAVE NOW</span>
                  </>
                )}
              </button>
            </div>

            {/* Top-Level Navigation Tabs Bar (De-clutter UI) */}
            <div className="flex flex-wrap gap-1.5 mb-4 w-full justify-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  setActiveTab('BOSS_SELECT');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'BOSS_SELECT'
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow ring-1 ring-amber-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}>
                <Skull size={14} className="shrink-0" />
                <span>Boss Roster</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  setActiveTab('SKILL_TREE');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'SKILL_TREE'
                    ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow ring-1 ring-amber-300'
                    : 'text-amber-400 hover:text-white hover:bg-slate-800'
                }`}>
                <Layers size={14} className="shrink-0" />
                <span>Skill Tree</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  setActiveTab('ABILITY_LOADOUT');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'ABILITY_LOADOUT'
                    ? 'bg-gradient-to-r from-purple-600 to-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}>
                <Sliders size={14} className="shrink-0" />
                <span>Ability Loadout (5 Slots)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  setActiveTab('SOUL_ALTAR');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'SOUL_ALTAR'
                    ? 'bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}>
                <Sparkles size={14} className="shrink-0" />
                <span>Soul Altar ({souls})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  setActiveTab('BESTIARY');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'BESTIARY'
                    ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}>
                <BookOpen size={14} className="shrink-0" />
                <span>Codex & Bestiary</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  setActiveTab('DEV_GALLERY');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'DEV_GALLERY'
                    ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow ring-1 ring-cyan-300'
                    : 'text-cyan-400 hover:text-white hover:bg-slate-800'
                }`}>
                <Sparkles size={14} className="shrink-0" />
                <span>Asset & Animation Gallery (Dev)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  setActiveTab('SETTINGS');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'SETTINGS'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}>
                <Settings size={14} className="shrink-0" />
                <span>Settings</span>
              </button>
            </div>

            {/* TAB 1: BOSS ROSTER WITH HERO DOSSIER & PLAY CTA */}
            {activeTab === 'BOSS_SELECT' && (
              <div className="w-full flex flex-col items-center gap-3.5">
                <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 w-full py-2 px-1 overflow-x-auto">
                  {BOSS_CLASSES.map((b) => {
                    const isSelected = selectedBoss === b.id;
                    const prog = charProgression[b.id] || { ...DEFAULT_PROG };
                    return (
                      <BossAvatarPortrait
                        key={b.id}
                        boss={b}
                        isSelected={isSelected}
                        progression={prog}
                        onClick={() => {
                          setSelectedBoss(b.id);
                          setTreeSelectedBoss(b.id);
                          commitSaveProfile({ activeBossId: b.id });
                        }}
                        assets={assets}
                      />
                    );
                  })}
                </div>

                {/* Selected Boss Dossier */}
                {(() => {
                  const b = BOSS_CLASSES.find((x) => x.id === selectedBoss)!;
                  const prog = charProgression[selectedBoss] || { ...DEFAULT_PROG };

                  return (
                    <div className="w-full bg-slate-900/95 border border-red-600/40 p-4 rounded-2xl flex flex-col gap-2.5 text-xs shadow-2xl backdrop-blur-md">
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-2">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-amber-300 drop-shadow">{b.name}</span>
                            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800" style={{ color: b.color }}>
                              {b.resourceName}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 italic">{b.title}</span>
                        </div>
                        <span className="text-amber-300 font-bold text-xs bg-red-950/90 px-3 py-1 rounded-xl border border-red-800 shadow whitespace-nowrap">
                          Mastery Rank {prog.level} ({prog.exp}/{prog.nextExp} EXP)
                        </span>
                      </div>

                      <p className="text-slate-300 leading-relaxed">{b.desc}</p>

                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <Zap size={14} className="text-amber-400 shrink-0" />
                        <span className="text-[11px] text-slate-300">
                          <strong className="text-amber-300">Ultimate: {b.ultimateName}</strong> — {b.ultimateDesc}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Primary Enter Dungeon CTA */}
                <button
                  ref={startButtonRef}
                  autoFocus
                  onClick={initGame}
                  onMouseEnter={() => gameAudio.playHoverMicroTone()}
                  className="w-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-orange-400 text-white px-8 py-3.5 md:py-4 rounded-2xl font-black text-base md:text-lg shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 border border-amber-300/40 cursor-pointer">
                  <Play size={20} className="fill-white shrink-0" />
                  <span className="whitespace-nowrap">ENTER DUNGEON & PURGE CRUSADERS</span>
                </button>
              </div>
            )}

            {/* TAB 2: UNIVERSAL INTERACTIVE SKILL TREE WITH CHARACTER SWITCHER PILL */}
            {activeTab === 'SKILL_TREE' && (
              <div className="w-full flex flex-col gap-3">
                {/* Character Switcher Pill */}
                <div className="flex items-center justify-between bg-slate-900/90 border border-red-600/40 p-2.5 rounded-2xl gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {BOSS_CLASSES.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          gameAudio.playCrispClick();
                          setTreeSelectedBoss(b.id);
                          setTreeBranchFilter(
                            b.id === 'demon_monarch'
                              ? 'SWORDSMANSHIP'
                              : b.id === 'vampire_queen'
                              ? 'BLOOD_SORCERY'
                              : b.id === 'shadow_reaper'
                              ? 'SCYTHE_MASTERY'
                              : b.id === 'cursed_golem'
                              ? 'COLOSSAL_PHYSICAL_COMBAT'
                              : 'SUMMONING'
                          );
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                          treeSelectedBoss === b.id
                            ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow'
                            : 'bg-slate-950 text-slate-400 hover:text-white'
                        }`}>
                        {b.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs bg-red-950 border border-red-500 text-amber-300 font-mono font-bold px-2.5 py-1 rounded-full shadow whitespace-nowrap">
                      {activeTreeBossData.treeData?.skillPoints || 0} SP Available
                    </span>
                    <button
                      type="button"
                      onClick={() => respecCharacterSkills(treeSelectedBoss)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-red-900 border border-slate-700 text-red-300 rounded-xl text-xs font-black transition-all cursor-pointer">
                      Respec
                    </button>
                  </div>
                </div>

                {/* 5 Branches Filter Bar */}
                <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
                  {treeBranches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => setTreeBranchFilter(branch.id)}
                      className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                        treeBranchFilter === branch.id
                          ? 'bg-red-600 border-amber-400 text-white shadow'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}>
                      <span>{branch.label}</span>
                    </button>
                  ))}
                </div>

                {/* Nodes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {(treeBranchFilter === 'PASSIVES' ? treeNodesPassive : treeNodesActive.filter((n) => n.branch === treeBranchFilter)).map((node) => {
                    const tree = activeTreeBossData.treeData;
                    const rank = tree?.allocatedSkills[node.id] || 1;
                    const isMax = rank >= node.maxRank;
                    const canAfford = (tree?.skillPoints || 0) >= 1 && !isMax;

                    return (
                      <div
                        key={node.id}
                        className="bg-slate-900/90 border border-slate-800 hover:border-red-500/50 p-3 rounded-2xl flex flex-col justify-between gap-2 shadow-md">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-sm text-amber-300" style={{ color: node.color }}>
                              {node.name}
                            </span>
                            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono text-amber-300 font-bold">
                              Rank {rank} / {node.maxRank}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-relaxed mb-1">
                            {node.desc}
                          </p>

                          {node.evolutions && (
                            <div className="bg-slate-950/90 p-1.5 rounded-lg border border-slate-800 text-[9px] text-slate-400 font-mono">
                              <span className="text-amber-400 font-bold">Rank 5: </span>{node.evolutions.rank5}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[9px] text-emerald-400 font-mono">{node.rankBonus}</span>
                          <button
                            type="button"
                            onClick={() => buyCharacterSkillRank(treeSelectedBoss, node.id)}
                            disabled={!canAfford}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                              isMax
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : canAfford
                                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow hover:scale-105'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}>
                            <Plus size={12} />
                            <span>{isMax ? 'MAXED' : 'UPGRADE'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: 5-SLOT ABILITY LOADOUT MANAGEMENT */}
            {activeTab === 'ABILITY_LOADOUT' && (
              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center justify-between bg-slate-900/90 border border-red-600/40 p-3 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="font-black text-sm text-amber-200">5-Slot Combat Ability Loadout</span>
                    <span className="text-[11px] text-slate-400">
                      Equip unlocked active abilities into Slots [1], [2], [3], [4], [5] for instant battle casting.
                    </span>
                  </div>

                  {/* Switch Active Boss */}
                  <div className="flex gap-1">
                    {BOSS_CLASSES.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setTreeSelectedBoss(b.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black ${
                          treeSelectedBoss === b.id ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5 Current Slots */}
                <div className="grid grid-cols-5 gap-2 w-full">
                  {activeTreeBossData.treeData?.loadout.map((slotNodeId, idx) => {
                    const nodeDef = ALL_CHARACTER_NODES[slotNodeId] || ALL_BOSS_SKILLS[slotNodeId];
                    return (
                      <div
                        key={idx}
                        className="bg-slate-900 border-2 border-red-500/80 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md text-center">
                        <div className="bg-slate-950 text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded-md font-mono border border-red-500/50">
                          SLOT {idx + 1}
                        </div>
                        <span className="text-xs font-black text-white truncate max-w-full" style={{ color: nodeDef?.color || '#ef4444' }}>
                          {nodeDef?.name || 'Empty'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {nodeDef ? (nodeDef as any).branch || 'Active' : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Available 50 Active Abilities to Equip */}
                <span className="text-xs font-black text-amber-300 mt-2">Equip Available Active Abilities:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {(treeSelectedBoss === 'demon_monarch'
                    ? DEMON_TREE_ACTIVE_SKILLS
                    : treeSelectedBoss === 'vampire_queen'
                    ? VAMPIRE_TREE_ACTIVE_SKILLS
                    : treeSelectedBoss === 'shadow_reaper'
                    ? REAPER_TREE_ACTIVE_SKILLS
                    : treeSelectedBoss === 'cursed_golem'
                    ? GOLEM_TREE_ACTIVE_SKILLS
                    : LICH_TREE_ACTIVE_SKILLS
                  ).map((node) => (
                    <div
                      key={node.id}
                      className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="font-black text-xs text-white truncate" style={{ color: node.color }}>{node.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{node.branch} • {node.resourceCost} Cost</span>
                      </div>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((slotIdx) => (
                          <button
                            key={slotIdx}
                            onClick={() => equipAbilityToSlot(treeSelectedBoss, node.id, slotIdx)}
                            className="px-2 py-1 bg-slate-800 hover:bg-red-700 text-white rounded text-[10px] font-mono font-black border border-slate-700 transition-all">
                            S{slotIdx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SOUL ALTAR */}
            {activeTab === 'SOUL_ALTAR' && (
              <div className="w-full flex flex-col gap-3.5">
                <div className="flex justify-between items-center bg-purple-950/60 border border-purple-800 p-3 rounded-2xl">
                  <div>
                    <div className="font-black text-sm text-purple-200">The Soul Altar</div>
                    <div className="text-[11px] text-purple-300/80">Channel harvested hero souls into permanent global attributes.</div>
                  </div>
                  <div className="font-black text-base text-amber-300 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 whitespace-nowrap">
                    <Sparkles size={16} className="text-purple-400 shrink-0" />
                    <span>{souls} Souls</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {META_UPGRADES.map((m) => {
                    const curLvl = metaLevels[m.id] || 0;
                    const cost = Math.floor(m.costBase * Math.pow(m.costScale, curLvl));
                    const isMax = curLvl >= m.maxLevel;
                    const canAfford = souls >= cost && !isMax;

                    return (
                      <div
                        key={m.id}
                        className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center justify-between transition-all gap-2">
                        <div className="flex flex-col pr-1 min-w-0">
                          <span className="font-black text-sm text-white truncate">{m.name}</span>
                          <span className="text-[11px] text-slate-400">{m.desc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (canAfford) {
                              saveMeta(souls - cost, { ...metaLevels, [m.id]: curLvl + 1 });
                              gameAudio.playPowerupChime();
                            }
                          }}
                          disabled={!canAfford}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            isMax ? 'bg-slate-800 text-slate-500' : canAfford ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500'
                          }`}>
                          {isMax ? 'MAX' : `${cost} Souls`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: CODEX & BESTIARY */}
            {activeTab === 'BESTIARY' && (
              <div className="w-full flex flex-col gap-3">
                <div className="bg-slate-900/90 border border-teal-600/40 p-3 rounded-2xl text-xs text-teal-200">
                  <span>Compendium of kingdom champions and holy invaders seeking to cleanse your dark dungeon.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {BESTIARY.map((b) => (
                    <div key={b.id} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between gap-1 shadow">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-sm text-amber-300">{b.name}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-bold text-teal-400">
                          {b.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">{b.desc}</p>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                        <span>HP: {b.hp}</span>
                        <span className={b.danger === 'Boss' ? 'text-red-400 font-bold' : 'text-amber-400'}>Danger: {b.danger}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ASSET & ANIMATION GALLERY (DEV) */}
            {activeTab === 'DEV_GALLERY' && (
              <AssetGalleryViewer assets={assets} getSpriteRenderer={getSpriteRenderer} />
            )}

            {/* TAB 6: SETTINGS & PERSISTENT STORAGE MANAGEMENT */}
            {activeTab === 'SETTINGS' && (
              <div className="w-full flex flex-col gap-3.5 max-h-[360px] overflow-y-auto pr-1">
                {/* Audio Settings */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span className="font-black text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Volume2 size={14} className="text-amber-400" />
                      Audio & Volume Settings
                    </span>
                  </div>

                  {/* SFX Volume Slider */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Volume2 size={13} className="text-red-400" /> SFX Volume
                      </span>
                      <span className="font-mono text-amber-300 font-bold">{Math.round(sfxVolume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={sfxVolume}
                        onChange={(e) => handleSfxVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 accent-red-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleToggleSfxMute}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                          sfxMuted ? 'bg-red-950 border-red-500 text-red-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}>
                        {sfxMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Music Volume Slider */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Volume2 size={13} className="text-cyan-400" /> Music Volume
                      </span>
                      <span className="font-mono text-cyan-300 font-bold">{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={musicVolume}
                        onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 accent-cyan-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleToggleMusicMute}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                          musicMuted ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}>
                        {musicMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Combat & Gameplay Controls */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span className="font-black text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders size={14} className="text-amber-400" />
                      Combat & Device Control Scheme
                    </span>
                  </div>

                  {/* Device Control Scheme Selector */}
                  <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-red-500/40">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                          <Smartphone size={13} className="text-red-400" />
                          Control Scheme Mode
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Active: <strong className="text-white">{controlScheme === 'AUTO' ? `Auto-Detect (${detectedInputMode})` : controlScheme}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 mt-1">
                      <button
                        type="button"
                        onClick={() => handleControlSchemeChange('AUTO')}
                        className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer border text-center ${
                          controlScheme === 'AUTO'
                            ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-300 shadow'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                        }`}>
                        Auto (Default)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleControlSchemeChange('KEYBOARD')}
                        className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer border text-center flex items-center justify-center gap-1 ${
                          controlScheme === 'KEYBOARD'
                            ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-300 shadow'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                        }`}>
                        <Monitor size={12} className="shrink-0" />
                        <span>PC Keyboard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleControlSchemeChange('TOUCH')}
                        className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer border text-center flex items-center justify-center gap-1 ${
                          controlScheme === 'TOUCH'
                            ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-300 shadow'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                        }`}>
                        <Smartphone size={12} className="shrink-0" />
                        <span>Touch HUD</span>
                      </button>
                    </div>

                    {/* Helpful Scheme Description */}
                    <div className="text-[10px] text-slate-300/90 font-mono mt-1 pt-1 border-t border-slate-900">
                      {controlScheme === 'KEYBOARD' ? (
                        <span>PC Controls: [WASD] Move • [Mouse] Aim • [L-Click] Attack • [Space] Dash • [1-5] Loadout • [R/F] Ultimate • [Esc/P] Pause</span>
                      ) : controlScheme === 'TOUCH' ? (
                        <span>Mobile Touch Controls: Virtual Joystick (Left) • Multitouch Action Cluster (Right) • 1-5 Slots • Dash • Ult</span>
                      ) : (
                        <span>Auto Mode: Dynamically shows touch HUD on touchscreen devices and clean viewport on PC keyboards.</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-cyan-800/40">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-cyan-300">Asset & Animation Gallery (Dev)</span>
                      <span className="text-[10px] text-slate-400">Inspect all 10 Lich summons, 5 bosses, enemies & live animations</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        gameAudio.playCrispClick();
                        setActiveTab('DEV_GALLERY');
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow hover:scale-105 cursor-pointer">
                      LAUNCH INSPECTOR
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-200 font-bold">Auto-Attack / Auto-Cast</span>
                      <span className="text-[10px] text-slate-400">Automatically fire equipped 5-slot abilities when off cooldown</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAutoAttack()}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                        autoAttackEnabled ? 'bg-red-600 text-white shadow' : 'bg-slate-800 text-slate-400'
                      }`}>
                      {autoAttackEnabled ? 'ENABLED' : 'MANUAL'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-200 font-bold">Screen Shake Effects</span>
                      <span className="text-[10px] text-slate-400">Tactile camera impact feedback on critical explosions</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleScreenShake}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                        screenShakeEnabled ? 'bg-amber-600 text-white shadow' : 'bg-slate-800 text-slate-400'
                      }`}>
                      {screenShakeEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-200 font-bold">Floating Damage Numbers</span>
                      <span className="text-[10px] text-slate-400">Density of damage popups in active combat</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCycleDamageDensity}
                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer font-mono">
                      {damageDensity}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-200 font-bold">High Contrast Mode</span>
                      <span className="text-[10px] text-slate-400">Sharpen visuals for enhanced clarity</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleHighContrast}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                        highContrast ? 'bg-cyan-600 text-white shadow' : 'bg-slate-800 text-slate-400'
                      }`}>
                      {highContrast ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* Persistent Storage & Reset Save Data Section */}
                <div className="bg-slate-900/90 border border-red-950 p-4 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span className="font-black text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <HardDrive size={14} className="text-emerald-400" />
                      Persistent Profile & Save Storage
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      Key: {SAVE_STORAGE_KEY}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    All boss progression levels, unlocked skill trees, ability loadouts, harvested souls, altar perks, and high scores are persistently preserved across browser reloads and play sessions.
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="flex flex-col text-[10px] font-mono text-slate-400">
                      <span>Save Version: v1.0 (Auto-Sync)</span>
                      <span>Last Saved: {new Date(lastSavedTimestamp).toLocaleTimeString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={triggerManualSave}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black border border-slate-700 flex items-center gap-1.5 cursor-pointer">
                        <Save size={13} className="text-amber-400" />
                        <span>Save Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          gameAudio.playErrorBuzz();
                          setShowResetConfirmModal(true);
                        }}
                        className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-600/80 text-red-300 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow">
                        <Trash2 size={13} className="text-red-400" />
                        <span>Reset Save Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* IN-RUN DRAFT MODAL */}
      {/* ========================================================================= */}
      {isDraftOpen && (
        <MenuOverlay tone="neutral" zIndex={50}>
          <div className="w-full max-w-2xl bg-slate-950/95 border-2 border-red-500/80 rounded-3xl p-6 shadow-[0_0_60px_rgba(239,68,68,0.3)] flex flex-col items-center backdrop-blur-xl">
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-orange-500 mb-4">
              CHOOSE DEMONIC BOON
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full mb-5">
              {draftOptions.map((skillId) => {
                const def = ALL_CHARACTER_NODES[skillId] || ALL_BOSS_SKILLS[skillId];
                if (!def) return null;
                const cur = simRef.current.skills.get(skillId);
                const nextLvl = cur ? cur.level + 1 : 1;

                return (
                  <div
                    key={skillId}
                    className="bg-slate-900 border-2 border-red-500/80 p-4 rounded-2xl flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="font-black text-base mb-1" style={{ color: def.color }}>{def.name}</div>
                      <p className="text-[11px] text-slate-300 mb-2">{def.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectSkillUpgrade(skillId)}
                      className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white py-2 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer">
                      CLAIM (RANK {nextLvl})
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleRerollDraft}
              className="px-4 py-2 bg-slate-900 border border-red-600 rounded-xl text-xs font-black text-amber-300 flex items-center gap-1.5 cursor-pointer">
              <RefreshCw size={14} />
              <span>REROLL ({rerollCount > 0 ? `${rerollCount} FREE` : '20 GOLD'})</span>
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* DUNGEON MERCHANT */}
      {/* ========================================================================= */}
      {isMerchantOpen && (
        <MenuOverlay tone="neutral" zIndex={50}>
          <div className="w-full max-w-2xl bg-slate-950/95 border-2 border-amber-500/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center backdrop-blur-xl">
            <h2 className="text-xl sm:text-2xl font-black text-yellow-400 mb-3">DUNGEON MERCHANT ({hudGold} Gold)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
              {MERCHANT_ITEMS.map((item) => {
                const count = merchantPurchases[item.id] || 0;
                const cost = Math.floor(item.baseCost * Math.pow(1.25, count));
                const canAfford = hudGold >= cost;

                return (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between gap-2">
                    <span className="font-black text-sm text-white" style={{ color: item.color }}>{item.name}</span>
                    <span className="text-[11px] text-slate-300">{item.desc}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sim = simRef.current;
                        if (sim.gold >= cost) {
                          sim.gold -= cost;
                          setHudGold(sim.gold);
                          setMerchantPurchases({ ...merchantPurchases, [item.id]: count + 1 });
                          if (item.effectType === 'heal') sim.boss.hp = Math.min(sim.boss.maxHp, sim.boss.hp + 250);
                          if (item.effectType === 'resource') sim.boss.resource = Math.min(sim.boss.maxResource + 30, sim.boss.resource + 100);
                          if (item.effectType === 'haste') sim.perkHasteMult *= 0.9;
                          if (item.effectType === 'might') sim.perkDamageMult += 0.12;
                          gameAudio.playPowerupChime();
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-xl font-black text-xs ${canAfford ? 'bg-yellow-600 text-black' : 'bg-slate-800 text-slate-500'}`}>
                      BUY FOR {cost} GOLD
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setIsMerchantOpen(false)}
              className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black text-sm border border-slate-700 cursor-pointer">
              RESUME INVASION
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* PAUSE MENU & IN-RUN SKILLS / SYNERGIES VIEW */}
      {/* ========================================================================= */}
      {isGameMenuOpen && (
        <MenuOverlay tone="neutral" zIndex={60}>
          <div className="w-full max-w-3xl bg-slate-950/95 border-2 border-red-600/50 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center backdrop-blur-2xl">
            <h2 className="text-xl font-black text-amber-300 mb-3">TACTICAL PAUSE & ACTIVE RUN STATS</h2>
            
            <div className="w-full flex flex-col gap-3 mb-4">
              {/* Combat Preferences & Control Scheme in Pause Menu */}
              <div className="flex flex-wrap items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs gap-2">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-200">Auto-Cast Loadout Abilities</span>
                  <span className="text-[10px] text-slate-400">Toggle automatic trigger of equipped 5 loadout slots</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAutoAttack()}
                  className="px-3 py-1 bg-red-600 text-white font-black rounded-lg cursor-pointer">
                  {autoAttackEnabled ? 'AUTO' : 'MANUAL (1-5)'}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs gap-2">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-200">Control Scheme: <strong className="text-amber-300">{controlScheme}</strong></span>
                  <span className="text-[10px] text-slate-400">Switch between Auto, PC Keyboard, or Touch Controls</span>
                </div>
                <div className="flex gap-1">
                  {(['AUTO', 'KEYBOARD', 'TOUCH'] as const).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => handleControlSchemeChange(sc)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                        controlScheme === sc ? 'bg-amber-500 text-black shadow' : 'bg-slate-800 text-slate-400'
                      }`}>
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active In-Run Drafted Skills & Synergies List */}
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Active Run Skills & Synergies ({simRef.current.skills.size})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Acquired this expedition</span>
                </div>

                {simRef.current.skills.size === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-500 italic">
                    No in-run skills drafted yet. Level up during the invasion to claim demonic boons.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {Array.from(simRef.current.skills.entries()).map(([skillId, skillData]) => {
                      const def = ALL_CHARACTER_NODES[skillId] || ALL_BOSS_SKILLS[skillId];
                      return (
                        <div
                          key={skillId}
                          className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex flex-col justify-between gap-1 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-xs text-amber-200 truncate" style={{ color: def?.color || '#ef4444' }}>
                              {def?.name || skillId}
                            </span>
                            <span className="text-[9px] bg-red-950 text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded border border-red-800">
                              Rank {skillData.level}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 line-clamp-2">
                            {def?.desc || 'Demonic boon enhancing combat power.'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setIsGameMenuOpen(false)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-2xl font-black text-sm cursor-pointer shadow">
                RESUME COMBAT
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGameMenuOpen(false);
                  setGameState((prev) => ({ ...prev, status: 'START' }));
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 py-3 px-4 rounded-2xl font-black text-xs border border-slate-800 cursor-pointer">
                MAIN MENU
              </button>
            </div>
          </div>
        </MenuOverlay>
      )}

      {/* RESET SAVE DATA CONFIRMATION MODAL */}
      {showResetConfirmModal && (
        <MenuOverlay tone="danger" zIndex={70}>
          <div className="w-full max-w-md bg-slate-950/98 border-2 border-red-600 rounded-3xl p-6 shadow-[0_0_60px_rgba(239,68,68,0.4)] flex flex-col items-center text-center backdrop-blur-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-950 border border-red-500 flex items-center justify-center mb-3 shadow">
              <Trash2 size={28} className="text-red-400" />
            </div>

            <h3 className="text-xl font-black text-white mb-2">RESET ALL SAVE DATA?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Are you sure you want to completely erase all 5 Boss progression levels, allocated skill points, unlocked loadouts, harvested souls, and high score records? <br />
              <strong className="text-red-400">This action cannot be undone.</strong>
            </p>

            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-black border border-slate-700 cursor-pointer">
                CANCEL
              </button>
              <button
                type="button"
                onClick={resetAllSaveData}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-[0_0_20px_rgba(239,68,68,0.7)] cursor-pointer">
                YES, RESET ALL
              </button>
            </div>
          </div>
        </MenuOverlay>
      )}

      {/* GAME OVER OVERLAY */}
      {gameState.status === 'GAME_OVER' && (
        <Overlay
          title="OVERLORD DEFEATED"
          description={`Waves Cleared: ${runSummary.wavesSurvived} | Slain: ${runSummary.enemiesDefeated} | Souls: ${runSummary.soulsHarvested}`}
          actionLabel="REAWAKEN"
          onAction={initGame}
          icon={<RotateCw size={24} />}
          tone="danger"
        />
      )}

      {/* VICTORY OVERLAY */}
      {gameState.status === 'VICTORY' && (
        <Overlay
          title="REALM OBLITERATED"
          description={`Final Score: ${gameState.score}`}
          actionLabel="REIGN AGAIN"
          onAction={initGame}
          icon={<RotateCw size={24} />}
          tone="victory"
        />
      )}
    </div>
  );
}
