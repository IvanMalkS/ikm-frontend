import { create } from "zustand";
import axios from "axios";

const URL = process.env.BACKEND_API_URL || 'http://localhost:8080/rest/employees';

export const useEmployeeStore = create((set) => ({
    employees: [],
    isLoading: false, // Новое состояние для управления загрузкой
    error: null,

    // Получение всех сотрудников
    fetchEmployees: async () => {
        set({ isLoading: true, error: null }); // Устанавливаем isLoading в true перед запросом
        try {
            const response = await axios.get(URL);
            set({ employees: response.data, isLoading: false }); // Устанавливаем isLoading в false после успешного запроса
        } catch (error) {
            set({ error: error.message, isLoading: false }); // Устанавливаем isLoading в false в случае ошибки
        }
    },

    // Получение одного сотрудника по ID
    fetchEmployeeById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${URL}/${id}`);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Создание нового сотрудника
    createEmployee: async (employeeData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(URL, employeeData);
            set((state) => ({ employees: [...state.employees, response.data], isLoading: false }));
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateEmployee: async (id, employeeData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.patch(`${URL}/${id}`, employeeData);
            set((state) => ({
                employees: state.employees.map((emp) =>
                    emp.id === id ? { ...emp, ...response.data } : emp
                ),
                isLoading: false,
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Удаление сотрудника
    deleteEmployee: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`${URL}/${id}`);
            set((state) => ({
                employees: state.employees.filter((emp) => emp.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },
}));