// Payments Page Logic - WITH API INTEGRATION
const PaymentsPage = {
    payments: [],
    filteredPayments: [],
    isLoading: false,
    
    async render(container) {
        container.innerHTML = this.renderSkeleton();
        await this.loadPayments();
        this.renderContent(container);
    },
    
    renderSkeleton() {
        return `
            <div class="header">
                <h1>Quản lý thanh toán</h1>
            </div>
            <div style="text-align: center; padding: 40px;">
                <p>Đang tải dữ liệu...</p>
            </div>
        `;
    },
    
    async loadPayments() {
        this.isLoading = true;
        try {
            const response = await API.payments.getAll();
            this.payments = response.data || response;
            this.filteredPayments = [...this.payments];
        } catch (error) {
            console.error('Error loading payments:', error);
            showNotification('Không thể tải danh sách thanh toán: ' + error.message, 'error');
             // Fallback to mock data
            // this.payments = SampleData.payments || [];
            // this.filteredPayments = [...this.payments];
        } finally {
            this.isLoading = false;
        }
    },
    
    renderContent(container) {
        container.innerHTML = `
            <div class="header">
                <h1>Quản lý thanh toán</h1>
            </div>

            <div class="filter-bar">
                <input type="text" class="search-box" id="paymentSearch" placeholder="🔍 Tìm kiếm thanh toán...">
                <select id="methodFilter">
                    <option value="">Tất cả phương thức</option>
                    <option value="cash">Tiền mặt</option>
                    <option value="transfer">Chuyển khoản</option>
                    <option value="momo">Momo</option>
                    <option value="vnpay">VNPay</option>
                </select>
                <select id="paymentStatusFilter">
                    <option value="">Tất cả trạng thái</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="unpaid">Chưa thanh toán</option>
                </select>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã thanh toán</th>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Số tiền</th>
                            <th>Phương thức</th>
                            <th>Ngày thanh toán</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="paymentTableBody">
                        ${this.renderPaymentRows()}
                    </tbody>
                </table>
            </div>
        `;
        
        this.attachEventListeners();
    },
    
    renderPaymentRows() {
        if (this.filteredPayments.length === 0) {
            return `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">💰</div>
                            <p>Không tìm thấy thanh toán nào</p>
                        </div>
                    </td>
                </tr>
            `;
        }
        
        return this.filteredPayments.map(payment => `
            <tr>
                <td>${payment.id}</td>
                <td>${payment.orderId}</td>
                <td>${payment.customerName}</td>
                <td>${formatCurrency(payment.amount)}</td>
                <td>${this.getMethodBadge(payment.method)}</td>
                <td>${payment.date ? formatDate(payment.date) : '-'}</td>
                <td>${this.getStatusBadge(payment.status)}</td>
                <td>
                    <div class="action-buttons">
                        ${payment.status === 'unpaid' ? 
                            `<button class="icon-btn btn-success" onclick="PaymentsPage.confirmPayment('${payment.id}')" title="Xác nhận thanh toán">✅</button>` : 
                            `<button class="icon-btn btn-primary" onclick="PaymentsPage.viewReceipt('${payment.id}')" title="Xem biên lai">📄</button>`
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    getMethodBadge(method) {
        const methodMap = {
            'cash': '<span class="badge badge-success">Tiền mặt</span>',
            'transfer': '<span class="badge badge-info">Chuyển khoản</span>',
            'momo': '<span class="badge" style="background: rgba(167, 24, 115, 0.1); color: #a71873;">Momo</span>',
            'vnpay': '<span class="badge" style="background: rgba(0, 123, 255, 0.1); color: #007bff;">VNPay</span>'
        };
        return methodMap[method] || method;
    },
    
    getStatusBadge(status) {
        const statusMap = {
            'paid': '<span class="badge badge-success">Đã thanh toán</span>',
            'unpaid': '<span class="badge badge-warning">Chưa thanh toán</span>'
        };
        return statusMap[status] || status;
    },
    
    attachEventListeners() {
        const searchInput = document.getElementById('paymentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.filterPayments();
            }, 300));
        }
        
        const methodFilter = document.getElementById('methodFilter');
        const statusFilter = document.getElementById('paymentStatusFilter');
        
        if (methodFilter) {
            methodFilter.addEventListener('change', () => this.filterPayments());
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterPayments());
        }
    },
    
    filterPayments() {
        const searchTerm = document.getElementById('paymentSearch').value.toLowerCase();
        const methodFilter = document.getElementById('methodFilter').value;
        const statusFilter = document.getElementById('paymentStatusFilter').value;
        
        this.filteredPayments = this.payments.filter(payment => {
            const matchSearch = !searchTerm ||
                payment.id.toLowerCase().includes(searchTerm) ||
                payment.orderId.toLowerCase().includes(searchTerm) ||
                payment.customerName.toLowerCase().includes(searchTerm);
            
            const matchMethod = !methodFilter || payment.method === methodFilter;
            const matchStatus = !statusFilter || payment.status === statusFilter;
            
            return matchSearch && matchMethod && matchStatus;
        });
        
        document.getElementById('paymentTableBody').innerHTML = this.renderPaymentRows();
    },
    
    async confirmPayment(id) {
        confirmDialog('Xác nhận khách hàng đã thanh toán?', async () => {
            try {
                await API.payments.confirm(id);
                await this.loadPayments();
                this.filterPayments();
                showNotification('Xác nhận thanh toán thành công!', 'success');
            } catch (error) {
                console.error('Error confirming payment:', error);
                showNotification('Lỗi: ' + error.message, 'error');
            }
        });
    },
    
    viewReceipt(id) {
        const payment = this.payments.find(p => p.id === id);
        if (!payment) return;
        
        showNotification('Đang tải biên lai...', 'success');
        // Here you can implement actual receipt viewing functionality
    }
};