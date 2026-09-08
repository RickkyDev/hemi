// General imports
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

// Screens and cards
import LoadingScreen from '../../components/loadingScreen';
import DailyReflectionCard from "../../components/dailyReflection";
import RelationshipTime from "../../components/relationshipTime";

// Modules
import { getStoredSession, logout } from "../../services/authService";
import { DailyReflection, getDailyReflection } from "../../services/reflectionService";
import { getRelationship } from "../../services/relationshipService";
import { getGreetings } from '../../services/greetingService';
import { getRandomGreeting } from '../../utils/greetingUtils';

export default function HomeScreen() {
  const [startDate, setStartDate] = useState<Date | null>(null);

  const [userName, setUserName] = useState("");

  const [reflection, setReflection] = useState<DailyReflection | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [greeting, setGreeting] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadHome() {
        try {
          setIsLoading(true);

          const session = await getStoredSession();

          if (!session) {
            router.replace("/login");
            return;
          }

          const greetings = await getGreetings();

          const selectedGreeting =
              getRandomGreeting(greetings);

          if (!isActive) {
              return;
          }

          setGreeting(selectedGreeting);

          const [relationship, dailyReflection] = await Promise.all([
            getRelationship(),
            getDailyReflection(),
          ]);

          if (!isActive) {
            return;
          }

          setUserName(session.user.name);

          setStartDate(new Date(relationship.start_date));

          setReflection(dailyReflection);
        } catch (error) {
          console.error("Erro ao carregar Home:", error);

          if (error instanceof Error && error.message === "AUTH_REQUIRED") {
            router.replace("/login");
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      loadHome();

      const channel = supabase
        .channel("daily-reflection")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "daily_reflection",
          },
          (payload) => {
            if (!isActive) {
              return;
            }

            const newReflection = payload.new;

            setReflection({
              reflection_date: newReflection.reflection_date,
              content: newReflection.content,
            });
          },
        )
        .subscribe((status) => {
          console.log("Tock Realtime:", status);
        });

      return () => {
        isActive = false;

        supabase.removeChannel(channel);
      };
    }, []),
  );

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (isLoading) {
      return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ Hemi</Text>

      <Text style={styles.userName}>{greeting}, {userName}!</Text>

      {startDate && <RelationshipTime startDate={startDate} />}

      {!isLoading && (
        <DailyReflectionCard content={reflection?.content ?? null} />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center",
    padding: 24,
    paddingTop: 70,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    color: "#bdbdbd",
    marginBottom: 24,
  },
  logoutButton: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1c1c1c",
  },
  logoutText: {
    color: "#bdbdbd",
    fontSize: 15,
  },
});
