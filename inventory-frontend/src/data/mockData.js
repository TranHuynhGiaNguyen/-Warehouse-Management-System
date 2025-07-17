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
        name: 'Cà phê hòa tan G7',
        code: 'COFFEE001',
        category_id: 2,
        category_name: 'Thực phẩm',
        description: 'Cà phê hòa tan G7 3in1, hộp 20 gói',
        unit: 'hộp',
        price: 45000,
        min_stock: 50,
        current_stock: 120,
        status: 'active',
        created_at: '2024-01-16',
        updated_at: '2024-01-16'
    },
    {
        id: 3,
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
    {
        id: 4,
        name: 'Nồi cơm điện Sharp',
        code: 'RICE001',
        category_id: 4,
        category_name: 'Gia dụng',
        description: 'Nồi cơm điện Sharp 1.8L',
        unit: 'cái',
        price: 1200000,
        min_stock: 10,
        current_stock: 8,
        status: 'active',
        created_at: '2024-01-18',
        updated_at: '2024-01-18'
    },
    {
        id: 5,
        name: 'Bánh mì sandwich',
        code: 'BREAD001',
        category_id: 2,
        category_name: 'Thực phẩm',
        description: 'Bánh mì sandwich tươi',
        unit: 'ổ',
        price: 25000,
        min_stock: 20,
        current_stock: 3,
        status: 'low_stock',
        created_at: '2024-01-19',
        updated_at: '2024-01-19'
    }
];

export const suppliers = [
    {
        id: 1,
        name: 'Công ty TNHH VN',
        contact_person: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'contact@abc.com',
        address: '123 Lê Trọng Tấn, TP.HCM'
    },
    {
        id: 2,
        name: 'Nhà cung cấp XYZ',
        contact_person: 'Trần Thị B',
        phone: '0987654321',
        email: 'info@xyz.com',
        address: '456 Đường XYZ, Hà Nội'
    },
    {
        id: 3,
        name: 'Siêu thị S Store',
        contact_person: 'Lê Văn Sĩ',
        phone: '0369852147',
        email: 'sales@techstore.com',
        address: '789 Đường DC4, Đà Nẵng'
    }
];

export const employees = [
    {
        id: 1,
        name: 'Admin System',
        email: 'admin@company.com',
        phone: '0123456789',
        role: 'admin'
    },
    {
        id: 2,
        name: 'Nguyễn Thị Hoa',
        email: 'hoa@company.com',
        phone: '0987654321',
        role: 'staff'
    },
    {
        id: 3,
        name: 'Trần Văn Nam',
        email: 'nam@company.com',
        phone: '0369852147',
        role: 'staff'
    }
];

export const stockInRecords = [
    {
        id: 1,
        supplier_id: 1,
        supplier_name: 'Công ty TNHH VN',
        employee_id: 1,
        employee_name: 'Admin System',
        invoice_number: 'PN001',
        total_amount: 30090000,
        notes: 'Nhập hàng đầu tháng',
        status: 'completed',
        created_at: '2024-07-15T10:30:00Z',
        details: [
            {
                id: 1,
                product_id: 1,
                product_name: 'Laptop Dell Inspiron 15',
                product_code: 'DELL001',
                quantity: 2,
                unit_price: 15000000,
                total_price: 30000000,
                expiry_date: null
            },
            {
                id: 2,
                product_id: 2,
                product_name: 'Cà phê hòa tan G7',
                product_code: 'COFFEE001',
                quantity: 2,
                unit_price: 45000,
                total_price: 90000,
                expiry_date: '2024-12-31'
            }
        ]
    },
    {
        id: 2,
        supplier_id: 2,
        supplier_name: 'Nhà cung cấp GN',
        employee_id: 2,
        employee_name: 'Nguyễn Thị Hoa',
        invoice_number: 'PN002',
        total_amount: 150000,
        notes: 'Nhập văn phòng phẩm',
        status: 'completed',
        created_at: '2024-07-16T14:20:00Z',
        details: [
            {
                id: 3,
                product_id: 3,
                product_name: 'Bút bi Thiên Long',
                product_code: 'PEN001',
                quantity: 50,
                unit_price: 3000,
                total_price: 150000,
                expiry_date: null
            }
        ]
    },
    {
        id: 3,
        supplier_id: 3,
        supplier_name: 'Siêu thị S Store',
        employee_id: 1,
        employee_name: 'Admin System',
        invoice_number: 'PN003',
        total_amount: 1200000,
        notes: 'Nhập gia dụng',
        status: 'pending',
        created_at: '2024-07-17T09:15:00Z',
        details: [
            {
                id: 4,
                product_id: 4,
                product_name: 'Nồi cơm điện Sharp',
                product_code: 'RICE001',
                quantity: 1,
                unit_price: 1200000,
                total_price: 1200000,
                expiry_date: null
            }
        ]
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

export const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
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

export const getStockInStatusText = (status) => {
    switch(status) {
        case 'pending':
            return 'Đang xử lý';
        case 'completed':
            return 'Hoàn thành';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return 'Không xác định';
    }
};

export const getStockInStatusColor = (status) => {
    switch(status) {
        case 'pending':
            return 'warning';
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'danger';
        default:
            return 'primary';
    }
};
export const stockOutRecords = [
    {
        id: 1,
        employee_id: 2,
        employee_name: 'Nguyễn Thị Hoa',
        customer_name: 'Công ty DEF',
        invoice_number: 'PX001',
        total_amount: 15045000,
        notes: 'Khách lẻ',
        status: 'completed',
        created_at: '2024-07-15T14:30:00Z',
        details: [
            {
                id: 1,
                product_id: 1,
                product_name: 'Laptop Dell Inspiron 15',
                product_code: 'DELL001',
                quantity: 1,
                unit_price: 15000000,
                total_price: 15000000
            },
            {
                id: 2,
                product_id: 2,
                product_name: 'Cà phê hòa tan G7',
                product_code: 'COFFEE001',
                quantity: 1,
                unit_price: 45000,
                total_price: 45000
            }
        ]
    },
    {
        id: 2,
        employee_id: 3,
        employee_name: 'Trần Văn Nam',
        customer_name: 'Khách lẻ',
        invoice_number: 'PX002',
        total_amount: 150000,
        notes: 'Khách lẻ',
        status: 'completed',
        created_at: '2024-07-16T09:15:00Z',
        details: [
            {
                id: 3,
                product_id: 3,
                product_name: 'Bút bi Thiên Long',
                product_code: 'PEN001',
                quantity: 50,
                unit_price: 3000,
                total_price: 150000
            }
        ]
    },
    {
        id: 3,
        employee_id: 1,
        employee_name: 'Admin System',
        customer_name: 'Siêu thị Mini Mart',
        invoice_number: 'PX003',
        total_amount: 75000,
        notes: 'Khách lẻ',
        status: 'pending',
        created_at: '2024-07-17T11:45:00Z',
        details: [
            {
                id: 4,
                product_id: 5,
                product_name: 'Bánh mì sandwich',
                product_code: 'BREAD001',
                quantity: 3,
                unit_price: 25000,
                total_price: 75000
            }
        ]
    },
    {
        id: 4,
        employee_id: 2,
        employee_name: 'Nguyễn Thị Hoa',
        customer_name: 'Cửa hàng ABC',
        invoice_number: 'PX004',
        total_amount: 1250000,
        notes: 'Khách lẻ',
        status: 'completed',
        created_at: '2024-07-17T16:20:00Z',
        details: [
            {
                id: 5,
                product_id: 4,
                product_name: 'Nồi cơm điện Sharp',
                product_code: 'RICE001',
                quantity: 1,
                unit_price: 1200000,
                total_price: 1200000
            },
            {
                id: 6,
                product_id: 3,
                product_name: 'Bút bi Thiên Long',
                product_code: 'PEN001',
                quantity: 10,
                unit_price: 3000,
                total_price: 30000
            },
            {
                id: 7,
                product_id: 5,
                product_name: 'Bánh mì sandwich',
                product_code: 'BREAD001',
                quantity: 1,
                unit_price: 25000,
                total_price: 25000
            }
        ]
    },
    {
        id: 5,
        employee_id: 1,
        employee_name: 'Admin System',
        customer_name: 'Nguyễn Văn A',
        invoice_number: 'PX005',
        total_amount: 90000,
        notes: 'Khách lẻ',
        status: 'cancelled',
        created_at: '2024-07-17T18:30:00Z',
        details: [
            {
                id: 8,
                product_id: 2,
                product_name: 'Cà phê hòa tan G7',
                product_code: 'COFFEE001',
                quantity: 2,
                unit_price: 45000,
                total_price: 90000
            }
        ]
    }
];

// Utility functions cho Stock Out
export const getStockOutStatusText = (status) => {
    switch(status) {
        case 'pending':
            return 'Đang xử lý';
        case 'completed':
            return 'Hoàn thành';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return 'Không xác định';
    }
};

export const getStockOutStatusColor = (status) => {
    switch(status) {
        case 'pending':
            return 'warning';
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'danger';
        default:
            return 'primary';
    }
};

// Thống kê nhanh cho Stock Out
export const getStockOutStats = () => {
    const totalRecords = stockOutRecords.length;
    const totalAmount = stockOutRecords.reduce((sum, record) => sum + record.total_amount, 0);
    const todayRecords = stockOutRecords.filter(record => {
        const today = new Date();
        const recordDate = new Date(record.created_at);
        return recordDate.toDateString() === today.toDateString();
    }).length;

    const completedRecords = stockOutRecords.filter(record => record.status === 'completed').length;
    const pendingRecords = stockOutRecords.filter(record => record.status === 'pending').length;
    const cancelledRecords = stockOutRecords.filter(record => record.status === 'cancelled').length;

    return {
        totalRecords,
        totalAmount,
        todayRecords,
        completedRecords,
        pendingRecords,
        cancelledRecords
    };
};

// Lấy top khách hàng
export const getTopCustomers = () => {
    const customerStats = {};

    stockOutRecords.forEach(record => {
        if (record.status === 'completed') {
            if (!customerStats[record.customer_name]) {
                customerStats[record.customer_name] = {
                    name: record.customer_name,
                    totalAmount: 0,
                    totalOrders: 0
                };
            }
            customerStats[record.customer_name].totalAmount += record.total_amount;
            customerStats[record.customer_name].totalOrders += 1;
        }
    });

    return Object.values(customerStats)
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 5);
};

// Thống kê theo nhân viên
export const getEmployeeStats = () => {
    const employeeStats = {};

    stockOutRecords.forEach(record => {
        if (record.status === 'completed') {
            if (!employeeStats[record.employee_id]) {
                employeeStats[record.employee_id] = {
                    employee_id: record.employee_id,
                    employee_name: record.employee_name,
                    totalAmount: 0,
                    totalOrders: 0
                };
            }
            employeeStats[record.employee_id].totalAmount += record.total_amount;
            employeeStats[record.employee_id].totalOrders += 1;
        }
    });

    return Object.values(employeeStats)
        .sort((a, b) => b.totalAmount - a.totalAmount);
};