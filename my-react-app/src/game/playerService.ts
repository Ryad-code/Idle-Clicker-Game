import { supabase } from '../supabaseClient';
import { Player, Unit, type UnitType } from './types';

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
        row.pos_x ?? 0,
        row.pos_y ?? 0,
        row.value ?? 0
      )
    );

    player.refreshDerivedStats();

    return player;
  } catch (error) {
    console.error('Failed to load player from DB:', error);
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
        points: player.points,
        clickvalue: player.clickValue,
        pointspersecond: player.pointsPerSecond,
        totalclicks: player.totalClicks,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;

    // Replace all unit rows for this user (simple sync strategy)
    const { error: deleteError } = await supabase
      .from('units')
      .delete()
      .eq('player_id', userId);

    if (deleteError) throw deleteError;

    if (player.units.length > 0) {
      const payload = player.units.map(u => ({
        id: u.id,
        player_id: userId,
        type: u.type,
        value: u.value,
        position_x: u.position.x,
        position_y: u.position.y,
      }));

      const { error: insertError } = await supabase
        .from('units')
        .upsert(payload);

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Failed to save player to DB:', error);
    // Silently fail for now; could add user feedback later
  }
}
