import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { layoutTheme } from "@/config/theme";
import AddCardForm from "@/components/screens/profile/add-card/add-card.form";

const ProfileAddCardScreen = () => {
    const { colorScheme } = useTheme();
    const isDark = colorScheme === "dark";

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? layoutTheme.colors.primary : "#FFFFFF" }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: isDark ? "white" : "black" }]}>Yeni Kart Əlavə Et</Text>
                <View style={{ width: 40 }} />
            </View>
            
            <AddCardForm />
        </SafeAreaView>
    );
};

export default ProfileAddCardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
});