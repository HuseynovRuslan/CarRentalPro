import BrandLogo from "@/components/screens/main/brand-logo";
import CarBrands from "@/components/screens/main/car-brands";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCarState } from "@/state/carStore";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const { setBrand } = useCarState();

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = useCallback(
        (text: string) => {
            setSearchQuery(text);
            if (text.trim()) {
                setBrand([]); // clear brand filter so search works across all brands
            }
        },
        [setBrand]
    );

    const clearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <View style={styles.locationContainer}>
                        <View style={styles.locationIconBox}>
                            <Ionicons name="location" size={20} color={layoutTheme.colors.secondary} />
                        </View>
                        <View style={styles.locationTextBox}>
                            <Text style={styles.locationLabel}>Your location</Text>
                            <TouchableOpacity
                                style={styles.locationPicker}
                                onPress={() => router.push("/location")}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.locationValue}>Find on Map</Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={16}
                                    color={
                                        colorScheme === "dark"
                                            ? layoutTheme.colors.text.white
                                            : layoutTheme.colors.text.primary
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Image
                        source={require("@/assets/images/profile.png")}
                        style={styles.profilePic}
                    />
                </View>

                <Text style={styles.heroTitle}>Find your favourite{"\n"}vehicle.</Text>

                <View style={styles.searchBarContainer}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by brand, model or type…"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        returnKeyType="search"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="close-circle" size={18} color="#aaa" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.sectionsContainer}>
                    {!searchQuery.trim() && <BrandLogo />}
                    <CarBrands searchQuery={searchQuery} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
        },
        scrollContent: {
            paddingBottom: 30,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 10,
        },
        locationContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        locationIconBox: {
            width: 45,
            height: 45,
            backgroundColor:
                theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#eee",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        locationTextBox: {
            marginLeft: 12,
        },
        locationLabel: {
            fontSize: 12,
            color: "#888",
            fontFamily: layoutTheme.fonts.inter.regular,
        },
        locationPicker: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
        },
        locationValue: {
            fontSize: 16,
            fontWeight: "bold",
            color:
                theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
            fontFamily: layoutTheme.fonts.inter.bold,
        },
        profilePic: {
            width: 45,
            height: 45,
            borderRadius: 12,
        },
        heroTitle: {
            fontSize: 28,
            fontWeight: "bold",
            paddingHorizontal: 20,
            marginTop: 30,
            color:
                theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
            fontFamily: layoutTheme.fonts.inter.bold,
            lineHeight: 36,
        },
        searchBarContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 20,
            marginTop: 25,
            paddingHorizontal: 15,
            height: 55,
            backgroundColor:
                theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: "#eee",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
        },
        searchIcon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 15,
            color:
                theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
            fontFamily: layoutTheme.fonts.inter.regular,
        },
        sectionsContainer: {
            marginTop: 20,
        },
    });