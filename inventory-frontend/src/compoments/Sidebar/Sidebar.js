import React from 'react';
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

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Tổng quan', icon: Home },
        { id: 'products', label: 'Sản phẩm', icon: Package },
        { id: 'categories', label: 'Danh mục', icon: Settings },
        { id: 'stock-in', label: 'Nhập hàng', icon: TrendingUp },
        { id: 'stock-out', label: 'Xuất hàng', icon: ShoppingCart },
        { id: 'reports', label: 'Báo cáo', icon: FileText },
    ];

    const handleMenuClick = (menuId) => {
        setActiveMenu(menuId);
        setSidebarOpen(false);
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
                                onClick={() => handleMenuClick(item.id)}
                                className={`sidebar__menu-item ${
                                    activeMenu === item.id ? 'sidebar__menu-item--active' : ''
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