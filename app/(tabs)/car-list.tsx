import CarCard from "@/components/screens/main/car-card";
import { layoutTheme } from "@/config/theme";
import { carModels } from "@/data/car-models";
import { useTheme } from "@/hooks/use-theme";
import { useCarState } from "@/state/carStore";
import { CarModel } from "@/types/car-model.types";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CAR_TYPES = ["All", "SUV", "Sedan", "Sport", "Electric", "Luxury", "Truck"];

export default function CarList() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const { brand, setBrand } = useCarState();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    const handleClearFilters = useCallback(() => {
        setBrand([]);
        setSelectedType("All");
        setSearchQuery("");
    }, [setBrand]);

    const filteredCars = useMemo<CarModel[]>(() => {
        const query = searchQuery.trim().toLowerCase();
        return (carModels as CarModel[]).filter((car) => {
            const matchesBrand = brand.length === 0 || car.brandSlug === brand[0];
            const matchesType =
                selectedType === "All" ||
                car.type.toLowerCase().includes(selectedType.toLowerCase());
            const matchesSearch =
                !query ||
                car.brand.toLowerCase().includes(query) ||
                car.model.toLowerCase().includes(query) ||
                car.type.toLowerCase().includes(query);
            return matchesBrand && matchesType && matchesSearch;
        });
    }, [brand, selectedType, searchQuery]);

    const hasActiveFilters = brand.length > 0 || selectedType !== "All" || searchQuery.trim().length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons
                        name="chevron-back"
                        size={22}
                        color={colorScheme === "dark" ? "#fff" : layoutTheme.colors.text.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {brand.length > 0 ? `${brand[0].toUpperCase()} Cars` : "All Vehicles"}
                </Text>
                {hasActiveFilters ? (
                    <TouchableOpacity onPress={handleClearFilters}>
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40 }} />
                )}
            </View>

            {/* Search bar */}
            <View style={styles.searchBarContainer}>
                <Ionicons name="search" size={18} color="#999" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search brand, model or type…"
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={16} color="#aaa" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Type filter chips */}
            <FlatList
                data={CAR_TYPES}
                keyExtractor={(t) => t}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={styles.filterList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            selectedType === item && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedType(item)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                selectedType === item && styles.filterChipTextActive,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Results count */}
            <Text style={styles.resultsCount}>
                {filteredCars.length} vehicle{filteredCars.length !== 1 ? "s" : ""} found
            </Text>

            {/* Car list */}
            {filteredCars.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="car-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyTitle}>No vehicles found</Text>
                    <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
                    <TouchableOpacity style={styles.clearBtn} onPress={handleClearFilters}>
                        <Text style={styles.clearBtnText}>Clear Filters</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredCars}
                    keyExtractor={(item) => item.id}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <CarCard item={item} width={undefined as any} />
                        </View>
                    )}
                    contentContainerStyle={styles.carList}
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
            backgroundColor:
                theme === "dark" ? layoutTheme.colors.primary : "#f7f8fa",
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        backBtn: {
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor:
                theme === "dark" ? layoutTheme.colors.background.darkGray : "#fff",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        headerTitle: {
            fontSize: 18,
            fontFamily: layoutTheme.fonts.inter.bold,
            color: theme === "dark" ? "#fff" : layoutTheme.colors.text.primary,
        },
        clearText: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.inter.medium,
            color: layoutTheme.colors.secondary,
            width: 40,
            textAlign: "right",
        },
        searchBarContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
            paddingHorizontal: 14,
            height: 50,
            backgroundColor:
                theme === "dark" ? layoutTheme.colors.background.darkGray : "#fff",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme === "dark" ? "#2a2a2a" : "#eee",
            gap: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 2,
        },
        searchInput: {
            flex: 1,
            fontSize: 14,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: theme === "dark" ? "#fff" : layoutTheme.colors.text.primary,
        },
        filterList: {
            paddingHorizontal: 16,
            paddingVertical: 14,
            gap: 10,
            alignItems: "center",
        },
        filterChip: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor:
                theme === "dark" ? layoutTheme.colors.background.darkGray : "#fff",
            borderWidth: 1,
            borderColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
        },
        filterChipActive: {
            backgroundColor: layoutTheme.colors.secondary,
            borderColor: layoutTheme.colors.secondary,
        },
        filterChipText: {
            fontSize: 13,
            fontFamily: layoutTheme.fonts.inter.medium,
            color: theme === "dark" ? "#bbb" : "#666",
        },
        filterChipTextActive: {
            color: "#fff",
        },
        resultsCount: {
            paddingHorizontal: 20,
            paddingBottom: 8,
            fontSize: 13,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: "#999",
        },
        carList: {
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
            gap: 8,
        },
        emptyTitle: {
            fontSize: 18,
            fontFamily: layoutTheme.fonts.inter.bold,
            color: theme === "dark" ? "#fff" : layoutTheme.colors.text.primary,
            marginTop: 10,
        },
        emptySubtitle: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.inter.regular,
            color: "#aaa",
        },
        clearBtn: {
            marginTop: 16,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: layoutTheme.colors.secondary,
            borderRadius: 20,
        },
        clearBtnText: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.inter.semiBold,
            color: "#fff",
        },
    });