"use client"
import { useEffect, useState } from 'react';
import { projectStore } from "@/store/projectStore";
import { Button, List, Typography, Modal, Form, Input } from 'antd';

const { Title } = Typography;
const { Item } = Form;

export default function Page() {
    const { projects, fetchProjects, createProject, updateProject, deleteProject } = projectStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProjects();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newProject = {
                projectName: values.projectName,
                projectDescription: values.projectDescription,
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
        const updatedProject = { projectName: 'Updated Project', projectDescription: 'Updated Description', employees: [], employeeProjects: [] };
        await updateProject(id, updatedProject);
    };

    const handleDeleteProject = async (id: number) => {
        await deleteProject(id);
    };

    return (
        <div className="p-4">
            <Title level={2} className="text-center mb-4">Projects</Title>
            <Button type="primary" onClick={showModal} className="mb-4 w-full">Create Project</Button>
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
                            title={<a href={`#${project.id}`}>{project.projectName}</a>}
                            description={project.projectDescription}
                        />
                        <div className="flex justify-between mt-4">
                            <Button type="primary" onClick={() => handleUpdateProject(project.id)}>Update</Button>
                            <Button type="primary" danger onClick={() => handleDeleteProject(project.id)}>Delete</Button>
                        </div>
                    </List.Item>
                )}
            />
            <Modal
                title="Create Project"
                visible={isModalVisible}
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
                </Form>
            </Modal>
        </div>
    );
};
