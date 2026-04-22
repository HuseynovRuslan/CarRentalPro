import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeDashboard = () => {
    const listItems = [
        { id: 1, label: "Car 1" },
        { id: 2, label: "Moto" },
        { id: 3, label: "Car 3" },
        { id: 4, label: "Car 4" },
        { id: 5, label: "Car 5" },
        { id: 6, label: "Car 6" },
        { id: 7, label: "Car 7" },
        { id: 8, label: "Car 8" },
        { id: 9, label: "Car 9" },
        { id: 10, label: "Car 10" },
    ];

    return (
        <SafeAreaView style={homeStyles.screenLayout}>
            <StatusBar barStyle="dark-content" />
            <Text style={homeStyles.headerText}>Home Without Tabs Layout</Text>
            <FlatList
                horizontal
                data={listItems}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={homeStyles.scrollList}
                renderItem={({ item }) => (
                    <View style={homeStyles.cardItem}>
                        <Text>{item.label}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

export default HomeDashboard;

const homeStyles = StyleSheet.create({
    screenLayout: {
        flex: 1,
        paddingHorizontal: 10,
    },
    scrollList: {
        flex: 1,
        gap: 10,
        marginTop: 16,
    },
    headerText: {
        fontSize: 20,
        color: "red",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 16,
    },
    cardItem: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});