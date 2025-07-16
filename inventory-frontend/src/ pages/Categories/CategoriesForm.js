import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import './CategoriesForm.css';

const CategoryForm = ({ category, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || ''
            });
        }
    }, [category]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên danh mục là bắt buộc';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Tên danh mục phải có ít nhất 2 ký tự';
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
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
            const submitData = {
                ...formData,
                name: formData.name.trim(),
                description: formData.description.trim()
            };

            await onSubmit(submitData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
        }
    };

    return (
        <div className="category-form">
            <div className="category-form__header">
                <button
                    type="button"
                    className="category-form__back-btn"
                    onClick={onCancel}
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
                <h2 className="category-form__title">
                    {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h2>
            </div>

            <div className="category-form__form">
                <div className="category-form__content">
                    <div className="category-form__section">
                        <h3 className="category-form__section-title">Thông tin danh mục</h3>

                        <div className="form-group">
                            <label className="form-label">
                                Tên danh mục <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                                placeholder="Nhập tên danh mục"
                                maxLength={100}
                            />
                            {errors.name && <span className="form-error">{errors.name}</span>}
                            <small className="form-hint">
                                Tên danh mục sẽ hiển thị trong danh sách sản phẩm
                            </small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mô tả</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={`form-textarea ${errors.description ? 'form-textarea--error' : ''}`}
                                placeholder="Nhập mô tả danh mục (tùy chọn)"
                                rows={4}
                                maxLength={500}
                            />
                            {errors.description && <span className="form-error">{errors.description}</span>}
                            <small className="form-hint">
                                {formData.description.length}/500 ký tự
                            </small>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="category-form__preview">
                        <h3 className="category-form__section-title">Xem trước</h3>
                        <div className="category-form__preview-card">
                            <div className="category-form__preview-header">
                                <h4 className="category-form__preview-title">
                                    {formData.name || 'Tên danh mục'}
                                </h4>
                            </div>
                            <p className="category-form__preview-description">
                                {formData.description || 'Mô tả danh mục sẽ hiển thị ở đây'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="category-form__actions">
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
                        {isSubmitting ? 'Đang lưu...' : (category ? 'Cập nhật' : 'Thêm mới')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;