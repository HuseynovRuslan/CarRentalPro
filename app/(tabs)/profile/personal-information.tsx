import PersonalInformationForm from "@/components/screens/profile/personal-information/personal-information.form";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAvatarStore } from "@/state/avatarStore";
import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";

export default function PersonalInformation() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);


    const {avatar, setAvatar, loadAvatar} = useAvatarStore();

    useEffect(() => {
        loadAvatar();
    }, [loadAvatar]);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.granted === false) {
            Alert.alert("Permission Required",
                "Please grant permission to access your media library"
            );
            return
        }

        Alert.alert("Upload Avatar", "Choose an option",
            [
                {
                    text: "Take a photo",
                    onPress: async () => {
                        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
                        if (cameraPermission.granted) {
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [4, 3],
                                quality: 1,
                            });
                            if (!result.canceled) {
                                await setAvatar(result.assets[0].uri);
                            }
                        }
                    }
                },
                {
                    text: "Choose from library",
                    onPress: async () => {
                        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (libraryPermission.granted) {
                            const result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [4, 3],
                                quality: 1,
                            });
                            if (!result.canceled) {
                                await setAvatar(result.assets[0].uri);
                            }
                        }
                    }
                },
                {
                    text: "Cancel",
                    onPress: () => {
                        console.log("Cancel");
                    }
                }
            ],
            { cancelable: true }
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
                    <Ionicons name="chevron-back" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                </TouchableOpacity>
                <Text style={styles.title}>Personal Information</Text>
            </View>
            
            <View style={styles.content}>
                <View style={styles.profileImageContainer}>
                    <View style={styles.profileImageOverlay}>
                        <Image source={avatar ? { uri: avatar } : require("@/assets/images/profile.png")} style={styles.profileImage} />
                        <TouchableOpacity style={styles.profileImageButton} onPress={pickImage}>
                            <Ionicons name="camera" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>
                <PersonalInformationForm />

            </View>
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: theme === "dark" ? "white" : "black",
    },
    content: {
        flex: 1,
        width: "100%",
        padding: 16,
        alignItems: "center",
    },
    profileImageContainer: {
        width: "100%",
        alignItems: "center",

    },
    profileImageOverlay: {
        position: "relative",
    },
    profileImageButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        borderWidth: 1,
        borderColor: "lightGray",
        backgroundColor: "white",
        borderRadius: 100,
        padding: 5,
    },

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
    }
})