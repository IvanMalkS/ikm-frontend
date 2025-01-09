import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {useEffect, useState} from "react";

export interface GlobalStore {
    isAdmin: boolean | null;
    setAdmin: (isAdmin: boolean) => void; // Обновлено для явного задания роли
    loadFromStorage: () => Promise<void>;
}

export const globalStore = create<GlobalStore>()(
    persist(
        (set) => ({
            isAdmin: null,
            setAdmin: (isAdmin) => set({ isAdmin }), // Обновлено для явного задания роли
            loadFromStorage: async () => {
                return Promise.resolve();
            },
        }),
        {
            name: 'global-store', // Ключ для localStorage
            storage: createJSONStorage(() => localStorage), // Используем localStorage
        }
    )
);

export const useStore = <T>(selector: (state: GlobalStore) => T): T => {
    const [state, setState] = useState<T>(selector(globalStore.getState()));

    useEffect(() => {
        // Subscribe to the store and update state when it changes
        const unsubscribe = globalStore.subscribe((newState) => {
            setState(selector(newState));
        });

        // Load data from storage on mount
        globalStore.getState().loadFromStorage();

        // Unsubscribe on unmount
        return () => unsubscribe();
    }, [selector]);

    return state;
};