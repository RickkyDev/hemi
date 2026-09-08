import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface DailyReflectionCardProps {
    content: string | null;
}

export default function DailyReflectionCard({
    content,
}: DailyReflectionCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Reflexão amorosa do dia
            </Text>

            {content ? (
                <>
                    <Text style={styles.content}>
                        "{content}"
                    </Text>
                </>
            ) : (
                <Text style={styles.emptyText}>
                    Tock ainda não deixou a reflexão
                    de hoje por aqui.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#1c1c1c',
        borderRadius: 20,
        padding: 24,
        marginTop: 16,
    },
    title: {
        color: 'white',
        fontSize: 19,
        fontWeight: '900',
        marginBottom: 22,
    },
    content: {
        color: '#b5b5b5',
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'center',
    },
    emptyText: {
        color: '#777',
        fontSize: 15,
        lineHeight: 22,
    },
});