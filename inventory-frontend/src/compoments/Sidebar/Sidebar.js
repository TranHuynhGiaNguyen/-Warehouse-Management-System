import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Package,
    ShoppingCart,
    TrendingUp,
    FileText,
    X,
    Home,
    Settings,
    Users
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Tổng quan', icon: Home, path: '/' },
        { id: 'products', label: 'Sản phẩm', icon: Package, path: '/products' },
        { id: 'categories', label: 'Danh mục', icon: Settings, path: '/categories' },
        { id: 'stock-in', label: 'Nhập hàng', icon: TrendingUp, path: '/stock-in' },
        { id: 'stock-out', label: 'Xuất hàng', icon: ShoppingCart, path: '/stock-out' },
        { id: 'reports', label: 'Báo cáo', icon: FileText, path: '/reports' },
    ];

    const handleMenuClick = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    // Kiểm tra menu item nào đang active dựa trên URL hiện tại
    const isActiveMenu = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
                {/* Logo */}
                <div className="sidebar__header">
                    <h1 className="sidebar__title">Quản lý tồn kho</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="sidebar__close-btn"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="sidebar__nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.path)}
                                className={`sidebar__menu-item ${
                                    isActiveMenu(item.path) ? 'sidebar__menu-item--active' : ''
                                }`}
                            >
                                <Icon size={20} className="sidebar__menu-icon" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Overlay cho mobile */}
            {sidebarOpen && (
                <div
                    className="sidebar__overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;