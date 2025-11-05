// changepassword.js - Xử lý đổi mật khẩu cho người dùng

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('changePasswordForm');
    const messageDiv = document.getElementById('changePasswordMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        messageDiv.textContent = '';
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            messageDiv.textContent = 'Mật khẩu mới không khớp.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            await changePassword(oldPassword, newPassword);
            messageDiv.textContent = 'Đổi mật khẩu thành công!';
            messageDiv.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'profileuser.html';
            }, 1200);
            form.reset();
        } catch (err) {
            messageDiv.textContent = err.message || 'Đổi mật khẩu thất bại.';
            messageDiv.style.color = 'red';
        }
    });
});

async function changePassword(oldPassword, newPassword) {
    // Gọi API đổi mật khẩu
    const confirmPassword = document.getElementById('confirmPassword').value;
    const payload = {
        currentPassword: oldPassword,
        newPassword,
        confirmPassword
    };
    // Đúng endpoint backend: /profile/change-password
    return api.request('/profile/change-password', 'POST', payload);
}
