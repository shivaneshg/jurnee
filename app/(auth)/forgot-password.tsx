import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const placeholderColor = useThemeColor(
    { light: "#999", dark: "#666" },
    "text"
  );
  const tintColor = useThemeColor(
    { light: "#2e78b7", dark: "#4e98d7" },
    "tint"
  );

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual password reset logic here

      // For now, simulate a successful reset email
      setTimeout(() => {
        setResetSent(true);
        setIsSubmitting(false);
      }, 1500);
    } catch (error: any) {
      setIsSubmitting(false);
      alert("Failed to send reset email. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor }]}
    >
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol size={24} name="chevron.left" color={textColor} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Reset Password</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        {!resetSent ? (
          <>
            <ThemedText style={styles.instructions}>
              Enter your email address and we&apos;ll send you instructions to
              reset your password.
            </ThemedText>

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
                  editable={!isSubmitting}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: tintColor }]}
                onPress={handleResetPassword}
                disabled={isSubmitting}
              >
                <ThemedText style={styles.buttonText}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.successContainer}>
            <IconSymbol
              size={60}
              name="checkmark.circle.fill"
              color={tintColor}
            />
            <ThemedText style={styles.successTitle}>
              Check Your Email
            </ThemedText>
            <ThemedText style={styles.successMessage}>
              We&apos;ve sent password reset instructions to {email}
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: tintColor, marginTop: 30 },
              ]}
              onPress={() => router.replace("/(auth)/login")}
            >
              <ThemedText style={styles.buttonText}>Back to Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 34, // Same width as back button for centering title
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: "center",
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
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
  },
});
