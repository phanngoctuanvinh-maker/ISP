// forgotpassword.js - Xử lý gửi yêu cầu lấy lại mật khẩu

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgotPasswordForm');
    const messageDiv = document.getElementById('forgotPasswordMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        messageDiv.textContent = '';
        const email = document.getElementById('forgotEmail').value.trim();
        if (!email) {
            messageDiv.textContent = 'Vui lòng nhập email.';
            messageDiv.style.color = 'red';
            return;
        }
        try {
            messageDiv.textContent = '⏳ Đang gửi yêu cầu...';
            messageDiv.style.color = '#0c5460';
            
            await api.forgotPassword(email);
            
            messageDiv.textContent = '✅ Đã gửi mã OTP về email. Đang chuyển hướng...';
            messageDiv.style.color = 'green';
            
            // Lưu email vào localStorage để dùng ở trang reset
            localStorage.setItem('resetEmail', email);
            
            // Chuyển sang trang reset password sau 1.5 giây
            setTimeout(() => {
                window.location.href = 'resetpassword.html?email=' + encodeURIComponent(email);
            }, 1500);
            
        } catch (err) {
            let errorMsg = err.message || 'Không gửi được yêu cầu.';
            
            // Xử lý các lỗi cụ thể
            if (errorMsg.includes('Authentication failed') || errorMsg.includes('Không thể gửi email')) {
                errorMsg = '⚠️ Hệ thống email chưa được cấu hình. Vui lòng liên hệ quản trị viên.\n\n' +
                          'Lỗi kỹ thuật: Backend chưa cấu hình Gmail SMTP.\n' +
                          'Xem file HUONG_DAN_CAU_HINH_EMAIL.md trong thư mục backend.';
            } else if (errorMsg.includes('Email không tồn tại')) {
                errorMsg = '❌ Email này chưa được đăng ký trong hệ thống.';
            }
            
            messageDiv.textContent = errorMsg;
            messageDiv.style.color = 'red';
            messageDiv.style.whiteSpace = 'pre-line'; // Cho phép xuống dòng
        }
    });
});
