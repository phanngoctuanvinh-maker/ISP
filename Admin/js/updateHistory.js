// Update History Management JavaScript

// API Base URL
const API_BASE_URL = 'http://localhost:8080/YourProject';

// Global variables
let allLogs = [];
let filteredLogs = [];
let currentPage = 1;
const logsPerPage = 10;

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadUpdateHistory();
});

// Function to load update history
async function loadUpdateHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/UpdateHistoryController`);
        if (!response.ok) {
            throw new Error('Failed to fetch update history');
        }
        const data = await response.json();
        allLogs = data.logs || [];
        filteredLogs = [...allLogs];
        renderHistoryTable();
        updateStatistics();
    } catch (error) {
        console.error('Error loading update history:', error);
        showError('Failed to load update history. Please try again.');
    }
}

// Function to render history table
function renderHistoryTable() {
    const tableBody = document.getElementById('historyTableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    
    if (!filteredLogs || filteredLogs.length === 0) {
        tableBody.innerHTML = '';
        emptyMessage.style.display = 'block';
        updatePaginationInfo(0, 0);
        return;
    }

    emptyMessage.style.display = 'none';

    // Calculate pagination
    const startIndex = (currentPage - 1) * logsPerPage;
    const endIndex = Math.min(startIndex + logsPerPage, filteredLogs.length);
    const pageData = filteredLogs.slice(startIndex, endIndex);

    // Render table rows
    let html = '';
    pageData.forEach(log => {
        const actionBadge = getActionBadge(log.actionType);
        const isRecent = isRecentChange(log.performedAt);
        
        html += `
            <tr class="${isRecent ? 'recent-change' : ''}">
                <td><strong>#${log.logID}</strong></td>
                <td>${actionBadge}</td>
                <td><span class="badge bg-secondary">${log.tableName}</span></td>
                <td>${log.recordID}</td>
                <td class="old-value">${log.oldValue || '-'}</td>
                <td class="new-value">${log.newValue || '-'}</td>
                <td><span class="user-badge">${log.performedBy}</span></td>
                <td class="timestamp">${formatDateTime(log.performedAt)}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
    updatePaginationInfo(startIndex + 1, endIndex);
    renderPagination();
}

// Function to get action badge HTML
function getActionBadge(action) {
    const badges = {
        'INSERT': '<span class="badge-insert">INSERT</span>',
        'UPDATE': '<span class="badge-update">UPDATE</span>',
        'DELETE': '<span class="badge-delete">DELETE</span>'
    };
    return badges[action] || `<span class="badge bg-secondary">${action}</span>`;
}

// Function to check if change is recent (within last hour)
function isRecentChange(dateTime) {
    if (!dateTime) return false;
    const changeTime = new Date(dateTime);
    const now = new Date();
    const diffMs = now - changeTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 1;
}

// Function to format date time
function formatDateTime(dateTime) {
    if (!dateTime) return '-';
    const date = new Date(dateTime);
    return date.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Function to update statistics
function updateStatistics() {
    const insertCount = allLogs.filter(log => log.actionType === 'INSERT').length;
    const updateCount = allLogs.filter(log => log.actionType === 'UPDATE').length;
    const deleteCount = allLogs.filter(log => log.actionType === 'DELETE').length;
    
    document.getElementById('insertCount').textContent = insertCount;
    document.getElementById('updateCount').textContent = updateCount;
    document.getElementById('deleteCount').textContent = deleteCount;
    document.getElementById('totalActions').textContent = allLogs.length;
}

// Function to update pagination info
function updatePaginationInfo(start, end) {
    document.getElementById('showingCount').textContent = end - start + 1;
    document.getElementById('totalCount').textContent = filteredLogs.length;
}

// Function to render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
    const pagination = document.getElementById('pagination');
    
    let html = '';
    
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }
    }
    
    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

// Function to change page
function changePage(page) {
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderHistoryTable();
}

// Function to filter by action
function filterByAction(action) {
    if (action === 'all') {
        filteredLogs = [...allLogs];
    } else {
        filteredLogs = allLogs.filter(log => log.actionType === action);
    }
    currentPage = 1;
    renderHistoryTable();
}

// Function to filter by table
function filterByTable(tableName) {
    if (tableName === 'all') {
        filteredLogs = [...allLogs];
    } else {
        filteredLogs = allLogs.filter(log => log.tableName === tableName);
    }
    currentPage = 1;
    renderHistoryTable();
}

// Function to filter by date
function filterByDate() {
    const dateInput = document.getElementById('dateFilter').value;
    if (!dateInput) {
        filteredLogs = [...allLogs];
    } else {
        filteredLogs = allLogs.filter(log => {
            const logDate = new Date(log.performedAt).toISOString().split('T')[0];
            return logDate === dateInput;
        });
    }
    currentPage = 1;
    renderHistoryTable();
}

// Function to search history
function searchHistory() {
    const searchTerm = document.getElementById('searchFilter').value.toLowerCase();
    if (!searchTerm) {
        filteredLogs = [...allLogs];
    } else {
        filteredLogs = allLogs.filter(log => 
            log.performedBy.toLowerCase().includes(searchTerm) ||
            log.tableName.toLowerCase().includes(searchTerm) ||
            log.actionType.toLowerCase().includes(searchTerm)
        );
    }
    currentPage = 1;
    renderHistoryTable();
}

// Function to refresh history
function refreshHistory() {
    // Show loading
    const tableBody = document.getElementById('historyTableBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center text-muted">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Refreshing data...</p>
            </td>
        </tr>
    `;
    
    // Reload data
    loadUpdateHistory();
}

// Function to clear history
async function clearHistory() {
    if (!confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/ClearHistoryController`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Failed to clear history');
        }
        
        alert('History cleared successfully!');
        loadUpdateHistory();
    } catch (error) {
        console.error('Error clearing history:', error);
        alert('Failed to clear history. Please try again.');
    }
}

// Function to show error message
function showError(message) {
    const tableBody = document.getElementById('historyTableBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center text-danger">
                <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                <p class="mt-2">${message}</p>
                <button class="btn btn-primary btn-sm" onclick="refreshHistory()">
                    <i class="bi bi-arrow-clockwise me-2"></i>Try Again
                </button>
            </td>
        </tr>
    `;
}
