// Coupons Page Logic
const CouponsPage = {
    coupons: [...SampleData.coupons],
    filteredCoupons: [],
    
    render(container) {
        this.filteredCoupons = [...this.coupons];
        
        container.innerHTML = `
            <div class="header">
                <h1>Quản lý mã giảm giá</h1>
                <button class="btn btn-primary" onclick="CouponsPage.openAddModal()">
                    ➕ Thêm mã giảm giá
                </button>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã code</th>
                            <th>Mô tả</th>
                            <th>Giảm giá</th>
                            <th>Đơn tối thiểu</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày hết hạn</th>
                            <th>Đã dùng/Tổng</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="couponTableBody">
                        ${this.renderCouponRows()}
                    </tbody>
                </table>
            </div>

            ${this.renderModal()}
        `;
        
        this.attachEventListeners();
    },
    
    renderCouponRows() {
        if (this.filteredCoupons.length === 0) {
            return `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">🎁</div>
                            <p>Không tìm thấy mã giảm giá nào</p>
                        </div>
                    </td>
                </tr>
            `;
        }
        
        return this.filteredCoupons.map(coupon => `
            <tr>
                <td><strong>${coupon.code}</strong></td>
                <td>${coupon.description}</td>
                <td>${this.getDiscountText(coupon)}</td>
                <td>${formatCurrency(coupon.minAmount)}</td>
                <td>${formatDate(coupon.startDate)}</td>
                <td>${formatDate(coupon.endDate)}</td>
                <td>${coupon.used}/${coupon.quantity}</td>
                <td>${this.getStatusBadge(coupon)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn btn-primary" onclick="CouponsPage.editCoupon('${coupon.id}')">✏️</button>
                        <button class="icon-btn btn-danger" onclick="CouponsPage.deleteCoupon('${coupon.id}')">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    getDiscountText(coupon) {
        if (coupon.type === 'percent') {
            return `${coupon.value}%`;
        } else {
            return formatCurrency(coupon.value);
        }
    },
    
    getStatusBadge(coupon) {
        const today = new Date();
        const endDate = new Date(coupon.endDate);
        const isExpired = endDate < today;
        const isOutOfStock = coupon.used >= coupon.quantity;
        
        if (isExpired || isOutOfStock) {
            return '<span class="badge badge-danger">Hết hạn</span>';
        } else {
            return '<span class="badge badge-success">Còn hiệu lực</span>';
        }
    },
    
    renderModal() {
        return `
            <div class="modal" id="couponModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="couponModalTitle">Thêm mã giảm giá</h2>
                        <span class="close-btn" onclick="closeModal('couponModal')">&times;</span>
                    </div>
                    <form id="couponForm">
                        <input type="hidden" id="couponId">
                        <div class="form-group">
                            <label>Mã code *</label>
                            <input type="text" id="couponCode" required placeholder="VD: SUMMER2025" style="text-transform: uppercase;">
                        </div>
                        <div class="form-group">
                            <label>Mô tả *</label>
                            <input type="text" id="couponDescription" required placeholder="VD: Giảm giá mùa hè">
                        </div>
                        <div class="form-group">
                            <label>Loại giảm giá *</label>
                            <select id="couponType" required>
                                <option value="percent">Phần trăm (%)</option>
                                <option value="fixed">Số tiền cố định (VNĐ)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Giá trị giảm *</label>
                            <input type="number" id="couponValue" required placeholder="VD: 20 hoặc 500000">
                        </div>
                        <div class="form-group">
                            <label>Số tiền thuê tối thiểu (VNĐ) *</label>
                            <input type="number" id="couponMinAmount" required placeholder="VD: 2000000">
                        </div>
                        <div class="form-group">
                            <label>Ngày bắt đầu *</label>
                            <input type="date" id="couponStartDate" required>
                        </div>
                        <div class="form-group">
                            <label>Ngày hết hạn *</label>
                            <input type="date" id="couponEndDate" required>
                        </div>
                        <div class="form-group">
                            <label>Số lượng mã *</label>
                            <input type="number" id="couponQuantity" required placeholder="VD: 100">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Tạo mã giảm giá</button>
                    </form>
                </div>
            </div>
        `;
    },
    
    attachEventListeners() {
        const form = document.getElementById('couponForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCoupon();
            });
        }
    },
    
    openAddModal() {
        document.getElementById('couponModalTitle').textContent = 'Thêm mã giảm giá';
        document.getElementById('couponForm').reset();
        document.getElementById('couponId').value = '';
        
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('couponStartDate').value = today;
        
        openModal('couponModal');
    },
    
    editCoupon(id) {
        const coupon = this.coupons.find(c => c.id === id);
        if (!coupon) return;
        
        document.getElementById('couponModalTitle').textContent = 'Chỉnh sửa mã giảm giá';
        document.getElementById('couponId').value = coupon.id;
        document.getElementById('couponCode').value = coupon.code;
        document.getElementById('couponDescription').value = coupon.description;
        document.getElementById('couponType').value = coupon.type;
        document.getElementById('couponValue').value = coupon.value;
        document.getElementById('couponMinAmount').value = coupon.minAmount;
        document.getElementById('couponStartDate').value = coupon.startDate;
        document.getElementById('couponEndDate').value = coupon.endDate;
        document.getElementById('couponQuantity').value = coupon.quantity;
        
        openModal('couponModal');
    },
    
    saveCoupon() {
        const id = document.getElementById('couponId').value;
        const code = document.getElementById('couponCode').value.toUpperCase();
        
        // Check if code already exists (for new coupons)
        if (!id && this.coupons.some(c => c.code === code)) {
            showNotification('Mã giảm giá đã tồn tại!', 'error');
            return;
        }
        
        const couponData = {
            id: id || generateId(),
            code: code,
            description: document.getElementById('couponDescription').value,
            type: document.getElementById('couponType').value,
            value: parseFloat(document.getElementById('couponValue').value),
            minAmount: parseFloat(document.getElementById('couponMinAmount').value),
            startDate: document.getElementById('couponStartDate').value,
            endDate: document.getElementById('couponEndDate').value,
            quantity: parseInt(document.getElementById('couponQuantity').value),
            used: id ? this.coupons.find(c => c.id === id).used : 0,
            status: 'active'
        };
        
        // Validate dates
        if (new Date(couponData.startDate) > new Date(couponData.endDate)) {
            showNotification('Ngày bắt đầu không được lớn hơn ngày hết hạn!', 'error');
            return;
        }
        
        if (id) {
            // Update existing coupon
            const index = this.coupons.findIndex(c => c.id === id);
            if (index !== -1) {
                this.coupons[index] = couponData;
                showNotification('Cập nhật mã giảm giá thành công!', 'success');
            }
        } else {
            // Add new coupon
            this.coupons.push(couponData);
            showNotification('Thêm mã giảm giá mới thành công!', 'success');
        }
        
        closeModal('couponModal');
        this.filteredCoupons = [...this.coupons];
        document.getElementById('couponTableBody').innerHTML = this.renderCouponRows();
    },
    
    deleteCoupon(id) {
        confirmDialog('Bạn có chắc chắn muốn xóa mã giảm giá này?', () => {
            this.coupons = this.coupons.filter(c => c.id !== id);
            this.filteredCoupons = [...this.coupons];
            document.getElementById('couponTableBody').innerHTML = this.renderCouponRows();
            showNotification('Xóa mã giảm giá thành công!', 'success');
        });
    }
};