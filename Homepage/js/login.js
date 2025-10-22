document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const oldError = this.querySelector('.error-message');
            if (oldError) oldError.remove();
            
            const username = this.querySelector('input[type="text"]').value.trim();
            const password = this.querySelector('input[type="password"]').value;
            
            if (!username || !password) {
                showError(this, 'Vui lòng nhập đầy đủ thông tin!');
                return;
            }

            const submitBtn = this.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang đăng nhập...';

            try {
                const response = await api.login(username, password);
                
                if (response.success) {
                    // Nếu form được mở trong iframe (từ homepage), reload lại trang cha
                    if (window.parent && window.parent !== window) {
                        window.parent.location.reload();
                    } else {
                        window.location.href = 'homepage.html';
                    }
                } else {
                    showError(this, response.message || 'Đăng nhập thất bại!');
                }
            } catch (error) {
                showError(this, error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Đăng Nhập';
            }
        });
    }
    
    function showError(form, message) {
        const submitBtn = form.querySelector('.btn-submit');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        form.insertBefore(errorDiv, submitBtn);
    }

    // Xử lý nút xem mật khẩu
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }

    // Forgot password UI & logic
    const forgotBtn = document.getElementById('forgotPasswordBtn');
    const forgotSection = document.getElementById('forgotPasswordSection');
    const forgotForm = document.getElementById('forgotPasswordForm');
    const forgotMsg = document.getElementById('forgotPasswordMessage');

    if (forgotBtn && forgotSection && forgotForm) {
        forgotBtn.addEventListener('click', function(e) {
            e.preventDefault();
            forgotSection.style.display = forgotSection.style.display === 'none' ? 'block' : 'none';
        });

        forgotForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            forgotMsg.textContent = '';
            const email = document.getElementById('forgotEmail').value.trim();
            if (!email) {
                forgotMsg.textContent = 'Vui lòng nhập email.';
                forgotMsg.style.color = 'red';
                return;
            }
            try {
                await api.forgotPassword(email);
                forgotMsg.textContent = 'Đã gửi yêu cầu lấy lại mật khẩu. Vui lòng kiểm tra email.';
                forgotMsg.style.color = 'green';
                forgotForm.reset();
            } catch (err) {
                forgotMsg.textContent = err.message || 'Không gửi được yêu cầu.';
                forgotMsg.style.color = 'red';
            }
        });
    }
});

/**
 * Google Login Callback
 * Được gọi tự động khi user đăng nhập Google thành công
 */
async function handleGoogleLogin(response) {
    try {
        // response.credential chứa Google ID Token
        const idToken = response.credential;
        
        // Gọi backend API để verify và login
        const apiResponse = await api.googleLogin(idToken);
        
        if (apiResponse.success) {
            // Chuyển về homepage sau khi login thành công
            if (window.parent && window.parent !== window) {
                window.parent.location.reload();
            } else {
                window.location.href = 'homepage.html';
            }
        } else {
            alert('Đăng nhập Google thất bại: ' + (apiResponse.message || 'Lỗi không xác định'));
        }
    } catch (error) {
        console.error('Google Login Error:', error);
        alert('Đăng nhập Google thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
}

// Export hàm để Google Sign-In có thể gọi
window.handleGoogleLogin = handleGoogleLogin;

