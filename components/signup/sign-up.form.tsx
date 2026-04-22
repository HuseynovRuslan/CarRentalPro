import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { signUpSchema, SignUpSchema } from "./sign-up.schema";
import CustomAppButton from "../ui/button";

export default function SignUpForm() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false,
        },
    });

    const onSubmitRegistration = async (data: SignUpSchema) => {
        try {
            const { confirmPassword, termsAccepted, ...userProfileFields } = data;
            await AsyncStorage.setItem("user", JSON.stringify(userProfileFields));
            Alert.alert("Welcome!", "Your account has been successfully created.");
            router.push("/signin");
        } catch (error) {
            console.error(error);
            Alert.alert("Registration Failed", "Something went wrong while saving your account.");
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
                
                <Text style={styles.label}>Full Legal Name</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. John Doe"
                                placeholderTextColor="#999"
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="words"
                            />
                        )}
                    />
                </View>
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="hello@example.com"
                                placeholderTextColor="#999"
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                    />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Text style={styles.label}>Mobile Phone Number</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={24} color="#666" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="+1 234 567 8900"
                                placeholderTextColor="#999"
                                onChangeText={onChange}
                                value={value}
                                keyboardType="phone-pad"
                            />
                        )}
                    />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

                <Text style={styles.label}>Account Password</Text>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="lock-outline" size={24} color="#666" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            
                <Text style={styles.label}>Verify Password</Text>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="lock-outline" size={24} color="#666" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                    />
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

                <Controller
                    control={control}
                    name="termsAccepted"
                    render={({ field: { onChange, value } }) => (
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => onChange(!value)}>
                            <View style={[styles.checkbox, value && styles.checkboxActive]}>
                                {value && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </View>
                            <Text style={styles.checkboxLabel}>I accept the Terms and Privacy Policy</Text>
                        </TouchableOpacity>
                    )}
                />
                {errors.termsAccepted && <Text style={styles.errorText}>{errors.termsAccepted.message}</Text>}
            </View>

            <View style={styles.buttonContainer}>
                <CustomAppButton onPress={handleSubmit(onSubmitRegistration)}>
                    <Text style={styles.signInButtonText}>CREATE ACCOUNT</Text>
                    <Ionicons name="arrow-forward" size={24} color="#FFF" />
                </CustomAppButton>

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Already an existing member? </Text>
                    <TouchableOpacity onPress={() => router.push("/signin")}>
                        <Text style={styles.signUpLink}>Login Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.primary : layoutTheme.colors.background.white,
        marginTop: 10,
    },
    formContainer: {
        paddingBottom: 20
    },
    buttonContainer: {
        paddingBottom: 40
    },
    label: {
        fontSize: 14,
        color: "#999",
        marginBottom: 8,
        marginTop: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        paddingBottom: 8,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        paddingVertical: 8,
    },
    eyeIcon: {
        padding: 4,
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 6,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "#999",
        borderRadius: 4,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxActive: {
        backgroundColor: layoutTheme.colors.secondary,
        borderColor: layoutTheme.colors.secondary,
    },
    checkboxLabel: {
        fontSize: 14,
        color: "#666",
    },
    signInButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 1,
    },
    signUpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    signUpText: {
        fontSize: 14,
        color: "#666",
    },
    signUpLink: {
        fontSize: 14,
        color: "#000",
        fontWeight: "600",
    },
});