"use client";

import { Layout, Menu } from "antd";
import Link from "next/link";

const { Header } = Layout;

export default function AppHeader() {
    return (
        <Header className="flex items-center">
            <div className="demo-logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                className="flex-1"
            >
                <Menu.Item key="1">
                    <Link href="/admins">Admins</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link href="/employee">Employee</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link href="/projects">Projects</Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link href="/schedule">Schedule</Link>
                </Menu.Item>
            </Menu>
        </Header>
    );
}