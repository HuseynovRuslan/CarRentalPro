import DriverLicenseForm from "@/components/screens/profile/license/LicenseForm";
import Button from "@/components/ui/button";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LicenseData {
    driverLicenseNumber: string;
    driverLicenseExpiryDate: string;
    driverLicenseImage: string;
}

export default function DriverLicense() {
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)

    const [licenseData, setLicenseData] = useState<LicenseData | null>(null)
    const [showForm, setShowForm] = useState(false)

    const getDriverLicense = async () => {
        try {
            const data = await AsyncStorage.getItem("driverLicense")
            if (data) {
                setLicenseData(JSON.parse(data))
            }
            setShowForm(false)
        } catch (error) {
            console.log("Error loading driver license data:", error)
        }
    }

    useEffect(() => {
        getDriverLicense()
    }, [])

    const deleteDriverLicense = async () => {
        try {
            await AsyncStorage.removeItem("driverLicense")
            setLicenseData(null)
            setShowForm(false)
        } catch (error) {
            console.log("Error deleting driver license:", error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={colorScheme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Driver License</Text>
            </View>
            {!showForm && licenseData ? (
                <View style={styles.licenseCardContent}>
                    <View style={styles.licenseCard}>
                        <Image source={{ uri: licenseData.driverLicenseImage }} style={styles.licenseImage} />
                        <View style={styles.licenseDetails}>
                            <Text style={styles.licenseLabel}>License Number</Text>
                            <Text style={styles.licenseValue}>{licenseData.driverLicenseNumber}</Text>

                            <Text style={styles.licenseLabel}>Expiry Date</Text>
                            <Text style={styles.licenseValue}>{licenseData.driverLicenseExpiryDate}</Text>
                        </View>
                    </View>

                    <Button onPress={() => setShowForm(true)} style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit Driver License</Text>
                    </Button>
                    <Button onPress={deleteDriverLicense} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete Driver License</Text>
                    </Button>
                </View>
            ) : !showForm && !licenseData ? (
                <View style={styles.emptyState}>
                    <Ionicons name="card-outline" size={64} color={layoutTheme.colors.gray} />
                    <Text style={styles.emptyStateText}>No Driver License Added</Text>
                    <Button onPress={() => setShowForm(true)} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Add Driver License</Text>
                    </Button>
                </View>
            ) : (
                <DriverLicenseForm onSuccess={getDriverLicense} />
            )}
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark"
            ? layoutTheme.colors.background.primary
            : layoutTheme.colors.background.white,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    licenseCardContent: {
        flex: 1,
        marginTop: 24,
    },
    licenseCard: {
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.secondary : layoutTheme.colors.background.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: theme === "dark" ? layoutTheme.colors.gray : layoutTheme.colors.gray,
        gap: 16,
    },
    licenseImage: {
        width: "100%",
        height: 200,
        borderRadius: 8,
    },
    licenseDetails: {
        gap: 8,
    },
    licenseLabel: {
        fontSize: 12,
        fontFamily: layoutTheme.fonts.inter.regular,
        color: layoutTheme.colors.text.secondary,
    },
    licenseValue: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        marginBottom: 8,
    },
    editButton: {
        marginTop: 24,
    },
    editButtonText: {
        color: layoutTheme.colors.white,
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
    },
    deleteButton: {
        marginTop: 12,
        backgroundColor: layoutTheme.colors.background.primary,
        borderWidth: 1,
        borderColor: layoutTheme.colors.text.red,
    },
    deleteButtonText: {
        color: layoutTheme.colors.text.red,
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    emptyStateText: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.regular,
        color: layoutTheme.colors.text.secondary,
    },
    addButton: {
        marginTop: 16,
        paddingHorizontal: 32,
    },
    addButtonText: {
        color: layoutTheme.colors.white,
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
    },
})