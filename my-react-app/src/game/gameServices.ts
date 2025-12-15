import { supabase } from '../supabaseClient';
import { Player, Unit, type UnitType } from './types';
import { logError } from '../utils/errorUtils';

/**
 * Fetch player data from Supabase and convert to Player instance
 * @param userId - The authenticated user's ID
 * @returns Player instance populated with DB data, or new Player if fetch fails
 */
export async function loadPlayerFromDB(userId: string): Promise<Player> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .single(); // Expect exactly one row

    if (error) throw error;
    if (!data) return new Player(); // Should not happen with trigger, but fallback

    // Deserialize DB row into Player instance
    const player = new Player(
      data.points || 0,
      data.clickvalue || 1,
      data.pointspersecond || 0
    );
    player.totalClicks = data.totalclicks || 0;

    // Load units for this user
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('*')
      .eq('player_id', userId);

    if (unitsError) throw unitsError;

    player.units = (units || []).map(row =>
      new Unit(
        row.id,
        row.type as UnitType,
        row.position_x ?? 0,
        row.position_y ?? 0,
        row.value ?? 0
      )
    );

    player.refreshDerivedStats();

    return player;
  } catch (error) {
    logError('loadPlayerFromDB', error);
    return new Player(); // Return default on error
  }
}

/**
 * Save player data to Supabase
 * @param userId - The authenticated user's ID
 * @param player - Player instance to save
 */
export async function savePlayerToDB(userId: string, player: Player): Promise<void> {
  try {
    const { error } = await supabase
      .from('players')
      .update({
        points: Math.floor(player.points),
        clickvalue: Math.floor(player.clickValue),
        pointspersecond: Math.floor(player.pointsPerSecond),
        totalclicks: Math.floor(player.totalClicks),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;

    // Sync units: delete sold units, upsert current ones
    const { data: existingUnits } = await supabase
      .from('units')
      .select('id')
      .eq('player_id', userId);

    const existingIds = new Set((existingUnits || []).map(u => u.id));
    const currentIds = new Set(player.units.map(u => u.id));

    // Delete units that exist in DB but not in player.units (sold units)
    const toDelete = [...existingIds].filter(id => !currentIds.has(id));
    if (toDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('units')
        .delete()
        .in('id', toDelete);

      if (deleteError) throw deleteError;
    }

    // Upsert current units (creates new, updates existing)
    if (player.units.length > 0) {
      const payload = player.units.map(u => ({
        id: u.id,
        player_id: userId,
        type: u.type,
        value: u.value,
        position_x: u.position.x,
        position_y: u.position.y,
      }));

      const { error: upsertError } = await supabase
        .from('units')
        .upsert(payload);

      if (upsertError) throw upsertError;
    }
  } catch (error) {
    logError('savePlayerToDB', error);
    // Silently fail; user feedback handled in context
  }
}
