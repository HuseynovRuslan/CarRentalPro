import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CardInformation() {
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={colorScheme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Card Information</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.contentHeader}>

                    <Text style={styles.contentTitle}>Cards</Text>
                    <TouchableOpacity style={styles.addCardButton} onPress={() => router.push("/profile/add-card")}>
                        <Ionicons
                            name="add"
                            size={24}
                            color={layoutTheme.colors.secondary}
                        />
                        <Text style={styles.addCardButtonText}>Add Card</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark"
            ? layoutTheme.colors.primary
            : layoutTheme.colors.white,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    content: {
        flex: 1,
    },
    contentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
    },
    contentTitle: {
        fontSize: 24,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: layoutTheme.colors.secondary,
    },
    addCardButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: layoutTheme.colors.secondary,
        borderRadius: 8,
        padding: 8,

    },
    addCardButtonText: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.regular,
        color: layoutTheme.colors.secondary,
    },
})