// Dashboard Page Logic
const DashboardPage = {
    render(container) {
        const stats = SampleData.stats;
        const recentOrders = SampleData.orders.slice(0, 5);
        
        container.innerHTML = `
            <div class="header">
                <h1>Dashboard</h1>
                <div class="user-info">
                    <div class="user-avatar">AD</div>
                    <span>Admin</span>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">🚗</div>
                    <div class="stat-info">
                        <h3>${stats.totalVehicles}</h3>
                        <p>Tổng số xe</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <h3>${stats.rentedVehicles}</h3>
                        <p>Xe đang cho thuê</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">📅</div>
                    <div class="stat-info">
                        <h3>${stats.ordersThisMonth}</h3>
                        <p>Đơn thuê tháng này</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">💰</div>
                    <div class="stat-info">
                        <h3>${(stats.revenueThisMonth / 1000000).toFixed(1)}M</h3>
                        <p>Doanh thu tháng này</p>
                    </div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-card">
                    <h3>Doanh thu 6 tháng gần đây</h3>
                    <canvas id="revenueChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Tình trạng xe</h3>
                    <canvas id="statusChart"></canvas>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h3>Đơn thuê gần đây</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Xe</th>
                            <th>Ngày thuê</th>
                            <th>Trạng thái</th>
                            <th>Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderRecentOrders(recentOrders)}
                    </tbody>
                </table>
            </div>
        `;
        
        this.initCharts();
    },
    
    renderRecentOrders(orders) {
        return orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.vehicleName}</td>
                <td>${formatDate(order.startDate)}</td>
                <td>${this.getStatusBadge(order.status)}</td>
                <td>${formatCurrency(order.totalAmount)}</td>
            </tr>
        `).join('');
    },
    
    getStatusBadge(status) {
        const statusMap = {
            'pending': '<span class="badge badge-warning">Chờ xác nhận</span>',
            'renting': '<span class="badge badge-success">Đang thuê</span>',
            'completed': '<span class="badge badge-info">Hoàn tất</span>',
            'cancelled': '<span class="badge badge-danger">Hủy</span>'
        };
        return statusMap[status] || status;
    },
    
    initCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10'],
                    datasets: [{
                        label: 'Doanh thu (triệu đồng)',
                        data: [32, 38, 42, 45, 48, 45.2],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + 'M';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Status Chart
        const statusCtx = document.getElementById('statusChart');
        if (statusCtx) {
            new Chart(statusCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Khả dụng', 'Đang thuê', 'Bảo trì', 'Hỏng'],
                    datasets: [{
                        data: [28, 12, 3, 2],
                        backgroundColor: [
                            '#2ecc71',
                            '#3498db',
                            '#f39c12',
                            '#e74c3c'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }
};