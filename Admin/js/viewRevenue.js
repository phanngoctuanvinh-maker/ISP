// View Revenue JavaScript

// API Base URL
const API_BASE_URL = 'http://localhost:8080/YourProject';

// Global variables
let revenueData = [];
let topProducts = [];
let colorStats = [];
let categories = [];
let selectedMonth = 'all';
let selectedYear = 'all';
let selectedCategory = 'all';

// Charts
let lineChart, pieChart, barChart;

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadRevenueData();
    
    // Form submit handler
    document.getElementById('filterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        selectedMonth = document.getElementById('monthFilter').value;
        selectedYear = document.getElementById('yearFilter').value;
        selectedCategory = document.getElementById('categoryFilter').value;
        loadRevenueData();
    });
});

// Function to load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/GetCategoriesController`);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        categories = data.categories || [];
        renderCategoryOptions();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Function to render category options
function renderCategoryOptions() {
    const categoryFilter = document.getElementById('categoryFilter');
    let html = '<option value="all">All Categories</option>';
    
    categories.forEach(category => {
        html += `<option value="${category.cateName}">${category.cateName}</option>`;
    });
    
    categoryFilter.innerHTML = html;
}

// Function to load revenue data
async function loadRevenueData() {
    try {
        const params = new URLSearchParams({
            monthValue: selectedMonth,
            yearValue: selectedYear,
            category: selectedCategory
        });

        const response = await fetch(`${API_BASE_URL}/ViewRevenueController?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch revenue data');
        }
        const data = await response.json();
        
        revenueData = data.revenueList || [];
        topProducts = data.topProducts || [];
        colorStats = data.colorStats || [];
        
        renderCharts();
        renderRevenueTable();
        updateStatistics();
    } catch (error) {
        console.error('Error loading revenue data:', error);
        showError('Failed to load revenue data. Please try again.');
    }
}

// Function to render charts
function renderCharts() {
    renderLineChart();
    renderPieChart();
    renderBarChart();
}

// Function to render line chart
function renderLineChart() {
    const ctx = document.getElementById('lineChart');
    
    // Destroy existing chart
    if (lineChart) {
        lineChart.destroy();
    }
    
    const labels = revenueData.map(item => item.month || `Month ${item.monthNumber}`);
    const values = revenueData.map(item => item.totalRevenue);
    
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (VND)',
                data: values,
                fill: true,
                tension: 0.4,
                borderColor: '#234C45',
                backgroundColor: 'rgba(35, 76, 69, 0.1)',
                pointBackgroundColor: '#234C45',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Revenue: ' + formatCurrency(context.parsed.y) + ' VND';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Function to render pie chart
function renderPieChart() {
    const ctx = document.getElementById('pieChart');
    
    // Destroy existing chart
    if (pieChart) {
        pieChart.destroy();
    }
    
    const labels = colorStats.map(item => 
        item.productName + (item.colorName ? ` (${item.colorName})` : '')
    );
    const values = colorStats.map(item => item.totalQuantity);
    
    // Generate colors
    const backgroundColors = labels.map((_, index) => 
        `hsl(${(index * 360) / labels.length}, 70%, 60%)`
    );
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Function to render bar chart
function renderBarChart() {
    const ctx = document.getElementById('barChart');
    
    // Destroy existing chart
    if (barChart) {
        barChart.destroy();
    }
    
    const labels = topProducts.map(item => item.productName);
    const values = topProducts.map(item => item.totalQuantity);
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantity Sold',
                data: values,
                backgroundColor: '#234C45',
                borderColor: '#1a3a35',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Quantity: ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Function to render revenue table
function renderRevenueTable() {
    const tableBody = document.getElementById('revenueTableBody');
    const topProductsCard = document.getElementById('topProductsCard');
    const topProductsTitle = document.getElementById('topProductsTitle');
    const topProductsTableBody = document.getElementById('topProductsTableBody');
    
    if (!topProducts || topProducts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No data available.</td></tr>';
        return;
    }
    
    // Render main table
    let html = '';
    const isAllCategory = selectedCategory === 'all';
    
    if (isAllCategory) {
        topProducts.forEach((product, index) => {
            html += `
                <tr class="${index === 0 ? 'top-product' : ''}">
                    <td>
                        ${product.productName}
                        ${index === 0 ? '<i class="bi bi-trophy-fill text-warning ms-2"></i>' : ''}
                    </td>
                    <td><span class="quantity-badge">${product.totalQuantity}</span></td>
                    <td class="revenue-amount">${formatCurrency(product.totalRevenue)} VND</td>
                </tr>
            `;
        });
        topProductsCard.style.display = 'none';
    } else {
        // Show category revenue
        revenueData.forEach(item => {
            html += `
                <tr>
                    <td>${item.categoryName}</td>
                    <td><span class="quantity-badge">${item.totalQuantity}</span></td>
                    <td class="revenue-amount">${formatCurrency(item.totalRevenue)} VND</td>
                </tr>
            `;
        });
        
        // Show top products table
        topProductsCard.style.display = 'block';
        topProductsTitle.innerHTML = `<i class="bi bi-trophy"></i> Top 5 Best-Selling Products in Category: ${selectedCategory}`;
        
        let topHtml = '';
        topProducts.forEach((product, index) => {
            topHtml += `
                <tr class="${index === 0 ? 'top-product' : ''}">
                    <td>
                        ${product.productName}
                        ${index === 0 ? '<i class="bi bi-trophy-fill text-warning ms-2"></i>' : ''}
                    </td>
                    <td><span class="quantity-badge">${product.totalQuantity}</span></td>
                    <td class="revenue-amount">${formatCurrency(product.totalRevenue)} VND</td>
                </tr>
            `;
        });
        topProductsTableBody.innerHTML = topHtml;
    }
    
    tableBody.innerHTML = html;
}

// Function to update statistics
function updateStatistics() {
    // Calculate total revenue
    const totalRev = topProducts.reduce((sum, item) => sum + item.totalRevenue, 0);
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRev);
    
    // Calculate total quantity
    const totalQty = topProducts.reduce((sum, item) => sum + item.totalQuantity, 0);
    document.getElementById('totalQuantity').textContent = totalQty;
    
    // Get best seller
    if (topProducts.length > 0) {
        document.getElementById('topProduct').textContent = topProducts[0].productName;
    } else {
        document.getElementById('topProduct').textContent = '-';
    }
    
    // Calculate average revenue
    const avgRev = topProducts.length > 0 ? totalRev / topProducts.length : 0;
    document.getElementById('avgRevenue').textContent = formatCurrency(avgRev);
}

// Function to format currency
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Function to show error message
function showError(message) {
    const tableBody = document.getElementById('revenueTableBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="3" class="text-center text-danger">
                <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                <p class="mt-2">${message}</p>
                <button class="btn btn-primary btn-sm" onclick="loadRevenueData()">
                    <i class="bi bi-arrow-clockwise me-2"></i>Try Again
                </button>
            </td>
        </tr>
    `;
}
