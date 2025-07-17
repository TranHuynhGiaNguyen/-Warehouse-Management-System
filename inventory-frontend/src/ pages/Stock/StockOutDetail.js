import React from 'react';
import {
    ArrowLeft,
    FileText,
    User,
    Users,
    Calendar,
    Package,
    DollarSign,
    StickyNote,
    Printer
} from 'lucide-react';
import {
    formatCurrency,
    formatDateTime,
    getStockOutStatusText,
    getStockOutStatusColor
} from '../../data/mockData';
import './StockOutDetail.css';

const StockOutDetail = ({ record, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    const totalQuantity = record.details.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="stock-out-detail">
            <div className="stock-out-detail__header">
                <button
                    type="button"
                    className="stock-out-detail__back-btn"
                    onClick={onClose}
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
                <h2 className="stock-out-detail__title">Chi tiết phiếu xuất</h2>
                <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={handlePrint}
                >
                    <Printer size={16} />
                    In phiếu
                </button>
            </div>

            <div className="stock-out-detail__content">
                {/* Invoice Info */}
                <div className="stock-out-detail__invoice-header">
                    <div className="stock-out-detail__invoice-info">
                        <h3 className="stock-out-detail__invoice-number">
                            Phiếu xuất #{record.invoice_number}
                        </h3>
                        <div className="stock-out-detail__status">
              <span className={`badge badge--${getStockOutStatusColor(record.status)}`}>
                {getStockOutStatusText(record.status)}
              </span>
                        </div>
                    </div>
                    <div className="stock-out-detail__date">
                        <Calendar size={16} />
                        <span>{formatDateTime(record.created_at)}</span>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="stock-out-detail__section">
                    <h4 className="stock-out-detail__section-title">Thông tin chung</h4>
                    <div className="stock-out-detail__info-grid">
                        <div className="stock-out-detail__info-item">
                            <div className="stock-out-detail__info-icon">
                                <Users size={20} />
                            </div>
                            <div className="stock-out-detail__info-content">
                                <label className="stock-out-detail__info-label">Khách hàng</label>
                                <span className="stock-out-detail__info-value">{record.customer_name}</span>
                            </div>
                        </div>

                        <div className="stock-out-detail__info-item">
                            <div className="stock-out-detail__info-icon">
                                <User size={20} />
                            </div>
                            <div className="stock-out-detail__info-content">
                                <label className="stock-out-detail__info-label">Nhân viên xuất</label>
                                <span className="stock-out-detail__info-value">{record.employee_name}</span>
                            </div>
                        </div>

                        <div className="stock-out-detail__info-item">
                            <div className="stock-out-detail__info-icon">
                                <FileText size={20} />
                            </div>
                            <div className="stock-out-detail__info-content">
                                <label className="stock-out-detail__info-label">Số phiếu</label>
                                <span className="stock-out-detail__info-value">{record.invoice_number}</span>
                            </div>
                        </div>

                        <div className="stock-out-detail__info-item">
                            <div className="stock-out-detail__info-icon">
                                <DollarSign size={20} />
                            </div>
                            <div className="stock-out-detail__info-content">
                                <label className="stock-out-detail__info-label">Tổng tiền</label>
                                <span className="stock-out-detail__info-value stock-out-detail__info-value--amount">
                  {formatCurrency(record.total_amount)}
                </span>
                            </div>
                        </div>
                    </div>

                    {record.notes && (
                        <div className="stock-out-detail__notes">
                            <div className="stock-out-detail__notes-icon">
                                <StickyNote size={16} />
                            </div>
                            <div className="stock-out-detail__notes-content">
                                <label className="stock-out-detail__notes-label">Ghi chú</label>
                                <p className="stock-out-detail__notes-text">{record.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Details */}
                <div className="stock-out-detail__section">
                    <h4 className="stock-out-detail__section-title">Chi tiết sản phẩm</h4>

                    <div className="stock-out-detail__products-table">
                        <table className="stock-out-detail__table">
                            <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã SP</th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {record.details.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="stock-out-detail__table-index">
                                        {index + 1}
                                    </td>
                                    <td>
                      <span className="stock-out-detail__product-code">
                        {item.product_code}
                      </span>
                                    </td>
                                    <td>
                      <span className="stock-out-detail__product-name">
                        {item.product_name}
                      </span>
                                    </td>
                                    <td className="stock-out-detail__quantity">
                                        {item.quantity.toLocaleString('vi-VN')}
                                    </td>
                                    <td className="stock-out-detail__price">
                                        {formatCurrency(item.unit_price)}
                                    </td>
                                    <td className="stock-out-detail__total">
                                        {formatCurrency(item.total_price)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary */}
                <div className="stock-out-detail__summary">
                    <div className="stock-out-detail__summary-grid">
                        <div className="stock-out-detail__summary-item">
                            <Package size={16} className="stock-out-detail__summary-icon" />
                            <div className="stock-out-detail__summary-content">
                                <span className="stock-out-detail__summary-label">Tổng sản phẩm</span>
                                <span className="stock-out-detail__summary-value">{record.details.length}</span>
                            </div>
                        </div>

                        <div className="stock-out-detail__summary-item">
                            <Package size={16} className="stock-out-detail__summary-icon" />
                            <div className="stock-out-detail__summary-content">
                                <span className="stock-out-detail__summary-label">Tổng số lượng</span>
                                <span className="stock-out-detail__summary-value">{totalQuantity.toLocaleString('vi-VN')}</span>
                            </div>
                        </div>

                        <div className="stock-out-detail__summary-item stock-out-detail__summary-item--total">
                            <DollarSign size={16} className="stock-out-detail__summary-icon" />
                            <div className="stock-out-detail__summary-content">
                                <span className="stock-out-detail__summary-label">Tổng tiền</span>
                                <span className="stock-out-detail__summary-value">
                  {formatCurrency(record.total_amount)}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockOutDetail;