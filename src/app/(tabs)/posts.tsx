import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PostsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                💌 Textinhos
            </Text>

            <Text style={styles.text}>
                Em breve...
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
        fontSize: 28,
        fontWeight: '700',
    },
    text: {
        color: '#bdbdbd',
        fontSize: 16,
        marginTop: 12,
    },
});