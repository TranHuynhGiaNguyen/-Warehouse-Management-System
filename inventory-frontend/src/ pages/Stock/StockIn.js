import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Eye,
    TrendingUp,
    Calendar,
    User,
    Package,
    FileText,
    Filter
} from 'lucide-react';
import {
    stockInRecords as initialStockInRecords,
    suppliers,
    employees,
    formatCurrency,
    formatDateTime,
    getStockInStatusText,
    getStockInStatusColor
} from '../../data/mockData';
import StockInForm from './StockInForm';
import StockInDetail from './StockInDetail';
import './StockIn.css';

const StockIn = () => {
    const [stockInRecords, setStockInRecords] = useState(initialStockInRecords);
    const [filteredRecords, setFilteredRecords] = useState(initialStockInRecords);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        filterRecords();
    }, [stockInRecords, searchTerm, statusFilter, supplierFilter, dateFilter]);

    const filterRecords = () => {
        let filtered = [...stockInRecords];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(record =>
                record.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter(record => record.status === statusFilter);
        }

        // Supplier filter
        if (supplierFilter) {
            filtered = filtered.filter(record => record.supplier_id === parseInt(supplierFilter));
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

    const handleAddStockIn = () => {
        setShowForm(true);
    };

    const handleViewDetail = (record) => {
        setSelectedRecord(record);
        setShowDetail(true);
    };

    const handleFormSubmit = (formData) => {
        const newRecord = {
            id: Math.max(...stockInRecords.map(r => r.id)) + 1,
            ...formData,
            status: 'completed',
            created_at: new Date().toISOString()
        };
        setStockInRecords([newRecord, ...stockInRecords]);
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
    const totalRecords = stockInRecords.length;
    const totalAmount = stockInRecords.reduce((sum, record) => sum + record.total_amount, 0);
    const todayRecords = stockInRecords.filter(record => {
        const today = new Date();
        const recordDate = new Date(record.created_at);
        return recordDate.toDateString() === today.toDateString();
    }).length;

    if (showForm) {
        return (
            <StockInForm
                suppliers={suppliers}
                employees={employees}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
            />
        );
    }

    if (showDetail) {
        return (
            <StockInDetail
                record={selectedRecord}
                onClose={handleDetailClose}
            />
        );
    }

    return (
        <div className="stock-in">
            {/* Header */}
            <div className="stock-in__header">
                <div className="stock-in__header-left">
                    <h2 className="stock-in__title">
                        <TrendingUp className="stock-in__title-icon" />
                        Nhập kho
                    </h2>
                    <p className="stock-in__subtitle">
                        Quản lý phiếu nhập hàng từ nhà cung cấp
                    </p>
                </div>
                <button
                    className="btn btn--primary"
                    onClick={handleAddStockIn}
                >
                    <Plus size={16} />
                    Tạo phiếu nhập
                </button>
            </div>

            {/* Statistics */}
            <div className="stock-in__stats">
                <div className="stock-in__stat-card">
                    <div className="stock-in__stat-icon">
                        <FileText size={24} />
                    </div>
                    <div className="stock-in__stat-content">
                        <p className="stock-in__stat-label">Tổng phiếu nhập</p>
                        <p className="stock-in__stat-value">{totalRecords}</p>
                    </div>
                </div>

                <div className="stock-in__stat-card">
                    <div className="stock-in__stat-icon stock-in__stat-icon--success">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stock-in__stat-content">
                        <p className="stock-in__stat-label">Tổng giá trị nhập</p>
                        <p className="stock-in__stat-value">{formatCurrency(totalAmount)}</p>
                    </div>
                </div>

                <div className="stock-in__stat-card">
                    <div className="stock-in__stat-icon stock-in__stat-icon--warning">
                        <Calendar size={24} />
                    </div>
                    <div className="stock-in__stat-content">
                        <p className="stock-in__stat-label">Nhập hôm nay</p>
                        <p className="stock-in__stat-value">{todayRecords}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="stock-in__filters">
                <div className="stock-in__search">
                    <Search className="stock-in__search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo số phiếu, nhà cung cấp, nhân viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="stock-in__search-input"
                    />
                </div>

                <div className="stock-in__filter-group">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="stock-in__filter-select"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Đang xử lý</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>

                    <select
                        value={supplierFilter}
                        onChange={(e) => setSupplierFilter(e.target.value)}
                        className="stock-in__filter-select"
                    >
                        <option value="">Tất cả nhà cung cấp</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="stock-in__filter-date"
                    />
                </div>
            </div>

            {/* Records Table */}
            <div className="stock-in__table-container">
                <table className="stock-in__table">
                    <thead>
                    <tr>
                        <th>Số phiếu</th>
                        <th>Nhà cung cấp</th>
                        <th>Nhân viên</th>
                        <th>Ngày nhập</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentRecords.map(record => {
                        const statusColor = getStockInStatusColor(record.status);

                        return (
                            <tr key={record.id}>
                                <td>
                    <span className="stock-in__invoice-number">
                      {record.invoice_number}
                    </span>
                                </td>
                                <td>
                                    <div className="stock-in__supplier-info">
                      <span className="stock-in__supplier-name">
                        {record.supplier_name}
                      </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="stock-in__employee-info">
                                        <User size={14} className="stock-in__employee-icon" />
                                        <span className="stock-in__employee-name">
                        {record.employee_name}
                      </span>
                                    </div>
                                </td>
                                <td>
                    <span className="stock-in__date">
                      {formatDateTime(record.created_at)}
                    </span>
                                </td>
                                <td>
                    <span className="stock-in__amount">
                      {formatCurrency(record.total_amount)}
                    </span>
                                </td>
                                <td>
                    <span className={`badge badge--${statusColor}`}>
                      {getStockInStatusText(record.status)}
                    </span>
                                </td>
                                <td>
                                    <div className="stock-in__actions">
                                        <button
                                            className="stock-in__action-btn stock-in__action-btn--view"
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
                    <div className="stock-in__empty">
                        <TrendingUp size={48} className="stock-in__empty-icon" />
                        <p className="stock-in__empty-text">Không tìm thấy phiếu nhập nào</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="stock-in__pagination">
                    <button
                        className="stock-in__pagination-btn"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`stock-in__pagination-btn ${currentPage === i + 1 ? 'stock-in__pagination-btn--active' : ''}`}
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="stock-in__pagination-btn"
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

export default StockIn;