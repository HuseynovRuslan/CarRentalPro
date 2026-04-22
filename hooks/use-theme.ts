import { useContext } from "react";
import { ThemeContext } from "./useThemeContext";



export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("Use Theme must be used within a Theme Provider");
    }
    return context;
}