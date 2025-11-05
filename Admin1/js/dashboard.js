// Dashboard Page Logic - PURE API (NO MOCK DATA)
const DashboardPage = {
    async render(container) {
        container.innerHTML = this.renderSkeleton();
        
        try {
            const stats = await API.dashboard.getStats();
            const recentOrders = await API.dashboard.getRecentOrders(5);
            
            this.renderContent(container, stats.data || stats, recentOrders.data || recentOrders);
            await this.initCharts(stats.data || stats);
        } catch (error) {
            container.innerHTML = this.renderError('Không thể tải dữ liệu Dashboard. Vui lòng kiểm tra kết nối API.');
            console.error('Dashboard Error:', error);
        }
    },
    
    renderSkeleton() {
        return `
            <div class="header">
                <h1>Dashboard</h1>
                <div class="user-info">
                    <div class="user-avatar">AD</div>
                    <span>Admin</span>
                </div>
            </div>
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">⏳</div>
                <p style="font-size: 18px; color: #7f8c8d;">Đang tải dữ liệu...</p>
            </div>
        `;
    },
    
    renderError(message) {
        return `
            <div class="header">
                <h1>Dashboard</h1>
                <div class="user-info">
                    <div class="user-avatar">AD</div>
                    <span>Admin</span>
                </div>
            </div>
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                <h2 style="color: #e74c3c; margin-bottom: 15px;">Lỗi tải dữ liệu</h2>
                <p style="color: #7f8c8d; margin-bottom: 25px;">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">🔄 Tải lại trang</button>
            </div>
        `;
    },
    
    renderContent(container, stats, recentOrders) {
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
                        <h3>${stats.totalVehicles || 0}</h3>
                        <p>Tổng số xe</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <h3>${stats.rentedVehicles || 0}</h3>
                        <p>Xe đang cho thuê</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">📅</div>
                    <div class="stat-info">
                        <h3>${stats.ordersThisMonth || 0}</h3>
                        <p>Đơn thuê tháng này</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">💰</div>
                    <div class="stat-info">
                        <h3>${((stats.revenueThisMonth || 0) / 1000000).toFixed(1)}M</h3>
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
    },
    
    renderRecentOrders(orders) {
        if (!orders || orders.length === 0) {
            return `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">
                        Chưa có đơn hàng nào
                    </td>
                </tr>
            `;
        }
        
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
    
    async initCharts(stats) {
        try {
            // Load revenue chart data from API
            const revenueResponse = await API.dashboard.getRevenueChart('6months');
            const revenueData = revenueResponse.data || revenueResponse;
            
            // Revenue Chart
            const revenueCtx = document.getElementById('revenueChart');
            if (revenueCtx) {
                new Chart(revenueCtx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: revenueData.labels || [],
                        datasets: [{
                            label: 'Doanh thu (triệu đồng)',
                            data: revenueData.data || [],
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

            // Load vehicle status from API
            const statusResponse = await API.dashboard.getVehicleStatus();
            const vehicleStatus = statusResponse.data || statusResponse;

            // Status Chart
            const statusCtx = document.getElementById('statusChart');
            if (statusCtx) {
                new Chart(statusCtx.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: vehicleStatus.labels || [],
                        datasets: [{
                            data: vehicleStatus.data || [],
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
        } catch (error) {
            console.error('Error loading charts:', error);
        }
    }
};