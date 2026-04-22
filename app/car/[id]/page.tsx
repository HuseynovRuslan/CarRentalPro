import { layoutTheme } from "@/config/theme";
import { carModels } from "@/data/car-models";
import { useTheme } from "@/hooks/use-theme";
import { useAddBookingStore } from "@/state/bookingStore";
import { useCarState } from "@/state/carStore";
import { ThemeType } from "@/types/theme.type";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CarDetailedViewPage = () => {
    const [currentImage, setCurrentImage] = useState<number>(0);
    const { colorScheme } = useTheme();
    const computedStyles = generateThemeStyles(colorScheme);
    const flatListRef = useRef<FlatList>(null);

    const { id } = useLocalSearchParams();
    const { setCarId } = useAddBookingStore();
    const { setSelectedCar } = useCarState();

    const car = carModels.find((car) => car.id === id);
    if (!car) {
        return <View style={computedStyles.container}><Text>Car not found</Text></View>;
    }

    const handleBooking = () => {
        setCarId(id as string);
        setSelectedCar(car);
        router.push(`/booking`);
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / SCREEN_WIDTH);
        setCurrentImage(index);
    };

    const renderImageItem = ({ item }: { item: any }) => (
        <View style={computedStyles.imageContainer}>
            <Image
                source={typeof item === 'string' ? { uri: item } : item}
                style={computedStyles.image}
            />
        </View>
    );

    const renderDots = () => (
        <View style={computedStyles.dotsContainer}>
            {(car.images || [car.image]).map((_, index) => (
                <View
                    key={index}
                    style={[
                        computedStyles.dot,
                        index === currentImage && computedStyles.activeDot
                    ]}
                />
            ))}
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colorScheme === "dark" ? layoutTheme.colors.background.primary : "#fff" }}>
            <ScrollView contentContainerStyle={computedStyles.container} showsVerticalScrollIndicator={false}>
                {/* Back Button */}
                <TouchableOpacity onPress={() => router.back()} style={computedStyles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>

                {/* Slider and Dots */}
                <View style={computedStyles.sliderWrapper}>
                    <FlatList
                        ref={flatListRef}
                        data={car.images || [car.image]}
                        renderItem={renderImageItem}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    />
                    {renderDots()}
                </View>

                <View style={computedStyles.content}>
                    {/* Title and Rating */}
                    <View style={computedStyles.headerRow}>
                        <View>
                            <Text style={computedStyles.carTitle}>{car.brand} {car.model} - {car.type}</Text>
                            <View style={computedStyles.ratingBox}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={computedStyles.ratingText}>4.8 </Text>
                                <Text style={computedStyles.reviewText}>[140+ Review]</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={computedStyles.favoriteButton}>
                            <Ionicons name="heart-outline" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    {/* Renter Section */}
                    <View style={computedStyles.renterCard}>
                        <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} style={computedStyles.renterAvatar} />
                        <View style={computedStyles.renterInfo}>
                            <Text style={computedStyles.renterName}>John Downson</Text>
                            <Text style={computedStyles.renterLabel}>Renter</Text>
                        </View>
                        <View style={computedStyles.renterActions}>
                            <TouchableOpacity style={computedStyles.renterBtn}>
                                <Ionicons name="chatbox-ellipses-outline" size={20} color={layoutTheme.colors.secondary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={computedStyles.renterBtn}>
                                <Ionicons name="call-outline" size={20} color={layoutTheme.colors.secondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Car Info Section */}
                    <Text style={computedStyles.sectionTitle}>Car Info</Text>
                    <View style={computedStyles.infoList}>
                        <View style={computedStyles.infoItem}>
                            <Ionicons name="person" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={computedStyles.infoText}>4 Passangers</Text>
                        </View>
                        <View style={computedStyles.infoItem}>
                            <MaterialCommunityIcons name="car-door" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={computedStyles.infoText}>4 Doors</Text>
                        </View>
                        <View style={computedStyles.infoItem}>
                            <Ionicons name="snow" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={computedStyles.infoText}>Air conditioning</Text>
                        </View>
                        <View style={computedStyles.infoItem}>
                            <Ionicons name="color-fill" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={computedStyles.infoText}>Fuel info: Full to Full</Text>
                        </View>
                        <View style={computedStyles.infoItem}>
                            <MaterialCommunityIcons name="car-cog" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={computedStyles.infoText}>{car.transmission}</Text>
                        </View>
                    </View>

                    {/* Car Specs Section */}
                    <Text style={computedStyles.sectionTitle}>Car Specs</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={computedStyles.specsList}>
                        <View style={computedStyles.specCard}>
                            <Text style={computedStyles.specLabel}>Max Power</Text>
                            <Text style={computedStyles.specValue}>720</Text>
                        </View>
                        <View style={computedStyles.specCard}>
                            <Text style={computedStyles.specLabel}>0-60 mph</Text>
                            <Text style={computedStyles.specValue}>5.4</Text>
                        </View>
                        <View style={computedStyles.specCard}>
                            <Text style={computedStyles.specLabel}>Top Speed</Text>
                            <Text style={computedStyles.specValue}>180</Text>
                        </View>
                    </ScrollView>

                    {/* Add some space for floating button */}
                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Floating Booking Button */}
            <View style={computedStyles.footer}>
                <TouchableOpacity style={computedStyles.bookingBtn} onPress={handleBooking}>
                    <Text style={computedStyles.bookingBtnText}>Booking Now</Text>
                    <View style={computedStyles.priceContainer}>
                        <Text style={computedStyles.footerPrice}>${car.pricePerDay}</Text>
                        <Text style={computedStyles.footerDay}> /day</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default CarDetailedViewPage;

const generateThemeStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.primary : "#fff",
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    sliderWrapper: {
        width: SCREEN_WIDTH,
        height: 350,
        backgroundColor: "#F5F5F5",
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '90%',
        height: '80%',
        resizeMode: 'contain',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(232, 123, 53, 0.3)',
    },
    activeDot: {
        backgroundColor: '#E87B35',
        width: 25,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    carTitle: {
        fontSize: 22,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? "#fff" : "#000",
    },
    ratingBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    ratingText: {
        fontSize: 14,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: "#000",
        marginLeft: 5,
    },
    reviewText: {
        fontSize: 14,
        fontFamily: layoutTheme.fonts.inter.regular,
        color: "#888",
    },
    favoriteButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    renterCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    renterAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    renterInfo: {
        flex: 1,
        marginLeft: 15,
    },
    renterName: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.semiBold,
        color: "#000",
    },
    renterLabel: {
        fontSize: 14,
        fontFamily: layoutTheme.fonts.inter.regular,
        color: "#888",
    },
    renterActions: {
        flexDirection: "row",
        gap: 10,
    },
    renterBtn: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: "#000",
        marginTop: 25,
        marginBottom: 15,
    },
    infoList: {
        gap: 12,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    infoText: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.medium,
        color: "#333",
    },
    specsList: {
        gap: 15,
        paddingBottom: 10,
    },
    specCard: {
        width: 120,
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        backgroundColor: "#fff",
    },
    specLabel: {
        fontSize: 12,
        fontFamily: layoutTheme.fonts.inter.regular,
        color: "#888",
        marginBottom: 5,
    },
    specValue: {
        fontSize: 20,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: "#000",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    bookingBtn: {
        flexDirection: "row",
        backgroundColor: layoutTheme.colors.secondary,
        paddingVertical: 18,
        paddingHorizontal: 25,
        borderRadius: 20,
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: layoutTheme.colors.secondary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    bookingBtnText: {
        fontSize: 18,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: "#fff",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    footerPrice: {
        fontSize: 20,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: "#fff",
    },
    footerDay: {
        fontSize: 14,
        fontFamily: layoutTheme.fonts.inter.regular,
        color: "rgba(255,255,255,0.8)",
    }
});