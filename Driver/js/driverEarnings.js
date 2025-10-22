// Earnings Page JavaScript

// Sample data structure
const earningsData = {
  "2025-10": {
    month: "October 2025",
    totalEarnings: 2500000,
    completedTrips: 42,
    weeks: [
      { week: 1, earnings: 600000 },
      { week: 2, earnings: 700000 },
      { week: 3, earnings: 500000 },
      { week: 4, earnings: 700000 }
    ]
  },
  "2025-09": {
    month: "September 2025",
    totalEarnings: 2800000,
    completedTrips: 48,
    weeks: [
      { week: 1, earnings: 650000 },
      { week: 2, earnings: 750000 },
      { week: 3, earnings: 680000 },
      { week: 4, earnings: 720000 }
    ]
  },
  "2025-08": {
    month: "August 2025",
    totalEarnings: 2300000,
    completedTrips: 38,
    weeks: [
      { week: 1, earnings: 550000 },
      { week: 2, earnings: 600000 },
      { week: 3, earnings: 580000 },
      { week: 4, earnings: 570000 }
    ]
  }
};

// Current date state
let currentDate = new Date();
let currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
}

// Calculate average per trip
function calculateAverage(total, trips) {
  return Math.round(total / trips);
}

// Get month name
function getMonthName(dateStr) {
  const [year, month] = dateStr.split('-');
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Update display
function updateDisplay() {
  const data = earningsData[currentMonthKey];
  
  if (!data) {
    // Default data if month not found
    document.getElementById('currentMonth').textContent = getMonthName(currentMonthKey);
    document.getElementById('totalEarnings').textContent = '₫0';
    document.getElementById('completedTrips').textContent = '0 trips';
    document.getElementById('avgPerTrip').textContent = '₫0';
    
    // Clear weekly data
    const weeklyGrid = document.querySelector('.weekly-grid');
    weeklyGrid.innerHTML = '<p class="text-muted">No data available for this month</p>';
    return;
  }

  // Update month display
  document.getElementById('currentMonth').textContent = data.month;
  
  // Update summary
  document.getElementById('totalEarnings').textContent = formatCurrency(data.totalEarnings);
  document.getElementById('completedTrips').textContent = `${data.completedTrips} trips`;
  
  const avgPerTrip = calculateAverage(data.totalEarnings, data.completedTrips);
  document.getElementById('avgPerTrip').textContent = formatCurrency(avgPerTrip);
  
  // Update weekly breakdown
  updateWeeklyBreakdown(data.weeks);
}

// Update weekly breakdown
function updateWeeklyBreakdown(weeks) {
  const weeklyGrid = document.querySelector('.weekly-grid');
  const maxEarnings = Math.max(...weeks.map(w => w.earnings));
  
  weeklyGrid.innerHTML = weeks.map(week => {
    const percentage = (week.earnings / maxEarnings) * 100;
    return `
      <div class="week-card">
        <div class="week-label">Week ${week.week}</div>
        <div class="week-amount">${formatCurrency(week.earnings)}</div>
        <div class="week-bar">
          <div class="week-bar-fill" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// Navigate to previous month
function previousMonth() {
  const [year, month] = currentMonthKey.split('-').map(Number);
  const newDate = new Date(year, month - 2); // -2 because month is 1-indexed in our key
  currentMonthKey = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
  updateDisplay();
}

// Navigate to next month
function nextMonth() {
  const [year, month] = currentMonthKey.split('-').map(Number);
  const newDate = new Date(year, month); // month already points to next month (0-indexed)
  currentMonthKey = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
  updateDisplay();
}

// View detailed report
function viewDetailedReport() {
  alert('Detailed report feature coming soon!');
  // In production, this would navigate to a detailed report page
  // window.location.href = 'detailed-report.html?month=' + currentMonthKey;
}

// Download CSV
function downloadCSV() {
  const data = earningsData[currentMonthKey];
  
  if (!data) {
    alert('No data available for this month');
    return;
  }

  // Create CSV content
  let csvContent = "Week,Earnings,Trips\n";
  
  const tripsPerWeek = Math.round(data.completedTrips / data.weeks.length);
  
  data.weeks.forEach(week => {
    csvContent += `Week ${week.week},${week.earnings},${tripsPerWeek}\n`;
  });
  
  csvContent += `\nTotal,${data.totalEarnings},${data.completedTrips}\n`;
  csvContent += `Average per Trip,${calculateAverage(data.totalEarnings, data.completedTrips)}\n`;

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `earnings_${currentMonthKey}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize display
  updateDisplay();
  
  // Month navigation
  document.getElementById('prevMonth').addEventListener('click', previousMonth);
  document.getElementById('nextMonth').addEventListener('click', nextMonth);
  
  // Action buttons
  document.getElementById('viewDetailedReport').addEventListener('click', viewDetailedReport);
  document.getElementById('downloadCSV').addEventListener('click', downloadCSV);
});

// Export functions for use in other scripts if needed
window.earningsModule = {
  updateDisplay,
  previousMonth,
  nextMonth,
  viewDetailedReport,
  downloadCSV
};