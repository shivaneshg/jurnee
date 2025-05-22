import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function RootIndex() {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading state or return null while checking authentication status
  if (loading) {
    return null;
  }

  // Redirect based on authentication state
  return (
    <View style={{ flex: 1 }}>
      {isAuthenticated ? (
        <Redirect href="/(tabs)" />
      ) : (
        <Redirect href="/(auth)/login" />
      )}
    </View>
  );
}
