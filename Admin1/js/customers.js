// Customers Page Logic - PURE API (NO MOCK DATA)
const CustomersPage = {
    customers: [],
    filteredCustomers: [],
    isLoading: false,
    
    async render(container) {
        container.innerHTML = this.renderSkeleton();
        
        try {
            await this.loadCustomers();
            this.renderContent(container);
        } catch (error) {
            container.innerHTML = `<div style="color: red; padding: 20px;">Lỗi: ${error.message}</div>`;
        }
    },
    
    renderSkeleton() {
        return `
            <div class="header">
                <h1>Quản lý khách hàng</h1>
            </div>
            <div style="text-align: center; padding: 40px;">
                <p>Đang tải dữ liệu...</p>
            </div>
        `;
    },
    
    async loadCustomers() {
        this.isLoading = true;
        try {
            const response = await API.customers.getAll();
            this.customers = response.data || response;
            this.filteredCustomers = [...this.customers];
        } catch (error) {
            console.error('Error loading customers:', error);
            showNotification('Không thể tải danh sách khách hàng: ' + error.message, 'error');
            this.customers = [];
            this.filteredCustomers = [];
        } finally {
            this.isLoading = false;
        }
    },
    
    renderContent(container) {
        container.innerHTML = `
            <div class="header">
                <h1>Quản lý khách hàng</h1>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h3>Danh sách khách hàng</h3>
                    <input type="text" class="search-box" id="customerSearch" placeholder="🔍 Tìm kiếm khách hàng...">
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Mã KH</th>
                            <th>Họ tên</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>CCCD</th>
                            <th>Số lần thuê</th>
                            <th>Tổng chi tiêu</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="customerTableBody">
                        ${this.renderCustomerRows()}
                    </tbody>
                </table>
            </div>

            ${this.renderDetailModal()}
        `;
        
        this.attachEventListeners();
    },
    
    renderCustomerRows() {
        if (this.filteredCustomers.length === 0) {
            return `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <p>Không tìm thấy khách hàng nào</p>
                        </div>
                    </td>
                </tr>
            `;
        }
        
        return this.filteredCustomers.map(customer => `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.email}</td>
                <td>${customer.idCard}</td>
                <td>${customer.totalRentals}</td>
                <td>${formatCurrency(customer.totalSpent)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn btn-primary" onclick="CustomersPage.viewDetails('${customer.id}')" title="Xem chi tiết">👁️</button>
                        <button class="icon-btn btn-danger" onclick="CustomersPage.blockCustomer('${customer.id}')" title="Chặn khách hàng">🚫</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    renderDetailModal() {
        return `
            <div class="modal" id="customerDetailModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Chi tiết khách hàng</h2>
                        <span class="close-btn" onclick="closeModal('customerDetailModal')">&times;</span>
                    </div>
                    <div id="customerDetailContent">
                        <!-- Content will be loaded dynamically -->
                    </div>
                </div>
            </div>
        `;
    },
    
    attachEventListeners() {
        const searchInput = document.getElementById('customerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.filterCustomers();
            }, 300));
        }
    },
    
    filterCustomers() {
        const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
        
        this.filteredCustomers = this.customers.filter(customer => {
            return customer.name.toLowerCase().includes(searchTerm) ||
                   customer.phone.includes(searchTerm) ||
                   customer.email.toLowerCase().includes(searchTerm) ||
                   customer.id.toLowerCase().includes(searchTerm);
        });
        
        document.getElementById('customerTableBody').innerHTML = this.renderCustomerRows();
    },
    
    async viewDetails(id) {
        try {
            const customer = this.customers.find(c => c.id === id);
            if (!customer) return;
            
            // Load rental history from API
            let customerOrders = [];
            try {
                const response = await API.customers.getRentalHistory(id);
                customerOrders = response.data || response;
            } catch (error) {
                customerOrders = [];
            }
            
            const detailContent = `
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">Thông tin cá nhân</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <strong>Mã KH:</strong> ${customer.id}
                        </div>
                        <div>
                            <strong>Họ tên:</strong> ${customer.name}
                        </div>
                        <div>
                            <strong>Số điện thoại:</strong> ${customer.phone}
                        </div>
                        <div>
                            <strong>Email:</strong> ${customer.email}
                        </div>
                        <div>
                            <strong>CCCD:</strong> ${customer.idCard}
                        </div>
                        <div>
                            <strong>Trạng thái:</strong> ${customer.status === 'active' ? '<span class="badge badge-success">Hoạt động</span>' : '<span class="badge badge-danger">Bị chặn</span>'}
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <strong>Tổng số lần thuê:</strong> ${customer.totalRentals} lần
                        </div>
                        <div>
                            <strong>Tổng chi tiêu:</strong> ${formatCurrency(customer.totalSpent)}
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">Lịch sử thuê xe</h3>
                    ${customerOrders.length > 0 ? `
                        <table style="width: 100%;">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Xe</th>
                                    <th>Ngày thuê</th>
                                    <th>Trạng thái</th>
                                    <th>Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customerOrders.map(order => `
                                    <tr>
                                        <td>${order.id}</td>
                                        <td>${order.vehicleName}</td>
                                        <td>${formatDate(order.startDate)}</td>
                                        <td>${this.getOrderStatusBadge(order.status)}</td>
                                        <td>${formatCurrency(order.totalAmount)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p style="text-align: center; color: #7f8c8d; padding: 20px;">Chưa có lịch sử thuê xe</p>'}
                </div>
            `;
            
            document.getElementById('customerDetailContent').innerHTML = detailContent;
            openModal('customerDetailModal');
        } catch (error) {
            console.error('Error loading customer details:', error);
            showNotification('Lỗi: ' + error.message, 'error');
        }
    },
    
    getOrderStatusBadge(status) {
        const statusMap = {
            'pending': '<span class="badge badge-warning">Chờ xác nhận</span>',
            'renting': '<span class="badge badge-success">Đang thuê</span>',
            'completed': '<span class="badge badge-info">Hoàn tất</span>',
            'cancelled': '<span class="badge badge-danger">Hủy</span>'
        };
        return statusMap[status] || status;
    },
    
    async blockCustomer(id) {
        const customer = this.customers.find(c => c.id === id);
        if (!customer) return;
        
        const action = customer.status === 'active' ? 'chặn' : 'bỏ chặn';
        
        confirmDialog(`Bạn có chắc chắn muốn ${action} khách hàng này?`, async () => {
            try {
                if (customer.status === 'active') {
                    await API.customers.block(id);
                } else {
                    await API.customers.unblock(id);
                }
                
                customer.status = customer.status === 'active' ? 'blocked' : 'active';
                this.filterCustomers();
                showNotification(`${action.charAt(0).toUpperCase() + action.slice(1)} khách hàng thành công!`, 'success');
            } catch (error) {
                console.error('Error blocking/unblocking customer:', error);
                showNotification('Lỗi: ' + error.message, 'error');
            }
        });
    }
};