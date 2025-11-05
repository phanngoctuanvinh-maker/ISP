// ========================================
// MOCK DATA VERSION - For Demo Purpose
// ========================================
// Uncomment section below to use with real backend API

// API Base URL - Thay đổi theo server của bạn
// const API_BASE_URL = 'http://localhost:8080/ISP392-Font';

// ========================================
// MOCK DATA
// ========================================
const mockUsers = [
    { userID: 1, fullName: 'Nguyen Van A', email: 'vana@gmail.com', phone: '0901234567', address: 'Ha Noi', role: 'User' },
    { userID: 2, fullName: 'Tran Thi B', email: 'thib@gmail.com', phone: '0912345678', address: 'Ho Chi Minh', role: 'Staff' },
    { userID: 3, fullName: 'Le Van C', email: 'vanc@gmail.com', phone: '0923456789', address: 'Da Nang', role: 'Shipper' },
    { userID: 4, fullName: 'Pham Thi D', email: 'thid@gmail.com', phone: '0934567890', address: 'Can Tho', role: 'User' },
    { userID: 5, fullName: 'Hoang Van E', email: 'vane@gmail.com', phone: '0945678901', address: 'Hai Phong', role: 'Staff' },
    { userID: 6, fullName: 'Vo Thi F', email: 'thif@gmail.com', phone: '0956789012', address: 'Hue', role: 'User' },
    { userID: 7, fullName: 'Dang Van G', email: 'vang@gmail.com', phone: '0967890123', address: 'Nha Trang', role: 'Shipper' }
];

let filteredUsers = [...mockUsers];

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    renderUserTable();
    setupSearchForm();
    showSessionMessage();
});

// ========================================
// RENDER FUNCTIONS
// ========================================
function renderUserTable() {
    const tbody = document.getElementById('userTableBody');
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>${escapeHtml(user.userID)}</td>
            <td>${escapeHtml(user.fullName)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.phone)}</td>
            <td>${escapeHtml(user.address)}</td>
            <td>
                <form class="d-flex align-items-center gap-2" onsubmit="return handleRoleChange(event, ${user.userID})">
                    <select name="newRole" class="form-select form-select-sm" style="width:auto;">
                        <option value="User" ${user.role === 'User' ? 'selected' : ''}>User</option>
                        <option value="Staff" ${user.role === 'Staff' ? 'selected' : ''}>Staff</option>
                        <option value="Shipper" ${user.role === 'Shipper' ? 'selected' : ''}>Shipper</option>
                    </select>
                    <button type="submit" class="btn btn-sm btn-outline-success">Save</button>
                </form>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="handleDelete(${user.userID}, '${escapeHtml(user.fullName)}')">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// ========================================
// SEARCH & FILTER
// ========================================
function setupSearchForm() {
    const form = document.getElementById('searchForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const keyword = document.getElementById('keyword').value.toLowerCase();
        const role = document.getElementById('role').value;
        
        filteredUsers = mockUsers.filter(user => {
            const matchKeyword = !keyword || 
                user.fullName.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword) ||
                user.address.toLowerCase().includes(keyword) ||
                user.role.toLowerCase().includes(keyword);
            
            const matchRole = role === 'all' || user.role === role;
            
            return matchKeyword && matchRole;
        });
        
        renderUserTable();
    });
}

function resetSearch() {
    document.getElementById('keyword').value = '';
    document.getElementById('role').value = 'all';
    filteredUsers = [...mockUsers];
    renderUserTable();
}

// ========================================
// USER ACTIONS
// ========================================
function handleRoleChange(event, userID) {
    event.preventDefault();
    
    const form = event.target;
    const newRole = form.querySelector('select[name="newRole"]').value;
    
    const user = mockUsers.find(u => u.userID === userID);
    if (user) {
        user.role = newRole;
        showAlert('Role updated successfully!', 'success');
        
        // Cập nhật lại filteredUsers
        const keyword = document.getElementById('keyword').value;
        const role = document.getElementById('role').value;
        if (keyword || role !== 'all') {
            // Reapply filter
            document.getElementById('searchForm').dispatchEvent(new Event('submit'));
        } else {
            renderUserTable();
        }
    }
    
    return false;
}

function handleDelete(userID, fullName) {
    if (!confirm(`Delete user ${fullName}?`)) {
        return;
    }
    
    const index = mockUsers.findIndex(u => u.userID === userID);
    if (index !== -1) {
        mockUsers.splice(index, 1);
        filteredUsers = filteredUsers.filter(u => u.userID !== userID);
        showAlert('User deleted successfully!', 'success');
        renderUserTable();
    }
}

// ========================================
// UI HELPERS
// ========================================
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    alertContainer.innerHTML = alertHtml;
    
    // Auto dismiss sau 3 giây
    setTimeout(() => {
        const alertElement = alertContainer.querySelector('.alert');
        if (alertElement) {
            const bsAlert = new bootstrap.Alert(alertElement);
            bsAlert.close();
        }
    }, 3000);
}

function showSessionMessage() {
    const message = sessionStorage.getItem('message');
    if (message) {
        showAlert(message, 'success');
        sessionStorage.removeItem('message');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        showAlert('Logged out successfully!', 'info');
        // Uncomment để redirect
        // setTimeout(() => window.location.href = '../web/login.jsp', 1000);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

// ========================================
// REAL API VERSION (Commented out)
// ========================================
/*
// Uncomment để sử dụng với backend thật

async function loadUsers(keyword = '', role = 'all') {
    try {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (role !== 'all') params.append('role', role);
        
        const response = await fetch(`${API_BASE_URL}/ManageUserAccountController?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        filteredUsers = data.users || [];
        
        renderUserTable();
    } catch (error) {
        console.error('Error loading users:', error);
        showAlert('Error loading users. Please try again.', 'danger');
    }
}

async function handleRoleChange(event, userID) {
    event.preventDefault();
    
    const form = event.target;
    const newRole = form.querySelector('select[name="newRole"]').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/ManageUserActionController`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                userID: userID,
                action: 'editRole',
                newRole: newRole
            })
        });
        
        if (!response.ok) throw new Error('Failed to update role');
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Role updated successfully!', 'success');
            const keyword = document.getElementById('keyword').value;
            const role = document.getElementById('role').value;
            loadUsers(keyword, role);
        } else {
            showAlert(result.message || 'Failed to update role', 'danger');
        }
    } catch (error) {
        console.error('Error updating role:', error);
        showAlert('Error updating role. Please try again.', 'danger');
    }
    
    return false;
}

async function handleDelete(userID, fullName) {
    if (!confirm(`Delete user ${fullName}?`)) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/ManageUserActionController`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                userID: userID,
                action: 'delete'
            })
        });
        
        if (!response.ok) throw new Error('Failed to delete user');
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('User deleted successfully!', 'success');
            const keyword = document.getElementById('keyword').value;
            const role = document.getElementById('role').value;
            loadUsers(keyword, role);
        } else {
            showAlert(result.message || 'Failed to delete user', 'danger');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showAlert('Error deleting user. Please try again.', 'danger');
    }
}
*/
