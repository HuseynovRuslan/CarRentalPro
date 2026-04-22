import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const STORAGE_KEY = 'app_device_push_token';

/**
 * Initializes the foreground presentation behavior.
 */
export const initializeNotificationHandling = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
        }),
    });
};

/**
 * Ensures optimal channel layout for Android specific to app features.
 */
export const createAndroidNotificationChannels = async () => {
    if (Platform.OS !== 'android') return;

    await Notifications.setNotificationChannelAsync('transactions', {
        name: 'Transaction Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0066FF',
        enableVibrate: true,
        showBadge: true,
    });

    await Notifications.setNotificationChannelAsync('system', {
        name: 'System Notifications',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
    });
};

/**
 * Handles OS-level permission logic safely.
 */
export const requestNotificationAccess = async (): Promise<boolean> => {
    const { status: currentStatus } = await Notifications.getPermissionsAsync();
    if (currentStatus === 'granted') return true;

    const { status: requestedStatus } = await Notifications.requestPermissionsAsync();
    return requestedStatus === 'granted';
};

/**
 * Main utility to orchestrate permissions and token generation.
 */
export const registerDeviceForNotifications = async (): Promise<string | null> => {
    try {
        const isGranted = await requestNotificationAccess();
        if (!isGranted) {
            console.log("Device push access denied by user.");
            return null;
        }

        await createAndroidNotificationChannels();

        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        
        let tokenResult;
        if (projectId) {
            tokenResult = await Notifications.getExpoPushTokenAsync({ projectId });
        } else {
            // Development fallback warning
            console.warn("No EXPO project ID found. Notifications might fail in standalone builds.");
            tokenResult = await Notifications.getExpoPushTokenAsync();
        }

        const token = tokenResult.data;
        await AsyncStorage.setItem(STORAGE_KEY, token);
        return token;
    } catch (error) {
        console.error("Critical failure computing push token:", error);
        return null;
    }
};

export const getStoredDevicePushToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(STORAGE_KEY).catch(() => null);
};

export const clearStoredDevicePushToken = async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEY).catch(console.error);
};
