import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { login, setUser } = useAuth();
  const tintColor = "#007AFF";
  const textColor = "#ffffff";
  const placeholderColor = "#888";

  async function handleLogin() {
    setIsSubmitting(true);
    try {
      if (!email || !password) {
        throw Error("Email and password are required");
      }
      const user = await login(email, password);
      if (user) {
        setUser(user);
        router.push("/(tabs)/home");
      } else setUser(null);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.title}>Welcome to Jurnee</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor: placeholderColor },
              ]}
              placeholder="Email"
              placeholderTextColor={placeholderColor}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor: placeholderColor },
              ]}
              placeholder="Password"
              placeholderTextColor={placeholderColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordLink}
            onPress={() => {}}
          >
            <ThemedText
              style={[styles.forgotPasswordText, { color: tintColor }]}
            >
              Forgot password?
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            <ThemedText style={styles.buttonText}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <ThemedText style={styles.footerText}>
              Don&apos;t have an account?{" "}
            </ThemedText>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <ThemedText style={[styles.footerLink, { color: tintColor }]}>
                Sign Up
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "bold",
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default LoginPage;
