import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAddBookingStore } from "@/state/bookingStore";
import { useCarState } from "@/state/carStore";
import { useCardStore } from "@/state/cardsStore";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfirmationPage() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    const { selectedCar } = useCarState();
    const { startDate, endDate, totalDays, totalPrice, selectedCardId } = useAddBookingStore();
    const { cards } = useCardStore();

    const selectedCard = cards.find((c) => c.id === selectedCardId);
    const maskedCard = selectedCard
        ? "**** **** **** " + selectedCard.cardNumber.slice(-4)
        : "—";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <Ionicons
                        name="checkmark-circle"
                        size={90}
                        color={layoutTheme.colors.secondary}
                    />
                </View>

                <Text style={styles.title}>Booking Confirmed!</Text>
                <Text style={styles.subtitle}>
                    Your payment was successful. Enjoy your ride!
                </Text>

                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="car-sport" size={18} color={layoutTheme.colors.white} />
                        </View>
                        <View style={styles.detailTextGroup}>
                            <Text style={styles.detailLabel}>Vehicle</Text>
                            <Text style={styles.detailValue}>
                                {selectedCar
                                    ? `${selectedCar.brand} ${selectedCar.model}`
                                    : "—"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="calendar-outline" size={18} color={layoutTheme.colors.white} />
                        </View>
                        <View style={styles.detailTextGroup}>
                            <Text style={styles.detailLabel}>Rental Period</Text>
                            <Text style={styles.detailValue}>
                                {startDate || "—"} → {endDate || "—"}
                            </Text>
                            <Text style={styles.detailSub}>
                                {totalDays} day{totalDays !== 1 ? "s" : ""}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="card-outline" size={18} color={layoutTheme.colors.white} />
                        </View>
                        <View style={styles.detailTextGroup}>
                            <Text style={styles.detailLabel}>Payment Card</Text>
                            <Text style={styles.detailValue}>{maskedCard}</Text>
                            {selectedCard && (
                                <Text style={styles.detailSub}>{selectedCard.cardHolderName}</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={[styles.iconCircle, { backgroundColor: "#2ECC71" }]}>
                            <Ionicons name="cash-outline" size={18} color={layoutTheme.colors.white} />
                        </View>
                        <View style={styles.detailTextGroup}>
                            <Text style={styles.detailLabel}>Total Paid</Text>
                            <Text style={[styles.detailValue, styles.priceValue]}>
                                ${totalPrice}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace("/(tabs)")}
                    activeOpacity={0.85}
                >
                    <Ionicons name="home" size={20} color={layoutTheme.colors.white} />
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                theme === "dark"
                    ? layoutTheme.colors.background.primary
                    : layoutTheme.colors.background.white,
        },
        content: {
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 32,
            alignItems: "center",
        },
        iconWrapper: {
            marginBottom: 16,
        },
        title: {
            fontFamily: layoutTheme.fonts.inter.bold,
            fontSize: 26,
            color:
                theme === "dark"
                    ? layoutTheme.colors.text.white
                    : layoutTheme.colors.text.primary,
            textAlign: "center",
            marginBottom: 10,
        },
        subtitle: {
            fontFamily: layoutTheme.fonts.inter.regular,
            fontSize: 15,
            color:
                theme === "dark"
                    ? layoutTheme.colors.text.white
                    : layoutTheme.colors.text.primary,
            textAlign: "center",
            opacity: 0.75,
            marginBottom: 28,
            paddingHorizontal: 8,
        },
        detailsCard: {
            width: "100%",
            backgroundColor:
                theme === "dark"
                    ? layoutTheme.colors.background.darkGray
                    : layoutTheme.colors.background.gray,
            borderRadius: 16,
            padding: 20,
            marginBottom: 28,
            gap: 4,
        },
        detailRow: {
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 14,
            paddingVertical: 6,
        },
        iconCircle: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: layoutTheme.colors.secondary,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2,
        },
        detailTextGroup: {
            flex: 1,
            gap: 2,
        },
        detailLabel: {
            fontFamily: layoutTheme.fonts.inter.regular,
            fontSize: 12,
            color:
                theme === "dark"
                    ? layoutTheme.colors.text.white
                    : layoutTheme.colors.text.primary,
            opacity: 0.6,
        },
        detailValue: {
            fontFamily: layoutTheme.fonts.inter.semiBold,
            fontSize: 15,
            color:
                theme === "dark"
                    ? layoutTheme.colors.text.white
                    : layoutTheme.colors.text.primary,
        },
        detailSub: {
            fontFamily: layoutTheme.fonts.inter.regular,
            fontSize: 12,
            color:
                theme === "dark"
                    ? layoutTheme.colors.text.white
                    : layoutTheme.colors.text.primary,
            opacity: 0.55,
        },
        priceValue: {
            color: "#2ECC71",
            fontSize: 18,
            fontFamily: layoutTheme.fonts.inter.bold,
        },
        divider: {
            height: 1,
            backgroundColor:
                theme === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.07)",
            marginVertical: 4,
        },
        button: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: layoutTheme.colors.secondary,
            paddingVertical: 16,
            paddingHorizontal: 40,
            borderRadius: 14,
            width: "100%",
        },
        buttonText: {
            fontFamily: layoutTheme.fonts.inter.bold,
            fontSize: 16,
            color: layoutTheme.colors.white,
        },
    });
