import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const URL = process.env.BACKEND_API_URL || 'http://localhost:8080/rest/schedules';

export const scheduleStore = create<ScheduleState>()(
    persist(
        (set, get) => ({
            schedules: [],
            fetchSchedules: async () => {
                try {
                    const response = await axios.get(URL);
                    set({ schedules: response.data });
                } catch (error) {
                    console.error('Error fetching schedules:', error);
                }
            },
            createSchedule: async (schedule) => {
                try {
                    const response = await axios.post(URL, schedule);
                    set({ schedules: [...get().schedules, response.data] });
                } catch (error) {
                    console.error('Error creating schedule:', error);
                }
            },
            updateSchedule: async (id, schedule) => {
                try {
                    const response = await axios.patch(`${URL}/${id}`, schedule);
                    set({
                        schedules: get().schedules.map(s => (s.id === id ? { ...s, ...response.data } : s)),
                    });
                } catch (error) {
                    console.error('Error updating schedule:', error);
                }
            },
            deleteSchedule: async (id) => {
                try {
                    await axios.delete(`${URL}/${id}`);
                    set({ schedules: get().schedules.filter(s => s.id !== id) });
                } catch (error) {
                    console.error('Error deleting schedule:', error);
                }
            },
        }),
        {
            name: 'schedule-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
