// API Configuration
const API_BASE_URL = 'http://localhost:8080/api'; // Thay đổi port nếu cần

// API Helper Functions
const api = {
    /**
     * Gửi yêu cầu đến API
     * @param {string} endpoint - Điểm cuối của API (ví dụ: '/auth/login')
     * @param {string} method - Phương thức HTTP (GET, POST, PUT, DELETE)
     * @param {object} body - Dữ liệu gửi đi (cho POST, PUT)
     * @returns {Promise<any>}
     */
    async request(endpoint, method = 'GET', body = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null,
            });

            // Kiểm tra xem response có phải JSON không
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // Nếu không phải JSON (ví dụ: HTML error page)
                const textResponse = await response.text();
                console.error('Response không phải JSON:', textResponse);
                throw new Error(`Lỗi ${response.status}: Server trả về dữ liệu không hợp lệ`);
            }

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `Lỗi ${response.status}`);
            }

            return responseData;
        } catch (error) {
            if (error instanceof TypeError) {
                console.error('Lỗi mạng hoặc CORS. Kiểm tra: 1. Backend đã chạy chưa? 2. Cấu hình CORS. 3. URL API.');
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
            }
            throw error;
        }
    },

    // --- AUTH ---
    async register(userData) {
        const payload = {
            username: userData.email, // Backend dùng username là email
            password: userData.password,
            role: 'customer',
            fullName: userData.name,
            phone: userData.phone,
            email: userData.email,
        };
        return this.request('/auth/register', 'POST', payload);
    },

    async login(username, password) {
        const payload = { username, password };
        const response = await this.request('/auth/login', 'POST', payload);
        if (response.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify(response.data));
        }
        return response;
    },

    async forgotPassword(email) {
        // Gọi endpoint backend: /auth/forgot-password
return this.request('/auth/forgot-password', 'POST', { email });
    },

    async resetPassword(email, otpCode, newPassword, confirmPassword) {
        // Gọi endpoint backend: /auth/reset-password
        return this.request('/auth/reset-password', 'POST', {
            email,
            otpCode,
            newPassword,
            confirmPassword
        });
    },

    async googleLogin(idToken) {
        // Gọi endpoint backend: /auth/google-login
        const response = await this.request('/auth/google-login', 'POST', { idToken });
        // Lưu token và user info vào localStorage
        if (response.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify(response.data));
        }
        return response;
    },

    // --- VALIDATION ---
    async checkEmailExists(email) {
        return this.request(`/validation/check-email?email=${encodeURIComponent(email)}`);
    },

    async checkPhoneExists(phone) {
        return this.request(`/validation/check-phone?phone=${encodeURIComponent(phone)}`);
    },

    // --- CARS ---
    async getSubscriptionCars(city) {
        return this.request(`/cars/subscription?city=${encodeURIComponent(city)}`);
    },

    // --- HELPERS ---
    isLoggedIn: () => !!localStorage.getItem('token'),
    getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser') || 'null'),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
        window.location.href = 'homepage.html';
    },
};

// Export for use in other files
window.api = api;