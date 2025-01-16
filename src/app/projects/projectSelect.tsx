import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { projectStore } from '@/store/projectStore';

const { Option } = Select;

interface ProjectSelectProps {
    value?: number[];
    onChange?: (value: number[]) => void;
}

export const ProjectSelect = ({ value, onChange }: ProjectSelectProps) => {
    const [projects, setProjects] = useState([]);

    // Загружаем проекты из store
    useEffect(() => {
        const fetchProjects = async () => {
            await projectStore.getState().fetchProjects();
            setProjects(projectStore.getState().projects);
        };
        fetchProjects();
    }, []);

    return (
        <Select
            mode="multiple"
    placeholder="Select projects"
    value={value}
    onChange={onChange}
        >
        {projects.map((project) => (
                <Option key={project.id} value={project.id}>
            {project.projectName}
            </Option>
))}
    </Select>
);
};