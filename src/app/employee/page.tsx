"use client";
import { useEffect, useState } from 'react';
import { useEmployeeStore } from "@/store/employeeStore";
import { Button, List, Typography, Modal, Form, Input, Select } from 'antd';
import { ProjectSelect } from "@/app/projects/projectSelect";

const { Title } = Typography;
const { Item } = Form;
const { Option } = Select;

export default function Page() {
    const { employees, fetchEmployees, createEmployee, updateEmployee, deleteEmployee, isLoading } = useEmployeeStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    if (isLoading) {
        return <div>Loading employees...</div>; // Индикатор загрузки
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newEmployee = {
                firstName: values.firstName,
                lastName: values.lastName,
                position: values.position,
                isActive: values.isActive,
                projectIds: values.projectIds || [], // Передаем выбранные ID проектов
                employeeProjectIds: [],
                scheduleIds: []
            };
            await createEmployee(newEmployee);
            setIsModalVisible(false);
            form.resetFields();
        } catch (errorInfo) {
            console.error('Failed to create employee:', errorInfo);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleUpdateEmployee = async (id) => {
        const employee = employees.find(emp => emp.id === id);
        if (!employee) {
            console.error('Employee is undefined');
            return;
        }
        setCurrentEmployee(employee);
        updateForm.setFieldsValue({
            firstName: employee.firstName,
            lastName: employee.lastName,
            position: employee.position,
            isActive: employee.isActive,
            projectIds: employee.projectNames || [] // Устанавливаем текущие ID проектов
        });
        setIsUpdateModalVisible(true);
    };

    const handleUpdateOk = async () => {
        try {
            const values = await updateForm.validateFields();
            if (!currentEmployee) {
                console.error('Employee is undefined');
                return;
            }
            const updatedEmployee = {
                ...currentEmployee,
                firstName: values.firstName,
                lastName: values.lastName,
                position: values.position,
                isActive: values.isActive,
                projectIds: values.projectIds // Обновляем ID проектов
            };
            await updateEmployee(currentEmployee.id, updatedEmployee);
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
        } catch (errorInfo) {
            console.error('Failed to update employee:', errorInfo);
        }
    };

    const handleUpdateCancel = () => {
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
    };

    const handleDeleteEmployee = async (id) => {
        await deleteEmployee(id);
    };

    return (
        <div className="p-4">
            <Title level={2} className="text-center mb-4">Employees</Title>
            <Button type="primary" onClick={showModal} className="mb-4 w-full">Create Employee</Button>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={employees}
                renderItem={employee => (
                    <List.Item
                        key={employee.id}
                        className="p-4 border rounded-lg shadow-md mb-4"
                    >
                        <List.Item.Meta
                            title={<a href={`#${employee.id}`}>{employee.firstName} {employee.lastName}</a>}
                            description={
                                <div>
                                    <p>Position: {employee.position}</p>
                                    <p>Active: {employee.isActive ? 'Yes' : 'No'}</p>
                                    <p>Projects:</p>
                                    {employee.projectNames && employee.projectNames.length > 0 ? (
                                        <ul>
                                            {employee.projectNames.map((projectName, index) => (
                                                <li key={index}>{projectName}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>This employee is not assigned to any projects.</p>
                                    )}
                                </div>
                            }
                        />
                        <div className="flex justify-between mt-4">
                            <Button type="primary" onClick={() => handleUpdateEmployee(employee.id)}>Update</Button>
                            <Button type="primary" danger onClick={() => handleDeleteEmployee(employee.id)}>Delete</Button>
                        </div>
                    </List.Item>
                )}
            />
            <Modal
                title="Create Employee"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please input the first name!' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please input the last name!' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        name="position"
                        label="Position"
                        rules={[{ required: true, message: 'Please input the position!' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        name="isActive"
                        label="Is Active"
                        valuePropName="checked"
                        rules={[{ required: true, message: 'Please specify if the employee is active!' }]}
                    >
                        <Select>
                            <Option value={true}>Yes</Option>
                            <Option value={false}>No</Option>
                        </Select>
                    </Item>
                    <Item
                        name="projectIds"
                        label="Project IDs"
                    >
                        <ProjectSelect />
                    </Item>
                </Form>
            </Modal>
            <Modal
                title="Update Employee"
                open={isUpdateModalVisible}
                onOk={handleUpdateOk}
                onCancel={handleUpdateCancel}
            >
                <Form form={updateForm} layout="vertical">
                    <Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please input the first name!' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please input the last name!' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        name="position"
                        label="Position"
                        rules={[{ required: true, message: 'Please input the position!' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        name="isActive"
                        label="Is Active"
                        valuePropName="checked"
                        rules={[{ required: true, message: 'Please specify if the employee is active!' }]}
                    >
                        <Select>
                            <Option value={true}>Yes</Option>
                            <Option value={false}>No</Option>
                        </Select>
                    </Item>
                    <Item
                        name="projectIds"
                        label="Project IDs"
                    >
                        <ProjectSelect />
                    </Item>
                </Form>
            </Modal>
        </div>
    );
}