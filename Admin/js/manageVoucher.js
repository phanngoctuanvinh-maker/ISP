// ========================================
// MOCK DATA VERSION - For Demo Purpose
// ========================================
// Uncomment section below to use with real backend API

// API Base URL - Thay đổi theo server của bạn
// const API_BASE_URL = 'http://localhost:8080/ISP392-Font';

// ========================================
// MOCK DATA
// ========================================
const mockVouchers = [
    { voucherID: 1, voucherCode: 'SUMMER2025', discountValue: 20.00, expiryDate: '2025-12-31', status: 'Active' },
    { voucherID: 2, voucherCode: 'WINTER2025', discountValue: 15.50, expiryDate: '2025-11-30', status: 'Active' },
    { voucherID: 3, voucherCode: 'SPRING2025', discountValue: 10.00, expiryDate: '2025-10-15', status: 'Inactive' },
    { voucherID: 4, voucherCode: 'NEWYEAR2025', discountValue: 25.00, expiryDate: '2025-12-25', status: 'Active' },
    { voucherID: 5, voucherCode: 'FLASH50', discountValue: 50.00, expiryDate: '2025-09-30', status: 'Inactive' }
];

let vouchers = [...mockVouchers];
let nextID = 6;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    renderVoucherTable();
    setupFormHandler();
    showSessionMessage();
});

// ========================================
// RENDER FUNCTIONS
// ========================================
function renderVoucherTable() {
    const tbody = document.getElementById('voucherTableBody');
    
    if (vouchers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-vouchers">
                    <i class="bi bi-ticket-perforated"></i>
                    <p>No vouchers found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = vouchers.map(voucher => `
        <tr>
            <td>${voucher.voucherID}</td>
            <td><strong>${escapeHtml(voucher.voucherCode)}</strong></td>
            <td>$${voucher.discountValue.toFixed(2)}</td>
            <td>${voucher.expiryDate}</td>
            <td>
                <span class="status-${voucher.status.toLowerCase()}">
                    ${voucher.status}
                </span>
            </td>
            <td>
                <button class="btn btn-danger btn-sm btn-delete" 
                        onclick="handleDelete(${voucher.voucherID}, '${escapeHtml(voucher.voucherCode)}')">
                    <i class="bi bi-trash me-1"></i>Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// ========================================
// FORM HANDLER
// ========================================
function setupFormHandler() {
    const form = document.getElementById('addVoucherForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const voucherCode = document.getElementById('voucherCode').value.trim().toUpperCase();
        const discountValue = parseFloat(document.getElementById('discountValue').value);
        const expiryDate = document.getElementById('expiryDate').value;
        const status = document.getElementById('status').value;
        
        // Validate
        if (!validateForm(voucherCode, discountValue, expiryDate)) {
            return;
        }
        
        // Add voucher
        addVoucher({ voucherCode, discountValue, expiryDate, status });
    });
}

// ========================================
// VALIDATION
// ========================================
function validateForm(voucherCode, discountValue, expiryDate) {
    // Check empty fields
    if (!voucherCode || !discountValue || !expiryDate) {
        showAlert('Please fill in all fields!', 'danger');
        return false;
    }
    
    // Check duplicate code
    const exists = vouchers.some(v => v.voucherCode.toUpperCase() === voucherCode);
    if (exists) {
        showAlert('Voucher code already exists!', 'danger');
        return false;
    }
    
    // Check discount value
    if (discountValue <= 0) {
        showAlert('Discount value must be greater than 0!', 'danger');
        return false;
    }
    
    if (discountValue > 100) {
        showAlert('Discount value cannot exceed 100!', 'warning');
    }
    
    // Check expiry date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    
    if (expiry < today) {
        showAlert('Expiry date must be in the future!', 'danger');
        return false;
    }
    
    return true;
}

// ========================================
// VOUCHER ACTIONS
// ========================================
function addVoucher(voucherData) {
    // Create new voucher
    const newVoucher = {
        voucherID: nextID++,
        voucherCode: voucherData.voucherCode,
        discountValue: voucherData.discountValue,
        expiryDate: voucherData.expiryDate,
        status: voucherData.status
    };
    
    // Add to array
    vouchers.push(newVoucher);
    
    // Show success message
    showAlert(`Voucher "${newVoucher.voucherCode}" added successfully!`, 'success');
    
    // Reset form
    document.getElementById('addVoucherForm').reset();
    
    // Re-render table
    renderVoucherTable();
    
    // Log for testing
    console.log('Added voucher:', newVoucher);
}

function handleDelete(voucherID, voucherCode) {
    if (!confirm(`Are you sure you want to delete voucher "${voucherCode}"?`)) {
        return;
    }
    
    // Find and remove voucher
    const index = vouchers.findIndex(v => v.voucherID === voucherID);
    if (index !== -1) {
        vouchers.splice(index, 1);
        showAlert(`Voucher "${voucherCode}" deleted successfully!`, 'success');
        renderVoucherTable();
        
        console.log('Deleted voucher:', voucherID);
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
    
    // Auto dismiss sau 5 giây
    setTimeout(() => {
        const alertElement = alertContainer.querySelector('.alert');
        if (alertElement) {
            const bsAlert = new bootstrap.Alert(alertElement);
            bsAlert.close();
        }
    }, 5000);
}

function showSessionMessage() {
    const message = sessionStorage.getItem('message');
    const type = sessionStorage.getItem('messageType') || 'success';
    
    if (message) {
        showAlert(message, type);
        sessionStorage.removeItem('message');
        sessionStorage.removeItem('messageType');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        showAlert('Logged out successfully!', 'info');
        // Uncomment để redirect
        // setTimeout(() => window.location.href = '../login.html', 1000);
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

async function loadVouchers() {
    try {
        const response = await fetch(`${API_BASE_URL}/ManageVoucherController`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch vouchers');
        }
        
        const data = await response.json();
        vouchers = data.vouchers || [];
        
        renderVoucherTable();
    } catch (error) {
        console.error('Error loading vouchers:', error);
        showAlert('Error loading vouchers. Please try again.', 'danger');
    }
}

async function addVoucher(voucherData) {
    try {
        const response = await fetch(`${API_BASE_URL}/ManageVoucherController`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'add',
                voucherCode: voucherData.voucherCode,
                discountValue: voucherData.discountValue,
                expiryDate: voucherData.expiryDate,
                status: voucherData.status
            })
        });
        
        if (!response.ok) throw new Error('Failed to add voucher');
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Voucher added successfully!', 'success');
            document.getElementById('addVoucherForm').reset();
            loadVouchers();
        } else {
            showAlert(result.message || 'Failed to add voucher', 'danger');
        }
    } catch (error) {
        console.error('Error adding voucher:', error);
        showAlert('Error adding voucher. Please try again.', 'danger');
    }
}

async function handleDelete(voucherID, voucherCode) {
    if (!confirm(`Are you sure you want to delete voucher "${voucherCode}"?`)) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/ManageVoucherController`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                voucherID: voucherID,
                action: 'delete'
            })
        });
        
        if (!response.ok) throw new Error('Failed to delete voucher');
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Voucher deleted successfully!', 'success');
            loadVouchers();
        } else {
            showAlert(result.message || 'Failed to delete voucher', 'danger');
        }
    } catch (error) {
        console.error('Error deleting voucher:', error);
        showAlert('Error deleting voucher. Please try again.', 'danger');
    }
}
*/
