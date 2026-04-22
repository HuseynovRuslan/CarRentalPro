import { CarModel } from "@/types/car-model.types";
import { create } from "zustand";

interface FavoriteState {
    favorites: CarModel[];
    addFavorite: (car: CarModel) => void;
    removeFavorite: (carId: string) => void;
    isFavorite: (carId: string) => boolean;
    toggleFavorite: (car: CarModel) => void;
}

export const useFavoriteState = create<FavoriteState>((set, get) => ({
    favorites: [],

    addFavorite: (car) =>
        set((state) => ({
            favorites: [...state.favorites, car],
        })),

    removeFavorite: (carId) =>
        set((state) => ({
            favorites: state.favorites.filter((c) => c.id !== carId),
        })),

    isFavorite: (carId) => get().favorites.some((c) => c.id === carId),

    toggleFavorite: (car) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(car.id)) {
            removeFavorite(car.id);
        } else {
            addFavorite(car);
        }
    },
}));
