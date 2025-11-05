// Handle register page interactions
function initRegister() {
    // Close button returns to homepage
    document.addEventListener('click', function(e){
        if(e.target.classList.contains('btn-close')){
            window.location.href = './homepage.html';
        }
    });

    // Toggle password visibility
    document.body.addEventListener('click', (e) => {
        const toggle = e.target.closest('.toggle-password');
        if(!toggle) return;
        const input = toggle.parentElement.querySelector('.password-input');
        if(!input) return;
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        const icon = toggle.querySelector('i');
        if(icon){
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    });

    // If there's a link to go back to login, handle it
    const toLoginLink = document.querySelector('a[href="./login.html"]');
    if (toLoginLink) {
        toLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = './login.html';
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRegister);
} else {
    initRegister();
}

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form');
    
    // Toggle password visibility
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
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
    });
    
    // Switch to login
    const switchToLogin = document.querySelector('.switch-to-login');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Remove previous error/success message
            const oldError = this.querySelector('.error-message');
            if (oldError) oldError.remove();
            const oldSuccess = this.querySelector('.success-message');
            if (oldSuccess) oldSuccess.remove();

            // Lấy đúng các trường từ form
            const name = this.querySelector('input[type="text"]').value.trim(); // Giả sử input text đầu tiên là Họ tên
            const phone = this.querySelector('input[type="tel"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const password = this.querySelectorAll('input[type="password"]')[0].value;
            const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;
            const agreed = this.querySelector('#agreePolicy') ? this.querySelector('#agreePolicy').checked : true;
            
            // ============ VALIDATIONS ============
            
            // 1. Kiểm tra họ tên
            if (!name || name.length < 2) {
                showError(this, 'Họ tên phải có ít nhất 2 ký tự!');
                return;
            }
            
            // 2. Kiểm tra email
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!email || !emailRegex.test(email)) {
                showError(this, 'Email không hợp lệ! Ví dụ: example@gmail.com');
                return;
            }
            
            // 3. Kiểm tra số điện thoại (10-11 chữ số)
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phone || !phoneRegex.test(phone)) {
                showError(this, 'Số điện thoại phải là 10-11 chữ số!');
                return;
            }
            
            // 4. Kiểm tra mật khẩu
            if (!password || password.length < 6) {
                showError(this, 'Mật khẩu phải có ít nhất 6 ký tự!');
                return;
            }
            
            // Kiểm tra mật khẩu mạnh (tùy chọn - có thể bỏ comment nếu muốn)
            // const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
            // if (!strongPasswordRegex.test(password)) {
            //     showError(this, 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!');
            //     return;
            // }
            
            // 5. Kiểm tra xác nhận mật khẩu
            if (password !== confirmPassword) {
                showError(this, 'Mật khẩu xác nhận không khớp!');
                return;
            }
            
            // 6. Kiểm tra đồng ý chính sách
            if (!agreed) {
                showError(this, 'Vui lòng đồng ý với điều khoản và chính sách!');
                return;
            }

            // Disable submit button
            const submitBtn = this.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang kiểm tra...';

            try {
                // 7. Kiểm tra email đã tồn tại chưa
                const emailCheck = await api.checkEmailExists(email);
                if (emailCheck.success && emailCheck.data === true) {
                    showError(this, 'Email này đã được đăng ký. Vui lòng sử dụng email khác!');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Đăng Ký';
                    return;
                }

                // 8. Kiểm tra số điện thoại đã tồn tại chưa
                const phoneCheck = await api.checkPhoneExists(phone);
                if (phoneCheck.success && phoneCheck.data === true) {
                    showError(this, 'Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác!');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Đăng Ký';
                    return;
                }

                // 9. Tất cả validation đã pass, tiến hành đăng ký
                submitBtn.textContent = 'Đăng đăng ký...';

                // Call API register
                const response = await api.register({
                    name: name,
                    phone: phone,
                    password: password,
                    email: email
                });
                
                if (response.success) {
                    // Show success message
                    showSuccess(this, 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
                    
                    // Redirect to login page after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    showError(this, response.message || 'Đăng ký thất bại!');
                }
            } catch (error) {
                showError(this, error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Đăng Ký';
            }
        });
    }
    
    // Function to show error message
    function showError(form, message) {
        const submitBtn = form.querySelector('.btn-submit');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        form.insertBefore(errorDiv, submitBtn);
    }

    // Function to show success message
    function showSuccess(form, message) {
        const submitBtn = form.querySelector('.btn-submit');
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        form.insertBefore(successDiv, submitBtn);
    }
});

// Header scroll behavior for register page
let lastScrollTop = 0;
const authContainer = document.querySelector('.auth-container');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Ẩn/hiện container dựa vào hướng scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll xuống -> thêm hiệu ứng mờ nhẹ
        authContainer.style.opacity = '0.95';
    } else {
        // Scroll lên -> hiện rõ
        authContainer.style.opacity = '1';
    }
    
    lastScrollTop = scrollTop;
});


