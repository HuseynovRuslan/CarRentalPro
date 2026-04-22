import { create } from "zustand";

interface AddBookingState {
    startDate: string;
    endDate: string;
    carId: string;
    selectedCardId: string;
    totalDays: number;
    totalPrice: number;
    setStartDate: (startDate: string) => void;
    setEndDate: (endDate: string) => void;
    setCarId: (carId: string) => void;
    setSelectedCardId: (cardId: string) => void;
    setTotalDays: (days: number) => void;
    setTotalPrice: (price: number) => void;
}

export const useAddBookingStore = create<AddBookingState>((set) => ({
    startDate: "",
    endDate: "",
    carId: "",
    selectedCardId: "",
    totalDays: 0,
    totalPrice: 0,
    setStartDate: (startDate: string) => set({ startDate }),
    setEndDate: (endDate: string) => set({ endDate }),
    setCarId: (carId: string) => set({ carId }),
    setSelectedCardId: (selectedCardId: string) => set({ selectedCardId }),
    setTotalDays: (totalDays: number) => set({ totalDays }),
    setTotalPrice: (totalPrice: number) => set({ totalPrice }),
}));