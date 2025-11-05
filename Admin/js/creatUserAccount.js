// API Configuration (Commented for testing)
// const API_BASE_URL = 'http://localhost:8080/ISP392-Font';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // checkAuth(); // Comment để test không cần login
    setupFormHandler();
});

// Check if user is authenticated (Commented for testing)
/*
function checkAuth() {
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    
    if (!userRole || userRole !== 'Admin') {
        window.location.href = '../login.html';
        return;
    }
    
    if (userName) {
        document.getElementById('adminName').textContent = `Hello, ${userName}`;
    }
}
*/

// Setup form submit handler
function setupFormHandler() {
    const form = document.getElementById('createUserForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;
        const role = document.getElementById('role').value;
        
        // Validate
        if (!validateForm(fullName, email, address, phone, password, confirm)) {
            return;
        }
        
        // Success message for testing (no API call)
        showAlert('Form validation passed! User data ready to submit.', 'success');
        console.log('User Data:', { fullName, email, address, phone, password, role });
        
        // Uncomment khi có backend API
        // await createUser({ fullName, email, address, phone, password, role });
    });
}

// Validate form
function validateForm(fullName, email, address, phone, password, confirm) {
    // Check empty fields
    if (!fullName || !email || !address || !phone || !password || !confirm) {
        showAlert('Please fill in all fields!', 'danger');
        return false;
    }
    
    // Check password match
    if (password !== confirm) {
        showAlert('Passwords do not match!', 'danger');
        return false;
    }
    
    // Check password length
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters!', 'danger');
        return false;
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Invalid email format!', 'danger');
        return false;
    }
    
    // Check phone format (10-11 digits)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
        showAlert('Phone must be 10-11 digits!', 'danger');
        return false;
    }
    
    return true;
}

// Create user via API (Commented for testing)
/*
async function createUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/AdminCreateUserController`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('User created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'adminManagerUser.html';
            }, 1500);
        } else {
            showAlert(result.message || 'Failed to create user!', 'danger');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        showAlert('Error connecting to server!', 'danger');
    }
}
*/

// Show alert message
function showAlert(message, type = 'danger') {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.classList.remove('d-none');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        alertDiv.classList.add('d-none');
    }, 5000);
}

// Handle cancel button
function handleCancel() {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
        window.location.href = 'adminManagerUser.html';
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // sessionStorage.clear();
        alert('Logout function (for testing only)');
        // window.location.href = '../login.html';
    }
}