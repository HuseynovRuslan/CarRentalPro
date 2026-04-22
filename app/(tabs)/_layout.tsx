import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: layoutTheme.colors.secondary,
            tabBarInactiveTintColor: "#888",
        }} >
            <Tabs.Screen name="index" options={{
                title: "",
                tabBarIcon: ({ color, size }) => <Ionicons name="location" color={color} size={size + 4} />
            }}
            />
            <Tabs.Screen name="favorite"
                options={{
                    title: "",
                    tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size + 4} />
                }}
            />
            <Tabs.Screen name="notifications"
                options={{
                    title: "",
                    tabBarIcon: ({ color, size }) => <Ionicons name="notifications" color={color} size={size + 4} />
                }}
            />
            <Tabs.Screen name="profile"
                options={{
                    title: "",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size + 4} />
                }}
            />

            {/* Hidden tabs */}
            <Tabs.Screen name="car-list" options={{ title: "", href: null }} />
            <Tabs.Screen name="settings" options={{ title: "", href: null }} />
            <Tabs.Screen name="location" options={{ title: "", href: null }} />
            <Tabs.Screen name="profile/personal-information" options={{ title: "", href: null }} />
            <Tabs.Screen name="profile/license" options={{ title: "", href: null }} />
            <Tabs.Screen name="profile/card-information" options={{ title: "", href: null }} />
            <Tabs.Screen name="profile/add-card" options={{ title: "", href: null }} />
        </Tabs >
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    tabBar: {
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
        height: 70,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    }
})