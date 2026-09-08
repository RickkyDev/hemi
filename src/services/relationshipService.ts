import { supabase } from '../lib/supabase';

export async function getRelationship() {
    const { data, error } = await supabase
        .from('relationships')
        .select('start_date')
        .single();

    if (error) {
        throw error;
    }

    return data;
}