import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { colorScheme } = useTheme()
  const styles = getStyles(colorScheme)

  const handleLogout = async () => {
    await AsyncStorage.removeItem("isAuthenticated");
    router.replace("/");
  }

  return (
    <>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.settings}>
            <TouchableOpacity onPress={() => router.push("/(tabs)/settings")}>
              <Ionicons name="settings-outline" size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.item} onPress={() => router.push("/profile/personal-information")}>
            <Text style={styles.itemText}>Personal Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => router.push("/profile/license")}>
            <Text style={styles.itemText}>Driver License</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => router.push("/profile/card-information")}>
            <Text style={styles.itemText}>Card Information</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  settings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  logoutButtonText: {

    fontFamily: layoutTheme.fonts.inter.regular,
    color: layoutTheme.colors.secondary,
  },
  title: {
    fontSize: 16,
    fontFamily: layoutTheme.fonts.inter.bold,
    color: theme === "dark" ? "white" : "black",
  },
  content: {
    paddingVertical: 16,
    flex: 1,
    gap: 16,
  },
  item: {
    padding: 22,
    borderRadius: 10,
    backgroundColor: theme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.secondary,
  },
  itemText: {
    fontFamily: layoutTheme.fonts.inter.bold,
    fontSize: 18,
    color: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
  }
});