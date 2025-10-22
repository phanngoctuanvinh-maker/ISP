// Profile Page JavaScript

// Driver profile data
const driverProfile = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "+84 912 345 678",
  joinDate: "10/03/2024",
  status: "active",
  vehicle: {
    type: "Car (4 Seats)",
    licensePlate: "51F-123.45",
    model: "Toyota Vios 2020",
    color: "Silver"
  },
  settings: {
    notifications: true,
    language: "en",
    theme: "light"
  }
};

// Initialize modals
let editProfileModal;
let changePasswordModal;
let updateVehicleModal;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap modals
  editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
  changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
  updateVehicleModal = new bootstrap.Modal(document.getElementById('updateVehicleModal'));

  // Load profile data
  loadProfileData();

  // Setup event listeners
  setupEventListeners();
});

// Load profile data into the page
function loadProfileData() {
  // Basic Information
  document.getElementById('driverName').textContent = driverProfile.name;
  document.getElementById('driverEmail').textContent = driverProfile.email;
  document.getElementById('driverPhone').textContent = driverProfile.phone;
  document.getElementById('joinDate').textContent = driverProfile.joinDate;
  
  const statusBadge = document.getElementById('driverStatus');
  statusBadge.className = `status-badge ${driverProfile.status}`;
  statusBadge.innerHTML = driverProfile.status === 'active' 
    ? '<i class="bi bi-check-circle-fill"></i> Active'
    : '<i class="bi bi-x-circle-fill"></i> Inactive';

  // Vehicle Information
  document.getElementById('vehicleType').textContent = driverProfile.vehicle.type;
  document.getElementById('licensePlate').textContent = driverProfile.vehicle.licensePlate;
  document.getElementById('vehicleModel').textContent = driverProfile.vehicle.model;
  document.getElementById('vehicleColor').textContent = driverProfile.vehicle.color;

  // Settings
  document.getElementById('notificationsToggle').checked = driverProfile.settings.notifications;
  document.getElementById('notificationStatus').textContent = driverProfile.settings.notifications ? 'ON' : 'OFF';
  document.getElementById('languageSelect').value = driverProfile.settings.language;
  document.getElementById('themeSelect').value = driverProfile.settings.theme;
}

// Setup event listeners
function setupEventListeners() {
  // Edit Profile button
  document.getElementById('editProfileBtn').addEventListener('click', openEditProfileModal);
  
  // Change Password button
  document.getElementById('changePasswordBtn').addEventListener('click', openChangePasswordModal);
  
  // Update Vehicle button
  document.getElementById('updateVehicleBtn').addEventListener('click', openUpdateVehicleModal);
  
  // Save Profile button
  document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
  
  // Save Password button
  document.getElementById('savePasswordBtn').addEventListener('click', changePassword);
  
  // Save Vehicle button
  document.getElementById('saveVehicleBtn').addEventListener('click', updateVehicle);
  
  // Notification toggle
  document.getElementById('notificationsToggle').addEventListener('change', updateNotificationStatus);
  
  // Save Settings button
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
}

// Open Edit Profile Modal
function openEditProfileModal() {
  document.getElementById('editName').value = driverProfile.name;
  document.getElementById('editEmail').value = driverProfile.email;
  document.getElementById('editPhone').value = driverProfile.phone;
  editProfileModal.show();
}

// Save Profile
function saveProfile() {
  const name = document.getElementById('editName').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const phone = document.getElementById('editPhone').value.trim();

  if (!name || !email || !phone) {
    showAlert('Please fill in all fields', 'warning');
    return;
  }

  if (!validateEmail(email)) {
    showAlert('Please enter a valid email address', 'warning');
    return;
  }

  // Update profile data
  driverProfile.name = name;
  driverProfile.email = email;
  driverProfile.phone = phone;

  // Update display
  loadProfileData();

  // Close modal
  editProfileModal.hide();

  // Show success message
  showAlert('Profile updated successfully!', 'success');
}

// Open Change Password Modal
function openChangePasswordModal() {
  document.getElementById('changePasswordForm').reset();
  changePasswordModal.show();
}

// Change Password
function changePassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    showAlert('Please fill in all fields', 'warning');
    return;
  }

  if (newPassword.length < 6) {
    showAlert('New password must be at least 6 characters', 'warning');
    return;
  }

  if (newPassword !== confirmPassword) {
    showAlert('New passwords do not match', 'warning');
    return;
  }

  // In production, this would make an API call
  // For now, just simulate success
  changePasswordModal.hide();
  showAlert('Password changed successfully!', 'success');
  document.getElementById('changePasswordForm').reset();
}

// Open Update Vehicle Modal
function openUpdateVehicleModal() {
  // Map vehicle type to select value
  let vehicleTypeValue = 'car4';
  if (driverProfile.vehicle.type.includes('7')) vehicleTypeValue = 'car7';
  if (driverProfile.vehicle.type.includes('Motorbike')) vehicleTypeValue = 'bike';

  document.getElementById('editVehicleType').value = vehicleTypeValue;
  document.getElementById('editLicensePlate').value = driverProfile.vehicle.licensePl