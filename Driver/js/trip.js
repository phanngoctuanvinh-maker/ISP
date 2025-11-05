// Trip Management JavaScript

// Sample trip data
const tripsData = [
    {
        id: 12,
        customer: 'Lê Văn A',
        phone: '0901234567',
        pickup: '123 Lê Lợi, Quận 1',
        dropoff: '456 Nguyễn Huệ, Quận 3',
        time: '14:30 - 10/10/2025',
        distance: '5.2 km',
        price: '85,000đ',
        status: 'ongoing'
    },
    {
        id: 13,
        customer: 'Trần Thị B',
        phone: '0902345678',
        pickup: '789 Trần Hưng Đạo, Quận 7',
        dropoff: '321 Hai Bà Trưng, Quận 5',
        time: '15:00 - 10/10/2025',
        distance: '8.5 km',
        price: '125,000đ',
        status: 'pending'
    },
    {
        id: 14,
        customer: 'Nguyễn Văn C',
        phone: '0903456789',
        pickup: '555 Võ Văn Tần, Quận 3',
        dropoff: '888 Nam Kỳ Khởi Nghĩa, Quận 1',
        time: '13:00 - 10/10/2025',
        distance: '3.8 km',
        price: '65,000đ',
        status: 'completed'
    },
    {
        id: 15,
        customer: 'Phạm Thị D',
        phone: '0904567890',
        pickup: '111 Điện Biên Phủ, Quận 10',
        dropoff: '222 Cộng Hòa, Tân Bình',
        time: '16:00 - 10/10/2025',
        distance: '6.3 km',
        price: '95,000đ',
        status: 'pending'
    }
];

// Filter trips
function filterTrips() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    const rows = document.querySelectorAll('#tripsTableBody tr');
    
    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        const tripId = row.getAttribute('data-trip-id');
        const customerName = row.querySelector('.customer-info span').textContent.toLowerCase();
        
        let showRow = true;
        
        // Filter by status
        if (statusFilter !== 'all' && status !== statusFilter) {
            showRow = false;
        }
        
        // Filter by search
        if (searchInput && !tripId.includes(searchInput) && !customerName.includes(searchInput)) {
            showRow = false;
        }
        
        // Show/hide row
        row.style.display = showRow ? '' : 'none';
    });
}

// Reset filters
function resetFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = '';
    document.getElementById('searchInput').value = '';
    filterTrips();
}

// View trip details
function viewTrip(tripId) {
    const trip = tripsData.find(t => t.id === tripId);
    
    if (trip) {
        document.getElementById('modalCustomerName').textContent = trip.customer;
        document.getElementById('modalCustomerPhone').textContent = trip.phone;
        document.getElementById('modalPickup').textContent = trip.pickup;
        document.getElementById('modalDropoff').textContent = trip.dropoff;
        document.getElementById('modalDistance').textContent = trip.distance;
        document.getElementById('modalPrice').textContent = trip.price;
        
        const modal = new bootstrap.Modal(document.getElementById('tripDetailModal'));
        modal.show();
    }
}

// Start trip
function startTrip(tripId) {
    if (confirm(`Bạn có chắc muốn bắt đầu chuyến đi #${tripId}?`)) {
        // Update trip status in UI
        const row = document.querySelector(`tr[data-trip-id="${tripId}"]`);
        if (row) {
            row.setAttribute('data-status', 'ongoing');
            const statusBadge = row.querySelector('.badge');
            statusBadge.className = 'badge bg-success';
            statusBadge.textContent = '🟢 Ongoing';
            
            // Update action buttons
            const actionButtons = row.querySelector('.action-buttons');
            actionButtons.innerHTML = `
                <button class="btn btn-sm btn-info" onclick="viewTrip(${tripId})" title="Xem chi tiết">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="completeTrip(${tripId})" title="Hoàn thành">
                    <i class="bi bi-check-circle"></i>
                </button>
            `;
            
            showNotification('Đã bắt đầu chuyến đi #' + tripId, 'success');
        }
    }
}

// Complete trip
function completeTrip(tripId) {
    if (confirm(`Bạn có chắc muốn hoàn thành chuyến đi #${tripId}?`)) {
        // Update trip status in UI
        const row = document.querySelector(`tr[data-trip-id="${tripId}"]`);
        if (row) {
            row.setAttribute('data-status', 'completed');
            const statusBadge = row.querySelector('.badge');
            statusBadge.className = 'badge bg-primary';
            statusBadge.textContent = '🔵 Completed';
            
            // Update action buttons
            const actionButtons = row.querySelector('.action-buttons');
            actionButtons.innerHTML = `
                <button class="btn btn-sm btn-info" onclick="viewTrip(${tripId})" title="Xem chi tiết">
                    <i class="bi bi-eye"></i>
                </button>
            `;
            
            showNotification('Đã hoàn thành chuyến đi #' + tripId, 'success');
        }
    }
}

// Cancel trip
function cancelTrip(tripId) {
    const reason = prompt('Lý do hủy chuyến đi:');
    if (reason) {
        // Update trip status in UI
        const row = document.querySelector(`tr[data-trip-id="${tripId}"]`);
        if (row) {
            row.setAttribute('data-status', 'cancelled');
            const statusBadge = row.querySelector('.badge');
            statusBadge.className = 'badge bg-danger';
            statusBadge.textContent = '🔴 Cancelled';
            
            // Update action buttons
            const actionButtons = row.querySelector('.action-buttons');
            actionButtons.innerHTML = `
                <button class="btn btn-sm btn-info" onclick="viewTrip(${tripId})" title="Xem chi tiết">
                    <i class="bi bi-eye"></i>
                </button>
            `;
            
            showNotification('Đã hủy chuyến đi #' + tripId, 'warning');
        }
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-toast {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-toast i {
        font-size: 20px;
    }
`;
document.head.appendChild(style);

// Handle logout
function handleLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        // Redirect to login page
        window.location.href = '../../web/login.jsp';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Trips page loaded');
    
    // Set current date as default for date filter
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateFilter').value = today;
});
