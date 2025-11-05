// Settings Page JavaScript

// Settings data structure
const settingsData = {
  account: {
    fullName: "Tài xế A",
    email: "driver@example.com",
    phone: "0901 234 567"
  },
  theme: "dark",
  language: "en",
  notifications: {
    tripUpdates: true,
    earningsAlerts: true,
    marketingMessages: false
  }
};

// Store original settings for reset functionality
let originalSettings = JSON.parse(JSON.stringify(settingsData));

// Initialize modals
let changePasswordModal;
let deleteAccountModal;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap modals
  changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
  deleteAccountModal = new bootstrap.Modal(document.getElementById('deleteAccountModal'));

  // Load settings
  loadSettings();

  // Setup event listeners
  setupEventListeners();
});

// Load settings into the form
function loadSettings() {
  // Account settings
  document.getElementById('fullName').value = settingsData.account.fullName;
  document.getElementById('email').value = settingsData.account.email;
  document.getElementById('phone').value = settingsData.account.phone;

  // Theme settings
  if (settingsData.theme === 'light') {
    document.getElementById('lightMode').checked = true;
  } else {
    document.getElementById('darkMode').checked = true;
  }

  // Language
  document.getElementById('languageSelect').value = settingsData.language;

  // Notification preferences
  document.getElementById('tripUpdates').checked = settingsData.notifications.tripUpdates;
  document.getElementById('earningsAlerts').checked = settingsData.notifications.earningsAlerts;
  document.getElementById('marketingMessages').checked = settingsData.notifications.marketingMessages;
}

// Setup event listeners
function setupEventListeners() {
  // Change password button
  document.getElementById('changePasswordBtn').addEventListener('click', openChangePasswordModal);

  // Save password button
  document.getElementById('savePasswordBtn').addEventListener('click', savePassword);

  // Export data button
  document.getElementById('exportDataBtn').addEventListener('click', exportData);

  // Delete account button
  document.getElementById('deleteAccountBtn').addEventListener('click', openDeleteAccountModal);

  // Confirm delete input
  document.getElementById('confirmDeleteText').addEventListener('input', function(e) {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (e.target.value === 'DELETE') {
      confirmBtn.disabled = false;
    } else {
      confirmBtn.disabled = true;
    }
  });

  // Confirm delete button
  document.getElementById('confirmDeleteBtn').addEventListener('click', deleteAccount);

  // Save changes button
  document.getElementById('saveChangesBtn').addEventListener('click', saveSettings);

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', resetSettings);
}

// Open Change Password Modal
function openChangePasswordModal() {
  document.getElementById('changePasswordForm').reset();
  changePasswordModal.show();
}

// Save Password
function savePassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    showToast('Please fill in all fields', 'warning');
    return;
  }

  if (newPassword.length < 6) {
    showToast('Password must be at least 6 characters', 'warning');
    return;
  }

  if (newPassword !== confirmPassword) {
    showToast('Passwords do not match', 'warning');
    return;
  }

  // In production, this would make an API call
  // Simulate success
  changePasswordModal.hide();
  showToast('Password changed successfully!', 'success');
  document.getElementById('changePasswordForm').reset();
}

// Export Data
function exportData() {
  // Create export data object
  const exportObj = {
    account: settingsData.account,
    theme: settingsData.theme,
    language: settingsData.language,
    notifications: settingsData.notifications,
    exportDate: new Date().toISOString()
  };

  // Convert to JSON
  const dataStr = JSON.stringify(exportObj, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  // Create download link
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `drivenow_data_${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Data exported successfully!', 'success');
}

// Open Delete Account Modal
function openDeleteAccountModal() {
  document.getElementById('confirmDeleteText').value = '';
  document.getElementById('confirmDeleteBtn').disabled = true;
  deleteAccountModal.show();
}

// Delete Account
function deleteAccount() {
  // In