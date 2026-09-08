import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { getStoredSession } from '../services/authService';

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

    return (
        <View style={styles.container}>
            <ActivityIndicator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101010',
        alignItems: 'center',
        justifyContent: 'center',
    },
});