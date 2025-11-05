// Potential Customer Management JavaScript

// API Base URL
const API_BASE_URL = 'http://localhost:8080/YourProject';

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPotentialCustomers();
});

// Function to load potential customers
async function loadPotentialCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/PotentialCustomerController`);
        if (!response.ok) {
            throw new Error('Failed to fetch potential customers');
        }
        const data = await response.json();
        renderCustomerTable(data.potentialList);
        updateStatistics(data.potentialList);

    } catch (error) {
        console.error('Error loading potential customers:', error);
        showError('Failed to load potential customers. Please try again.');
    }
}

// Function to render customer table
function renderCustomerTable(customers) {
    const tableBody = document.getElementById('customerTableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    const totalCount = document.getElementById('totalCount');

    if (!customers || customers.length === 0) {
        tableBody.innerHTML = '';
        emptyMessage.style.display = 'block';
        totalCount.textContent = '0';
        return;
    }

    emptyMessage.style.display = 'none';
    totalCount.textContent = customers.length;

    // Sort customers by totalSpent (descending)
    customers.sort((a, b) => b.totalSpent - a.totalSpent);

    let html = '';
    customers.forEach((customer, index) => {
        const isTopCustomer = index === 0;
        html += `
            <tr class="${isTopCustomer ? 'top-customer' : ''}">
                <td>${index + 1}</td>
                <td>
                    <strong>${customer.fullName}</strong>
                    ${isTopCustomer ? '<i class="bi bi-star-fill text-warning ms-2" title="Top Customer"></i>' : ''}
                </td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>
                    <span class="badge-orders">${customer.totalOrders} orders</span>
                </td>
                <td>
                    <span class="badge-spent">$${formatCurrency(customer.totalSpent)}</span>
                </td>
                <td>
                    <span class="badge-reviews">${customer.reviewCount} reviews</span>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// Function to update statistics
function updateStatistics(customers) {
    if (!customers || customers.length === 0) {
        document.getElementById('topCustomerOrders').textContent = '0';
        document.getElementById('totalRevenue').textContent = '$0';
        document.getElementById('totalReviews').textContent = '0';
        return;
    }

    // Find top customer orders
    const topOrders = Math.max(...customers.map(c => c.totalOrders));
    document.getElementById('topCustomerOrders').textContent = topOrders;

    // Calculate total revenue
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    document.getElementById('totalRevenue').textContent = '$' + formatCurrency(totalRevenue);

    // Calculate total reviews
    const totalReviews = customers.reduce((sum, c) => sum + c.reviewCount, 0);
    document.getElementById('totalReviews').textContent = totalReviews;
}

// Function to format currency
function formatCurrency(amount) {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Function to refresh data
function refreshData() {
    const tableBody = document.getElementById('customerTableBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center text-muted">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Refreshing data...</p>
            </td>
        </tr>
    `;

    loadPotentialCustomers();
}

// Function to show error message
function showError(message) {
    const tableBody = document.getElementById('customerTableBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center text-danger">
                <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                <p class="mt-2">${message}</p>
                <button class="btn btn-primary btn-sm" onclick="refreshData()">
                    <i class="bi bi-arrow-clockwise me-2"></i>Try Again
                </button>
            </td>
        </tr>
    `;
}
