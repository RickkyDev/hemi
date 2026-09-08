import { supabase } from '../lib/supabase';
import { getStoredSession } from './authService';

export interface DailyReflection {
    reflection_date: string;
    content: string;
}

export async function getDailyReflection() {
    const session = await getStoredSession();

    if (!session) {
        throw new Error('AUTH_REQUIRED');
    }

    const { data, error } = await supabase.rpc(
        'get_daily_reflection',
        {
            input_code: session.accessCode,
        },
    );

    if (error) {
        throw error;
    }

    if (!data || data.length === 0) {
        return null;
    }

    return data[0] as DailyReflection;
}