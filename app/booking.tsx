import RangeCalendar from "@/components/screens/car/calendar";
import Button from "@/components/ui/button";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCarState } from "@/state/carStore";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Booking() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    const { selectedCar } = useCarState();

    if (!selectedCar) {
        return (
            <View style={styles.container}>
                <Text style={{ padding: 20, color: "red" }}>Car not found. Please go back and select a car.</Text>
            </View>
        );
    }

    const handleBooking = () => {
        router.push(`/payment/page`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={colorScheme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Date & Time</Text>
            </View>
            <View style={styles.bookedCarContainer}>
                <Text style={styles.bookedCarTitle}>
                    Selected Car: {selectedCar.brand} {selectedCar.model}
                </Text>
                <Text style={styles.bookedCarSubTitle}>
                    {selectedCar.type} · ${selectedCar.pricePerDay}/day
                </Text>
            </View>
            <RangeCalendar />
            <Button onPress={handleBooking} style={styles.button}>
                <Text style={styles.buttonText}>Book Now</Text>
            </Button>
        </View>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.primary : layoutTheme.colors.background.white,
    },
    header: {
        marginTop: 80,
        paddingHorizontal: 22,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        fontSize: 24,
        marginBottom: 8,
    },
    bookedCarContainer: {
        paddingHorizontal: 22,
        marginBottom: 16,
        marginTop: 22,
    },
    bookedCarTitle: {
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        fontSize: 16,
        marginBottom: 4,
    },
    bookedCarSubTitle: {
        fontFamily: layoutTheme.fonts.inter.regular,
        color: theme === "dark" ? layoutTheme.colors.lightGray : layoutTheme.colors.gray,
        fontSize: 13,
    },
    button: {
        marginHorizontal: "auto",
        marginBottom: 44,
    },
    buttonText: {
        fontFamily: layoutTheme.fonts.inter.bold,
        color: layoutTheme.colors.white,
        fontSize: 16,
        textAlign: "center",
    },
});