import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { useFavoriteState } from "@/state/favoriteStore";
import { CarModel } from "@/types/car-model.types";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CarCardProps {
    item: CarModel;
    width?: number;
}

export default function CarCard({ item, width = 280 }: CarCardProps) {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme, width);
    const { isFavorite, toggleFavorite } = useFavoriteState();
    const favorited = isFavorite(item.id);

    return (
        <TouchableOpacity
            style={styles.item}
            activeOpacity={0.85}
            onPress={() => router.push(`/car/${item.id}/page`)}
        >
            {/* Favorite button */}
            <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => toggleFavorite(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons
                    name={favorited ? "heart" : "heart-outline"}
                    size={20}
                    color={favorited ? "#e74c3c" : "#aaa"}
                />
            </TouchableOpacity>

            {/* Car Image */}
            <View style={styles.imageBox}>
                <Image
                    source={typeof item.image === "string" ? { uri: item.image } : item.image}
                    style={styles.carImage}
                    contentFit="contain"
                />
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
                <Text style={styles.carName} numberOfLines={1}>
                    {item.brand} {item.model}
                </Text>
                <Text style={styles.carType}>{item.type}</Text>
                <View style={styles.ratingPriceRow}>
                    <View style={styles.ratingBox}>
                        <Ionicons name="star" size={13} color="#FFD700" />
                        <Text style={styles.ratingText}>4.8</Text>
                        <Text style={styles.reviewText}> (140+)</Text>
                    </View>
                    <View style={styles.priceBox}>
                        <Text style={styles.priceText}>${item.pricePerDay}</Text>
                        <Text style={styles.dayText}>/day</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const getStyles = (theme: ThemeType, width: number) =>
    StyleSheet.create({
        item: {
            width,
            backgroundColor:
                theme === "dark" ? layoutTheme.colors.background.darkGray : "#fff",
            borderRadius: 20,
            padding: 12,
            borderWidth: 1,
            borderColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 4,
            position: "relative",
        },
        favoriteBtn: {
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 10,
            backgroundColor:
                theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
            borderRadius: 20,
            padding: 6,
        },
        imageBox: {
            width: "100%",
            height: 140,
            borderRadius: 14,
            backgroundColor: theme === "dark" ? "#2a2a2a" : "#f9f9f9",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
        },
        carImage: {
            width: "90%",
            height: "90%",
        },
        infoBox: {
            marginTop: 12,
        },
        carName: {
            fontSize: 15,
            fontFamily: layoutTheme.fonts.inter.semiBold,
            color:
                theme === "dark"
                    ? layoutTheme.colors.text.white
                    : layoutTheme.colors.text.primary,
        },
        carType: {
            fontSize: 12,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: "#999",
            marginTop: 2,
        },
        ratingPriceRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
        },
        ratingBox: {
            flexDirection: "row",
            alignItems: "center",
        },
        ratingText: {
            fontSize: 13,
            fontFamily: layoutTheme.fonts.inter.bold,
            marginLeft: 3,
            color:
                theme === "dark"
                    ? layoutTheme.colors.text.white
                    : layoutTheme.colors.text.primary,
        },
        reviewText: {
            fontSize: 11,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: "#aaa",
        },
        priceBox: {
            flexDirection: "row",
            alignItems: "baseline",
        },
        priceText: {
            fontSize: 16,
            fontFamily: layoutTheme.fonts.inter.bold,
            color: layoutTheme.colors.secondary,
        },
        dayText: {
            fontSize: 11,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: "#aaa",
            marginLeft: 2,
        },
    });
