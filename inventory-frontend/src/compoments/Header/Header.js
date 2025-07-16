import React from 'react';
import { Menu } from 'lucide-react';
import './ Header.css';

const Header = ({ setSidebarOpen, activeMenu, menuItems }) => {
    const currentMenuItem = menuItems.find(item => item.id === activeMenu);

    return (
        <header className="header">
            <button
                onClick={() => setSidebarOpen(true)}
                className="header__menu-btn"
            >
                <Menu size={24} />
            </button>

            <h2 className="header__title">
                {currentMenuItem?.label || 'Trang chủ'}
            </h2>

            <div className="header__user">
                <span className="header__user-name">Xin chào, Admin</span>
                <div className="header__user-avatar">
                    A
                </div>
            </div>
        </header>
    );
};

export default Header;