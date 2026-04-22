import LocationSection from "@/components/screens/booking/location";
import Button from "@/components/ui/button";
import Gradient from "@/components/ui/gradient";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { sendPaymentConfirmationNotification } from "@/services/NotificationService";
import { useAddBookingStore } from "@/state/bookingStore";
import { useCarState } from "@/state/carStore";
import { useCardStore } from "@/state/cardsStore";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PaymentPage() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    const { startDate, endDate, setSelectedCardId, setTotalDays, setTotalPrice, selectedCardId } = useAddBookingStore();
    const { selectedCar } = useCarState();
    const { cards } = useCardStore();

    if (!selectedCar) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Car not found. Please go back and select a car.</Text>
            </View>
        );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const totalDays = diffMs > 0 ? Math.round(diffMs / (1000 * 60 * 60 * 24)) : 1;
    const totalPrice = selectedCar.pricePerDay * totalDays;

    const handleSelectCard = (cardId: string) => {
        setSelectedCardId(cardId);
    };

    const handlePay = () => {
        if (!selectedCardId && cards.length > 0) {
            return;
        }

        const chosenCard = cards.find((c) => c.id === selectedCardId);
        const cardNumber = chosenCard ? chosenCard.cardNumber : "0000000000000000";

        setTotalDays(totalDays);
        setTotalPrice(totalPrice);

        sendPaymentConfirmationNotification({
            amount: totalPrice,
            car: selectedCar.brand + " " + selectedCar.model,
            totalDays: totalDays,
            totalPrice: totalPrice,
            cardNumber: cardNumber,
            paymentId: Math.random().toString(36).substring(2, 10).toUpperCase(),
        });

        router.push("/confirmation-page");
    };

    return (
        <View style={{ flex: 1 }}>
            <Gradient style={{ flex: 1 }}>
                <LocationSection />
                <View style={styles.carDetails}>
                <View style={styles.carDetailsTitle}>
                    <Text style={styles.carDetailsText}>
                        {selectedCar.brand} {selectedCar.model}
                    </Text>
                    <Text style={styles.carDetailsSubText}>
                        {selectedCar.type} · {selectedCar.seats} seats · {selectedCar.fuelType}
                    </Text>
                </View>

                <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Overview</Text>
                        <View style={styles.dayDetails}>
                            <View style={styles.dayDetailsItem}>
                                <Text style={styles.dayDetailsItemTitle}>Start Date</Text>
                                <Text style={styles.dayDetailsItemValue}>{startDate || "—"}</Text>
                            </View>
                            <View style={styles.dayDetailsItem}>
                                <Text style={styles.dayDetailsItemTitle}>End Date</Text>
                                <Text style={styles.dayDetailsItemValue}>{endDate || "—"}</Text>
                            </View>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Duration</Text>
                            <Text style={styles.summaryValue}>{totalDays} day{totalDays !== 1 ? "s" : ""}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Price per day</Text>
                            <Text style={styles.summaryValue}>${selectedCar.pricePerDay}</Text>
                        </View>
                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${totalPrice}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                        {cards.length === 0 ? (
                            <View style={styles.noCardBox}>
                                <Ionicons name="card-outline" size={28} color={layoutTheme.colors.secondary} />
                                <Text style={styles.noCardText}>No saved cards. Add a card from Profile → My Cards.</Text>
                            </View>
                        ) : (
                            cards.map((card) => {
                                const isSelected = selectedCardId === card.id;
                                const masked = "**** **** **** " + card.cardNumber.slice(-4);
                                return (
                                    <TouchableOpacity
                                        key={card.id}
                                        style={[styles.cardItem, isSelected && styles.cardItemSelected]}
                                        onPress={() => handleSelectCard(card.id)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.cardIconCircle}>
                                            <Ionicons name="card" size={20} color={layoutTheme.colors.white} />
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text style={styles.cardNumber}>{masked}</Text>
                                            <Text style={styles.cardHolder}>{card.cardHolderName}</Text>
                                        </View>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={22} color={layoutTheme.colors.secondary} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                <Button
                    onPress={handlePay}
                    style={[styles.button, cards.length > 0 && !selectedCardId && styles.buttonDisabled]}
                >
                    <Text style={styles.buttonText}>
                        {cards.length > 0 && !selectedCardId
                            ? "Select a card to pay"
                            : `Pay $${totalPrice} · ${totalDays} day${totalDays !== 1 ? "s" : ""}`}
                    </Text>
                </Button>
            </View>
        </Gradient>
        </View>
    );
}

const getStyles = (theme: ThemeType) =>
    StyleSheet.create({
        errorContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
        },
        errorText: {
            fontSize: 16,
            color: "red",
            textAlign: "center",
        },
        scrollArea: {
            flex: 1,
        },
        scrollContent: {
            padding: 20,
            gap: 20,
        },
        section: {
            gap: 12,
        },
        sectionTitle: {
            fontSize: 18,
            fontFamily: layoutTheme.fonts.inter.bold,
            color: theme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.primary,
            marginBottom: 4,
        },
        dayDetails: {
            flexDirection: "row",
            gap: 12,
        },
        dayDetailsItem: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme === "dark" ? layoutTheme.colors.lightGray : layoutTheme.colors.gray,
            borderRadius: 12,
            padding: 12,
            gap: 6,
        },
        dayDetailsItemTitle: {
            fontSize: 12,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: theme === "dark" ? layoutTheme.colors.lightGray : layoutTheme.colors.gray,
        },
        dayDetailsItemValue: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.inter.semiBold,
            color: theme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.primary,
        },
        summaryRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 6,
            borderBottomWidth: 1,
            borderBottomColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        },
        summaryLabel: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: theme === "dark" ? layoutTheme.colors.lightGray : layoutTheme.colors.gray,
        },
        summaryValue: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.inter.semiBold,
            color: theme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.primary,
        },
        totalRow: {
            borderBottomWidth: 0,
            marginTop: 4,
        },
        totalLabel: {
            fontSize: 16,
            fontFamily: layoutTheme.fonts.inter.bold,
            color: theme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.primary,
        },
        totalValue: {
            fontSize: 20,
            fontFamily: layoutTheme.fonts.inter.bold,
            color: layoutTheme.colors.secondary,
        },
        noCardBox: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: layoutTheme.colors.secondary,
            backgroundColor: theme === "dark" ? "rgba(232,123,53,0.1)" : "rgba(232,123,53,0.05)",
        },
        noCardText: {
            flex: 1,
            fontSize: 13,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: theme === "dark" ? layoutTheme.colors.lightGray : layoutTheme.colors.gray,
        },
        cardItem: {
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            padding: 14,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : layoutTheme.colors.white,
        },
        cardItemSelected: {
            borderColor: layoutTheme.colors.secondary,
            backgroundColor: theme === "dark" ? "rgba(232,123,53,0.12)" : "rgba(232,123,53,0.06)",
        },
        cardIconCircle: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: layoutTheme.colors.secondary,
            justifyContent: "center",
            alignItems: "center",
        },
        cardInfo: {
            flex: 1,
        },
        cardNumber: {
            fontSize: 15,
            fontFamily: layoutTheme.fonts.inter.semiBold,
            color: theme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.primary,
        },
        cardHolder: {
            fontSize: 12,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: theme === "dark" ? layoutTheme.colors.lightGray : layoutTheme.colors.gray,
            marginTop: 2,
        },
        carDetails: {
            position: "absolute",
            top: "40%",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        carDetailsTitle: {
            padding: 20,
            paddingBottom: 12,
            backgroundColor: layoutTheme.colors.secondary,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            gap: 4,
        },
        carDetailsText: {
            fontFamily: layoutTheme.fonts.inter.bold,
            fontSize: 20,
            color: layoutTheme.colors.white,
        },
        carDetailsSubText: {
            fontFamily: layoutTheme.fonts.inter.regular,
            fontSize: 13,
            color: "rgba(255,255,255,0.8)",
        },
        button: {
            position: "absolute",
            bottom: 30,
            left: 20,
            right: 20,
        },
        buttonDisabled: {
            opacity: 0.6,
        },
        buttonText: {
            fontSize: 16,
            fontFamily: layoutTheme.fonts.inter.bold,
            color: layoutTheme.colors.white,
            textAlign: "center",
        },
    });