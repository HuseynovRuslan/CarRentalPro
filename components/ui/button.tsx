import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface AbstractButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}

const CustomAppButton = ({ children, onPress, style }: AbstractButtonProps) => {
    const { colorScheme } = useTheme();
    const currentStyle = generatedStyles(colorScheme);

    return (
        <Pressable style={[currentStyle.actionBtn, style]} onPress={onPress}>
            {children}
        </Pressable>
    )
}

export default CustomAppButton;

const generatedStyles = (theme: ThemeType) => StyleSheet.create({
    actionBtn: {
        backgroundColor: layoutTheme.colors.background.secondary,
        maxWidth: 324,
        width: "100%",
        padding: 16,
        borderRadius: 12,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    }
})
