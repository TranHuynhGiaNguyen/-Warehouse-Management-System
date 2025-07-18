import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Calendar,
    Filter,
    BarChart3,
    PieChart,
    TrendingUp,
    Package,
    ShoppingCart,
    DollarSign,
    Eye,
    Search,
    RefreshCw
} from 'lucide-react';
import './Reports.css';

const Reports = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [reportData, setReportData] = useState({
        inventory: {
            totalProducts: 1250,
            totalValue: 45000000,
            lowStockItems: 23,
            outOfStockItems: 5
        },
        sales: {
            totalRevenue: 12000000,
            totalOrders: 450,
            avgOrderValue: 26667,
            topSellingProduct: 'iPhone 15 Pro'
        },
        movement: {
            stockIn: 340,
            stockOut: 287,
            returns: 12,
            adjustments: 8
        }
    });

    const [topProducts, setTopProducts] = useState([
        { id: 1, name: 'iPhone 15 Pro', category: 'Điện thoại', sold: 85, revenue: 2125000000 },
        { id: 2, name: 'Samsung Galaxy S24', category: 'Điện thoại', sold: 72, revenue: 1800000000 },
        { id: 3, name: 'MacBook Pro M3', category: 'Laptop', sold: 45, revenue: 2250000000 },
        { id: 4, name: 'iPad Air M2', category: 'Tablet', sold: 38, revenue: 760000000 },
        { id: 5, name: 'AirPods Pro 2', category: 'Phụ kiện', sold: 120, revenue: 360000000 }
    ]);

    const [categoryPerformance, setCategoryPerformance] = useState([
        { category: 'Điện thoại', products: 245, revenue: 8500000000, percentage: 45 },
        { category: 'Laptop', products: 180, revenue: 5400000000, percentage: 28 },
        { category: 'Tablet', products: 95, revenue: 2280000000, percentage: 12 },
        { category: 'Phụ kiện', products: 320, revenue: 1520000000, percentage: 8 },
        { category: 'Đồng hồ', products: 65, revenue: 1300000000, percentage: 7 }
    ]);

    const [stockMovement, setStockMovement] = useState([
        { date: '2024-01-01', stockIn: 45, stockOut: 32, balance: 13 },
        { date: '2024-01-02', stockIn: 38, stockOut: 41, balance: -3 },
        { date: '2024-01-03', stockIn: 52, stockOut: 29, balance: 23 },
        { date: '2024-01-04', stockIn: 41, stockOut: 36, balance: 5 },
        { date: '2024-01-05', stockIn: 48, stockOut: 43, balance: 5 },
        { date: '2024-01-06', stockIn: 35, stockOut: 38, balance: -3 },
        { date: '2024-01-07', stockIn: 42, stockOut: 31, balance: 11 }
    ]);

    const reportTypes = [
        {
            id: 'inventory',
            title: 'Báo cáo tồn kho',
            description: 'Tổng quan về tình hình hàng tồn kho',
            icon: Package,
            color: 'blue'
        },
        {
            id: 'sales',
            title: 'Báo cáo bán hàng',
            description: 'Thống kê doanh thu và đơn hàng',
            icon: DollarSign,
            color: 'green'
        },
        {
            id: 'movement',
            title: 'Báo cáo xuất nhập',
            description: 'Theo dõi việc xuất nhập kho',
            icon: TrendingUp,
            color: 'orange'
        },
        {
            id: 'analytics',
            title: 'Phân tích kinh doanh',
            description: 'Phân tích chi tiết hiệu suất',
            icon: BarChart3,
            color: 'purple'
        }
    ];

    const periods = [
        { value: 'day', label: 'Hôm nay' },
        { value: 'week', label: 'Tuần này' },
        { value: 'month', label: 'Tháng này' },
        { value: 'quarter', label: 'Quý này' },
        { value: 'year', label: 'Năm này' },
        { value: 'custom', label: 'Tùy chỉnh' }
    ];

    const categories = [
        { value: 'all', label: 'Tất cả danh mục' },
        { value: 'phones', label: 'Điện thoại' },
        { value: 'laptops', label: 'Laptop' },
        { value: 'tablets', label: 'Tablet' },
        { value: 'accessories', label: 'Phụ kiện' },
        { value: 'watches', label: 'Đồng hồ' }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const exportReport = (type) => {
        // Simulate export functionality
        console.log(`Exporting ${type} report...`);
        // In real implementation, this would generate and download the report
    };

    return (
        <div className="reports">
            <div className="reports__header">
                <div className="reports__title">
                    <h2>Báo cáo & Thống kê</h2>
                    <p>Theo dõi và phân tích hiệu suất kinh doanh</p>
                </div>
                <div className="reports__actions">
                    <button className="btn btn--secondary">
                        <RefreshCw size={16} />
                        Làm mới
                    </button>
                    <button className="btn btn--primary">
                        <Download size={16} />
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="reports__filters">
                <div className="filter-group">
                    <label>Thời gian</label>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="filter-select"
                    >
                        {periods.map(period => (
                            <option key={period.value} value={period.value}>
                                {period.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Danh mục</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="filter-select"
                    >
                        {categories.map(category => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Report Types */}
            <div className="reports__types">
                {reportTypes.map(type => {
                    const IconComponent = type.icon;
                    return (
                        <div key={type.id} className={`report-type report-type--${type.color}`}>
                            <div className="report-type__icon">
                                <IconComponent size={24} />
                            </div>
                            <div className="report-type__content">
                                <h3>{type.title}</h3>
                                <p>{type.description}</p>
                            </div>
                            <div className="report-type__actions">
                                <button
                                    className="btn btn--sm btn--outline"
                                    onClick={() => exportReport(type.id)}
                                >
                                    <Eye size={14} />
                                    Xem
                                </button>
                                <button
                                    className="btn btn--sm btn--primary"
                                    onClick={() => exportReport(type.id)}
                                >
                                    <Download size={14} />
                                    Tải
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="reports__content">
                {/* Summary Cards */}
                <div className="reports__summary">
                    <div className="summary-card">
                        <div className="summary-card__header">
                            <Package size={20} />
                            <h4>Tồn kho</h4>
                        </div>
                        <div className="summary-card__body">
                            <div className="summary-stat">
                                <span className="summary-stat__value">{reportData.inventory.totalProducts}</span>
                                <span className="summary-stat__label">Tổng sản phẩm</span>
                            </div>
                            <div className="summary-stat">
                                <span className="summary-stat__value">{formatCurrency(reportData.inventory.totalValue)}</span>
                                <span className="summary-stat__label">Giá trị tồn kho</span>
                            </div>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-card__header">
                            <DollarSign size={20} />
                            <h4>Doanh thu</h4>
                        </div>
                        <div className="summary-card__body">
                            <div className="summary-stat">
                                <span className="summary-stat__value">{formatCurrency(reportData.sales.totalRevenue)}</span>
                                <span className="summary-stat__label">Tổng doanh thu</span>
                            </div>
                            <div className="summary-stat">
                                <span className="summary-stat__value">{reportData.sales.totalOrders}</span>
                                <span className="summary-stat__label">Đơn hàng</span>
                            </div>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-card__header">
                            <TrendingUp size={20} />
                            <h4>Xuất nhập</h4>
                        </div>
                        <div className="summary-card__body">
                            <div className="summary-stat">
                                <span className="summary-stat__value text-green-600">{reportData.movement.stockIn}</span>
                                <span className="summary-stat__label">Nhập kho</span>
                            </div>
                            <div className="summary-stat">
                                <span className="summary-stat__value text-red-600">{reportData.movement.stockOut}</span>
                                <span className="summary-stat__label">Xuất kho</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="reports__section">
                    <div className="section-card">
                        <div className="section-card__header">
                            <h3>Sản phẩm bán chạy</h3>
                            <button className="btn btn--text">
                                <Download size={16} />
                                Xuất Excel
                            </button>
                        </div>
                        <div className="section-card__body">
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Danh mục</th>
                                        <th>Đã bán</th>
                                        <th>Doanh thu</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {topProducts.map(product => (
                                        <tr key={product.id}>
                                            <td className="font-medium">{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{product.sold}</td>
                                            <td>{formatCurrency(product.revenue)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Performance */}
                <div className="reports__section">
                    <div className="section-card">
                        <div className="section-card__header">
                            <h3>Hiệu suất theo danh mục</h3>
                            <button className="btn btn--text">
                                <PieChart size={16} />
                                Biểu đồ
                            </button>
                        </div>
                        <div className="section-card__body">
                            <div className="category-performance">
                                {categoryPerformance.map(category => (
                                    <div key={category.category} className="category-item">
                                        <div className="category-item__info">
                                            <h4>{category.category}</h4>
                                            <p>{category.products} sản phẩm</p>
                                        </div>
                                        <div className="category-item__revenue">
                                            <span className="revenue-amount">{formatCurrency(category.revenue)}</span>
                                            <div className="revenue-bar">
                                                <div
                                                    className="revenue-bar__fill"
                                                    style={{ width: `${category.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="category-item__percentage">
                                            <span>{category.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock Movement Chart */}
                <div className="reports__section">
                    <div className="section-card">
                        <div className="section-card__header">
                            <h3>Biểu đồ xuất nhập kho</h3>
                            <button className="btn btn--text">
                                <BarChart3 size={16} />
                                Chi tiết
                            </button>
                        </div>
                        <div className="section-card__body">
                            <div className="stock-movement-chart">
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <div className="legend-color legend-color--green"></div>
                                        <span>Nhập kho</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-color legend-color--red"></div>
                                        <span>Xuất kho</span>
                                    </div>
                                </div>
                                <div className="chart-container">
                                    {stockMovement.map((item, index) => (
                                        <div key={index} className="chart-bar">
                                            <div className="chart-bar__in" style={{ height: `${item.stockIn * 2}px` }}></div>
                                            <div className="chart-bar__out" style={{ height: `${item.stockOut * 2}px` }}></div>
                                            <div className="chart-bar__label">{new Date(item.date).getDate()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;