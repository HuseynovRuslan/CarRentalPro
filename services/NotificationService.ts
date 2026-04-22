import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const LOG_STORAGE_KEY = '@CarRental:notification_logs';
const MAX_LOG_HISTORY = 30;

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface BookingDetails {
  carBrand: string;
  carModel: string;
  rentalDays: number | string;
  totalPrice: number | string;
  bookingId: string;
}

export interface PaymentDetails {
  amount: number | string;
  car: string;
  totalDays: number | string;
  totalPrice: number | string;
  cardNumber: string;
  paymentId: string;
}

class NotificationService {
  /**
   * Confirms a car booking with a local notification
   */
  async confirmBooking(details: BookingDetails) {
    const { carBrand, carModel, rentalDays, totalPrice } = details;
    const vehicle = `${carBrand} ${carModel}`.trim() || 'Reserved Vehicle';

    const title = '🏎️ Yolunuz Açıq Olsun!';
    const body = `Sizin ${vehicle} ${rentalDays} günlük bron edildi. Ümumi məbləğ: $${Number(totalPrice).toFixed(2)}`;

    const data = {
      action: 'booking_success',
      ...details,
      createdAt: new Date().toISOString(),
    };

    return this.trigger({ title, body, data });
  }

  /**
   * Confirms a payment transaction
   */
  async confirmPayment(details: PaymentDetails) {
    const { amount, car } = details;

    const title = '💰 Ödəniş Uğurludur';
    const body = `${car} üçün $${Number(amount).toFixed(2)} məbləğində ödənişiniz qəbul edildi.`;

    const data = {
      action: 'payment_complete',
      ...details,
      createdAt: new Date().toISOString(),
    };

    return this.trigger({ title, body, data });
  }

  /**
   * Core method to trigger notifications
   */
  async trigger({ title, body, data = {} }: NotificationPayload) {
    try {
      let identifier = `web_notif_${Date.now()}`;

      if (Platform.OS !== 'web') {
        identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
            badge: 1,
          },
          trigger: null,
        });
      }

      await this.saveToLog({
        id: identifier,
        title,
        body,
        data,
      });

      return identifier;
    } catch (error) {
      console.error('[NotificationService] Error triggering notification:', error);
      return null;
    }
  }

  /**
   * Internal logger for notification history
   */
  async saveToLog(entry: any) {
    try {
      const rawHistory = await AsyncStorage.getItem(LOG_STORAGE_KEY);
      const history = rawHistory ? JSON.parse(rawHistory) : [];

      const newLog = {
        ...entry,
        receivedAt: new Date().toISOString(),
      };

      const updatedHistory = [newLog, ...history].slice(0, MAX_LOG_HISTORY);
      await AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('[NotificationService] Failed to log notification:', error);
    }
  }

  /**
   * Retrieves the notification history
   */
  async getHistory() {
    try {
      const raw = await AsyncStorage.getItem(LOG_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('[NotificationService] Error fetching history:', error);
      return [];
    }
  }

  /**
   * Clears all notification logs
   */
  async clearHistory() {
    try {
      await AsyncStorage.removeItem(LOG_STORAGE_KEY);
    } catch (error) {
      console.error('[NotificationService] Failed to clear history:', error);
    }
  }
}

const instance = new NotificationService();

// Backward compatibility exports
export const getNotificationHistory = () => instance.getHistory();
export const clearNotificationHistory = () => instance.clearHistory();
export const sendBookingConfirmationNotification = (details: BookingDetails) => instance.confirmBooking(details);
export const sendPaymentConfirmationNotification = (details: PaymentDetails) => instance.confirmPayment(details);

export default instance;
