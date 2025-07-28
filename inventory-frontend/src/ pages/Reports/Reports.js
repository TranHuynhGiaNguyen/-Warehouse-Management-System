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
                    <div className="btn-conteiner">
                        <a className="btn-content" href="#">
                            <span className="btn-title">LÀM MỚI</span>
                            <span className="icon-arrow">
          <svg
              width="66px"
              height="43px"
              viewBox="0 0 66 43"
              xmlns="http://www.w3.org/2000/svg"
          >
            <g id="arrow" fill="none" fillRule="evenodd">
              <path
                  id="arrow-icon-one"
                  d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                  fill="#FFFFFF"
              ></path>
              <path
                  id="arrow-icon-two"
                  d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                  fill="#FFFFFF"
              ></path>
              <path
                  id="arrow-icon-three"
                  d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                  fill="#FFFFFF"
              ></path>
            </g>
          </svg>
        </span>
                        </a>
                    </div>
                    <div className="btn-conteiner">
                        <a className="btn-content" >
                            <span className="btn-title">TẠO BÁO CÁO</span>
                            <span className="icon-arrow">
          <svg
              width="66px"
              height="43px"
              viewBox="0 0 66 43"
              xmlns="http://www.w3.org/2000/svg"
          >
            <g id="arrow" fill="none" fillRule="evenodd">
              <path
                  id="arrow-icon-one"
                  d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                  fill="#FFFFFF"
              ></path>
              <path
                  id="arrow-icon-two"
                  d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                  fill="#FFFFFF"
              ></path>
              <path
                  id="arrow-icon-three"
                  d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                  fill="#FFFFFF"
              ></path>
            </g>
          </svg>
        </span>
                        </a>
                    </div>
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