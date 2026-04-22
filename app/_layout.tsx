import { interFont, montserratFont } from "@/config/fonts";
import ThemeProvider from "@/context/theme-provider";
import useLayoutFonts from "@/hooks/use-fonts";
import { attachNotificationListeners, detachNotificationListeners } from "@/notification/listeners";
import { initializeNotificationHandling, registerDeviceForNotifications } from "@/notification/register";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { loaded, error } = useLayoutFonts({ ...interFont, ...montserratFont })

  useEffect(() => {
    initializeNotificationHandling();
    attachNotificationListeners();
    registerDeviceForNotifications().catch(error => {
      console.error('Error registering device:', error);
    });

    return () => {
      detachNotificationListeners();
    };
  }, [])

  if (!loaded || error) return null;
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home/page" />
        <Stack.Screen name="(tabs)/index" />
      </Stack>
    </ThemeProvider>
  )
}
