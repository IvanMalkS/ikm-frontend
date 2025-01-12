"use client";

import { Layout, Menu, Typography } from 'antd';
import Link from 'next/link';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Home() {
    return (
        <Layout className="min-h-screen">
            {/* Хедер */}


            {/* Контент */}
            <Content className="p-8">
                <div className="text-center">
                    <Title level={2}>Welcome to the Admin Panel</Title>
                    <p className="text-lg">
                        Use the navigation above to explore different sections.
                    </p>
                </div>
            </Content>
        </Layout>
    );
}