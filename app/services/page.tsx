import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { layoutTheme } from "@/config/theme";

interface ExtraService {
    id: string;
    title: string;
    description: string;
    price: number;
    icon: keyof typeof Ionicons.glyphMap;
}

const AVAILABLE_SERVICES: ExtraService[] = [
    { id: "srv-1", title: "Premium Insurance", description: "Full coverage for any accidental damage", price: 45, icon: "shield-checkmark" },
    { id: "srv-2", title: "Airport Pickup", description: "Direct transfer from the terminal", price: 30, icon: "airplane" },
    { id: "srv-3", title: "Child Seat", description: "Safe seating for passengers under 5", price: 15, icon: "body" },
    { id: "srv-4", title: "Chauffeur Service", description: "Professional driver for 8 hours", price: 120, icon: "person" },
    { id: "srv-5", title: "GPS Navigation", description: "Updated global navigation module", price: 10, icon: "navigate" },
];

const ExtraServicesScreen = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelection = (serviceId: string) => {
        setSelectedIds(prev =>
            prev.includes(serviceId) ? prev.filter(item => item !== serviceId) : [...prev, serviceId]
        );
    };

    const calculatedTotal = AVAILABLE_SERVICES
        .filter(s => selectedIds.includes(s.id))
        .reduce((sum, s) => sum + s.price, 0);

    return (
        <SafeAreaView style={styles.screenWrapper}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Extra Services</Text>
                <Text style={styles.headerSubtitle}>Customize your rental experience</Text>
            </View>

            <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                {AVAILABLE_SERVICES.map((service) => {
                    const isSelected = selectedIds.includes(service.id);
                    return (
                        <TouchableOpacity
                            key={service.id}
                            activeOpacity={0.8}
                            style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                            onPress={() => toggleSelection(service.id)}
                        >
                            <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                                <Ionicons name={service.icon} size={28} color={isSelected ? "#FFF" : layoutTheme.colors.secondary} />
                            </View>
                            <View style={styles.cardDetails}>
                                <Text style={styles.cardTitle}>{service.title}</Text>
                                <Text style={styles.cardDesc}>{service.description}</Text>
                                <Text style={styles.cardPrice}>+${service.price}/day</Text>
                            </View>
                            <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                                {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.summaryFooter}>
                <View style={styles.summaryInfo}>
                    <Text style={styles.summaryLabel}>Selected Extras ({selectedIds.length})</Text>
                    <Text style={styles.summaryPrice}>${calculatedTotal}</Text>
                </View>
                <TouchableOpacity style={[styles.applyBtn, selectedIds.length === 0 && styles.applyBtnDisabled]} disabled={selectedIds.length === 0}>
                    <Text style={styles.applyBtnText}>Apply Services</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ExtraServicesScreen;

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",
        fontFamily: layoutTheme.fonts.inter.bold || undefined,
    },
    headerSubtitle: {
        fontSize: 15,
        color: "#6b7280",
        marginTop: 6,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 120, // ensure space for absolute footer
        gap: 16,
    },
    serviceCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    serviceCardSelected: {
        borderColor: layoutTheme.colors.secondary,
        backgroundColor: "#FFFAFA",
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    iconBoxSelected: {
        backgroundColor: layoutTheme.colors.secondary,
    },
    cardDetails: {
        flex: 1,
        marginLeft: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    cardDesc: {
        fontSize: 13,
        color: "#6b7280",
        marginTop: 4,
        lineHeight: 18,
    },
    cardPrice: {
        fontSize: 15,
        fontWeight: "700",
        color: layoutTheme.colors.secondary,
        marginTop: 6,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },
    checkboxActive: {
        backgroundColor: layoutTheme.colors.secondary,
        borderColor: layoutTheme.colors.secondary,
    },
    summaryFooter: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32, // Accommodate iOS home indicator safely
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    summaryInfo: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 14,
        color: "#6b7280",
    },
    summaryPrice: {
        fontSize: 24,
        fontWeight: "800",
        color: "#111827",
        marginTop: 2,
    },
    applyBtn: {
        backgroundColor: layoutTheme.colors.secondary,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    applyBtnDisabled: {
        backgroundColor: "#D1D5DB",
    },
    applyBtnText: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 16,
    }
});