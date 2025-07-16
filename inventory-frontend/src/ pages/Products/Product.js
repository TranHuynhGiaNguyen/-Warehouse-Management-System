import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    Filter,
    Eye,
    AlertTriangle
} from 'lucide-react';
import {
    products as initialProducts,
    categories,
    formatCurrency,
    getStockStatus,
    getStockStatusText,
    getStockStatusColor
} from '../../data/mockData';
import ProductForm from './ProductForm';
import '../Products/Product.css';

const Products = () => {
    const [products, setProducts] = useState(initialProducts);
    const [filteredProducts, setFilteredProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, selectedCategory, stockFilter]);

    const filterProducts = () => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category_id === parseInt(selectedCategory));
        }

        // Stock filter
        if (stockFilter) {
            filtered = filtered.filter(product => {
                const status = getStockStatus(product.current_stock, product.min_stock);
                return status === stockFilter;
            });
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    const handleFormSubmit = (formData) => {
        if (editingProduct) {
            // Update existing product
            const updatedProducts = products.map(p =>
                p.id === editingProduct.id
                    ? { ...p, ...formData, updated_at: new Date().toISOString() }
                    : p
            );
            setProducts(updatedProducts);
        } else {
            // Add new product
            const newProduct = {
                id: Math.max(...products.map(p => p.id)) + 1,
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            setProducts([...products, newProduct]);
        }
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (showForm) {
        return (
            <ProductForm
                product={editingProduct}
                categories={categories}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
            />
        );
    }

    return (
        <div className="products">
            {/* Header */}
            <div className="products__header">
                <div className="products__header-left">
                    <h2 className="products__title">
                        <Package className="products__title-icon" />
                        Quản lý sản phẩm
                    </h2>
                    <p className="products__subtitle">
                        Tổng cộng {filteredProducts.length} sản phẩm
                    </p>
                </div>
                <button
                    className="btn btn--primary"
                    onClick={handleAddProduct}
                >
                    <Plus size={16} />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Filters */}
            <div className="products__filters">
                <div className="products__search">
                    <Search className="products__search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="products__search-input"
                    />
                </div>

                <div className="products__filter-group">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="products__filter-select"
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="products__filter-select"
                    >
                        <option value="">Trạng thái kho</option>
                        <option value="in_stock">Còn hàng</option>
                        <option value="low_stock">Sắp hết</option>
                        <option value="out_of_stock">Hết hàng</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="products__table-container">
                <table className="products__table">
                    <thead>
                    <tr>
                        <th>Mã SP</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Tồn kho</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentProducts.map(product => {
                        const stockStatus = getStockStatus(product.current_stock, product.min_stock);
                        const statusColor = getStockStatusColor(stockStatus);

                        return (
                            <tr key={product.id}>
                                <td>
                                    <span className="products__code">{product.code}</span>
                                </td>
                                <td>
                                    <div className="products__product-info">
                                        <span className="products__name">{product.name}</span>
                                        <span className="products__unit">({product.unit})</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="products__category">{product.category_name}</span>
                                </td>
                                <td>
                                    <span className="products__price">{formatCurrency(product.price)}</span>
                                </td>
                                <td>
                                    <div className="products__stock">
                      <span className={`products__stock-number ${stockStatus === 'low_stock' ? 'products__stock-number--warning' : ''}`}>
                        {product.current_stock}
                      </span>
                                        <span className="products__stock-min">/ {product.min_stock}</span>
                                    </div>
                                </td>
                                <td>
                    <span className={`badge badge--${statusColor}`}>
                      {stockStatus === 'low_stock' && <AlertTriangle size={12} />}
                        {getStockStatusText(stockStatus)}
                    </span>
                                </td>
                                <td>
                                    <div className="products__actions">
                                        <button
                                            className="products__action-btn products__action-btn--edit"
                                            onClick={() => handleEditProduct(product)}
                                            title="Chỉnh sửa"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="products__action-btn products__action-btn--delete"
                                            onClick={() => handleDeleteProduct(product.id)}
                                            title="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {currentProducts.length === 0 && (
                    <div className="products__empty">
                        <Package size={48} className="products__empty-icon" />
                        <p className="products__empty-text">Không tìm thấy sản phẩm nào</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="products__pagination">
                    <button
                        className="products__pagination-btn"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`products__pagination-btn ${currentPage === i + 1 ? 'products__pagination-btn--active' : ''}`}
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="products__pagination-btn"
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

export default Products;