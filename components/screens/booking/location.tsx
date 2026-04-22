import MapView, { Marker, PROVIDER_GOOGLE } from "@/components/map";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";


export default function LocationSection() {
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)

    const [location, setLocation] = useState<Location.LocationObject | null>(null)
    const [search, setSearch] = useState<string | null>(null)
    const [region, setRegion] = useState<any | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [searchedLocation, setSearchedLocation] = useState<{ latitude: number, longitude: number } | null>(null)

    useEffect(() => {
        async function getCurrentLocation() {
            if (Platform.OS === "android" && !Device.isDevice) {
                setErrorMsg("Oops, this must be run on a real device.")
                return;
            };
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            })
        }
        getCurrentLocation()
    }, [])

    const handleSearch = async () => {
        if (!search || !search.trim()) return;

        try {
            const result = await Location.geocodeAsync(search);

            if (result.length > 0) {
                const { latitude, longitude } = result[0]
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                })
                setSearchedLocation({ latitude, longitude })
            } else {
                alert("Location not found. Please try a different search term.")
            }
        } catch (error) {
            console.error(error);
            alert("Failed to search location. Please try again.")
        }
    }

    if (errorMsg) {
        return <Text>{errorMsg}</Text>
    }

    if (!location) {
        return <Text>Loading...</Text>
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                // initialRegion={{
                //     latitude: location.coords.latitude,
                //     longitude: location.coords.longitude,
                //     latitudeDelta: 0.01,
                //     longitudeDelta: 0.01,
                // }}
                region={region}
                showsUserLocation
                showsMyLocationButton
                showsCompass
                showsScale
                showsTraffic
                showsBuildings
                showsPointsOfInterest
            >
                <Marker
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    title="Your Location"
                    description="You are here"
                    pinColor="blue"
                // image={require("../../assets/images/marker.png")}
                />
                {searchedLocation && (
                    <Marker
                        coordinate={searchedLocation}
                        title="Searched Location"
                        description={search || "Search result"}
                        pinColor="red"
                    />
                )}

            </MapView>
        </View>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark"
            ? layoutTheme.colors.primary
            : layoutTheme.colors.white,
    },
    map: {
        width: "100%",
        height: "100%",
    },
    searchContainer: {
        position: "absolute",
        top: 80,
        left: 10,
        right: 10,
        zIndex: 1000,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        backgroundColor: layoutTheme.colors.white,
    },
    searchInput: {
        flex: 1,
        color: layoutTheme.colors.primary,
        fontSize: 16,
    }
})