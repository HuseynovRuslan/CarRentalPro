import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

let activeForegroundListener: Notifications.Subscription | undefined;
let activeResponseListener: Notifications.Subscription | undefined;

/**
 * Computes destination path for the router based on payload instructions.
 */
export const resolveNotificationRoute = (data: Record<string, any>): string | null => {
    if (data?.screen) return data.screen;

    switch (data?.type) {
        case 'booking_confirmed':
            return data?.bookingId ? '/(tabs)' : '/(tabs)/profile';
        case 'payment_confirmed':
            return '/(tabs)/notifications';
        case 'promo_offer':
        case 'system_update':
            return '/(tabs)';
        default:
            return null;
    }
};

/**
 * Handles incoming events when app is open in foreground.
 */
export const handleForegroundNotification = (notification: Notifications.Notification) => {
    const payload = notification.request.content.data;
    console.log("[FOREGROUND EVENT] Received:", payload.type || "unknown");
    
    // Extensible specific flow triggers without complex if/else chain
    switch(payload?.type) {
        case 'booking_confirmed':
            console.log("Dispatching UI state refresh for active booking");
            break;
        case 'payment_confirmed':
            console.log("Updating order records internally");
            break;
    }
};

/**
 * Handles user tapping on a system background/foreground banner.
 */
export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const payload = response.notification.request.content.data;
    console.log("[INTERACTION EVENT] User Tapped:", payload.type || "unknown");

    const targetRoute = resolveNotificationRoute(payload);
    if (targetRoute) {
        router.push(targetRoute as any);
    }
};

/**
 * Main lifecycle setup orchestration.
 */
export const attachNotificationListeners = () => {
    if (!activeForegroundListener) {
        activeForegroundListener = Notifications.addNotificationReceivedListener(handleForegroundNotification);
    }
    if (!activeResponseListener) {
        activeResponseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    }
};

/**
 * Cleanup function to drop references safely preventing memory leaks.
 */
export const detachNotificationListeners = () => {
    activeForegroundListener?.remove();
    activeResponseListener?.remove();
    
    activeForegroundListener = undefined;
    activeResponseListener = undefined;
};
