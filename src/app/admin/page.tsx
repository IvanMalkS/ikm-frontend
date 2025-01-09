"use client";
import { useStore } from '@/store/adminStore';
import { Form, Input, Button, message } from 'antd';
import {useEffect, useState} from 'react';

export default function Home() {
    const setCurrentUser = useStore((state) => state.setCurrentUser);
    const getAdmins = useStore((state) => state.getAdmins);
    const [loading, setLoading] = useState(false); // Состояние для индикатора загрузки



    const onFinish = async (values: { login: string; password: string }) => {
        const { login, password } = values;

        // Устанавливаем текущего пользователя
        setCurrentUser({ login, password });

        // Проверяем валидность пользователя
        setLoading(true);
        try {
            // Выполняем запрос на получение списка админов
            await getAdmins();
            message.success('Вход выполнен успешно!');
            // Здесь можно добавить перенаправление на другую страницу
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                message.error('Неверный логин или пароль');
            } else {
                message.error('Произошла ошибка при входе');
            }
            setCurrentUser(null)
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Ошибка при отправке формы:', errorInfo);
        message.error('Пожалуйста, заполните все поля корректно.');
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                gap: '16px',
                padding: '16px', // Добавляем отступы для мобильных устройств
            }}
        >
            {!useStore().currentUser && (
                <>
                    <h1 style={{ marginBottom: '24px' }}>Вход для админа</h1>
                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        style={{ width: '100%', maxWidth: '300px' }} // Ограничиваем ширину формы
                    >
                        <Form.Item
                            name="login"
                            rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
                        >
                            <Input placeholder="Логин" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
                        >
                            <Input.Password placeholder="Пароль" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                                Войти
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}
        </div>
    );
}