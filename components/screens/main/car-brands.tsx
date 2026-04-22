import { layoutTheme } from "@/config/theme";
import { carModels } from "@/data/car-models";
import { useTheme } from "@/hooks/use-theme";
import { useCarState } from "@/state/carStore";
import { CarModel } from "@/types/car-model.types";
import { ThemeType } from "@/types/theme.type";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CarCard from "./car-card";

interface CarBrandsProps {
    searchQuery?: string;
}

export default function CarBrands({ searchQuery = "" }: CarBrandsProps) {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const { brand } = useCarState();

    const displayedCars = useMemo<CarModel[]>(() => {
        const query = searchQuery.trim().toLowerCase();
        let filtered = carModels as CarModel[];

        if (brand.length > 0) {
            filtered = filtered.filter((car) => car.brandSlug === brand[0]);
        }

        if (query) {
            filtered = filtered.filter(
                (car) =>
                    car.brand.toLowerCase().includes(query) ||
                    car.model.toLowerCase().includes(query) ||
                    car.type.toLowerCase().includes(query)
            );
        }

        if (!query && brand.length === 0) {
            return [...filtered].sort(() => Math.random() - 0.5).slice(0, 6);
        }

        return filtered;
    }, [brand, searchQuery]);

    const title = useMemo(() => {
        if (searchQuery.trim()) return `Results for "${searchQuery.trim()}"`;
        if (brand.length > 0) return `${brand[0].toUpperCase()} Models`;
        return "Available Near You";
    }, [brand, searchQuery]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={() => router.push("/car-list")}>
                    <Text style={styles.viewAllButtonText}>See All</Text>
                </TouchableOpacity>
            </View>

            {displayedCars.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No vehicles found.</Text>
                </View>
            ) : (
                <FlatList
                    data={displayedCars}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <CarCard item={item} width={280} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const getStyles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            marginTop: 25,
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
            fontSize: 18,
            color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
            flex: 1,
            marginRight: 10,
        },
        viewAllButtonText: {
            fontFamily: layoutTheme.fonts.inter.regular,
            fontSize: 14,
            color: layoutTheme.colors.secondary,
        },
        list: {
            gap: 20,
            paddingBottom: 20,
        },
        emptyState: {
            height: 120,
            justifyContent: "center",
            alignItems: "center",
        },
        emptyText: {
            fontFamily: layoutTheme.fonts.inter.regular,
            fontSize: 14,
            color: "#999",
        },
    });