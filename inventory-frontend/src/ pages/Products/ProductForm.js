import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import './ProductForm.css';

const ProductForm = ({ product, categories, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category_id: '',
        description: '',
        unit: '',
        price: '',
        min_stock: '',
        current_stock: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                code: product.code || '',
                category_id: product.category_id || '',
                description: product.description || '',
                unit: product.unit || '',
                price: product.price || '',
                min_stock: product.min_stock || '',
                current_stock: product.current_stock || ''
            });
        }
    }, [product]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên sản phẩm là bắt buộc';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Mã sản phẩm là bắt buộc';
        }

        if (!formData.category_id) {
            newErrors.category_id = 'Danh mục là bắt buộc';
        }

        if (!formData.unit.trim()) {
            newErrors.unit = 'Đơn vị tính là bắt buộc';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Giá phải lớn hơn 0';
        }

        if (!formData.min_stock || formData.min_stock < 0) {
            newErrors.min_stock = 'Tồn kho tối thiểu phải >= 0';
        }

        if (!formData.current_stock || formData.current_stock < 0) {
            newErrors.current_stock = 'Tồn kho hiện tại phải >= 0';
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

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const categoryName = categories.find(c => c.id === parseInt(formData.category_id))?.name || '';

            const submitData = {
                ...formData,
                category_id: parseInt(formData.category_id),
                category_name: categoryName,
                price: parseFloat(formData.price),
                min_stock: parseInt(formData.min_stock),
                current_stock: parseInt(formData.current_stock)
            };

            await onSubmit(submitData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const units = [
        { value: 'cái', label: 'Cái' },
        { value: 'hộp', label: 'Hộp' },
        { value: 'kg', label: 'Kilogram' },
        { value: 'lít', label: 'Lít' },
        { value: 'mét', label: 'Mét' },
        { value: 'bộ', label: 'Bộ' },
        { value: 'thùng', label: 'Thùng' },
        { value: 'ổ', label: 'Ổ' }
    ];

    return (
        <div className="product-form">
            <div className="product-form__header">
                <button
                    type="button"
                    className="product-form__back-btn"
                    onClick={onCancel}
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
                <h2 className="product-form__title">
                    {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h2>
            </div>

            <div className="product-form__form">
                <div className="product-form__grid">
                    {/* Basic Information */}
                    <div className="product-form__section">
                        <h3 className="product-form__section-title">Thông tin cơ bản</h3>

                        <div className="product-form__row">
                            <div className="form-group">
                                <label className="form-label">
                                    Tên sản phẩm <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                                    placeholder="Nhập tên sản phẩm"
                                />
                                {errors.name && <span className="form-error">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Mã sản phẩm <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.code ? 'form-input--error' : ''}`}
                                    placeholder="Nhập mã sản phẩm"
                                />
                                {errors.code && <span className="form-error">{errors.code}</span>}
                            </div>
                        </div>

                        <div className="product-form__row">
                            <div className="form-group">
                                <label className="form-label">
                                    Danh mục <span className="required">*</span>
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    className={`form-select ${errors.category_id ? 'form-select--error' : ''}`}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <span className="form-error">{errors.category_id}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Đơn vị tính <span className="required">*</span>
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                    className={`form-select ${errors.unit ? 'form-select--error' : ''}`}
                                >
                                    <option value="">Chọn đơn vị</option>
                                    {units.map(unit => (
                                        <option key={unit.value} value={unit.value}>
                                            {unit.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.unit && <span className="form-error">{errors.unit}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mô tả</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="form-textarea"
                                placeholder="Nhập mô tả sản phẩm"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="product-form__section">
                        <h3 className="product-form__section-title">Giá & Tồn kho</h3>

                        <div className="form-group">
                            <label className="form-label">
                                Giá bán <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className={`form-input ${errors.price ? 'form-input--error' : ''}`}
                                placeholder="0"
                                min="0"
                                step="1000"
                            />
                            {errors.price && <span className="form-error">{errors.price}</span>}
                        </div>

                        <div className="product-form__row">
                            <div className="form-group">
                                <label className="form-label">
                                    Tồn kho tối thiểu <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="min_stock"
                                    value={formData.min_stock}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.min_stock ? 'form-input--error' : ''}`}
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.min_stock && <span className="form-error">{errors.min_stock}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Tồn kho hiện tại <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="current_stock"
                                    value={formData.current_stock}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.current_stock ? 'form-input--error' : ''}`}
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.current_stock && <span className="form-error">{errors.current_stock}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="product-form__actions">
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
                        {isSubmitting ? 'Đang lưu...' : (product ? 'Cập nhật' : 'Thêm mới')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;