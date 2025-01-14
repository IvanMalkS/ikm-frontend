"use client"
import { useEffect, useState } from 'react';
import { scheduleStore } from "@/store/scheduleStore";
import { useEmployeeStore } from "@/store/employeeStore";
import { Button, List, Typography, Modal, Form, Select, DatePicker, TimePicker } from 'antd';
import { adminStore } from "@/store/adminStore";

const { Title } = Typography;
const { Item } = Form;
const { Option } = Select;

export default function SchedulePage() {
    const { schedules, fetchSchedules, createSchedule, updateSchedule, deleteSchedule } = scheduleStore();
    const { employees, fetchEmployees, isLoading, error } = useEmployeeStore();
    const { currentUser } = adminStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();

    useEffect(() => {
        fetchSchedules();
        fetchEmployees();
    }, [fetchSchedules, fetchEmployees]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newSchedule = {
                scheduleDate: values.scheduleDate.format('YYYY-MM-DD'),
                startTime: values.startTime.format('HH:mm:ss'),
                employeeId: values.employeeId,
                employeeName: employees.find(emp => emp.id === values.employeeId).name
            };
            await createSchedule(newSchedule);
            setIsModalVisible(false);
            form.resetFields();
        } catch (errorInfo) {
            console.error('Failed to create schedule:', errorInfo);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleUpdateSchedule = async (id) => {
        const schedule = schedules.find(schedule => schedule.id === id);
        if (!schedule) {
            console.error('Schedule is undefined');
            return;
        }
        setCurrentSchedule(schedule);
        updateForm.setFieldsValue({
            scheduleDate: schedule.scheduleDate,
            startTime: schedule.startTime,
            employeeId: schedule.employeeId
        });
        setIsUpdateModalVisible(true);
    };

    const handleUpdateOk = async () => {
        try {
            const values = await updateForm.validateFields();
            if (!currentSchedule) {
                console.error('Schedule is undefined');
                return;
            }
            const updatedSchedule = {
                ...currentSchedule,
                scheduleDate: values.scheduleDate.format('YYYY-MM-DD'),
                startTime: values.startTime.format('HH:mm:ss'),
                employeeId: values.employeeId,
                employeeName: employees.find(emp => emp.id === values.employeeId).name
            };
            await updateSchedule(currentSchedule.id, updatedSchedule);
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
        } catch (errorInfo) {
            console.error('Failed to update schedule:', errorInfo);
        }
    };

    const handleUpdateCancel = () => {
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
    };

    const handleDeleteSchedule = async (id) => {
        await deleteSchedule(id);
    };

    return (
        <div className="p-4">
            <Title level={2} className="text-center mb-4">Schedules</Title>
            <Button type="primary" onClick={showModal} className="mb-4 w-full">Create Schedule</Button>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={schedules}
                renderItem={schedule => (
                    <List.Item
                        key={schedule.id}
                        className="p-4 border rounded-lg shadow-md mb-4"
                    >
                        <List.Item.Meta
                            title={<h2>{schedule.employeeName}</h2>}
                            description={`Date: ${schedule.scheduleDate}, Time: ${schedule.startTime}`}
                        />
                        <div className="flex justify-between mt-4">
                            <Button type="primary" onClick={() => handleUpdateSchedule(schedule.id)}>Update</Button>
                            <Button type="primary" danger onClick={() => handleDeleteSchedule(schedule.id)}>Delete</Button>
                        </div>
                    </List.Item>
                )}
            />
            <Modal
                title="Create Schedule"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Item
                        name="scheduleDate"
                        label="Schedule Date"
                        rules={[{ required: true, message: 'Please input the schedule date!' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" />
                    </Item>
                    <Item
                        name="startTime"
                        label="Start Time"
                        rules={[{ required: true, message: 'Please input the start time!' }]}
                    >
                        <TimePicker format="HH:mm:ss" />
                    </Item>
                    <Item
                        name="employeeId"
                        label="Employee"
                        rules={[{ required: true, message: 'Please select the employee!' }]}
                    >
                        <Select loading={isLoading}>
                            {employees.map(employee => (
                                <Option key={employee.id} value={employee.id}>
                                    {employee.firstName}
                                </Option>
                            ))}
                        </Select>
                    </Item>
                </Form>
            </Modal>
            <Modal
                title="Update Schedule"
                open={isUpdateModalVisible}
                onOk={handleUpdateOk}
                onCancel={handleUpdateCancel}
            >
                <Form form={updateForm} layout="vertical">
                    <Item
                        name="scheduleDate"
                        label="Schedule Date"
                        rules={[{ required: true, message: 'Please input the schedule date!' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" />
                    </Item>
                    <Item
                        name="startTime"
                        label="Start Time"
                        rules={[{ required: true, message: 'Please input the start time!' }]}
                    >
                        <TimePicker format="HH:mm:ss" />
                    </Item>
                    <Item
                        name="employeeId"
                        label="Employee"
                        rules={[{ required: true, message: 'Please select the employee!' }]}
                    >
                        <Select loading={isLoading}>
                            {employees.map(employee => (
                                <Option key={employee.id} value={employee.id}>
                                    {employee.firstName }
                                </Option>
                            ))}
                        </Select>
                    </Item>
                </Form>
            </Modal>
        </div>
    );
};
