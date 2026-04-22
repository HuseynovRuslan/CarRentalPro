import { layoutTheme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAddBookingStore } from "@/state/bookingStore";
import { ThemeType } from "@/types/theme.type";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";


export default function RangeCalendar() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    const { setStartDate: setStartDateStore, setEndDate: setEndDateStore } = useAddBookingStore();

    const today = new Date().toISOString().split('T')[0];

    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const onDayPress = (day: any) => {
        const selectedDate = day.dateString;

        if (selectedDate < today) return

        if (!startDate) {
            setStartDate(selectedDate);
            setEndDate(null);
            setStartDateStore(selectedDate);
            setEndDateStore("");
            return;
        }

        if (startDate && !endDate) {
            if (selectedDate < startDate) {
                setStartDate(selectedDate);
                setEndDate(null);
                setStartDateStore(selectedDate);
                setEndDateStore("");
            } else {
                setEndDate(selectedDate);
                setEndDateStore(selectedDate);
            }
            return
        }

        setStartDate(selectedDate);
        setEndDate(null);
        setStartDateStore(selectedDate);
        setEndDateStore("");
    }

    const getMarkedDates = () => {
        if (!startDate) return {};

        const marked: any = {};

        if (startDate && !endDate) {
            marked[startDate] = {
                startingDay: true,
                endingDay: true,
                color: layoutTheme.colors.secondary,
                textColor: "white",

            };
            return marked;
        }

        if (startDate && endDate) {
            let curr = new Date(startDate);
            const last = new Date(endDate);

            while (curr <= last) {
                const dateString = curr.toISOString().split('T')[0];

                marked[dateString] = {
                    color: layoutTheme.colors.secondary,
                    textColor: "white",
                };

                if (dateString === startDate) {
                    marked[dateString].startingDay = true;
                }

                if (dateString === endDate) {
                    marked[dateString].endingDay = true;
                }

                curr.setDate(curr.getDate() + 1);
            }
        }

        return marked; // Dövr bitdikdən sonra obyekti qaytarırıq
    };

    return (
        <View style={styles.container}>
            <Calendar
                style={styles.calendar}
                markingType="period"
                markedDates={getMarkedDates()}
                onDayPress={onDayPress}
                minDate={today}
                theme={{
                    dayTextColor: colorScheme === "dark"
                        ? layoutTheme.colors.text.white
                        : layoutTheme.colors.text.primary,
                    arrowColor: layoutTheme.colors.secondary,
                    todayTextColor: layoutTheme.colors.secondary,
                    textDayFontFamily: layoutTheme.fonts.inter.regular,
                    textMonthFontFamily: layoutTheme.fonts.inter.bold,
                    textDayHeaderFontFamily: layoutTheme.fonts.inter.bold,
                    textDayHeaderFontSize: 16,
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    calendarBackground: colorScheme === "dark"
                        ? layoutTheme.colors.background.primary
                        : layoutTheme.colors.background.white,
                    textDisabledColor: colorScheme === "dark"
                        ? layoutTheme.colors.gray
                        : layoutTheme.colors.lightGray,

                }}
            />

        </View>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        padding: 16,
        borderRadius: 28,
        backgroundColor: theme === "dark"
            ? layoutTheme.colors.background.primary
            : layoutTheme.colors.background.white,
    },
    title: {
        fontSize: 20,
        fontFamily: layoutTheme.fonts.inter.bold,
        textAlign: "center",
        color: theme === "dark"
            ? layoutTheme.colors.text.primary
            : layoutTheme.colors.text.white,
    },
    calendar: {
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: theme === "dark"
            ? layoutTheme.colors.background.primary
            : layoutTheme.colors.background.white,
    }
})