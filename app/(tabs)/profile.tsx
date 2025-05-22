import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const tintColor = useThemeColor(
    { light: "#2e78b7", dark: "#4e98d7" },
    "tint"
  );
  const borderColor = useThemeColor({ light: "#eee", dark: "#222" }, "background");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          setIsLoggingOut(true);
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
      </View>

      <ScrollView style={styles.scrollView}>
        <View
          style={[styles.profileSection, { borderBottomColor: borderColor }]}
        >
          <View style={styles.profileInfo}>
            <View
              style={[styles.avatarContainer, { backgroundColor: tintColor }]}
            >
              <ThemedText style={styles.avatarText}>
                {user?.name.charAt(0).toUpperCase() || "U"}
              </ThemedText>
            </View>
            <View style={styles.userInfoContainer}>
              <ThemedText style={styles.userName}>
                {user?.name || "User"}
              </ThemedText>
              <ThemedText style={styles.userEmail}>
                {user?.email || "user@example.com"}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: borderColor }]}
            onPress={() => {
              /* Navigate to settings */
            }}
          >
            <IconSymbol size={22} name="gear" color={textColor} />
            <ThemedText style={styles.menuItemText}>Settings</ThemedText>
            <IconSymbol
              size={18}
              name="chevron.right"
              color={textColor}
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: borderColor }]}
            onPress={() => {
              /* Navigate to help */
            }}
          >
            <IconSymbol
              size={22}
              name="questionmark.circle"
              color={textColor}
            />
            <ThemedText style={styles.menuItemText}>Help & Support</ThemedText>
            <IconSymbol
              size={18}
              name="chevron.right"
              color={textColor}
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: borderColor }]}
            onPress={() => {
              /* Navigate to about */
            }}
          >
            <IconSymbol size={22} name="info.circle" color={textColor} />
            <ThemedText style={styles.menuItemText}>About</ThemedText>
            <IconSymbol
              size={18}
              name="chevron.right"
              color={textColor}
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: tintColor }]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <ThemedText style={styles.logoutText}>
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfoContainer: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuSection: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  chevron: {
    opacity: 0.5,
  },
  logoutButton: {
    margin: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
