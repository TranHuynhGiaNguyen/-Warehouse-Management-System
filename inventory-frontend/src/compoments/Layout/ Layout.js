import React, { useState } from 'react';
import {
    Package,
    ShoppingCart,
    TrendingUp,
    FileText,
    Home,
    Settings,
    Users
} from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Dashboard from '../Dashboard/Dashboard';
import './Layout.css';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Tổng quan', icon: Home },
        { id: 'products', label: 'Sản phẩm', icon: Package },
        { id: 'categories', label: 'Danh mục', icon: Settings },
        { id: 'stock-in', label: 'Nhập hàng', icon: TrendingUp },
        { id: 'stock-out', label: 'Xuất hàng', icon: ShoppingCart },
        { id: 'reports', label: 'Báo cáo', icon: FileText },
        { id: 'suppliers', label: 'Nhà cung cấp', icon: Users }
    ];

    const renderContent = () => {
        switch(activeMenu) {
            case 'dashboard':
                return <Dashboard />;
            case 'products':
                return <ProductsPlaceholder />;
            case 'categories':
                return <CategoriesPlaceholder />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="layout">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />

            <div className="layout__main">
                <Header
                    setSidebarOpen={setSidebarOpen}
                    activeMenu={activeMenu}
                    menuItems={menuItems}
                />

                <main className="layout__content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

// Placeholder components
const ProductsPlaceholder = () => (
    <div className="placeholder">
        <h3 className="placeholder__title">Quản lý sản phẩm</h3>
        <p className="placeholder__text">Chức năng quản lý sản phẩm sẽ được phát triển ở bước tiếp theo.</p>
    </div>
);

const CategoriesPlaceholder = () => (
    <div className="placeholder">
        <h3 className="placeholder__title">Quản lý danh mục</h3>
        <p className="placeholder__text">Chức năng quản lý danh mục sẽ được phát triển ở bước tiếp theo.</p>
    </div>
);

export default Layout;