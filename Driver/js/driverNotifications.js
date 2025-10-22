// Notifications Page JavaScript

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  updateNotificationCount();
});

// Setup event listeners
function setupEventListeners() {
  // Mark all as read button
  document.getElementById('markAllReadBtn').addEventListener('click', markAllAsRead);
  
  // Clear all button
  document.getElementById('clearAllBtn').addEventListener('click', clearAllNotifications);
  
  // Individual notification actions
  setupNotificationActions();
}

// Setup individual notification action buttons
function setupNotificationActions() {
  const notificationItems = document.querySelectorAll('.notification-item');
  
  notificationItems.forEach(item => {
    // Mark as read button
    const markReadBtn = item.querySelector('.btn-mark-read');
    if (markReadBtn) {
      markReadBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        markAsRead(item);
      });
    }
    
    // Delete button
    const deleteBtn = item.querySelector('.btn-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteNotification(item);
      });
    }
    
    // Click on notification to mark as read
    item.addEventListener('click', function() {
      if (item.classList.contains('unread')) {
        markAsRead(item);
      }
    });
  });
}

// Mark single notification as read
function markAsRead(notificationItem) {
  if (notificationItem.classList.contains('unread')) {
    notificationItem.classList.remove('unread');
    updateNotificationCount();
    showToast('Notification marked as read', 'success');
  }
}

// Delete single notification
function deleteNotification(notificationItem) {
  // Add removing animation
  notificationItem.classList.add('removing');
  
  // Remove after animation completes
  setTimeout(() => {
    notificationItem.remove();
    updateNotificationCount();
    checkEmptyState();
    showToast('Notification deleted', 'info');
  }, 300);
}

// Mark all notifications as read
function markAllAsRead() {
  const unreadNotifications = document.querySelectorAll('.notification-item.unread');
  
  if (unreadNotifications.length === 0) {
    showToast('No unread notifications', 'info');
    return;
  }
  
  unreadNotifications.forEach(item => {
    item.classList.remove('unread');
  });
  
  updateNotificationCount();
  showToast(`${unreadNotifications.length} notifications marked as read`, 'success');
}

// Clear all notifications
function clearAllNotifications() {
  const notificationsList = document.getElementById('notificationsList');
  const allNotifications = document.querySelectorAll('.notification-item');
  
  if (allNotifications.length === 0) {
    showToast('No notifications to clear', 'info');
    return;
  }
  
  // Confirm before clearing
  if (!confirm(`Are you sure you want to delete all ${allNotifications.length} notifications? This action cannot be undone.`)) {
    return;
  }
  
  // Add animation to all items
  allNotifications.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('removing');
    }, index * 50);
  });
  
  // Clear all after animations
  setTimeout(() => {
    notificationsList.innerHTML = '';
    updateNotificationCount();
    checkEmptyState();
    showToast('All notifications cleared', 'success');
  }, allNotifications.length * 50 + 300);
}

// Update notification count in badge
function updateNotificationCount() {
  const unreadCount = document.querySelectorAll('.notification-item.unread').length;
  
  // Update top bar badge
  const topBadge = document.querySelector('.notification-badge');
  if (topBadge) {
    topBadge.textContent = unreadCount;
    if (unreadCount === 0) {
      topBadge.style.display = 'none';
    } else {
      topBadge.style.display = 'flex';
    }
  }
  
  // Update sidebar badge
  const sidebarBadge = document.querySelector('.nav-badge');
  if (sidebarBadge) {
    sidebarBadge.textContent = unreadCount;
    if (unreadCount === 0) {
      sidebarBadge.style.display = 'none';
    } else {
      sidebarBadge.style.display = 'inline-block';
    }
  }
}

// Check if notifications list is empty and show empty state
function checkEmptyState() {
  const notificationsList = document.getElementById('notificationsList');
  const emptyState = document.getElementById('emptyState');
  const actionButtons = document.querySelector('.action-buttons');
  
  if (notificationsList.children.length === 0) {
    emptyState.style.display = 'block';
    actionButtons.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    actionButtons.style.display = 'flex';
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="bi ${getToastIcon(type)}"></i>
    <span>${message}</span>
  `;
  
  // Add styles
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${getToastColor(type)};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 9999;
    font-weight: 500;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Get toast icon based on type
function getToastIcon(type) {
  const icons = {
    success: 'bi-check-circle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    error: 'bi-x-circle-fill'
  };
  return icons[type] || icons.info;
}

// Get toast color based on type
function getToastColor(type) {
  const colors = {
    success: 'linear-gradient(135deg, #38b2ac 0%, #2f855a 100%)',
    info: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    warning: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
    error: 'linear-gradient(135deg, #f56565 0%, #c53030 100%)'
  };
  return colors[type] || colors.info;
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Export functions for use in other scripts if needed
window.notificationsModule = {
  markAsRead,
  deleteNotification,
  markAllAsRead,
  clearAllNotifications,
  updateNotificationCount
};