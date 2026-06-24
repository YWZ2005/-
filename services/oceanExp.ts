import { supabase } from '@/lib/supabase';
import type { OceanStage, AssetConfig } from '@/types';
import { OCEAN_STAGES } from '@/data/oceanStages';
import {
  EXP_TEXT_BASE,
  EXP_VOICE_BASE,
  EXP_DRAW_BASE,
  EXP_WARMED_BONUS,
  DEPTH_LOW_THRESHOLD,
  DEPTH_MID_THRESHOLD,
  DEPTH_LOW_MULTIPLIER,
  DEPTH_MID_MULTIPLIER,
  DEPTH_HIGH_MULTIPLIER,
} from '@/lib/constants';

export function calculateExp(params: {
  mediaType: 'text' | 'voice' | 'draw';
  interactionDepth: number;
  isWarmed?: boolean;
}): number {
  const { mediaType, interactionDepth, isWarmed = false } = params;

  let baseExp: number;
  switch (mediaType) {
    case 'text':
      baseExp = EXP_TEXT_BASE;
      break;
    case 'voice':
      baseExp = EXP_VOICE_BASE;
      break;
    case 'draw':
      baseExp = EXP_DRAW_BASE;
      break;
  }

  let multiplier: number;
  if (interactionDepth < DEPTH_LOW_THRESHOLD) {
    multiplier = DEPTH_LOW_MULTIPLIER;
  } else if (interactionDepth <= DEPTH_MID_THRESHOLD) {
    multiplier = DEPTH_MID_MULTIPLIER;
  } else {
    multiplier = DEPTH_HIGH_MULTIPLIER;
  }

  let total = baseExp * multiplier;

  if (isWarmed) {
    total += EXP_WARMED_BONUS;
  }

  return Math.floor(total);
}

export async function grantExp(userId: string, params: {
  mediaType: 'text' | 'voice' | 'draw';
  interactionDepth: number;
  isWarmed?: boolean;
}): Promise<{ success: boolean; gained: number; totalExp: number; error?: string }> {
  const gained = calculateExp(params);

  if (gained <= 0) {
    return { success: true, gained: 0, totalExp: 0 };
  }

  const { data: currentData, error: fetchError } = await supabase
    .from('users')
    .select('ocean_energy')
    .eq('id', userId)
    .single();

  if (fetchError) {
    return { success: false, gained: 0, totalExp: 0, error: fetchError.message };
  }

  const currentEnergy = currentData.ocean_energy ?? 0;
  const newTotal = currentEnergy + gained;

  const { error: updateError } = await supabase
    .from('users')
    .update({ ocean_energy: newTotal })
    .eq('id', userId)
    .gte('ocean_energy', currentEnergy);

  if (updateError) {
    return { success: false, gained: 0, totalExp: 0, error: updateError.message };
  }

  return { success: true, gained, totalExp: newTotal };
}

export function getCurrentStage(totalExp: number): {
  stage: OceanStage;
  nextStage: OceanStage | null;
  progress: number;
  expInStage: number;
  expToNext: number;
} {
  let currentStage: OceanStage = OCEAN_STAGES[0];
  let nextStage: OceanStage | null = null;

  for (let i = 0; i < OCEAN_STAGES.length; i++) {
    const stage = OCEAN_STAGES[i];
    if (totalExp >= stage.minExp && totalExp < stage.maxExp) {
      currentStage = stage;
      nextStage = i < OCEAN_STAGES.length - 1 ? OCEAN_STAGES[i + 1] : null;
      break;
    }
    if (i === OCEAN_STAGES.length - 1 && totalExp >= stage.minExp) {
      currentStage = stage;
      nextStage = null;
    }
  }

  const expInStage = totalExp - currentStage.minExp;
  const expRange = currentStage.maxExp - currentStage.minExp;
  const expToNext = nextStage ? nextStage.minExp - totalExp : 0;
  const progress = nextStage ? expInStage / expRange : 1;

  return {
    stage: currentStage,
    nextStage,
    progress,
    expInStage,
    expToNext,
  };
}

export async function consumeExp(userId: string, amount: number): Promise<{
  success: boolean;
  remaining: number;
  error?: string;
}> {
  if (amount <= 0) {
    return { success: false, remaining: 0, error: '消耗数量必须大于0' };
  }

  const { data: currentData, error: fetchError } = await supabase
    .from('users')
    .select('ocean_energy')
    .eq('id', userId)
    .single();

  if (fetchError) {
    return { success: false, remaining: 0, error: fetchError.message };
  }

  const currentEnergy = currentData.ocean_energy ?? 0;

  if (currentEnergy < amount) {
    return { success: false, remaining: currentEnergy, error: '能量不足' };
  }

  const newTotal = currentEnergy - amount;

  const { error: updateError } = await supabase
    .from('users')
    .update({ ocean_energy: newTotal })
    .eq('id', userId)
    .gte('ocean_energy', amount);

  if (updateError) {
    return { success: false, remaining: currentEnergy, error: updateError.message };
  }

  return { success: true, remaining: newTotal };
}

export function getUnlockedAssets(totalExp: number, allAssets: AssetConfig[]): {
  unlocked: AssetConfig[];
  locked: AssetConfig[];
} {
  const unlocked: AssetConfig[] = [];
  const locked: AssetConfig[] = [];

  for (const asset of allAssets) {
    if (totalExp >= asset.requiredExp) {
      unlocked.push(asset);
    } else {
      locked.push(asset);
    }
  }

  return { unlocked, locked };
}
