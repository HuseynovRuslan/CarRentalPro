import { getNotificationHistory, clearNotificationHistory } from "@/services/NotificationService";
import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type NotificationHistoryItem = {
  id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  receivedAt: string;
  scheduledAt: string;
};

export default function NotificationsScreen() {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      getNotificationHistory()
        .then((list) => {
          if (!cancelled)
            setHistory((Array.isArray(list) ? list : []) as NotificationHistoryItem[]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const list = await getNotificationHistory();
    setHistory((Array.isArray(list) ? list : []) as NotificationHistoryItem[]);
    setRefreshing(false);
  }, []);

  const onClear = useCallback(async () => {
    await clearNotificationHistory();
    setHistory([]);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={layoutTheme.colors.secondary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={onClear} hitSlop={12} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={22} color={layoutTheme.colors.secondary} />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color={colorScheme === "dark" ? layoutTheme.colors.text.secondary : "#999"}
          />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>
            Booking and payment confirmations will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardBody} numberOfLines={3}>
                {item.body}
              </Text>
              <Text style={styles.cardTime}>
                {item.receivedAt
                  ? new Date(item.receivedAt).toLocaleString()
                  : ""}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme === "dark"
          ? layoutTheme.colors.background.primary
          : layoutTheme.colors.background.white,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor:
        theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    },
    title: {
      fontFamily: layoutTheme.fonts.inter.bold,
      fontSize: 22,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.white
          : layoutTheme.colors.text.primary,
    },
    clearButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    clearText: {
      fontFamily: layoutTheme.fonts.inter.medium,
      fontSize: 14,
      color: layoutTheme.colors.secondary,
    },
    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyText: {
      fontFamily: layoutTheme.fonts.inter.semiBold,
      fontSize: 18,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.white
          : layoutTheme.colors.text.primary,
      marginTop: 16,
    },
    emptySubtext: {
      fontFamily: layoutTheme.fonts.inter.regular,
      fontSize: 14,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.secondary
          : "#666",
      marginTop: 8,
      textAlign: "center",
    },
    listContent: {
      padding: 16,
      paddingBottom: 32,
    },
    card: {
      backgroundColor:
        theme === "dark"
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.04)",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    cardTitle: {
      fontFamily: layoutTheme.fonts.inter.semiBold,
      fontSize: 16,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.white
          : layoutTheme.colors.text.primary,
    },
    cardBody: {
      fontFamily: layoutTheme.fonts.inter.regular,
      fontSize: 14,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.secondary
          : "#555",
      marginTop: 4,
    },
    cardTime: {
      fontFamily: layoutTheme.fonts.inter.regular,
      fontSize: 12,
      color:
        theme === "dark"
          ? "rgba(255,255,255,0.5)"
          : "#888",
      marginTop: 8,
    },
  });
