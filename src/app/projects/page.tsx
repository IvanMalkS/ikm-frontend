"use client"
import { useEffect, useState } from 'react';
import { projectStore } from "@/store/projectStore";
import { Button, List, Typography, Modal, Form, Input } from 'antd';
import {adminStore} from "@/store/adminStore";

const { Title } = Typography;
const { Item } = Form;

export default function Page() {
    const { projects, fetchProjects, createProject, updateProject, deleteProject } = projectStore();
    const {currentUser} = adminStore()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newProject = {
                projectName: values.projectName,
                projectDescription: values.projectDescription,
                costed: Number(values.costed), // Преобразование в число
                employees: [],
                employeeProjects: []
            };
            await createProject(newProject);
            setIsModalVisible(false);
            form.resetFields();
        } catch (errorInfo) {
            console.error('Failed to create project:', errorInfo);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleUpdateProject = async (id: number) => {
        const project = projects.find(project => project.id === id);
        if (!project) {
            console.error('project is undefined')
        }
        setCurrentProject(project);
        updateForm.setFieldsValue({
            projectName: project.projectName,
            projectDescription: project.projectDescription,
            costed: project.costed
        });
        setIsUpdateModalVisible(true);
    };

    const handleUpdateOk = async () => {
        try {
            const values = await updateForm.validateFields();
            if (!currentProject) {
                console.error('project is undefined')
            }
            const updatedProject = {
                ...currentProject,
                projectName: values.projectName,
                projectDescription: values.projectDescription,
                costed: Number(values.costed) // Преобразование в число
            };
            await updateProject(currentProject.id, updatedProject);
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
        } catch (errorInfo) {
            console.error('Failed to update project:', errorInfo);
        }
    };

    const handleUpdateCancel = () => {
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
    };

    const handleDeleteProject = async (id: number) => {
        await deleteProject(id);
    };

    return (
        <div className="p-4">
            <Title level={2} className="text-center mb-4">Projects</Title>
            <Button type="primary" onClick={showModal} className="mb-4 w-full" disabled={!currentUser}>Create Project</Button>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={projects}
                renderItem={project => (
                    <List.Item
                        key={project.id}
                        className="p-4 border rounded-lg shadow-md mb-4"
                    >
                        <List.Item.Meta
                            title={<h2 >{project.projectName}</h2>}
                            description={project.projectDescription}
                        />
                        {( !project.costed && (<p>free</p>) )}
                        {( project.costed && (<p>Costed: {project.costed}</p>))}
                        <div className="flex justify-between mt-4">
                            <Button type="primary" disabled={!currentUser} onClick={() => handleUpdateProject(project.id)}>Update</Button>
                            <Button type="primary" disabled={!currentUser} danger onClick={() => handleDeleteProject(project.id)}>Delete</Button>
                        </div>
                    </List.Item>
                )}
            />
            <Modal
                title="Create Project"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Item
                        name="projectName"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please input the project name!' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        name="projectDescription"
                        label="Project Description"
                        rules={[{ required: true, message: 'Please input the project description!' }]}
                    >
                        <Input.TextArea />
                    </Item>
                    <Item
                        name="costed"
                        label="Project Costed"
                        rules={[{ required: false, message: 'Please input the project cost!'}]}
                    >
                        <Input type="number" />
                    </Item>
                </Form>
            </Modal>
            <Modal
                title="Update Project"
                open={isUpdateModalVisible}
                onOk={handleUpdateOk}
                onCancel={handleUpdateCancel}
            >
                <Form form={updateForm} layout="vertical">
                    <Item
                        name="projectName"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please input the project name!' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        name="projectDescription"
                        label="Project Description"
                        rules={[{ required: true, message: 'Please input the project description!' }]}
                    >
                        <Input.TextArea />
                    </Item>
                    <Item
                        name="costed"
                        label="Project Costed"
                        rules={[{ required: false, message: 'Please input the project cost!'}]}
                    >
                        <Input type="number" />
                    </Item>
                </Form>
            </Modal>
        </div>
    );
};
