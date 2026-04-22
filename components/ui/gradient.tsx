import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { layoutTheme } from "@/config/theme";

export type GradientVariant = 'hero' | 'card' | 'button';

interface ReusableGradientProps extends Omit<LinearGradientProps, 'colors'> {
    variant?: GradientVariant;
    rounded?: number;
    opacity?: number;
    colors?: string[]; // Allow overriding
    children?: React.ReactNode;
}

export const GradientWrapper = ({
    variant = 'card',
    rounded = 0,
    opacity = 1,
    style,
    colors,
    children,
    ...rest
}: ReusableGradientProps) => {
    
    // Abstract logic for matching variant colors seamlessly
    const getVariantColors = (): string[] => {
        if (colors) return colors;
        switch (variant) {
            case 'hero': return ['#1E3C72', '#2A5298'];
            case 'button': return [layoutTheme.colors.secondary, '#FF8A65']; 
            case 'card': 
            default:
                return ['#FDFBFB', '#EBEDEE'];
        }
    };

    const getVariantProps = () => {
        switch (variant) {
            case 'hero': return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
            case 'button': return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
            case 'card': return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
            default: return {};
        }
    };

    return (
        <LinearGradient
            colors={getVariantColors()}
            style={[
                { borderRadius: rounded, opacity },
                style
            ]}
            {...getVariantProps()}
            {...rest}
        >
            {children}
        </LinearGradient>
    );
};

export default GradientWrapper;