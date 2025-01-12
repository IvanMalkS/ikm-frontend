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
    admins: AdminUser[];
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
            admins: [],
            setCurrentUser: (user) => {
                set({ currentUser: user });
            },
            axiosInstance: axios.create({
                baseURL: URL,
            }),

            createAdmin: async (admin) => {
                const { currentUser, axiosInstance } = get();
                const config = {
                    headers: {
                        'login': currentUser?.login,
                        'password': currentUser?.password,
                    },
                };
                const response = await axiosInstance.post<AdminUser>('/admins', admin, config);
                set((state) => ({ admins: [...state.admins, response.data] }));
                return response.data;
            },

            getAdmins: async () => {
                const { currentUser, axiosInstance } = get();
                const config = {
                    headers: {
                        'login': currentUser?.login,
                        'password': currentUser?.password,
                    },
                };
                const response = await axiosInstance.get<AdminUser[]>('/admins', config);
                set({ admins: response.data });
                return response.data;
            },

            getAdminById: async (id) => {
                const { currentUser, axiosInstance } = get();
                const config = {
                    headers: {
                        'login': currentUser?.login,
                        'password': currentUser?.password,
                    },
                };
                const response = await axiosInstance.get<AdminUser>(`/admins/${id}`, config);
                return response.data;
            },

            updateAdmin: async (id, admin) => {
                const { currentUser, axiosInstance } = get();
                const config = {
                    headers: {
                        'login': currentUser?.login,
                        'password': currentUser?.password,
                    },
                };
                const response = await axiosInstance.patch<AdminUser>(`/admins/${id}`, admin, config);
                set((state) => ({
                    admins: state.admins.map((a) => (a.id === id ? response.data : a)),
                }));
                return response.data;
            },

            deleteAdmin: async (id) => {
                const { currentUser, axiosInstance } = get();
                const config = {
                    headers: {
                        'login': currentUser?.login,
                        'password': currentUser?.password,
                    },
                };
                await axiosInstance.delete(`/admins/${id}`, config);
                set((state) => ({
                    admins: state.admins.filter((a) => a.id !== id),
                }));
            },
        }),
        {
            name: 'admin-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const useStore = adminStore;
