import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const URL = process.env.BACKEND_API_URL || 'http://localhost:8080/rest/';

interface AdminUser {
    id?: number;
    login: string;
    password: string;
}

export interface AdminStore {
    currentUser: AdminUser | null;
    setCurrentUser: (user: AdminUser | null) => void;
    axiosInstance: ReturnType<typeof axios.create>;

    createAdmin: (admin: Omit<AdminUser, 'id'>) => Promise<AdminUser>;
    getAdmins: () => Promise<AdminUser[]>;
    getAdminById: (id: number) => Promise<AdminUser>;
    updateAdmin: (id: number, admin: Partial<AdminUser>) => Promise<AdminUser>;
    deleteAdmin: (id: number) => Promise<void>;
}

export const adminStore = create<AdminStore>()(
    persist(
        (set, get) => ({
            currentUser: null,
            setCurrentUser: (user) => {
                set({ currentUser: user });

                if (user) {
                    get().axiosInstance.interceptors.request.use((config) => {
                        config.headers['login'] = user.login;
                        config.headers['password'] = user.password;
                        return config;
                    });
                } else {

                    get().axiosInstance.interceptors.request.clear();
                }
            },
            axiosInstance: axios.create({
                baseURL: URL,
            }),

            createAdmin: async (admin) => {
                const response = await get().axiosInstance.post<AdminUser>('/admins', admin);
                return response.data;
            },

            getAdmins: async () => {
                const response = await get().axiosInstance.get<AdminUser[]>('/admins');
                return response.data;
            },

            getAdminById: async (id) => {
                const response = await get().axiosInstance.get<AdminUser>(`/admins/${id}`);
                return response.data;
            },

            updateAdmin: async (id, admin) => {
                const response = await get().axiosInstance.patch<AdminUser>(`/admins/${id}`, admin);
                return response.data;
            },

            deleteAdmin: async (id) => {
                await get().axiosInstance.delete(`/admins/${id}`);
            },
        }),
        {
            name: 'admin-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const useStore = adminStore;