// tslint:disable
/* eslint-disable */
/**
 * UndeadProceduralRenderer.ts
 * Master Procedural Sprite Renderer and Animation Controller for all 10 Lich Lord Undead Summons
 * and other minion summons across the Overlord universe.
 *
 * Provides pixel-art Canvas drawing routines with full Idle, Run/Walk, Attack, Hurt, and Death dissolution cycles.
 */

export type SummonAnimationAction = 'IDLE' | 'RUN' | 'ATTACK' | 'HURT' | 'DEATH';

export interface SummonRenderState {
  type: string;
  action: SummonAnimationAction;
  animTimer: number;
  facingRight: boolean;
  scale?: number;
  alpha?: number;
  hurtFlash?: number; // 0..1
  deathProgress?: number; // 0..1
}

export class UndeadProceduralRenderer {
  /**
   * Main render dispatch for all summoned entities
   */
  public static draw(
    ctx: CanvasRenderingContext2D,
    state: SummonRenderState,
    cx: number,
    cy: number,
    baseSize = 48
  ) {
    ctx.save();
    ctx.translate(cx, cy);

    if (state.alpha !== undefined) {
      ctx.globalAlpha = Math.max(0, Math.min(1, state.alpha));
    }

    if (!state.facingRight) {
      ctx.scale(-1, 1);
    }

    const s = state.scale || 1.0;
    ctx.scale(s, s);

    // Death dissolution effect (dissolves into ash/souls upward)
    if (state.action === 'DEATH') {
      const p = state.deathProgress || 0;
      ctx.globalAlpha *= Math.max(0, 1 - p);
      ctx.translate(0, -p * 20);
    }

    // Hurt flash
    if (state.hurtFlash && state.hurtFlash > 0) {
      ctx.filter = `brightness(${1 + state.hurtFlash * 2})`;
    }

    const t = state.animTimer;

    switch (state.type) {
      case 'bone_sentinel':
        this.drawBoneSentinel(ctx, state.action, t);
        break;
      case 'crypt_archer':
        this.drawCryptArcher(ctx, state.action, t);
        break;
      case 'grave_spearman':
        this.drawGraveSpearman(ctx, state.action, t);
        break;
      case 'grave_hound':
        this.drawGraveHound(ctx, state.action, t);
        break;
      case 'bone_mage':
        this.drawBoneMage(ctx, state.action, t);
        break;
      case 'ossuary_guardian':
        this.drawOssuaryGuardian(ctx, state.action, t);
        break;
      case 'wight_captain':
        this.drawWightCaptain(ctx, state.action, t);
        break;
      case 'corpse_collector':
        this.drawCorpseCollector(ctx, state.action, t);
        break;
      case 'dread_abomination':
        this.drawDreadAbomination(ctx, state.action, t);
        break;
      case 'skeletal_dragon':
        this.drawSkeletalDragon(ctx, state.action, t);
        break;
      case 'vampire_bat':
      case 'bloodhunter_bat':
        this.drawVampireBat(ctx, state.action, t, false);
        break;
      case 'crimson_familiar':
        this.drawVampireBat(ctx, state.action, t, true);
        break;
      case 'nightwing_sentinel':
        this.drawNightwingSentinel(ctx, state.action, t);
        break;
      case 'blood_seraph':
        this.drawBloodSeraph(ctx, state.action, t);
        break;
      case 'shadow_clone':
        this.drawShadowClone(ctx, state.action, t);
        break;
      case 'ash_clone':
        this.drawAshClone(ctx, state.action, t);
        break;
      case 'golem_minion':
        this.drawGolemMinion(ctx, state.action, t);
        break;
      default:
        this.drawBoneSentinel(ctx, state.action, t);
        break;
    }

    ctx.restore();
  }

  // =========================================================================
  // 1. BONE SENTINEL (Armored Skeleton Warrior with Skull Shield & Iron Sword)
  // =========================================================================
  private static drawBoneSentinel(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const bob = action === 'RUN' ? Math.sin(t * 14) * 4 : Math.sin(t * 3) * 1.5;
    const legSwing = action === 'RUN' ? Math.sin(t * 14) * 0.5 : 0;
    const swordSwing = action === 'ATTACK' ? Math.sin(t * 20) * 1.4 : Math.sin(t * 3) * 0.1;

    // Ground Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, bob);

    // Legs
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    // Left Leg
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(-6 - Math.sin(legSwing) * 8, 18);
    ctx.stroke();
    // Right Leg
    ctx.beginPath();
    ctx.moveTo(6, 4);
    ctx.lineTo(6 + Math.sin(legSwing) * 8, 18);
    ctx.stroke();

    // Ribcage & Breastplate
    ctx.fillStyle = '#334155';
    ctx.fillRect(-9, -10, 18, 14);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.8;
    // Ribs
    ctx.beginPath();
    ctx.moveTo(-7, -6);
    ctx.lineTo(7, -6);
    ctx.moveTo(-7, -2);
    ctx.lineTo(7, -2);
    ctx.moveTo(-5, 2);
    ctx.lineTo(5, 2);
    ctx.stroke();

    // Horned Iron Helm & Skull
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -18, 9, 0, Math.PI * 2);
    ctx.fill();

    // Helmet Top
    ctx.fillStyle = '#475569';
    ctx.fillRect(-8, -26, 16, 9);
    // Horns
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-8, -22);
    ctx.lineTo(-14, -28);
    ctx.moveTo(8, -22);
    ctx.lineTo(14, -28);
    ctx.stroke();

    // Glowing Cyan Eye Sockets
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 6;
    ctx.fillRect(1, -19, 3, 3);
    ctx.fillRect(-5, -19, 3, 3);
    ctx.shadowBlur = 0;

    // Left Arm & Spiked Skull Shield
    ctx.save();
    ctx.translate(-12, -4);
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Shield Boss Skull Emblem
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(0, -1, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right Arm & Swinging Iron Sword
    ctx.save();
    ctx.translate(10, -4);
    ctx.rotate(action === 'ATTACK' ? -0.8 + swordSwing : 0.2 + swordSwing);
    // Arm bone
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();
    // Sword Guard
    ctx.fillStyle = '#64748b';
    ctx.fillRect(8, -5, 3, 10);
    // Blade
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(11, -3);
    ctx.lineTo(30, 0);
    ctx.lineTo(11, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 2. CRYPT ARCHER (Skeleton Archer Drawing Composite Bone Bow & Arrow)
  // =========================================================================
  private static drawCryptArcher(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const bob = action === 'RUN' ? Math.sin(t * 14) * 3 : Math.sin(t * 3) * 1.5;
    const legSwing = action === 'RUN' ? Math.sin(t * 14) * 0.5 : 0;
    
    // Smooth draw & release cycle
    const attackPhase = (t * 3.5) % 1;
    const isDrawing = action === 'ATTACK';
    const drawBow = isDrawing ? (attackPhase < 0.7 ? attackPhase / 0.7 : Math.max(0, 1 - (attackPhase - 0.7) * 4)) : 0;
    const stringRecoil = isDrawing && attackPhase >= 0.7 ? Math.sin((attackPhase - 0.7) * Math.PI * 4) * 4 : 0;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, bob);

    // Legs
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-5, 4);
    ctx.lineTo(-5 - Math.sin(legSwing) * 7, 18);
    ctx.moveTo(5, 4);
    ctx.lineTo(5 + Math.sin(legSwing) * 7, 18);
    ctx.stroke();

    // Spine & Tattered Leather Armor
    ctx.fillStyle = '#475569';
    ctx.fillRect(-7, -8, 14, 12);
    
    // Quiver on Back with Bone Arrows
    ctx.fillStyle = '#334155';
    ctx.save();
    ctx.rotate(0.3);
    ctx.fillRect(-14, -14, 7, 20);
    // Arrows in quiver
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-13, -14);
    ctx.lineTo(-13, -22);
    ctx.moveTo(-9, -14);
    ctx.lineTo(-9, -24);
    ctx.stroke();
    // Feathers on arrows
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-15, -23, 4, 3);
    ctx.fillRect(-11, -25, 4, 3);
    ctx.restore();

    // Archer Hood & Skull
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -18, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.arc(2, -17, 6, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.fillRect(3, -18, 2.5, 2.5);
    ctx.shadowBlur = 0;

    // Bow & Aiming Arms
    ctx.save();
    ctx.translate(6, -6);
    
    // Left Arm holding composite recurve bow forward
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(14, -2);
    ctx.stroke();

    // Composite Bone Recurve Bow
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(14, -22);
    ctx.quadraticCurveTo(18, -12, 14, -2);
    ctx.quadraticCurveTo(18, 8, 14, 18);
    ctx.stroke();

    // Bow Tips
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(12, -24, 4, 4);
    ctx.fillRect(12, 18, 4, 4);

    // Dynamic Bowstring
    const nockX = 14 - drawBow * 14 + stringRecoil;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(14, -22);
    ctx.lineTo(nockX, -2);
    ctx.lineTo(14, 18);
    ctx.stroke();

    // Right Arm pulling string back
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-6, -2);
    ctx.lineTo(nockX - 4, -1);
    ctx.stroke();

    // Nocked Bone Arrow
    if (!isDrawing || attackPhase < 0.7) {
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nockX, -2);
      ctx.lineTo(nockX + 22, -2);
      ctx.stroke();
      // Arrowhead Glowing Tip
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(nockX + 22, -5);
      ctx.lineTo(nockX + 28, -2);
      ctx.lineTo(nockX + 22, 1);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 3. GRAVE SPEARMAN (Armored Skeleton with Long Piercing Bone Pike)
  // =========================================================================
  private static drawGraveSpearman(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const bob = action === 'RUN' ? Math.sin(t * 14) * 3.5 : Math.sin(t * 3) * 1.5;
    const legSwing = action === 'RUN' ? Math.sin(t * 14) * 0.5 : 0;
    const pikeThrust = action === 'ATTACK' ? Math.sin(t * 22) * 16 : 0;

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, bob);

    // Legs
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(-6 - Math.sin(legSwing) * 8, 18);
    ctx.moveTo(6, 4);
    ctx.lineTo(6 + Math.sin(legSwing) * 8, 18);
    ctx.stroke();

    // Spine & Iron Chestguard
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8, -10, 16, 14);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-8, -10, 16, 14);

    // Conical Iron Helmet & Skull
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -18, 8.5, 0, Math.PI * 2);
    ctx.fill();
    // Helmet
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(-9, -20);
    ctx.lineTo(0, -32);
    ctx.lineTo(9, -20);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(2, -18, 3, 3);
    ctx.fillRect(-4, -18, 3, 3);

    // Long Bone Pike / Spear
    ctx.save();
    ctx.translate(4 + pikeThrust, -6);
    // Spear Shaft
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, 8);
    ctx.lineTo(42, -8);
    ctx.stroke();
    // Spearhead
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(42, -12);
    ctx.lineTo(58, -8);
    ctx.lineTo(42, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Flowing Cyan Tattered Banner on Spear
    ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.beginPath();
    ctx.moveTo(38, -7);
    ctx.lineTo(26, -2 + Math.sin(t * 10) * 4);
    ctx.lineTo(36, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 4. GRAVE HOUND (Quadruped Undead Wolf Lunging on 4 Legs)
  // =========================================================================
  private static drawGraveHound(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const isRunning = action === 'RUN';
    const runCycle = t * 16;
    const lunge = action === 'ATTACK' ? Math.sin(t * 18) * 8 : 0;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(lunge, 0);

    // Front & Back Legs
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    const flAngle = isRunning ? Math.sin(runCycle) * 0.8 : 0;
    const blAngle = isRunning ? -Math.sin(runCycle) * 0.8 : 0;

    // Back Legs
    ctx.beginPath();
    ctx.moveTo(-14, 2);
    ctx.lineTo(-16 + Math.sin(blAngle) * 12, 14);
    ctx.moveTo(-10, 2);
    ctx.lineTo(-8 - Math.sin(blAngle) * 12, 14);
    ctx.stroke();

    // Front Legs
    ctx.beginPath();
    ctx.moveTo(10, 2);
    ctx.lineTo(12 + Math.sin(flAngle) * 12, 14);
    ctx.moveTo(14, 2);
    ctx.lineTo(16 - Math.sin(flAngle) * 12, 14);
    ctx.stroke();

    // Ribcage & Spine
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-16, -2);
    ctx.quadraticCurveTo(0, -6, 14, -2);
    ctx.stroke();

    // Exposed Glowing Ribs
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2;
    for (let i = -10; i <= 8; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, -4);
      ctx.lineTo(i + 1, 4);
      ctx.stroke();
    }

    // Bony Tail
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -2);
    ctx.lineTo(-24 + Math.sin(t * 8) * 4, -8);
    ctx.stroke();

    // Canine Skull Head & Snapping Jaws
    ctx.save();
    ctx.translate(16, -4);
    ctx.fillStyle = '#f8fafc';
    // Upper Skull
    ctx.beginPath();
    ctx.ellipse(4, -4, 9, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Lower Snapping Jaw
    const jawOpen = action === 'ATTACK' ? 6 : 2;
    ctx.beginPath();
    ctx.ellipse(3, 2 + jawOpen, 7, 3, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Sharp Fangs
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(8, -2, 2, 4);
    // Glowing Eye
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(2, -6, 3, 3);
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 5. BONE MAGE (Skeletal Sorcerer in Tattered Robes with Skull Staff)
  // =========================================================================
  private static drawBoneMage(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const floatBob = Math.sin(t * 4) * 4;
    const isAttacking = action === 'ATTACK';
    const castGlow = isAttacking ? Math.sin(t * 16) * 0.5 + 0.5 : 0.2;
    const staffAngle = isAttacking ? -0.4 + Math.sin(t * 12) * 0.15 : 0.1;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, floatBob);

    // Tattered Flowing Necrotic Robes
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-10, -6);
    ctx.lineTo(-14 + Math.sin(t * 6) * 3, 16);
    ctx.lineTo(14 + Math.cos(t * 6) * 3, 16);
    ctx.lineTo(10, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Skeletal Hands
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(-14, isAttacking ? -12 : 2);
    ctx.moveTo(8, -4);
    ctx.lineTo(12, isAttacking ? -14 : -2);
    ctx.stroke();

    // Robed Hood & Floating Skull
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -18, 11, 0, Math.PI * 2);
    ctx.fill();
    // Skull
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -18, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Sorcerer Eyes
    ctx.fillStyle = '#0ea5e9';
    ctx.shadowColor = '#0ea5e9';
    ctx.shadowBlur = 8;
    ctx.fillRect(1, -19, 3, 3);
    ctx.fillRect(-5, -19, 3, 3);
    ctx.shadowBlur = 0;

    // Skull Staff Raised Overhead during attack
    ctx.save();
    ctx.translate(12, isAttacking ? -16 : -8);
    ctx.rotate(staffAngle);
    
    // Staff Shaft
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(0, -18);
    ctx.stroke();
    
    // Staff Top Skull Orb
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -22, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Casting Necrotic Crystal with Arcane Glyphs
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12 * (1 + castGlow);
    ctx.beginPath();
    ctx.arc(0, -32, 5 + castGlow * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Glowing Arcane Rune Ring rotating overhead
    if (isAttacking) {
      ctx.save();
      ctx.translate(0, -32);
      ctx.rotate(t * 5);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.stroke();
      for (let r = 0; r < 4; r++) {
        const ra = (r / 4) * Math.PI * 2;
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(Math.cos(ra) * 14 - 1.5, Math.sin(ra) * 14 - 1.5, 3, 3);
      }
      ctx.restore();
    }

    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 6. OSSUARY GUARDIAN (Heavy Armored Fortress Skeleton with Tower Shield)
  // =========================================================================
  private static drawOssuaryGuardian(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const bob = action === 'RUN' ? Math.sin(t * 10) * 3 : Math.sin(t * 2) * 1;
    const bash = action === 'ATTACK' ? Math.sin(t * 18) * 12 : 0;

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.ellipse(0, 24, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(bash, bob);

    // Thick Armored Greaves
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.fillRect(-12, 6, 8, 16);
    ctx.fillRect(4, 6, 8, 16);

    // Massive Iron Plate Chest
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-16, -14, 32, 20);
    ctx.strokeRect(-16, -14, 32, 20);

    // Spiked Shoulder Pauldrons
    ctx.fillStyle = '#475569';
    ctx.fillRect(-22, -18, 10, 10);
    ctx.fillRect(12, -18, 10, 10);

    // Armored Greathelm with Glowing Slit
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10, -28, 20, 15);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.fillRect(-6, -22, 12, 3);
    ctx.shadowBlur = 0;

    // Spiked Tower Shield
    ctx.save();
    ctx.translate(14, -4);
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-4, -20, 16, 40, 4);
    } else {
      ctx.rect(-4, -20, 16, 40);
    }
    ctx.fill();
    ctx.stroke();
    // Shield Spikes
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(12, -12, 6, 4);
    ctx.fillRect(12, 0, 6, 4);
    ctx.fillRect(12, 12, 6, 4);
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 7. WIGHT CAPTAIN (Ancient Armored Warlord with Glowing Spectral Crown)
  // =========================================================================
  private static drawWightCaptain(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const bob = Math.sin(t * 4) * 2;
    const swordSwing = action === 'ATTACK' ? Math.sin(t * 18) * 1.2 : 0;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, bob);

    // Flowing Crimson/Purple Cape
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.moveTo(-12, -12);
    ctx.lineTo(-20 + Math.sin(t * 5) * 6, 18);
    ctx.lineTo(8 + Math.cos(t * 5) * 4, 18);
    ctx.lineTo(12, -12);
    ctx.closePath();
    ctx.fill();

    // Legs
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(-6, 20);
    ctx.moveTo(6, 4);
    ctx.lineTo(6, 20);
    ctx.stroke();

    // Breastplate
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-10, -12, 20, 16);

    // Skull & Spectral Glowing Crown
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -20, 9, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Violet Crown
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-10, -26);
    ctx.lineTo(-8, -34);
    ctx.lineTo(-4, -28);
    ctx.lineTo(0, -36);
    ctx.lineTo(4, -28);
    ctx.lineTo(8, -34);
    ctx.lineTo(10, -26);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Glowing Eyes
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(1, -21, 3, 3);
    ctx.fillRect(-5, -21, 3, 3);

    // Twin Spectral Blades
    ctx.save();
    ctx.translate(12, -6);
    ctx.rotate(0.3 + swordSwing);
    ctx.fillStyle = '#c084fc';
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(26, 0);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 8. CORPSE COLLECTOR (Hunched Hooded Ghoul Gathering Soul Essence)
  // =========================================================================
  private static drawCorpseCollector(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const bob = action === 'RUN' ? Math.sin(t * 12) * 3 : Math.sin(t * 3) * 1.5;

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, bob);

    // Heavy Sack of Souls on Back
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(-12, -6, 12, 0, Math.PI * 2);
    ctx.fill();
    // Glowing Soul Wisps from Sack
    ctx.fillStyle = '#34d399';
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(-14 + Math.sin(t * 6) * 3, -16 + Math.cos(t * 6) * 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Hunched Body
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(0, -2, 11, 14, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Hood & Hidden Face
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(8, -14, 9, 0, Math.PI * 2);
    ctx.fill();
    // Glowing Green Eye
    ctx.fillStyle = '#10b981';
    ctx.fillRect(11, -15, 3, 3);

    // Lantern on Stick
    ctx.save();
    ctx.translate(14, -6);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(0, -14);
    ctx.lineTo(8, -10);
    ctx.stroke();
    // Green Soul Lantern
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.fillRect(6, -8, 6, 8);
    ctx.shadowBlur = 0;
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 9. DREAD ABOMINATION (Massive Stitched Multi-Limbed Flesh/Bone Titan)
  // =========================================================================
  private static drawDreadAbomination(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const bob = action === 'RUN' ? Math.sin(t * 8) * 4 : Math.sin(t * 2) * 1.5;
    const slam = action === 'ATTACK' ? Math.sin(t * 16) * 18 : 0;

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath();
    ctx.ellipse(0, 28, 32, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, bob + slam);

    // Massive Stitched Flesh Legs
    ctx.fillStyle = '#475569';
    ctx.fillRect(-18, 8, 14, 20);
    ctx.fillRect(4, 8, 14, 20);

    // Colossal Torso with Stitches & Bones
    ctx.fillStyle = '#334155';
    ctx.fillRect(-24, -18, 48, 28);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.8;
    // Red Stitches
    ctx.beginPath();
    ctx.moveTo(-16, -14);
    ctx.lineTo(16, 4);
    ctx.moveTo(0, -18);
    ctx.lineTo(0, 10);
    ctx.stroke();

    // Exposed Glowing Ribcage
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.strokeRect(-12, -10, 24, 16);

    // Stitched Head & Jaw
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(0, -28, 14, 0, Math.PI * 2);
    ctx.fill();
    // Metal Plate on Head
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-10, -36, 20, 8);
    // Glowing Red Eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-6, -30, 4, 4);
    ctx.fillRect(4, -30, 4, 4);

    // Massive Dual Stitched Fists
    ctx.save();
    ctx.translate(-28, -6);
    ctx.fillStyle = '#475569';
    ctx.fillRect(-6, 0, 14, 18);
    ctx.restore();

    ctx.save();
    ctx.translate(28, -6);
    ctx.fillStyle = '#475569';
    ctx.fillRect(-6, 0, 14, 18);
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 10. SKELETAL DRAGON (Colossal Flying Skeletal Dragon with Bony Wings & Breath)
  // =========================================================================
  private static drawSkeletalDragon(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const flap = Math.sin(t * 8) * 16;
    const hoverBob = Math.sin(t * 4) * 6;
    const breath = action === 'ATTACK';

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.ellipse(0, 36, 42, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, hoverBob);

    // Long Articulated Skeletal Tail
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-20, 4);
    ctx.quadraticCurveTo(-38, 8 + Math.sin(t * 6) * 6, -56, -2 + Math.sin(t * 6) * 10);
    ctx.stroke();

    // Dragon Ribcage & Spine
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(24, -4);
    ctx.stroke();

    // Rib Arcs
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    for (let r = -12; r <= 18; r += 6) {
      ctx.beginPath();
      ctx.arc(r, 4, 10, 0, Math.PI);
      ctx.stroke();
    }

    // Colossal Bony Wings
    // Left Wing
    ctx.save();
    ctx.translate(0, -6);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-24, -28 + flap);
    ctx.lineTo(-50, -18 + flap * 1.2);
    ctx.stroke();
    // Wing Membrane Ribs
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-24, -28 + flap);
    ctx.lineTo(-20, 10);
    ctx.moveTo(-50, -18 + flap * 1.2);
    ctx.lineTo(-34, 12);
    ctx.stroke();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.translate(10, -6);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(24, -28 + flap);
    ctx.lineTo(50, -18 + flap * 1.2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(24, -28 + flap);
    ctx.lineTo(20, 10);
    ctx.moveTo(50, -18 + flap * 1.2);
    ctx.lineTo(34, 12);
    ctx.stroke();
    ctx.restore();

    // Dragon Skull Head with Ice Horns
    ctx.save();
    ctx.translate(28, -8);
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(8, -2, 16, 9, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Ice Horns
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(2, -8);
    ctx.lineTo(-12, -22);
    ctx.moveTo(8, -8);
    ctx.lineTo(-4, -24);
    ctx.stroke();

    // Glowing Frost Eye
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.fillRect(8, -6, 5, 5);
    ctx.shadowBlur = 0;

    // Necrotic Frost Breath Stream
    if (breath) {
      ctx.save();
      ctx.translate(22, 0);
      for (let p = 0; p < 8; p++) {
        const offsetAngle = (Math.random() - 0.5) * 0.4;
        const dist = 30 + Math.random() * 60;
        ctx.fillStyle = Math.random() > 0.5 ? '#38bdf8' : '#e0f2fe';
        ctx.beginPath();
        ctx.arc(
          Math.cos(offsetAngle) * dist,
          Math.sin(offsetAngle) * dist,
          4 + Math.random() * 6,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // VAMPIRE BAT & FAMILIAR
  // =========================================================================
  private static drawVampireBat(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number, isFamiliar = false) {
    const flap = Math.sin(t * 18) * 10;
    const size = isFamiliar ? 1.4 : 1.0;
    ctx.scale(size, size);

    // Body
    ctx.fillStyle = isFamiliar ? '#9f1239' : '#881337';
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = isFamiliar ? '#be123c' : '#e11d48';
    ctx.beginPath();
    ctx.moveTo(-16, flap);
    ctx.lineTo(-6, -4);
    ctx.lineTo(0, 0);
    ctx.lineTo(6, -4);
    ctx.lineTo(16, flap);
    ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();

    // Glowing Ruby Eyes
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-3, -6, 2, 2);
    ctx.fillRect(2, -6, 2, 2);
  }

  // =========================================================================
  // NIGHTWING SENTINEL (Gargoyle)
  // =========================================================================
  private static drawNightwingSentinel(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const flap = Math.sin(t * 8) * 8;
    ctx.fillStyle = '#475569';
    ctx.fillRect(-10, -10, 20, 22);

    // Stone Wings
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(-24, -14 + flap);
    ctx.lineTo(-8, -4);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(24, -14 + flap);
    ctx.lineTo(8, -4);
    ctx.lineTo(8, 8);
    ctx.closePath();
    ctx.fill();

    // Glowing Eyes
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-4, -6, 3, 3);
    ctx.fillRect(2, -6, 3, 3);
  }

  // =========================================================================
  // BLOOD SERAPH (6-Winged Crimson Angel)
  // =========================================================================
  private static drawBloodSeraph(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    const flap = Math.sin(t * 6) * 12;

    // 6 Wings
    ctx.fillStyle = 'rgba(236, 72, 153, 0.7)';
    for (let w = -1; w <= 1; w++) {
      ctx.beginPath();
      ctx.moveTo(-28, w * 12 + flap);
      ctx.lineTo(0, w * 6);
      ctx.lineTo(28, w * 12 + flap);
      ctx.lineTo(0, w * 6 + 8);
      ctx.closePath();
      ctx.fill();
    }

    // Angel Body
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blood Halo
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -22, 12, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // =========================================================================
  // SHADOW CLONE
  // =========================================================================
  private static drawShadowClone(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    ctx.fillStyle = 'rgba(107, 33, 168, 0.8)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Amethyst Spectral Scythe
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(14, -8, 14, 0, Math.PI);
    ctx.stroke();
  }

  // =========================================================================
  // ASH CLONE
  // =========================================================================
  private static drawAshClone(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    ctx.fillStyle = 'rgba(234, 88, 12, 0.85)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flaming Sword
    ctx.fillStyle = '#f97316';
    ctx.fillRect(10, -18, 5, 30);
  }

  // =========================================================================
  // GOLEM MINION (Living Stone)
  // =========================================================================
  private static drawGolemMinion(ctx: CanvasRenderingContext2D, action: SummonAnimationAction, t: number) {
    ctx.fillStyle = '#059669';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-12, -16, 24, 28, 4);
    } else {
      ctx.rect(-12, -16, 24, 28);
    }
    ctx.fill();
    ctx.stroke();

    // Emerald Eyes
    ctx.fillStyle = '#6ee7b7';
    ctx.fillRect(-6, -10, 4, 4);
    ctx.fillRect(2, -10, 4, 4);
  }
}
