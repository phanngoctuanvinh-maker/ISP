// API Configuration and Service

const API = {
    // ===== CẤU HÌNH API =====
    BASE_URL: 'http://localhost:3000/api', // Thay đổi URL API của bạn ở đây
    
    // Timeout cho các request (ms)
    TIMEOUT: 30000,
    
    // Token lưu trong localStorage
    getToken() {
        return localStorage.getItem('auth_token');
    },
    
    setToken(token) {
        localStorage.setItem('auth_token', token);
    },
    
    clearToken() {
        localStorage.removeItem('auth_token');
    },
    
    // ===== HELPER FUNCTIONS =====
    
    // Tạo headers cho request
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    },
    
    // Xử lý response
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'Đã xảy ra lỗi'
            }));
            
            // Nếu unauthorized, redirect về login
            if (response.status === 401) {
                this.clearToken();
                window.location.href = '/login.html';
            }
            
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        
        return response.json();
    },
    
    // Fetch với timeout
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    },
    
    // ===== AUTHENTICATION =====
    
    async login(email, password) {
        const response = await this.fetchWithTimeout(`${this.BASE_URL}/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(false),
            body: JSON.stringify({ email, password })
        });
        
        const data = await this.handleResponse(response);
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    },
    
    async logout() {
        try {
            await this.fetchWithTimeout(`${this.BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: this.getHeaders()
            });
        } finally {
            this.clearToken();
        }
    },
    
    // ===== VEHICLES API =====
    
    vehicles: {
        async getAll(filters = {}) {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${API.BASE_URL}/vehicles${queryParams ? '?' + queryParams : ''}`;
            
            const response = await API.fetchWithTimeout(url, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async getById(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/vehicles/${id}`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async create(vehicleData) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/vehicles`, {
                method: 'POST',
                headers: API.getHeaders(),
                body: JSON.stringify(vehicleData)
            });
            
            return API.handleResponse(response);
        },
        
        async update(id, vehicleData) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/vehicles/${id}`, {
                method: 'PUT',
                headers: API.getHeaders(),
                body: JSON.stringify(vehicleData)
            });
            
            return API.handleResponse(response);
        },
        
        async delete(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/vehicles/${id}`, {
                method: 'DELETE',
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async uploadImage(id, imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/vehicles/${id}/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API.getToken()}`
                    // Không set Content-Type để browser tự set multipart/form-data
                },
                body: formData
            });
            
            return API.handleResponse(response);
        }
    },
    
    // ===== CUSTOMERS API =====
    
    customers: {
        async getAll(filters = {}) {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${API.BASE_URL}/customers${queryParams ? '?' + queryParams : ''}`;
            
            const response = await API.fetchWithTimeout(url, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async getById(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/customers/${id}`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async getRentalHistory(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/customers/${id}/rentals`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async block(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/customers/${id}/block`, {
                method: 'POST',
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async unblock(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/customers/${id}/unblock`, {
                method: 'POST',
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        }
    },
    
    // ===== ORDERS API =====
    
    orders: {
        async getAll(filters = {}) {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${API.BASE_URL}/orders${queryParams ? '?' + queryParams : ''}`;
            
            const response = await API.fetchWithTimeout(url, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async getById(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/orders/${id}`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async create(orderData) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/orders`, {
                method: 'POST',
                headers: API.getHeaders(),
                body: JSON.stringify(orderData)
            });
            
            return API.handleResponse(response);
        },
        
        async approve(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/orders/${id}/approve`, {
                method: 'POST',
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async cancel(id, reason) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/orders/${id}/cancel`, {
                method: 'POST',
                headers: API.getHeaders(),
                body: JSON.stringify({ reason })
            });
            
            return API.handleResponse(response);
        },
        
        async complete(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/orders/${id}/complete`, {
                method: 'POST',
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        }
    },
    
    // ===== PAYMENTS API =====
    
    payments: {
        async getAll(filters = {}) {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${API.BASE_URL}/payments${queryParams ? '?' + queryParams : ''}`;
            
            const response = await API.fetchWithTimeout(url, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async getById(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/payments/${id}`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async confirm(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/payments/${id}/confirm`, {
                method: 'POST',
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        }
    },
    
    // ===== COUPONS API =====
    
    coupons: {
        async getAll(filters = {}) {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${API.BASE_URL}/coupons${queryParams ? '?' + queryParams : ''}`;
            
            const response = await API.fetchWithTimeout(url, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async getById(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/coupons/${id}`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async create(couponData) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/coupons`, {
                method: 'POST',
                headers: API.getHeaders(),
                body: JSON.stringify(couponData)
            });
            
            return API.handleResponse(response);
        },
        
        async update(id, couponData) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/coupons/${id}`, {
                method: 'PUT',
                headers: API.getHeaders(),
                body: JSON.stringify(couponData)
            });
            
            return API.handleResponse(response);
        },
        
        async delete(id) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/coupons/${id}`, {
                method: 'DELETE',
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async validate(code) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/coupons/validate/${code}`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        }
    },
    
    // ===== DASHBOARD/STATS API =====
    
    dashboard: {
        async getStats() {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/dashboard/stats`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async getRevenueChart(period = '6months') {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/dashboard/revenue?period=${period}`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async getVehicleStatus() {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/dashboard/vehicle-status`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        },
        
        async getRecentOrders(limit = 5) {
            const response = await API.fetchWithTimeout(`${API.BASE_URL}/dashboard/recent-orders?limit=${limit}`, {
                headers: API.getHeaders()
            });
            
            return API.handleResponse(response);
        }
    }
};

// Make API available globally
window.API = API;