// Orders Page Logic - WITH API INTEGRATION
const OrdersPage = {
    orders: [],
    filteredOrders: [],
    isLoading: false,
    
    async render(container) {
        container.innerHTML = this.renderSkeleton();
        await this.loadOrders();
        this.renderContent(container);
    },
    
    renderSkeleton() {
        return `
            <div class="header">
                <h1>Quản lý đơn thuê</h1>
            </div>
            <div style="text-align: center; padding: 40px;">
                <p>Đang tải dữ liệu...</p>
            </div>
        `;
    },
    
    async loadOrders() {
        this.isLoading = true;
        try {
            const response = await API.orders.getAll();
            this.orders = response.data || response;
            this.filteredOrders = [...this.orders];
        } catch (error) {
            console.error('Error loading orders:', error);
            showNotification('Không thể tải danh sách đơn hàng: ' + error.message, 'error');
            // Fallback to mock data
            this.orders = SampleData.orders || [];
            this.filteredOrders = [...this.orders];
        } finally {
            this.isLoading = false;
        }
    },
    
    renderContent(container) {
        container.innerHTML = `
            <div class="header">
                <h1>Quản lý đơn thuê</h1>
            </div>

            <div class="filter-bar">
                <input type="text" class="search-box" id="orderSearch" placeholder="🔍 Tìm kiếm đơn hàng...">
                <select id="orderStatusFilter">
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="renting">Đang thuê</option>
                    <option value="completed">Hoàn tất</option>
                    <option value="cancelled">Hủy</option>
                </select>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Xe</th>
                            <th>Ngày thuê</th>
                            <th>Ngày trả</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="orderTableBody">
                        ${this.renderOrderRows()}
                    </tbody>
                </table>
            </div>

            ${this.renderDetailModal()}
        `;
        
        this.attachEventListeners();
    },
    
    renderOrderRows() {
        if (this.filteredOrders.length === 0) {
            return `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">📅</div>
                            <p>Không tìm thấy đơn hàng nào</p>
                        </div>
                    </td>
                </tr>
            `;
        }
        
        return this.filteredOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.vehicleName}</td>
                <td>${formatDate(order.startDate)}</td>
                <td>${formatDate(order.endDate)}</td>
                <td>${formatCurrency(order.totalAmount)}</td>
                <td>${this.getStatusBadge(order.status)}</td>
                <td>
                    <div class="action-buttons">
                        ${this.renderActionButtons(order)}
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    renderActionButtons(order) {
        if (order.status === 'pending') {
            return `
                <button class="icon-btn btn-success" onclick="OrdersPage.approveOrder('${order.id}')" title="Xác nhận">✅</button>
                <button class="icon-btn btn-danger" onclick="OrdersPage.cancelOrder('${order.id}')" title="Từ chối">❌</button>
            `;
        } else if (order.status === 'renting') {
            return `
                <button class="icon-btn btn-primary" onclick="OrdersPage.viewDetails('${order.id}')" title="Xem chi tiết">👁️</button>
                <button class="icon-btn btn-success" onclick="OrdersPage.completeOrder('${order.id}')" title="Hoàn tất">✔️</button>
            `;
        } else {
            return `
                <button class="icon-btn btn-primary" onclick="OrdersPage.viewDetails('${order.id}')" title="Xem chi tiết">👁️</button>
                <button class="icon-btn btn-warning" onclick="OrdersPage.printInvoice('${order.id}')" title="In hóa đơn">🖨️</button>
            `;
        }
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
    
    renderDetailModal() {
        return `
            <div class="modal" id="orderDetailModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Chi tiết đơn hàng</h2>
                        <span class="close-btn" onclick="closeModal('orderDetailModal')">&times;</span>
                    </div>
                    <div id="orderDetailContent">
                        <!-- Content will be loaded dynamically -->
                    </div>
                </div>
            </div>
        `;
    },
    
    attachEventListeners() {
        const searchInput = document.getElementById('orderSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.filterOrders();
            }, 300));
        }
        
        const statusFilter = document.getElementById('orderStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterOrders());
        }
    },
    
    filterOrders() {
        const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
        const statusFilter = document.getElementById('orderStatusFilter').value;
        
        this.filteredOrders = this.orders.filter(order => {
            const matchSearch = !searchTerm ||
                order.id.toLowerCase().includes(searchTerm) ||
                order.customerName.toLowerCase().includes(searchTerm) ||
                order.vehicleName.toLowerCase().includes(searchTerm);
            
            const matchStatus = !statusFilter || order.status === statusFilter;
            
            return matchSearch && matchStatus;
        });
        
        document.getElementById('orderTableBody').innerHTML = this.renderOrderRows();
    },
    
    async viewDetails(id) {
        try {
            let order;
            try {
                const response = await API.orders.getById(id);
                order = response.data || response;
            } catch (error) {
                order = this.orders.find(o => o.id === id);
            }
            
            if (!order) return;
            
            const customer = SampleData.customers.find(c => c.id === order.customerId);
            const vehicle = SampleData.vehicles.find(v => v.id === order.vehicleId);
            
            const days = Math.ceil((new Date(order.endDate) - new Date(order.startDate)) / (1000 * 60 * 60 * 24));
            
            const detailContent = `
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">Thông tin đơn hàng</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div><strong>Mã đơn:</strong> ${order.id}</div>
                        <div><strong>Trạng thái:</strong> ${this.getStatusBadge(order.status)}</div>
                        <div><strong>Ngày thuê:</strong> ${formatDate(order.startDate)}</div>
                        <div><strong>Ngày trả:</strong> ${formatDate(order.endDate)}</div>
                        <div><strong>Số ngày thuê:</strong> ${days} ngày</div>
                        <div><strong>Tổng tiền:</strong> ${formatCurrency(order.totalAmount)}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">Thông tin khách hàng</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div><strong>Họ tên:</strong> ${customer ? customer.name : order.customerName}</div>
                        <div><strong>Số điện thoại:</strong> ${customer ? customer.phone : 'N/A'}</div>
                        <div><strong>Email:</strong> ${customer ? customer.email : 'N/A'}</div>
                        <div><strong>CCCD:</strong> ${customer ? customer.idCard : 'N/A'}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">Thông tin xe</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div><strong>Tên xe:</strong> ${vehicle ? vehicle.name : 'N/A'}</div>
                        <div><strong>Loại xe:</strong> ${vehicle ? vehicle.type : 'N/A'}</div>
                        <div><strong>Biển số:</strong> ${vehicle ? vehicle.plateNumber : 'N/A'}</div>
                        <div><strong>Giá thuê/ngày:</strong> ${vehicle ? formatCurrency(vehicle.pricePerDay) : 'N/A'}</div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                        <span>Tổng thanh toán:</span>
                        <span style="color: #e74c3c;">${formatCurrency(order.totalAmount)}</span>
                    </div>
                </div>
            `;
            
            document.getElementById('orderDetailContent').innerHTML = detailContent;
            openModal('orderDetailModal');
        } catch (error) {
            showNotification('Không thể tải chi tiết đơn hàng: ' + error.message, 'error');
        }
    },
    
    approveOrder(id) {
        confirmDialog('Bạn có chắc chắn muốn xác nhận đơn hàng này?', () => {
            const order = this.orders.find(o => o.id === id);
            if (order) {
                order.status = 'renting';
                this.filterOrders();
                showNotification('Xác nhận đơn hàng thành công!', 'success');
            }
        });
    },
    
    cancelOrder(id) {
        confirmDialog('Bạn có chắc chắn muốn hủy đơn hàng này?', () => {
            const order = this.orders.find(o => o.id === id);
            if (order) {
                order.status = 'cancelled';
                this.filterOrders();
                showNotification('Hủy đơn hàng thành công!', 'success');
            }
        });
    },
    
    completeOrder(id) {
        confirmDialog('Xác nhận khách hàng đã trả xe?', () => {
            const order = this.orders.find(o => o.id === id);
            if (order) {
                order.status = 'completed';
                this.filterOrders();
                showNotification('Hoàn tất đơn hàng thành công!', 'success');
            }
        });
    },
    
    printInvoice(id) {
        const order = this.orders.find(o => o.id === id);
        if (!order) return;
        
        showNotification('Đang chuẩn bị in hóa đơn...', 'success');
        // Here you can implement actual printing functionality
    }
};