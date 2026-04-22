import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInSchema, SignInSchema } from "./sign-in.schema";
import CustomAppButton from "@/components/ui/button";

const SignInScreenForm = () => {
    const { colorScheme } = useTheme();
    const componentStyles = buildStyles(colorScheme);
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const handleLoginSubmission = async (data: SignInSchema) => {
        try {
            const user = await AsyncStorage.getItem("user");
            if (!user) {
                Alert.alert("Account Not Found", "We couldn't find an account. Please register first.");
                return;
            }

            const userData = JSON.parse(user);

            // Checking both email & fullName dynamically
            const matchingIdentifier = userData.email === data.identifier || userData.fullName === data.identifier;
            if (!matchingIdentifier || userData.password !== data.password) {
                Alert.alert("Authentication Failed", "The credentials you entered are incorrect.");
                return;
            }

            await AsyncStorage.setItem("isAuthenticated", "true");
            router.push("/(tabs)");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={componentStyles.container}>
            <View style={componentStyles.formContainer}>
                <Text style={componentStyles.label}>Email or Full Name</Text>
                <View style={componentStyles.inputContainer}>
                    <Ionicons name="person-circle-outline" size={24} color="#666" style={componentStyles.inputIcon} />
                    <Controller
                        control={control}
                        name="identifier"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={componentStyles.input}
                                placeholder="e.g. John Doe or john@example.com"
                                placeholderTextColor="#999"
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                    />
                </View>
                {errors.identifier && <Text style={componentStyles.errorText}>{errors.identifier.message}</Text>}

                <Text style={componentStyles.label}>Account Password</Text>
                <View style={componentStyles.inputContainer}>
                    <MaterialIcons name="lock-outline" size={24} color="#666" style={componentStyles.inputIcon} />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={componentStyles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={componentStyles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={componentStyles.errorText}>{errors.password.message}</Text>}
            </View>

            <View style={componentStyles.buttonContainer}>
                <CustomAppButton onPress={handleSubmit(handleLoginSubmission)}>
                    <Text style={componentStyles.signInButtonText}>SECURE LOGIN</Text>
                    <Ionicons name="arrow-forward" size={24} color="#FFF" />
                </CustomAppButton>

                <View style={componentStyles.signUpContainer}>
                    <Text style={componentStyles.signUpText}>New to our platform? </Text>
                    <TouchableOpacity onPress={() => router.push("/signup")}>
                        <Text style={componentStyles.signUpLink}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SignInScreenForm;

const buildStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.primary : layoutTheme.colors.background.white,
        marginTop: 32,
        justifyContent: "space-between",
    },
    formContainer: {},
    buttonContainer: {},
    label: {
        fontSize: 14,
        color: "#999",
        marginBottom: 12,
        marginTop: 24,
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