import Button from "@/components/ui/button";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { driverLicenseSchema, DriverLicenseSchemaType } from "./driver-license.schema";

interface DriverLicenseFormProps {
    onSuccess?: () => void;
}

export default function DriverLicenseForm({ onSuccess }: DriverLicenseFormProps) {
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<DriverLicenseSchemaType>({
        resolver: zodResolver(driverLicenseSchema),
        defaultValues: {
            driverLicenseNumber: "",
            driverLicenseExpiryDate: "",
            driverLicenseImage: "",
        }
    })


    const formatDate = (text: string) => {
        const clean = text.replace(/\D/g, '')
        let format = clean
        if (clean.length >= 2) {
            format = clean.slice(0, 2)
            if (clean.length >= 2) {
                format = `${format}/${clean.slice(2, 4)}`
                if (clean.length >= 4) {
                    format = `${format}/${clean.slice(4, 8)}`
                }
            }
        }
        return format
    }


    const [licenseImage, setLicenseImage] = useState<string | null>(null)

    const chooseFromLibrary = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            })
            if (!result.canceled) {
                setLicenseImage(result.assets[0].uri)
                setValue("driverLicenseImage", result.assets[0].uri)
            }
        }
    }

    const pickImage = async () => {
        if (Platform.OS === 'web') {
            chooseFromLibrary()
            return
        }

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (permission.granted === false) {
            Alert.alert(
                "Permission denied",
                "Please grant permission to access your media library"
            )
            return
        }

        Alert.alert(
            "Upload License Photo",
            "Choose an option",
            [
                {
                    text: "Take Photo",
                    onPress: async () => {
                        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
                        if (cameraPermission.granted) {
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [1, 1],
                                quality: 1,
                            })
                            if (!result.canceled) {
                                setLicenseImage(result.assets[0].uri)
                                setValue("driverLicenseImage", result.assets[0].uri)
                            }
                        }
                    },
                },
                {
                    text: "Choose from Library",
                    onPress: () => chooseFromLibrary(),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        )
    }



    const onSubmit = async (data: DriverLicenseSchemaType) => {
        try {
            if (!licenseImage) {
                if (Platform.OS === 'web') {
                    window.alert("Please upload a driver license image")
                } else {
                    Alert.alert("Upload License Photo", "Please upload a driver license image")
                }
                return
            }

            await AsyncStorage.setItem("driverLicense", JSON.stringify(data))

            if (Platform.OS === 'web') {
                window.alert("Driver license information saved successfully")
            } else {
                Alert.alert("Success", "Driver license information saved successfully")
            }

            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            if (Platform.OS === 'web') {
                window.alert("Failed to save driver license information")
            } else {
                Alert.alert("Error", "Failed to save driver license information")
            }
            console.log(error)
        }
    }

    const getDriverLicense = async () => {
        const driverLicense = JSON.parse(await AsyncStorage.getItem("driverLicense") || "{}")
        if (driverLicense) {
            setValue("driverLicenseNumber", driverLicense.driverLicenseNumber)
            setValue("driverLicenseExpiryDate", driverLicense.driverLicenseExpiryDate)
            setLicenseImage(driverLicense.driverLicenseImage)
        }
    }

    useEffect(() => {
        getDriverLicense()
    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Controller
                    name="driverLicenseNumber"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.formWrapper}>
                            <Text style={styles.formTitle}>Driver License Number</Text>
                            <View style={styles.formControlWrapper}>
                                <TextInput
                                    style={styles.formControl}
                                    placeholder="Driver License Number"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                            </View>
                            {errors.driverLicenseNumber && <Text style={styles.errorText}>{errors.driverLicenseNumber.message}</Text>}
                        </View>
                    )}
                />
                <Controller
                    name="driverLicenseExpiryDate"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.formWrapper}>
                            <Text style={styles.formTitle}>Driver License Expiry Date</Text>
                            <View style={styles.formControlWrapper}>
                                <TextInput
                                    style={styles.formControl}
                                    placeholder="Driver License Expiry Date"
                                    value={value}
                                    onChangeText={text => onChange(formatDate(text))}
                                    onBlur={onBlur}
                                />
                            </View>
                            {errors.driverLicenseExpiryDate && <Text style={styles.errorText}>{errors.driverLicenseExpiryDate.message}</Text>}
                        </View>
                    )}
                />

                <View style={styles.uploadSection}>
                    <Text style={styles.formTitle}>Upload Driver License Image</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        {licenseImage
                            ? <Image
                                source={{ uri: licenseImage }}
                                style={styles.uploadedImage} />
                            : <Image
                                source={require("@/assets/images/license.jpg")}
                                style={styles.uploadImage} />
                        }
                    </TouchableOpacity>
                </View>


            </View>
            <Button onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </Button>

        </View>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark"
            ? layoutTheme.colors.background.primary
            : layoutTheme.colors.background.white,
        marginTop: 24,
    },
    form: {
        flex: 1,
        gap: 22,
    },
    formWrapper: {
        gap: 8,
    },
    formControlWrapper: {
        width: "100%",

        borderWidth: 1,
        borderColor: layoutTheme.colors.gray,
        borderRadius: 10,
        padding: 16,
    },
    formTitle: {
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
        color: layoutTheme.colors.text.secondary,
    },
    formControl: {
        fontSize: 14,
        color: layoutTheme.colors.text.secondary,
    },
    submitButton: {
        minWidth: "100%",
    },
    submitButtonText: {
        color: layoutTheme.colors.white,
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
    },
    errorText: {
        color: layoutTheme.colors.text.red,
        fontSize: 12,
        fontFamily: layoutTheme.fonts.inter.regular,
    },
    uploadSection: {},
    uploadButton: {
        marginTop: 16,
    },
    uploadImage: {
        opacity: 0.3,
        width: "100%",
        height: 300,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: layoutTheme.colors.gray,
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: layoutTheme.colors.background.secondary,
    },
    uploadedImage: {
        width: "100%",
        height: 300,
        borderRadius: 10,
    },
})

