import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Eye,
    ShoppingCart,
    Calendar,
    User,
    Package,
    FileText,
    Users
} from 'lucide-react';
import {
    stockOutRecords as initialStockOutRecords,
    employees,
    formatCurrency,
    formatDateTime,
    getStockOutStatusText,
    getStockOutStatusColor
} from '../../data/mockData';
import StockOutForm from './StockOutForm';
import StockOutDetail from './StockOutDetail';
import './StockOut.css';

const StockOut = () => {
    const [stockOutRecords, setStockOutRecords] = useState(initialStockOutRecords);
    const [filteredRecords, setFilteredRecords] = useState(initialStockOutRecords);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [employeeFilter, setEmployeeFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        filterRecords();
    }, [stockOutRecords, searchTerm, statusFilter, employeeFilter, dateFilter]);

    const filterRecords = () => {
        let filtered = [...stockOutRecords];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(record =>
                record.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter(record => record.status === statusFilter);
        }

        // Employee filter
        if (employeeFilter) {
            filtered = filtered.filter(record => record.employee_id === parseInt(employeeFilter));
        }

        // Date filter
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.created_at);
                return recordDate.toDateString() === filterDate.toDateString();
            });
        }

        // Sort by created_at (newest first)
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setFilteredRecords(filtered);
        setCurrentPage(1);
    };

    const handleAddStockOut = () => {
        setShowForm(true);
    };

    const handleViewDetail = (record) => {
        setSelectedRecord(record);
        setShowDetail(true);
    };

    const handleFormSubmit = (formData) => {
        const newRecord = {
            id: Math.max(...stockOutRecords.map(r => r.id)) + 1,
            ...formData,
            status: 'completed',
            created_at: new Date().toISOString()
        };
        setStockOutRecords([newRecord, ...stockOutRecords]);
        setShowForm(false);
    };

    const handleFormCancel = () => {
        setShowForm(false);
    };

    const handleDetailClose = () => {
        setShowDetail(false);
        setSelectedRecord(null);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Statistics
    const totalRecords = stockOutRecords.length;
    const totalAmount = stockOutRecords.reduce((sum, record) => sum + record.total_amount, 0);
    const todayRecords = stockOutRecords.filter(record => {
        const today = new Date();
        const recordDate = new Date(record.created_at);
        return recordDate.toDateString() === today.toDateString();
    }).length;

    if (showForm) {
        return (
            <StockOutForm
                employees={employees}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
            />
        );
    }

    if (showDetail) {
        return (
            <StockOutDetail
                record={selectedRecord}
                onClose={handleDetailClose}
            />
        );
    }

    return (
        <div className="stock-out">
            {/* Header */}
            <div className="stock-out__header">
                <div className="stock-out__header-left">
                    <h2 className="stock-out__title">
                        <ShoppingCart className="stock-out__title-icon" />
                        Xuất kho
                    </h2>
                    <p className="stock-out__subtitle">
                        Quản lý phiếu xuất hàng cho khách hàng
                    </p>
                </div>
                <button
                    className="btn btn--primary"
                    onClick={handleAddStockOut}
                >
                    <Plus size={16} />
                    Tạo phiếu xuất
                </button>
            </div>

            {/* Statistics */}
            <div className="stock-out__stats">
                <div className="stock-out__stat-card">
                    <div className="stock-out__stat-icon">
                        <FileText size={24} />
                    </div>
                    <div className="stock-out__stat-content">
                        <p className="stock-out__stat-label">Tổng phiếu xuất</p>
                        <p className="stock-out__stat-value">{totalRecords}</p>
                    </div>
                </div>

                <div className="stock-out__stat-card">
                    <div className="stock-out__stat-icon stock-out__stat-icon--error">
                        <ShoppingCart size={24} />
                    </div>
                    <div className="stock-out__stat-content">
                        <p className="stock-out__stat-label">Tổng giá trị xuất</p>
                        <p className="stock-out__stat-value">{formatCurrency(totalAmount)}</p>
                    </div>
                </div>

                <div className="stock-out__stat-card">
                    <div className="stock-out__stat-icon stock-out__stat-icon--warning">
                        <Calendar size={24} />
                    </div>
                    <div className="stock-out__stat-content">
                        <p className="stock-out__stat-label">Xuất hôm nay</p>
                        <p className="stock-out__stat-value">{todayRecords}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="stock-out__filters">
                <div className="stock-out__search">
                    <Search className="stock-out__search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo số phiếu, khách hàng, nhân viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="stock-out__search-input"
                    />
                </div>

                <div className="stock-out__filter-group">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="stock-out__filter-select"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Đang xử lý</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>

                    <select
                        value={employeeFilter}
                        onChange={(e) => setEmployeeFilter(e.target.value)}
                        className="stock-out__filter-select"
                    >
                        <option value="">Tất cả nhân viên</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="stock-out__filter-date"
                    />
                </div>
            </div>

            {/* Records Table */}
            <div className="stock-out__table-container">
                <table className="stock-out__table">
                    <thead>
                    <tr>
                        <th>Số phiếu</th>
                        <th>Khách hàng</th>
                        <th>Nhân viên</th>
                        <th>Ngày xuất</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentRecords.map(record => {
                        const statusColor = getStockOutStatusColor(record.status);

                        return (
                            <tr key={record.id}>
                                <td>
                    <span className="stock-out__invoice-number">
                      {record.invoice_number}
                    </span>
                                </td>
                                <td>
                                    <div className="stock-out__customer-info">
                                        <Users size={14} className="stock-out__customer-icon" />
                                        <span className="stock-out__customer-name">
                        {record.customer_name}
                      </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="stock-out__employee-info">
                                        <User size={14} className="stock-out__employee-icon" />
                                        <span className="stock-out__employee-name">
                        {record.employee_name}
                      </span>
                                    </div>
                                </td>
                                <td>
                    <span className="stock-out__date">
                      {formatDateTime(record.created_at)}
                    </span>
                                </td>
                                <td>
                    <span className="stock-out__amount">
                      {formatCurrency(record.total_amount)}
                    </span>
                                </td>
                                <td>
                    <span className={`badge badge--${statusColor}`}>
                      {getStockOutStatusText(record.status)}
                    </span>
                                </td>
                                <td>
                                    <div className="stock-out__actions">
                                        <button
                                            className="stock-out__action-btn stock-out__action-btn--view"
                                            onClick={() => handleViewDetail(record)}
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {currentRecords.length === 0 && (
                    <div className="stock-out__empty">
                        <ShoppingCart size={48} className="stock-out__empty-icon" />
                        <p className="stock-out__empty-text">Không tìm thấy phiếu xuất nào</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="stock-out__pagination">
                    <button
                        className="stock-out__pagination-btn"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`stock-out__pagination-btn ${currentPage === i + 1 ? 'stock-out__pagination-btn--active' : ''}`}
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="stock-out__pagination-btn"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default StockOut;