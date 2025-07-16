import React from 'react';
import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const statsData = [
        {
            title: 'Tổng sản phẩm',
            value: '150',
            icon: Package,
            color: 'blue'
        },
        {
            title: 'Nhập hôm nay',
            value: '25',
            icon: TrendingUp,
            color: 'green'
        },
        {
            title: 'Xuất hôm nay',
            value: '18',
            icon: ShoppingCart,
            color: 'red'
        },
        {
            title: 'Sắp hết hàng',
            value: '5',
            icon: Package,
            color: 'yellow'
        }
    ];

    const recentActivities = [
        {
            id: 1,
            type: 'in',
            message: 'Nhập 50 sản phẩm từ nhà cung cấp ABC',
            time: '2 giờ trước'
        },
        {
            id: 2,
            type: 'out',
            message: 'Xuất 20 sản phẩm cho khách hàng XYZ',
            time: '4 giờ trước'
        },
        {
            id: 3,
            type: 'in',
            message: 'Nhập 30 sản phẩm từ nhà cung cấp DEF',
            time: '6 giờ trước'
        }
    ];

    return (
        <div className="dashboard">
            {/* Stats Cards */}
            <div className="dashboard__stats">
                {statsData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="dashboard__stat-card">
                            <div className="dashboard__stat-content">
                                <div className="dashboard__stat-text">
                                    <p className="dashboard__stat-label">{stat.title}</p>
                                    <p className={`dashboard__stat-value dashboard__stat-value--${stat.color}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <Icon className={`dashboard__stat-icon dashboard__stat-icon--${stat.color}`} size={32} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="dashboard__activity">
                <div className="dashboard__activity-header">
                    <h3 className="dashboard__activity-title">Hoạt động gần đây</h3>
                </div>
                <div className="dashboard__activity-content">
                    <div className="dashboard__activity-list">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="dashboard__activity-item">
                                <div className={`dashboard__activity-dot dashboard__activity-dot--${activity.type}`}></div>
                                <span className="dashboard__activity-message">{activity.message}</span>
                                <span className="dashboard__activity-time">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;