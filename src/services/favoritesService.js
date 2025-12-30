import { supabase } from '../config/supabaseClient';

export const addFavorite = async (itemType, itemId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, item_type: itemType, item_id: itemId })
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Added to favorites');
    return data;
  } catch (error) {
    console.error('❌ Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (itemType, itemId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .eq('item_id', itemId);

    if (error) throw error;
    console.log('✅ Removed from favorites');
    return true;
  } catch (error) {
    console.error('❌ Error removing favorite:', error);
    throw error;
  }
};

export const isFavorite = async (itemType, itemId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    return false;
  }
};

export const getFavoriteVenues = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: favorites } = await supabase
      .from('favorites')
      .select('item_id')
      .eq('user_id', user.id)
      .eq('item_type', 'venue');

    if (!favorites || favorites.length === 0) return [];

    const { data: venues } = await supabase
      .from('venues')
      .select('*')
      .in('id', favorites.map(f => f.item_id));

    return venues || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getFavoriteEvents = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: favorites } = await supabase
      .from('favorites')
      .select('item_id')
      .eq('user_id', user.id)
      .eq('item_type', 'event');

    if (!favorites || favorites.length === 0) return [];

    const { data: events } = await supabase
      .from('events')
      .select('*')
      .in('id', favorites.map(f => f.item_id));

    return events || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getFavoriteDeals = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: favorites } = await supabase
      .from('favorites')
      .select('item_id')
      .eq('user_id', user.id)
      .eq('item_type', 'deal');

    if (!favorites || favorites.length === 0) return [];

    const { data: deals } = await supabase
      .from('deals')
      .select('*, venues!deals_venue_id_fkey(name)')
      .in('id', favorites.map(f => f.item_id));

    return deals || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};