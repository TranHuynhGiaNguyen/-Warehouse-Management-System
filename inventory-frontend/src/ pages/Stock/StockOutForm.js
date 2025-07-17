import React, { useState } from 'react';
import {
    ArrowLeft,
    Save,
    X,
    Plus,
    Trash2,
    Package,
    Calculator,
    AlertTriangle
} from 'lucide-react';
import {
    products,
    formatCurrency
} from '../../data/mockData';
import './StockOutForm.css';

const StockOutForm = ({ employees, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        employee_id: 1, // Default to admin
        customer_name: '',
        invoice_number: '',
        notes: ''
    });

    const [items, setItems] = useState([
        {
            id: 1,
            product_id: '',
            quantity: 1,
            unit_price: 0
        }
    ]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customer_name.trim()) {
            newErrors.customer_name = 'Tên khách hàng là bắt buộc';
        }

        if (!formData.invoice_number.trim()) {
            newErrors.invoice_number = 'Số phiếu xuất là bắt buộc';
        }

        // Validate items
        const itemErrors = {};
        items.forEach((item, index) => {
            if (!item.product_id) {
                itemErrors[`${index}_product_id`] = 'Vui lòng chọn sản phẩm';
            } else {
                // Check stock availability
                const product = products.find(p => p.id === parseInt(item.product_id));
                if (product && item.quantity > product.current_stock) {
                    itemErrors[`${index}_quantity`] = `Chỉ còn ${product.current_stock} sản phẩm trong kho`;
                }
            }

            if (!item.quantity || item.quantity <= 0) {
                itemErrors[`${index}_quantity`] = 'Số lượng phải lớn hơn 0';
            }

            if (!item.unit_price || item.unit_price <= 0) {
                itemErrors[`${index}_unit_price`] = 'Đơn giá phải lớn hơn 0';
            }
        });

        if (Object.keys(itemErrors).length > 0) {
            newErrors.items = itemErrors;
        }

        if (items.length === 0) {
            newErrors.items = { general: 'Phải có ít nhất một sản phẩm' };
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };

        // Auto-fill unit price when product is selected
        if (field === 'product_id' && value) {
            const selectedProduct = products.find(p => p.id === parseInt(value));
            if (selectedProduct) {
                updatedItems[index].unit_price = selectedProduct.price;
            }
        }

        setItems(updatedItems);

        // Clear item errors
        if (errors.items && errors.items[`${index}_${field}`]) {
            const newErrors = { ...errors };
            delete newErrors.items[`${index}_${field}`];
            if (Object.keys(newErrors.items).length === 0) {
                delete newErrors.items;
            }
            setErrors(newErrors);
        }
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                id: Math.max(...items.map(i => i.id)) + 1,
                product_id: '',
                quantity: 1,
                unit_price: 0
            }
        ]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            return total + (item.quantity * item.unit_price);
        }, 0);
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const employee = employees.find(e => e.id === parseInt(formData.employee_id));

            const submitData = {
                ...formData,
                employee_id: parseInt(formData.employee_id),
                employee_name: employee?.name || '',
                total_amount: calculateTotal(),
                details: items.map((item, index) => {
                    const product = products.find(p => p.id === parseInt(item.product_id));
                    return {
                        id: index + 1,
                        product_id: parseInt(item.product_id),
                        product_name: product?.name || '',
                        product_code: product?.code || '',
                        quantity: parseInt(item.quantity),
                        unit_price: parseFloat(item.unit_price),
                        total_price: parseInt(item.quantity) * parseFloat(item.unit_price)
                    };
                })
            };

            await onSubmit(submitData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSelectedProductIds = () => {
        return items.map(item => parseInt(item.product_id)).filter(id => !isNaN(id));
    };

    const getAvailableStock = (productId) => {
        const product = products.find(p => p.id === parseInt(productId));
        return product ? product.current_stock : 0;
    };

    return (
        <div className="stock-out-form">
            <div className="stock-out-form__header">
                <button
                    type="button"
                    className="stock-out-form__back-btn"
                    onClick={onCancel}
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
                <h2 className="stock-out-form__title">Tạo phiếu xuất kho</h2>
            </div>

            <div className="stock-out-form__content">
                {/* Basic Information */}
                <div className="stock-out-form__section">
                    <h3 className="stock-out-form__section-title">Thông tin chung</h3>

                    <div className="stock-out-form__row">
                        <div className="form-group">
                            <label className="form-label">
                                Tên khách hàng <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleInputChange}
                                className={`form-input ${errors.customer_name ? 'form-input--error' : ''}`}
                                placeholder="Nhập tên khách hàng"
                            />
                            {errors.customer_name && <span className="form-error">{errors.customer_name}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Số phiếu xuất <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="invoice_number"
                                value={formData.invoice_number}
                                onChange={handleInputChange}
                                className={`form-input ${errors.invoice_number ? 'form-input--error' : ''}`}
                                placeholder="Nhập số phiếu"
                            />
                            {errors.invoice_number && <span className="form-error">{errors.invoice_number}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nhân viên xuất</label>
                        <select
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            {employees.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Ghi chú</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="Ghi chú thêm (tùy chọn)"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Products */}
                <div className="stock-out-form__section">
                    <div className="stock-out-form__section-header">
                        <h3 className="stock-out-form__section-title">Danh sách sản phẩm</h3>
                        <button
                            type="button"
                            className="btn btn--secondary"
                            onClick={addItem}
                        >
                            <Plus size={16} />
                            Thêm sản phẩm
                        </button>
                    </div>

                    {errors.items && errors.items.general && (
                        <div className="form-error">{errors.items.general}</div>
                    )}

                    <div className="stock-out-form__items">
                        {items.map((item, index) => {
                            const selectedProductIds = getSelectedProductIds();
                            const availableProducts = products.filter(product =>
                                (!selectedProductIds.includes(product.id) || product.id === parseInt(item.product_id)) &&
                                product.current_stock > 0
                            );
                            const currentStock = getAvailableStock(item.product_id);
                            const isLowStock = item.product_id && currentStock < 10;

                            return (
                                <div key={item.id} className="stock-out-form__item">
                                    <div className="stock-out-form__item-header">
                                        <span className="stock-out-form__item-number">#{index + 1}</span>
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                className="stock-out-form__remove-btn"
                                                onClick={() => removeItem(index)}
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="stock-out-form__item-content">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Sản phẩm <span className="required">*</span>
                                            </label>
                                            <select
                                                value={item.product_id}
                                                onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                                className={`form-select ${errors.items && errors.items[`${index}_product_id`] ? 'form-select--error' : ''}`}
                                            >
                                                <option value="">Chọn sản phẩm</option>
                                                {availableProducts.map(product => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.code} - {product.name} (Còn: {product.current_stock})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.items && errors.items[`${index}_product_id`] && (
                                                <span className="form-error">{errors.items[`${index}_product_id`]}</span>
                                            )}
                                        </div>

                                        {item.product_id && (
                                            <div className="stock-out-form__stock-info">
                                                <Package size={14} />
                                                <span className={`stock-out-form__stock-text ${isLowStock ? 'stock-out-form__stock-text--warning' : ''}`}>
                          Tồn kho: {currentStock} sản phẩm
                                                    {isLowStock && <AlertTriangle size={14} className="stock-out-form__warning-icon" />}
                        </span>
                                            </div>
                                        )}

                                        <div className="stock-out-form__item-row">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Số lượng <span className="required">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                    className={`form-input ${errors.items && errors.items[`${index}_quantity`] ? 'form-input--error' : ''}`}
                                                    min="1"
                                                    max={currentStock}
                                                />
                                                {errors.items && errors.items[`${index}_quantity`] && (
                                                    <span className="form-error">{errors.items[`${index}_quantity`]}</span>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">
                                                    Đơn giá <span className="required">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={item.unit_price}
                                                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                                    className={`form-input ${errors.items && errors.items[`${index}_unit_price`] ? 'form-input--error' : ''}`}
                                                    min="0"
                                                    step="1000"
                                                />
                                                {errors.items && errors.items[`${index}_unit_price`] && (
                                                    <span className="form-error">{errors.items[`${index}_unit_price`]}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="stock-out-form__item-total">
                                            <strong>Thành tiền: {formatCurrency(item.quantity * item.unit_price)}</strong>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary */}
                <div className="stock-out-form__summary">
                    <div className="stock-out-form__summary-content">
                        <div className="stock-out-form__summary-row">
                            <span className="stock-out-form__summary-label">Tổng số sản phẩm:</span>
                            <span className="stock-out-form__summary-value">{items.length}</span>
                        </div>
                        <div className="stock-out-form__summary-row">
                            <span className="stock-out-form__summary-label">Tổng số lượng:</span>
                            <span className="stock-out-form__summary-value">
                {items.reduce((total, item) => total + parseInt(item.quantity || 0), 0)}
              </span>
                        </div>
                        <div className="stock-out-form__summary-row stock-out-form__summary-row--total">
                            <span className="stock-out-form__summary-label">Tổng tiền:</span>
                            <span className="stock-out-form__summary-value">{formatCurrency(calculateTotal())}</span>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="stock-out-form__actions">
                    <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        <X size={16} />
                        Hủy
                    </button>
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Save size={16} />
                        {isSubmitting ? 'Đang lưu...' : 'Tạo phiếu xuất'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockOutForm;