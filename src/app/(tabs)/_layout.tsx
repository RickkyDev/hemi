import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomTabBar({
    state,
    descriptors,
    navigation,
}: any) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    bottom: Math.max(insets.bottom, 36), // mudar altura da nav-pill
                },
            ]}
        >
            <View style={styles.tabBar}>
                {state.routes.map(
                    (route: any, index: number) => {
                        const { options } =
                            descriptors[route.key];

                        const label =
                            options.title ??
                            route.name;

                        const isFocused =
                            state.index === index;

                        const color = isFocused
                            ? 'white'
                            : '#777';

                        function handlePress() {
                            const event =
                                navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });

                            if (
                                !isFocused &&
                                !event.defaultPrevented
                            ) {
                                navigation.navigate(
                                    route.name,
                                );
                            }
                        }

                        return (
                            <Pressable
                                key={route.key}
                                onPress={handlePress}
                                style={[
                                    styles.tab,
                                    isFocused &&
                                        styles.activeTab,
                                ]}
                            >
                                {options.tabBarIcon?.({
                                    focused: isFocused,
                                    color,
                                    size: 23,
                                })}

                                <Text
                                    style={[
                                        styles.tabText,
                                        isFocused &&
                                            styles.activeTabText,
                                    ]}
                                >
                                    {label}
                                </Text>
                            </Pressable>
                        );
                    },
                )}
            </View>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => (
                <CustomTabBar {...props} />
            )}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Início',
                    tabBarIcon: ({
                        color,
                        focused,
                    }) => (
                        <Ionicons
                            name={
                                focused
                                    ? 'home'
                                    : 'home-outline'
                            }
                            color={color}
                            size={23}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="posts"
                options={{
                    title: 'Textinhos',
                    tabBarIcon: ({
                        color,
                        focused,
                    }) => (
                        <Ionicons
                            name={
                                focused
                                    ? 'heart'
                                    : 'heart-outline'
                            }
                            color={color}
                            size={23}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(28, 28, 28, 0.6)',
        borderRadius: 999,
        padding: 6,
    },
    tab: {
        minWidth: 88,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    tabText: {
        color: '#777',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 3,
    },
    activeTabText: {
        color: 'white',
    },
});