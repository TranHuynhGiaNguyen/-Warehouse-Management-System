import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './compoments/Sidebar/Sidebar';

import Dashboard from './compoments/Dashboard';
import Products from './ pages/Products';
import Categories from './ pages/Categories';
import StockIn from './ pages/Stock/StockIn';
import StockOut from './ pages/Stock/StockOut';
import Reports from './ pages/Reports/Reports';

import './App.css';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="App">
            {/* Layout container */}
            <div style={{
                display: 'flex',
                minHeight: '100vh'
            }}>
                {/* Sidebar */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Main content area */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '0'
                }}>
                    {/* Header với menu button */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: 'var(--bg-primary)',
                        borderBottom: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10
                    }}>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="mobile-menu-btn"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                marginRight: '1rem',
                                padding: '0.5rem',
                                borderRadius: '0.375rem',
                                color: 'var(--text-primary)',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            margin: '0'
                        }}>
                            Hệ thống quản lý kho
                        </h1>
                    </div>

                    {/* Main Content */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        backgroundColor: 'var(--bg-tertiary)',
                        overflow: 'auto'
                    }}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/stock-in" element={<StockIn />} />
                            <Route path="/stock-out" element={<StockOut />} />
                            <Route path="/reports" element={<Reports />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;