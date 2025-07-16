// src/data/mockData.js

export const categories = [
    {
        id: 1,
        name: 'Điện tử',
        description: 'Các thiết bị điện tử',
        created_at: '2024-01-01'
    },
    {
        id: 2,
        name: 'Thực phẩm',
        description: 'Thực phẩm và đồ uống',
        created_at: '2024-01-02'
    },
    {
        id: 3,
        name: 'Văn phòng phẩm',
        description: 'Dụng cụ văn phòng',
        created_at: '2024-01-03'
    },
    {
        id: 4,
        name: 'Gia dụng',
        description: 'Đồ gia dụng',
        created_at: '2024-01-04'
    }
];

export const products = [
    {
        id: 1,
        name: 'Laptop Dell Inspiron 15',
        code: 'DELL001',
        category_id: 1,
        category_name: 'Điện tử',
        description: 'Laptop Dell Inspiron 15 inch, Core i5, 8GB RAM',
        unit: 'cái',
        price: 15000000,
        min_stock: 5,
        current_stock: 12,
        status: 'active',
        created_at: '2024-01-15',
        updated_at: '2024-01-15'
    },
    {
        id: 2,
        name: 'Bút bi Thiên Long',
        code: 'PEN001',
        category_id: 3,
        category_name: 'Văn phòng phẩm',
        description: 'Bút bi Thiên Long màu xanh',
        unit: 'cái',
        price: 3000,
        min_stock: 100,
        current_stock: 45,
        status: 'active',
        created_at: '2024-01-17',
        updated_at: '2024-01-17'
    },


];

export const suppliers = [
    {
        id: 1,
        name: 'Công ty TNHH 1 mình tôi',
        contact_person: 'Trần Huỳnh Gia Nguyễn',
        phone: '0777815075',
        email: 'trangianguyen123@gmail.com',
        address: '233TS, TP.HCM'
    },
    {
        id: 2,
        name: 'Nội thất Kinh Đô',
        contact_person: 'Trần Hoàng Thiên',
        phone: '0987654321',
        email: 'thien123@gmail.com',
        address: '456 Đường Mai Dịch, Hà Nội'
    }
];

// Utility functions
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

export const getStockStatus = (current, min) => {
    if (current === 0) return 'out_of_stock';
    if (current <= min) return 'low_stock';
    return 'in_stock';
};

export const getStockStatusText = (status) => {
    switch(status) {
        case 'out_of_stock':
            return 'Hết hàng';
        case 'low_stock':
            return 'Sắp hết';
        case 'in_stock':
            return 'Còn hàng';
        default:
            return 'Không xác định';
    }
};

export const getStockStatusColor = (status) => {
    switch(status) {
        case 'out_of_stock':
            return 'danger';
        case 'low_stock':
            return 'warning';
        case 'in_stock':
            return 'success';
        default:
            return 'primary';
    }
};