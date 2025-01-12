"use client"
import { useEffect, useState } from 'react';
import { adminStore } from "@/store/adminStore";
import { Button, List, Typography, Modal, Form, Input } from 'antd';
import { AdminModal } from "@/app/admin/adminModal";

const { Title } = Typography;
const { Item } = Form;

export default function AdminPage() {
    const { admins, getAdmins, createAdmin, updateAdmin, deleteAdmin, currentUser } = adminStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();

    useEffect(() => {
        getAdmins();
    }, [getAdmins]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newAdmin = {
                login: values.login,
                password: values.password,
            };
            await createAdmin(newAdmin);
            setIsModalVisible(false);
            form.resetFields();
        } catch (errorInfo) {
            console.error('Failed to create admin:', errorInfo);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleUpdateAdmin = async (id: number) => {
        const admin = admins.find(admin => admin.id === id);
        if (!admin) {
            console.error('Admin is undefined');
        }
        setCurrentAdmin(admin);
        updateForm.setFieldsValue({
            login: admin.login,
            password: admin.password,
        });
        setIsUpdateModalVisible(true);
    };

    const handleUpdateOk = async () => {
        try {
            const values = await updateForm.validateFields();
            if (!currentAdmin) {
                console.error('Admin is undefined');
            }
            const updatedAdmin = {
                ...currentAdmin,
                login: values.login,
                password: values.password,
            };
            await updateAdmin(currentAdmin.id, updatedAdmin);
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
        } catch (errorInfo) {
            console.error('Failed to update admin:', errorInfo);
        }
    };

    const handleUpdateCancel = () => {
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
    };

    const handleDeleteAdmin = async (id: number) => {
        await deleteAdmin(id);
    };

    return (
        <>
            {currentUser ? (
                <div className="p-4">
                    <Title level={2} className="text-center mb-4">Admins</Title>
                    <Button type="primary" onClick={showModal} className="mb-4 w-full">Create Admin</Button>
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={admins}
                        renderItem={admin => (
                            <List.Item
                                key={admin.id}
                                className="p-4 border rounded-lg shadow-md mb-4"
                            >
                                <List.Item.Meta
                                    title={<h2>{admin.login}</h2>}
                                    description={`Password: ${admin.password}`}
                                />
                                <div className="flex justify-between mt-4">
                                    <Button type="primary" onClick={() => handleUpdateAdmin(admin.id)}>Update</Button>
                                    <Button type="primary" danger onClick={() => handleDeleteAdmin(admin.id)}>Delete</Button>
                                </div>
                            </List.Item>
                        )}
                    />
                    <Modal
                        title="Create Admin"
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Form form={form} layout="vertical">
                            <Item
                                name="login"
                                label="Login"
                                rules={[{ required: true, message: 'Please input the login!' }]}
                            >
                                <Input />
                            </Item>
                            <Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please input the password!' }]}
                            >
                                <Input.Password />
                            </Item>
                        </Form>
                    </Modal>
                    <Modal
                        title="Update Admin"
                        open={isUpdateModalVisible}
                        onOk={handleUpdateOk}
                        onCancel={handleUpdateCancel}
                    >
                        <Form form={updateForm} layout="vertical">
                            <Item
                                name="login"
                                label="Login"
                                rules={[{ required: true, message: 'Please input the login!' }]}
                            >
                                <Input />
                            </Item>
                            <Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please input the password!' }]}
                            >
                                <Input.Password />
                            </Item>
                        </Form>
                    </Modal>
                </div>
            ) : (
                <AdminModal />
            )}
        </>
    );
};
