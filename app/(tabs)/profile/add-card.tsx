import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";

const ProfileAddCardScreen = () => {
    return (
        <SafeAreaView style={screenStyles.wrapper}>
            <Text>Add Card Screen for Auth User</Text>
        </SafeAreaView>
    );
};

export default ProfileAddCardScreen;

const screenStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#fff",
    },
});