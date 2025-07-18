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
import Products from '../../ pages/Products/Product';
import Categories from '../../ pages/Categories/Categories';
import StockIn from '../../ pages/Stock/StockIn';
import StockOut from '../../ pages/Stock/StockOut';
import Reports from '../../ pages/Reports/Reports';
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
                return <Products />;
            case 'categories':
                return <Categories />;
            case 'stock-in':
                return <StockIn />;
            case 'stock-out':
                return <StockOut />;
            case 'reports':
                return <Reports />;
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

export default Layout;