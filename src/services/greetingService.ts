import { supabase } from '../lib/supabase';

export interface Greeting {
    id: number;
    greeting: string;
}

export async function getGreetings() {
    const { data, error } = await supabase
        .from('greetings')
        .select('id, greeting');

    if (error) {
        throw error;
    }

    return (data ?? []) as Greeting[];
}