import { supabase } from './supabase';

export interface ProfileGamification {
  xp: number;
  energy: number;
  streak: number;
  energy_last_updated: string;
  last_activity_date: string | null;
}

const MAX_ENERGY = 5;
const ENERGY_REGEN_TIME_MS = 1000 * 60 * 60 * 2; // 2 hours per energy unit

/**
 * Calculates and updates user energy based on time passed.
 */
export async function syncUserEnergy(userId: string, currentProfile: ProfileGamification) {
  const lastUpdated = new Date(currentProfile.energy_last_updated).getTime();
  const now = Date.now();
  const timePassed = now - lastUpdated;
  
  if (currentProfile.energy >= MAX_ENERGY) {
    return currentProfile.energy;
  }

  const energyToRegen = Math.floor(timePassed / ENERGY_REGEN_TIME_MS);
  
  if (energyToRegen > 0) {
    const newEnergy = Math.min(MAX_ENERGY, currentProfile.energy + energyToRegen);
    const newLastUpdated = new Date(lastUpdated + (energyToRegen * ENERGY_REGEN_TIME_MS)).toISOString();

    const { error } = await supabase
      .from('profiles')
      .update({ 
        energy: newEnergy, 
        energy_last_updated: newLastUpdated 
      })
      .eq('id', userId);

    if (error) console.error("Error syncing energy:", error);
    return newEnergy;
  }

  return currentProfile.energy;
}

/**
 * Handles XP gain and streak logic after a successful activity.
 */
export async function recordActivity(userId: string, currentProfile: ProfileGamification, quizScore: number) {
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = currentProfile.last_activity_date;
  
  let newStreak = currentProfile.streak;
  let newXP = currentProfile.xp + 10; // Base XP for completion
  
  // Bonus XP for perfect score
  if (quizScore === 100) {
    newXP += 15;
  }

  // Streak logic
  if (!lastActivity) {
    newStreak = 1;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActivity === yesterdayStr) {
        newStreak += 1;
    } else if (lastActivity !== today) {
        newStreak = 1; // Reset if they missed a day
    }
    // If lastActivity === today, streak stays the same
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      xp: newXP, 
      streak: newStreak,
      last_activity_date: today
    })
    .eq('id', userId);

  if (error) console.error("Error recording activity:", error);
  return { newXP, newStreak };
}

/**
 * Deducts energy for starting an activity.
 */
export async function useEnergy(userId: string, currentEnergy: number) {
  if (currentEnergy <= 0) return false;

  const { error } = await supabase
    .from('profiles')
    .update({ energy: currentEnergy - 1 })
    .eq('id', userId);

  if (error) {
    console.error("Error using energy:", error);
    return false;
  }
  return true;
}
