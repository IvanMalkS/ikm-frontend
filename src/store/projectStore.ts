import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { adminStore } from './adminStore'; // Импортируйте adminStore

const URL = process.env.BACKEND_API_URL || 'http://localhost:8080/rest/projects';

interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
}

interface EmployeeProject {
    id: {
        employeeId: number;
        projectId: number;
    };
}

interface Project {
    id: number;
    projectName: string;
    projectDescription: string;
    employees: Employee[];
    employeeProjects: EmployeeProject[];
}

interface ProjectState {
    projects: Project[];
    fetchProjects: () => Promise<void>;
    createProject: (project: Omit<Project, 'id'>) => Promise<void>;
    updateProject: (id: number, project: Partial<Project>) => Promise<void>;
    deleteProject: (id: number) => Promise<void>;
}

export const projectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            fetchProjects: async () => {
                try {
                    const response = await axios.get(URL);
                    set({ projects: response.data });
                } catch (error) {
                    console.error('Error fetching projects:', error);
                }
            },
            createProject: async (project) => {
                try {
                    const { currentUser } = adminStore.getState();
                    const response = await axios.post(URL, project, {
                        headers: {
                            'login': currentUser?.login,
                            'password': currentUser?.password
                        }
                    });
                    set({ projects: [...get().projects, response.data] });
                } catch (error) {
                    console.error('Error creating project:', error);
                }
            },
            updateProject: async (id, project) => {
                try {
                    const { currentUser } = adminStore.getState();
                    const response = await axios.put(`${URL}/${id}`, project, {
                        headers: {
                            'login': currentUser?.login,
                            'password': currentUser?.password
                        }
                    });
                    set({
                        projects: get().projects.map(p => (p.id === id ? response.data : p)),
                    });
                } catch (error) {
                    console.error('Error updating project:', error);
                }
            },
            deleteProject: async (id) => {
                try {
                    const { currentUser } = adminStore.getState();
                    if (!currentUser.login || !currentUser.password || !currentUser) {
                        console.error('Error deleting project: currentUser is null', );
                    }
                    await axios.delete(`${URL}/${id}`, {
                        headers: {
                            'login': currentUser.login,
                            'password': currentUser.password
                        }
                    });
                    set({ projects: get().projects.filter(p => p.id !== id) });
                } catch (error) {
                    console.error('Error deleting project:', error);
                }
            },
        }),
        {
            name: 'project-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
