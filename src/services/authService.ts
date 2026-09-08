import * as SecureStore from 'expo-secure-store';
import { supabase } from '../lib/supabase';

const sessionKey = 'hemiSession';

type AuthUser = {
    id: number;
    name: string;
};

type AuthSession = {
    accessCode: string;
    user: AuthUser;
};

export async function loginWithAccessCode(
    accessCode: string,
) {
    const normalizedCode = accessCode.trim().toUpperCase();

    const { data, error } = await supabase.rpc(
        'verify_access_code',
        {
            input_code: normalizedCode,
        },
    );

    if (error) {
        throw error;
    }

    if (!data || data.length === 0) {
        return null;
    }

    const user: AuthUser = {
        id: data[0].user_id,
        name: data[0].user_name,
    };

    const session: AuthSession = {
        accessCode: normalizedCode,
        user,
    };

    await SecureStore.setItemAsync(
        sessionKey,
        JSON.stringify(session),
    );

    return user;
}

export async function getStoredSession() {
    const storedSession = await SecureStore.getItemAsync(
        sessionKey,
    );

    if (!storedSession) {
        return null;
    }

    return JSON.parse(storedSession) as AuthSession;
}

export async function logout() {
    await SecureStore.deleteItemAsync(sessionKey);
}