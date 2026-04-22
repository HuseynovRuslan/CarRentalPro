import CustomAppButton from "@/components/ui/button";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAvatarStore } from "@/state/avatarStore";
import { ThemeType } from "@/types/theme.type";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { personalInformationSchema, UserProfileFormSchema } from "./personal-information.schema";

export default function PersonalInformationForm() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const { avatar, setAvatar, loadAvatar } = useAvatarStore();

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<UserProfileFormSchema>({
        resolver: zodResolver(personalInformationSchema),
        defaultValues: {
            avatarUrl: avatar || "",
            firstName: "",
            lastName: "",
            emailAddress: "",
            phoneNumber: "",
            city: "",
            addressLine: "",
        },
    });

    const triggerProfileUpdate = async (data: UserProfileFormSchema) => {
        try {
            if (data.avatarUrl) {
                await setAvatar(data.avatarUrl);
            }

            await AsyncStorage.setItem("userProfileData", JSON.stringify(data));
            Alert.alert("Profile Updated", "Your profile details have been saved.", [
                { text: "Continue", onPress: () => router.push("/(tabs)/profile") }
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert("Update Failed", "Could not save profile details at this time.");
        }
    };

    const loadExistingProfile = useCallback(async () => {
        await loadAvatar();
        const rawProfile = await AsyncStorage.getItem("userProfileData");
        const profile = rawProfile ? JSON.parse(rawProfile) : {};

        setValue("avatarUrl", profile.avatarUrl || "");
        setValue("firstName", profile.firstName || "");
        setValue("lastName", profile.lastName || "");
        setValue("emailAddress", profile.emailAddress || "");
        setValue("phoneNumber", profile.phoneNumber || "");
        setValue("city", profile.city || "");
        setValue("addressLine", profile.addressLine || "");
    }, [loadAvatar, setValue]);

    useEffect(() => {
        loadExistingProfile();
    }, [loadExistingProfile]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroller}>

                <Text style={styles.formTitle}>First Name</Text>
                <Controller name="firstName" control={control} render={({ field: { value, onChange, onBlur } }) => (
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.formInput}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Enter first name" />
                        {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}
                    </View>
                )} />

                <Text style={styles.formTitle}>Last Name</Text>
                <Controller name="lastName" control={control} render={({ field: { value, onChange, onBlur } }) => (
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.formInput}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Enter last name" />
                        {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}
                    </View>
                )} />

                <Text style={styles.formTitle}>Email Address</Text>
                <Controller name="emailAddress" control={control} render={({ field: { value, onChange, onBlur } }) => (
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.formInput}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Contact email" />
                        {errors.emailAddress && <Text style={styles.errorText}>{errors.emailAddress.message}</Text>}
                    </View>
                )} />

                <Text style={styles.formTitle}>Phone Number</Text>
                <Controller name="phoneNumber" control={control} render={({ field: { value, onChange, onBlur } }) => (
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.formInput}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="phone-pad"
                            placeholder="+1 234 567 8900" />
                        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
                    </View>
                )} />

                <Text style={styles.formTitle}>City / Region</Text>
                <Controller name="city" control={control} render={({ field: { value, onChange, onBlur } }) => (
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.formInput}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Your current city" />
                        {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
                    </View>
                )} />

                <Text style={styles.formTitle}>Full Street Address</Text>
                <Controller name="addressLine" control={control} render={({ field: { value, onChange, onBlur } }) => (
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.formInput}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            multiline
                            placeholder="E.g. 123 Main St, Apt 4B" />
                        {errors.addressLine && <Text style={styles.errorText}>{errors.addressLine.message}</Text>}
                    </View>
                )} />

                <CustomAppButton onPress={handleSubmit(triggerProfileUpdate)} style={styles.button}>
                    <Text style={styles.buttonText}>Save Profile</Text>
                </CustomAppButton>

            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    },
    formScroller: {
        padding: 16,
        paddingBottom: 40,
        gap: 6,
    },
    formTitle: {
        color: theme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.primary,
        fontSize: 15,
        fontWeight: "600",
        fontFamily: layoutTheme.fonts.inter?.semiBold || undefined,
        marginBottom: 4,
        marginTop: 6,
    },
    inputWrapper: {
        width: "100%",
        marginBottom: 10,
    },
    formInput: {
        borderWidth: 1,
        borderColor: layoutTheme.colors.gray,
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: layoutTheme.colors.text.secondary,
        backgroundColor: theme === "dark" ? "#1F2937" : "#F9FAFB",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontFamily: layoutTheme.fonts.inter?.bold || undefined,
    },
    button: {
        marginTop: 20,
    },
});