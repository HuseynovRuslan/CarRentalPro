import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCardStore } from "@/state/cardsStore";

export default function CardInformation() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const { cards } = useCardStore();

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
                <Text style={styles.headerTitle}>Kart Məlumatları</Text>
                <View style={{ width: 24 }} />
            </View>
            
            <View style={styles.content}>
                <View style={styles.contentHeader}>
                    <Text style={styles.contentTitle}>Kartlarım</Text>
                    <TouchableOpacity style={styles.addCardButton} onPress={() => router.push("/profile/add-card")}>
                        <Ionicons name="add" size={20} color={layoutTheme.colors.secondary} />
                        <Text style={styles.addCardButtonText}>Əlavə Et</Text>
                    </TouchableOpacity>
                </View>

                {cards.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="card-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>Hələ heç bir kart əlavə edilməyib.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={cards}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item }) => (
                            <View style={styles.cardItem}>
                                <View style={styles.cardIconBox}>
                                    <Ionicons name="card" size={24} color="white" />
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardNumber}>**** **** **** {item.cardNumber.slice(-4)}</Text>
                                    <Text style={styles.cardHolder}>{item.cardHolderName.toUpperCase()}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
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
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    contentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 20,
    },
    contentTitle: {
        fontSize: 22,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? "white" : layoutTheme.colors.primary,
    },
    addCardButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: layoutTheme.colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    addCardButtonText: {
        fontSize: 14,
        fontFamily: layoutTheme.fonts.inter.medium,
        color: layoutTheme.colors.secondary,
    },
    listContainer: {
        paddingBottom: 20,
    },
    cardItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme === "dark" ? "#1F2937" : "#F9FAFB",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
    },
    cardIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: layoutTheme.colors.secondary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    cardNumber: {
        fontSize: 16,
        fontWeight: "600",
        color: theme === "dark" ? "white" : "#111827",
    },
    cardHolder: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: "center",
    },
});