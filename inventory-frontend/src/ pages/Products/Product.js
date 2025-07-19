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
                <div className="btn-conteiner">
                    <a className="btn-content" href="#">
                        <span className="btn-title">THÊM SẢN PHẨM</span>
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