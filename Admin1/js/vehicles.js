// Vehicles Page Logic - WITH API INTEGRATION
const VehiclesPage = {
    vehicles: [],
    filteredVehicles: [],
    isLoading: false,
    
    async render(container) {
        container.innerHTML = this.renderSkeleton();
        await this.loadVehicles();
        this.renderContent(container);
    },
    
    renderSkeleton() {
        return `
            <div class="header">
                <h1>Quản lý xe</h1>
                <button class="btn btn-primary" disabled>
                    ⏳ Đang tải...
                </button>
            </div>
            <div style="text-align: center; padding: 40px;">
                <p>Đang tải dữ liệu...</p>
            </div>
        `;
    },
    
    async loadVehicles() {
        this.isLoading = true;
        try {
            // Gọi API lấy danh sách xe
            const response = await API.vehicles.getAll();
            this.vehicles = response.data || response;
            this.filteredVehicles = [...this.vehicles];
        } catch (error) {
            console.error('Error loading vehicles:', error);
            showNotification('Không thể tải danh sách xe: ' + error.message, 'error');
            // Fallback to mock data if API fails
            this.vehicles = SampleData.vehicles || [];
            this.filteredVehicles = [...this.vehicles];
        } finally {
            this.isLoading = false;
        }
    },
    
    renderContent(container) {
        container.innerHTML = `
            <div class="header">
                <h1>Quản lý xe</h1>
                <button class="btn btn-primary" onclick="VehiclesPage.openAddModal()">
                    ➕ Thêm xe mới
                </button>
            </div>

            <div class="filter-bar">
                <input type="text" class="search-box" id="vehicleSearch" placeholder="🔍 Tìm kiếm xe...">
                <select id="typeFilter">
                    <option value="">Tất cả loại xe</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Pickup">Pickup</option>
                    <option value="MPV">MPV</option>
                </select>
                <select id="statusFilter">
                    <option value="">Tất cả trạng thái</option>
                    <option value="available">Khả dụng</option>
                    <option value="rented">Đang thuê</option>
                    <option value="maintenance">Bảo trì</option>
                    <option value="broken">Hỏng</option>
                </select>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tên xe</th>
                            <th>Hãng</th>
                            <th>Loại</th>
                            <th>Biển số</th>
                            <th>Giá/ngày</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="vehicleTableBody">
                        ${this.renderVehicleRows()}
                    </tbody>
                </table>
            </div>

            ${this.renderModal()}
        `;
        
        this.attachEventListeners();
    },
    
    renderVehicleRows() {
        if (this.filteredVehicles.length === 0) {
            return `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">🚗</div>
                            <p>Không tìm thấy xe nào</p>
                        </div>
                    </td>
                </tr>
            `;
        }
        
        return this.filteredVehicles.map(vehicle => `
            <tr>
                <td>
                    ${vehicle.imageUrl ? 
                        `<img src="${vehicle.imageUrl}" class="car-image" alt="${vehicle.name}">` :
                        `<div class="car-image" style="background:#ddd; display:flex; align-items:center; justify-content:center; font-size:24px;">${vehicle.image || '🚗'}</div>`
                    }
                </td>
                <td>${vehicle.name}</td>
                <td>${vehicle.brand}</td>
                <td>${vehicle.type}</td>
                <td>${vehicle.plateNumber}</td>
                <td>${formatCurrency(vehicle.pricePerDay)}</td>
                <td>${this.getStatusBadge(vehicle.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn btn-primary" onclick="VehiclesPage.editVehicle('${vehicle.id}')">✏️</button>
                        <button class="icon-btn btn-danger" onclick="VehiclesPage.deleteVehicle('${vehicle.id}')">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    getStatusBadge(status) {
        const statusMap = {
            'available': '<span class="badge badge-success">Khả dụng</span>',
            'rented': '<span class="badge badge-warning">Đang thuê</span>',
            'maintenance': '<span class="badge badge-info">Bảo trì</span>',
            'broken': '<span class="badge badge-danger">Hỏng</span>'
        };
        return statusMap[status] || status;
    },
    
    renderModal() {
        return `
            <div class="modal" id="vehicleModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modalTitle">Thêm xe mới</h2>
                        <span class="close-btn" onclick="closeModal('vehicleModal')">&times;</span>
                    </div>
                    <form id="vehicleForm">
                        <input type="hidden" id="vehicleId">
                        <div class="form-group">
                            <label>Tên xe *</label>
                            <input type="text" id="vehicleName" required placeholder="VD: Toyota Camry">
                        </div>
                        <div class="form-group">
                            <label>Hãng xe *</label>
                            <select id="vehicleBrand" required>
                                <option value="">Chọn hãng xe</option>
                                <option value="Toyota">Toyota</option>
                                <option value="Honda">Honda</option>
                                <option value="Mazda">Mazda</option>
                                <option value="Ford">Ford</option>
                                <option value="Hyundai">Hyundai</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Loại xe *</label>
                            <select id="vehicleType" required>
                                <option value="">Chọn loại xe</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="MPV">MPV</option>
                                <option value="Pickup">Pickup</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Số chỗ ngồi *</label>
                            <select id="vehicleSeats" required>
                                <option value="4">4 chỗ</option>
                                <option value="5">5 chỗ</option>
                                <option value="7">7 chỗ</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Biển số xe *</label>
                            <input type="text" id="vehiclePlateNumber" required placeholder="VD: 51A-12345">
                        </div>
                        <div class="form-group">
                            <label>Giá thuê/ngày (VNĐ) *</label>
                            <input type="number" id="vehiclePrice" required placeholder="VD: 1200000">
                        </div>
                        <div class="form-group">
                            <label>Tình trạng *</label>
                            <select id="vehicleStatus" required>
                                <option value="available">Khả dụng</option>
                                <option value="rented">Đang thuê</option>
                                <option value="maintenance">Bảo trì</option>
                                <option value="broken">Hỏng</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Hình ảnh xe</label>
                            <input type="file" id="vehicleImage" accept="image/*">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;" id="submitBtn">Lưu xe</button>
                    </form>
                </div>
            </div>
        `;
    },
    
    attachEventListeners() {
        const searchInput = document.getElementById('vehicleSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.filterVehicles();
            }, 300));
        }
        
        const typeFilter = document.getElementById('typeFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterVehicles());
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterVehicles());
        }
        
        const form = document.getElementById('vehicleForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveVehicle();
            });
        }
    },
    
    filterVehicles() {
        const searchTerm = document.getElementById('vehicleSearch').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        
        this.filteredVehicles = this.vehicles.filter(vehicle => {
            const matchSearch = !searchTerm || 
                vehicle.name.toLowerCase().includes(searchTerm) ||
                vehicle.brand.toLowerCase().includes(searchTerm) ||
                vehicle.plateNumber.toLowerCase().includes(searchTerm);
            
            const matchType = !typeFilter || vehicle.type === typeFilter;
            const matchStatus = !statusFilter || vehicle.status === statusFilter;
            
            return matchSearch && matchType && matchStatus;
        });
        
        document.getElementById('vehicleTableBody').innerHTML = this.renderVehicleRows();
    },
    
    openAddModal() {
        document.getElementById('modalTitle').textContent = 'Thêm xe mới';
        document.getElementById('vehicleForm').reset();
        document.getElementById('vehicleId').value = '';
        openModal('vehicleModal');
    },
    
    editVehicle(id) {
        const vehicle = this.vehicles.find(v => v.id === id);
        if (!vehicle) return;
        
        document.getElementById('modalTitle').textContent = 'Chỉnh sửa xe';
        document.getElementById('vehicleId').value = vehicle.id;
        document.getElementById('vehicleName').value = vehicle.name;
        document.getElementById('vehicleBrand').value = vehicle.brand;
        document.getElementById('vehicleType').value = vehicle.type;
        document.getElementById('vehicleSeats').value = vehicle.seats;
        document.getElementById('vehiclePlateNumber').value = vehicle.plateNumber;
        document.getElementById('vehiclePrice').value = vehicle.pricePerDay;
        document.getElementById('vehicleStatus').value = vehicle.status;
        
        openModal('vehicleModal');
    },
    
    async saveVehicle() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang lưu...';
        
        try {
            const id = document.getElementById('vehicleId').value;
            const vehicleData = {
                name: document.getElementById('vehicleName').value,
                brand: document.getElementById('vehicleBrand').value,
                type: document.getElementById('vehicleType').value,
                seats: parseInt(document.getElementById('vehicleSeats').value),
                plateNumber: document.getElementById('vehiclePlateNumber').value,
                pricePerDay: parseInt(document.getElementById('vehiclePrice').value),
                status: document.getElementById('vehicleStatus').value
            };
            
            let result;
            if (id) {
                // Update existing vehicle
                result = await API.vehicles.update(id, vehicleData);
                showNotification('Cập nhật xe thành công!', 'success');
            } else {
                // Add new vehicle
                result = await API.vehicles.create(vehicleData);
                showNotification('Thêm xe mới thành công!', 'success');
            }
            
            // Upload image if selected
            const imageFile = document.getElementById('vehicleImage').files[0];
            if (imageFile && result.id) {
                await API.vehicles.uploadImage(result.id, imageFile);
            }
            
            closeModal('vehicleModal');
            await this.loadVehicles();
            this.filterVehicles();
            
        } catch (error) {
            console.error('Error saving vehicle:', error);
            showNotification('Lỗi: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Lưu xe';
        }
    },
    
    async deleteVehicle(id) {
        confirmDialog('Bạn có chắc chắn muốn xóa xe này?', async () => {
            try {
                await API.vehicles.delete(id);
                showNotification('Xóa xe thành công!', 'success');
                await this.loadVehicles();
                this.filterVehicles();
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                showNotification('Lỗi: ' + error.message, 'error');
            }
        });
    }
};