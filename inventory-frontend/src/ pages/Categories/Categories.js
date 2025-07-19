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
                <div className="btn-conteiner">
                    <a className="btn-content" href="#">
                        <span className="btn-title">THÊM DANH MỤC</span>
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