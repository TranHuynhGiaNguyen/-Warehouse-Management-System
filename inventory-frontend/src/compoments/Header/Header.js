import React from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // thêm dòng này
import './ Header.css';

const Header = ({ setSidebarOpen, activeMenu, menuItems }) => {
    const navigate = useNavigate(); // khởi tạo navigate
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
                <button className="animated-button" onClick={() => navigate('/login')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
                        <path
                            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                        ></path>
                    </svg>
                    <span className="text">ĐĂNG NHẬP </span>
                    <span className="circle"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
                        <path
                            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                        ></path>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
