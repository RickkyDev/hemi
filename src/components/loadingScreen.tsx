import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Hemi
            </Text>

            <ActivityIndicator
                size="large"
            />

            <Text style={styles.text}>
                Carregando...
            </Text>
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
    title: {
        color: 'white',
        fontSize: 36,
        fontWeight: '900',
        marginBottom: 24,
    },
    text: {
        color: '#777',
        fontSize: 15,
        marginTop: 16,
    },
});