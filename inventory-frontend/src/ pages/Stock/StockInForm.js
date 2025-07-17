import React, { useState } from 'react';
import {
    ArrowLeft,
    Save,
    X,
    Plus,
    Trash2,
    Package,
    Calculator
} from 'lucide-react';
import {
    products,
    formatCurrency
} from '../../data/mockData';
import './StockInForm.css';

const StockInForm = ({ suppliers, employees, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        supplier_id: '',
        employee_id: 1, // Default to admin
        invoice_number: '',
        notes: ''
    });

    const [items, setItems] = useState([
        {
            id: 1,
            product_id: '',
            quantity: 1,
            unit_price: 0,
            expiry_date: ''
        }
    ]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.supplier_id) {
            newErrors.supplier_id = 'Vui lòng chọn nhà cung cấp';
        }

        if (!formData.invoice_number.trim()) {
            newErrors.invoice_number = 'Số phiếu nhập là bắt buộc';
        }

        // Validate items
        const itemErrors = {};
        items.forEach((item, index) => {
            if (!item.product_id) {
                itemErrors[`${index}_product_id`] = 'Vui lòng chọn sản phẩm';
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
                unit_price: 0,
                expiry_date: ''
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
            const supplier = suppliers.find(s => s.id === parseInt(formData.supplier_id));
            const employee = employees.find(e => e.id === parseInt(formData.employee_id));

            const submitData = {
                ...formData,
                supplier_id: parseInt(formData.supplier_id),
                supplier_name: supplier?.name || '',
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
                        total_price: parseInt(item.quantity) * parseFloat(item.unit_price),
                        expiry_date: item.expiry_date || null
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

    return (
        <div className="stock-in-form">
            <div className="stock-in-form__header">
                <button
                    type="button"
                    className="stock-in-form__back-btn"
                    onClick={onCancel}
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
                <h2 className="stock-in-form__title">Tạo phiếu nhập kho</h2>
            </div>

            <div className="stock-in-form__content">
                {/* Basic Information */}
                <div className="stock-in-form__section">
                    <h3 className="stock-in-form__section-title">Thông tin chung</h3>

                    <div className="stock-in-form__row">
                        <div className="form-group">
                            <label className="form-label">
                                Nhà cung cấp <span className="required">*</span>
                            </label>
                            <select
                                name="supplier_id"
                                value={formData.supplier_id}
                                onChange={handleInputChange}
                                className={`form-select ${errors.supplier_id ? 'form-select--error' : ''}`}
                            >
                                <option value="">Chọn nhà cung cấp</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                            {errors.supplier_id && <span className="form-error">{errors.supplier_id}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Số phiếu nhập <span className="required">*</span>
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
                <div className="stock-in-form__section">
                    <div className="stock-in-form__section-header">
                        <h3 className="stock-in-form__section-title">Danh sách sản phẩm</h3>
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

                    <div className="stock-in-form__items">
                        {items.map((item, index) => {
                            const selectedProductIds = getSelectedProductIds();
                            const availableProducts = products.filter(product =>
                                !selectedProductIds.includes(product.id) || product.id === parseInt(item.product_id)
                            );

                            return (
                                <div key={item.id} className="stock-in-form__item">
                                    <div className="stock-in-form__item-header">
                                        <span className="stock-in-form__item-number">#{index + 1}</span>
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                className="stock-in-form__remove-btn"
                                                onClick={() => removeItem(index)}
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="stock-in-form__item-content">
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
                                                        {product.code} - {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.items && errors.items[`${index}_product_id`] && (
                                                <span className="form-error">{errors.items[`${index}_product_id`]}</span>
                                            )}
                                        </div>

                                        <div className="stock-in-form__item-row">
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

                                            <div className="form-group">
                                                <label className="form-label">Hạn sử dụng</label>
                                                <input
                                                    type="date"
                                                    value={item.expiry_date}
                                                    onChange={(e) => handleItemChange(index, 'expiry_date', e.target.value)}
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>

                                        <div className="stock-in-form__item-total">
                                            <strong>Thành tiền: {formatCurrency(item.quantity * item.unit_price)}</strong>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary */}
                <div className="stock-in-form__summary">
                    <div className="stock-in-form__summary-content">
                        <div className="stock-in-form__summary-row">
                            <span className="stock-in-form__summary-label">Tổng số sản phẩm:</span>
                            <span className="stock-in-form__summary-value">{items.length}</span>
                        </div>
                        <div className="stock-in-form__summary-row">
                            <span className="stock-in-form__summary-label">Tổng số lượng:</span>
                            <span className="stock-in-form__summary-value">
                {items.reduce((total, item) => total + parseInt(item.quantity || 0), 0)}
              </span>
                        </div>
                        <div className="stock-in-form__summary-row stock-in-form__summary-row--total">
                            <span className="stock-in-form__summary-label">Tổng tiền:</span>
                            <span className="stock-in-form__summary-value">{formatCurrency(calculateTotal())}</span>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="stock-in-form__actions">
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
                        {isSubmitting ? 'Đang lưu...' : 'Tạo phiếu nhập'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockInForm;