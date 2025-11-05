// Utility Functions - Global scope

// Format currency
window.formatCurrency = function(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Format date
window.formatDate = function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Open modal
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Close modal
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Show notification
window.showNotification = function(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#f39c12'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Confirm dialog
window.confirmDialog = function(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Generate unique ID
window.generateId = function() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Validate email
window.validateEmail = function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
window.validatePhone = function(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}

// Search in array
window.searchArray = function(array, searchTerm, fields) {
    searchTerm = searchTerm.toLowerCase();
    return array.filter(item => {
        return fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(searchTerm);
        });
    });
}

// Filter array
window.filterArray = function(array, filterKey, filterValue) {
    if (!filterValue || filterValue === 'all') return array;
    return array.filter(item => item[filterKey] === filterValue);
}

// Sort array
window.sortArray = function(array, sortKey, order = 'asc') {
    return array.sort((a, b) => {
        if (order === 'asc') {
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });
}

// Pagination
window.paginate = function(array, page, perPage) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
        data: array.slice(start, end),
        total: array.length,
        currentPage: page,
        totalPages: Math.ceil(array.length / perPage)
    };
}

// Debounce function
window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle logout
window.handleLogout = function() {
    confirmDialog('Bạn có chắc chắn muốn đăng xuất?', () => {
        // Show logout notification
        showNotification('Đang đăng xuất...', 'success');
        
        // Simulate logout delay
        setTimeout(() => {
            // Clear any stored session data if needed
            // localStorage.clear(); // Uncomment if you use localStorage
            
            // Redirect to login page or reload
            // In a real app, you would redirect to login page
            // window.location.href = '/login.html';
            
            // For demo, just reload the page
            window.location.reload();
        }, 1000);
    });
}