import CarCard from "@/components/screens/main/car-card";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { useFavoriteState } from "@/state/favoriteStore";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favorite() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const { favorites } = useFavoriteState();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favourites</Text>
                <Text style={styles.headerCount}>
                    {favorites.length} {favorites.length === 1 ? "vehicle" : "vehicles"}
                </Text>
            </View>

            {favorites.length === 0 ? (
                /* Empty State */
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconBox}>
                        <Ionicons name="heart-outline" size={48} color={layoutTheme.colors.secondary} />
                    </View>
                    <Text style={styles.emptyTitle}>No favourites yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Tap the ❤️ icon on any vehicle to save it here
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <CarCard item={item} width={undefined as any} />
                        </View>
                    )}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === "dark" ? layoutTheme.colors.primary : "#f7f8fa",
        },
        header: {
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 16,
            flexDirection: "row",
            alignItems: "baseline",
            gap: 8,
        },
        headerTitle: {
            fontSize: 26,
            fontFamily: layoutTheme.fonts.inter.bold,
            color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        },
        headerCount: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: "#aaa",
        },
        list: {
            paddingHorizontal: 16,
            paddingBottom: 30,
            gap: 16,
        },
        cardWrapper: {
            width: "100%",
        },
        emptyState: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 40,
        },
        emptyIconBox: {
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor:
                theme === "dark"
                    ? layoutTheme.colors.background.darkGray
                    : "#fff",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: layoutTheme.colors.secondary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 5,
        },
        emptyTitle: {
            fontSize: 20,
            fontFamily: layoutTheme.fonts.inter.bold,
            color: theme === "dark" ? "#fff" : layoutTheme.colors.text.primary,
            marginTop: 8,
        },
        emptySubtitle: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: "#aaa",
            textAlign: "center",
            lineHeight: 22,
        },
    });