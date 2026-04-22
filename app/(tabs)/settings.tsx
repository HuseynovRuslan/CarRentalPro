import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
    const { colorScheme, toggleTheme } = useTheme();
    const styles = getStyles(colorScheme);

    const handleToggleTheme = () => {
        toggleTheme(colorScheme === "dark" ? "light" : "dark")
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
                    <Ionicons name="chevron-back" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
            </View>
            <View style={styles.settings}>
                <Text style={styles.title}>Theme</Text>
                <Switch
                    value={colorScheme === "dark"}
                    onValueChange={handleToggleTheme}
                    trackColor={{ true: "white", false: "black" }}
                    thumbColor={colorScheme === "dark" ? layoutTheme.colors.secondary : layoutTheme.colors.white}
                />
            </View>
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? "white" : "black",
    },
    settings: {
        width: "100%",
        padding: 16,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    }
});