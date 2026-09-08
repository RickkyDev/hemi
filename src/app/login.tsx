import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { loginWithAccessCode } from "../services/authService";

export default function LoginScreen() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin() {
    setErrorMessage("");

    if (!accessCode.trim()) {
      setErrorMessage("Digite seu código.");
      return;
    }

    try {
      setIsLoading(true);

      const user = await loginWithAccessCode(accessCode);

      if (!user) {
        setErrorMessage("Código inválido.");
        return;
      }

      router.replace("/home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      setErrorMessage("Não foi possível fazer login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ Hemi</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Insira seu código de acesso</Text>

        <TextInput
          style={styles.input}
          placeholder="Código de acesso"
          placeholderTextColor="#777"
          value={accessCode}
          onChangeText={setAccessCode}
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!isLoading}
        />

        {errorMessage !== "" && (
          <Text style={styles.error}>{errorMessage}</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "white",
    marginBottom: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#1c1c1c",
    borderRadius: 20,
    padding: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
  },
  input: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#292929",
    color: "white",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: {
    color: "#ff6b6b",
    marginTop: 12,
  },
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#101010",
    fontSize: 16,
    fontWeight: "700",
  },
});
