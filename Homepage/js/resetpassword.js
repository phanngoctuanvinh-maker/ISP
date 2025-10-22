// resetpassword.js - Xử lý đặt lại mật khẩu với OTP

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resetPasswordForm');
    const messageDiv = document.getElementById('resetMessage');
    const emailInput = document.getElementById('resetEmail');

    // Lấy email từ URL parameter hoặc localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || localStorage.getItem('resetEmail') || '';
    
    if (!email) {
        messageDiv.textContent = 'Không tìm thấy email. Vui lòng quay lại trang Quên mật khẩu.';
        messageDiv.className = 'message error';
        form.querySelector('button').disabled = true;
        return;
    }

    emailInput.value = email;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        messageDiv.textContent = '';
        messageDiv.className = '';

        const otpCode = document.getElementById('otpCode').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
            showMessage('Mã OTP phải là 6 chữ số!', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showMessage('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }

        // Call API
        try {
            showMessage('⏳ Đang xử lý...', 'info');
            const response = await api.resetPassword(email, otpCode, newPassword, confirmPassword);
            
            showMessage('✅ ' + (response.message || 'Đặt lại mật khẩu thành công!'), 'success');
            
            // Clear localStorage
            localStorage.removeItem('resetEmail');
            
            // Chuyển về trang login sau 2 giây
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (err) {
            const errorMsg = err.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
            showMessage('❌ ' + errorMsg, 'error');
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + type;
    }
});
