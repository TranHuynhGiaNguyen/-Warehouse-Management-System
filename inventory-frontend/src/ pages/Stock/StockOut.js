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
                <div className="btn-conteiner">
                    <a className="btn-content" href="#">
                        <span className="btn-title">TẠO PHIẾU XUẤT</span>
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