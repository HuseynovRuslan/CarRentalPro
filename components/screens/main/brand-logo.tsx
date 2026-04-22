import { layoutTheme } from "@/config/theme";
import { carLogos } from "@/data/car-logo";
import { useTheme } from "@/hooks/use-theme";
import { useCarState } from "@/state/carStore";
import { ThemeType } from "@/types/theme.type";
import { Image } from "expo-image";
import { router } from "expo-router";

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BrandLogo() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    const { setBrand } = useCarState();

    const handleBrandPress = (slug: string) => {
        setBrand([slug]);
        router.push("/car-list");
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Top Brands</Text>
                <TouchableOpacity onPress={() => router.push("/car-list")}>
                    <Text style={styles.viewAllButtonText}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={carLogos}
                renderItem={({ item }) =>
                    <TouchableOpacity style={styles.item} onPress={() => handleBrandPress(item.slug)}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image.source }} style={styles.brandImage} />
                        </View>
                        <Text style={styles.brandText}>{item.name}</Text>
                    </TouchableOpacity>}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
            />
        </View>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 20,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    viewAllButtonText: {
        fontFamily: layoutTheme.fonts.inter.regular,
        fontSize: 14,
        color: layoutTheme.colors.secondary,
    },
    list: {
        gap: 15,
        paddingBottom: 10,
    },
    item: {
        alignItems: "center",
    },
    imageContainer: {
        width: 80,
        height: 70,
        backgroundColor: "white",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#f0f0f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    brandImage: {
        width: "70%",
        height: "70%",
        resizeMode: "contain",
    },
    brandText: {
        marginTop: 8,
        fontSize: 12,
        fontFamily: layoutTheme.fonts.inter.medium,
        color: theme === "dark" ? "#bbb" : "#666",
    }
});