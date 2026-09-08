import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { getStoredSession } from '../services/authService';
import LoadingScreen from '../components/loadingScreen';

export default function IndexScreen() {
    useEffect(() => {
        async function checkSession() {
            const session = await getStoredSession();

            if (session) {
                router.replace('/home');
                return;
            }

            router.replace('/login');
        }

        checkSession();
    }, []);

    return <LoadingScreen />;
}