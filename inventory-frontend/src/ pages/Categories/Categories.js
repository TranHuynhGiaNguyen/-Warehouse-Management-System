import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Settings,
    Package,
    Calendar,
    Tag
} from 'lucide-react';
import {
    categories as initialCategories,
    products,
    formatDate
} from '../../data/mockData';
import CategoryForm from './CategoriesForm';
import './Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [filteredCategories, setFilteredCategories] = useState(initialCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        filterCategories();
    }, [categories, searchTerm]);

    const filterCategories = () => {
        let filtered = [...categories];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCategories(filtered);
    };

    const getProductCountByCategory = (categoryId) => {
        return products.filter(product => product.category_id === categoryId).length;
    };

    const handleAddCategory = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleDeleteCategory = (categoryId) => {
        const productCount = getProductCountByCategory(categoryId);

        if (productCount > 0) {
            alert(`Không thể xóa danh mục này vì còn ${productCount} sản phẩm đang sử dụng.`);
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            setCategories(categories.filter(c => c.id !== categoryId));
        }
    };

    const handleFormSubmit = (formData) => {
        if (editingCategory) {
            // Update existing category
            const updatedCategories = categories.map(c =>
                c.id === editingCategory.id
                    ? { ...c, ...formData, updated_at: new Date().toISOString() }
                    : c
            );
            setCategories(updatedCategories);
        } else {
            // Add new category
            const newCategory = {
                id: Math.max(...categories.map(c => c.id)) + 1,
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            setCategories([...categories, newCategory]);
        }
        setShowForm(false);
        setEditingCategory(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingCategory(null);
    };

    if (showForm) {
        return (
            <CategoryForm
                category={editingCategory}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
            />
        );
    }

    return (
        <div className="categories">
            {/* Header */}
            <div className="categories__header">
                <div className="categories__header-left">
                    <h2 className="categories__title">
                        <Settings className="categories__title-icon" />
                        Quản lý danh mục
                    </h2>
                    <p className="categories__subtitle">
                        Tổng cộng {filteredCategories.length} danh mục
                    </p>
                </div>
                <button
                    className="btn btn--primary"
                    onClick={handleAddCategory}
                >
                    <Plus size={16} />
                    Thêm danh mục
                </button>
            </div>

            {/* Search */}
            <div className="categories__search-container">
                <div className="categories__search">
                    <Search className="categories__search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="categories__search-input"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="categories__grid">
                {filteredCategories.map(category => {
                    const productCount = getProductCountByCategory(category.id);

                    return (
                        <div key={category.id} className="categories__card">
                            <div className="categories__card-header">
                                <div className="categories__card-icon">
                                    <Tag size={24} />
                                </div>
                                <div className="categories__card-actions">
                                    <button
                                        className="categories__action-btn categories__action-btn--edit"
                                        onClick={() => handleEditCategory(category)}
                                        title="Chỉnh sửa"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="categories__action-btn categories__action-btn--delete"
                                        onClick={() => handleDeleteCategory(category.id)}
                                        title="Xóa"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="categories__card-content">
                                <h3 className="categories__card-title">{category.name}</h3>
                                <p className="categories__card-description">
                                    {category.description || 'Không có mô tả'}
                                </p>

                                <div className="categories__card-stats">
                                    <div className="categories__stat">
                                        <Package size={16} className="categories__stat-icon" />
                                        <span className="categories__stat-text">
                      {productCount} sản phẩm
                    </span>
                                    </div>
                                    <div className="categories__stat">
                                        <Calendar size={16} className="categories__stat-icon" />
                                        <span className="categories__stat-text">
                      {formatDate(category.created_at)}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
                <div className="categories__empty">
                    <Settings size={48} className="categories__empty-icon" />
                    <h3 className="categories__empty-title">Không tìm thấy danh mục nào</h3>
                    <p className="categories__empty-text">
                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm danh mục đầu tiên'}
                    </p>
                    {!searchTerm && (
                        <button
                            className="btn btn--primary categories__empty-btn"
                            onClick={handleAddCategory}
                        >
                            <Plus size={16} />
                            Thêm danh mục
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Categories;