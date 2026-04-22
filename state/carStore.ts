import { CarModel } from "@/types/car-model.types";
import { create } from "zustand";

interface CarState {
    // Brand filter used on the Home screen (CarBrands component)
    brand: string[];
    setBrand: (brand: string[]) => void;

    // Full selected car object for the booking flow
    selectedCar: CarModel | null;
    setSelectedCar: (car: CarModel) => void;
    clearSelectedCar: () => void;
}

export const useCarState = create<CarState>((set) => ({
    // Brand filter
    brand: [],
    setBrand: (brand) => set({ brand }),

    // Selected car
    selectedCar: null,
    setSelectedCar: (car) => set({ selectedCar: car }),
    clearSelectedCar: () => set({ selectedCar: null }),
}));