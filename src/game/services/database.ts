import { supabase } from '../../supabaseClient';
import type { GameState } from '../core/types';
import { dbToStateFormat, stateToDBFormat, createDefaultState } from '../core/state';
import { logError } from '../../utils/errorUtils';

/**
 * Load player data from Supabase and convert to GameState
 */
export async function loadPlayerFromDB(userId: string): Promise<GameState> {
  try {
    // Load player record
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (playerError) throw playerError;
    if (!playerData) return createDefaultState();

    // Load units
    const { data: unitsData, error: unitsError } = await supabase
      .from('units')
      .select('*')
      .eq('player_id', userId);

    if (unitsError) throw unitsError;

    // Load active upgrades
    const { data: upgradesData, error: upgradesError } = await supabase
      .from('active_upgrades')
      .select('*')
      .eq('player_id', userId);

    if (upgradesError) throw upgradesError;

    // Convert to GameState
    return dbToStateFormat(playerData, unitsData || [], upgradesData || []);
  } catch (error) {
    logError('loadPlayerFromDB', error);
    return createDefaultState();
  }
}

/**
 * Save GameState to Supabase
 */
export async function savePlayerToDB(userId: string, state: GameState): Promise<void> {
  console.log("saving to DB...");
  try {
    const { player, units, upgrades } = stateToDBFormat(state, userId);

    // Upsert player record (creates if doesn't exist, updates if it does)
    const { error: playerError } = await supabase
      .from('players')
      .upsert(player, { onConflict: 'user_id' });

    if (playerError) throw playerError;

    // Sync units: delete sold units, upsert current ones
    const { data: existingUnits } = await supabase
      .from('units')
      .select('id')
      .eq('player_id', userId);

    const existingIds = new Set((existingUnits || []).map(u => u.id));
    const currentIds = new Set(units.map(u => u.id));

    // Delete sold units
    const toDelete = [...existingIds].filter(id => !currentIds.has(id));
    if (toDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('units')
        .delete()
        .in('id', toDelete);

      if (deleteError) throw deleteError;
    }

    // Upsert current units
    if (units.length > 0) {
      const { error: upsertError } = await supabase
        .from('units')
        .upsert(units);

      if (upsertError) throw upsertError;
    }

    // Sync active upgrades: delete all and insert current
    const { error: deleteUpgradesError } = await supabase
      .from('active_upgrades')
      .delete()
      .eq('player_id', userId);

    if (deleteUpgradesError) throw deleteUpgradesError;

    if (upgrades.length > 0) {
      const { error: insertUpgradesError } = await supabase
        .from('active_upgrades')
        .insert(upgrades);

      if (insertUpgradesError) throw insertUpgradesError;
    }
  } catch (error) {
    logError('savePlayerToDB', error);
    throw error;
  }
}
