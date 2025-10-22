// profileuser.js - Hiển thị thông tin khách hàng và xử lý click tên

document.addEventListener('DOMContentLoaded', function() {
    // Lấy user từ localStorage (sau khi đăng nhập lưu vào currentUser)
    // Nếu chưa có thì chuyển về trang đăng nhập
    const user = api.getCurrentUser();
    if (!user) {
        window.location.href = 'homepage.html';
        return;
    }

    // Hiển thị thông tin user đúng trường
    document.getElementById('profileName').textContent = user.fullName || user.name || user.username || '';
    document.getElementById('joinDate').textContent = user.joinDate || user.createdAt || '--/--/----';
    document.getElementById('dob').textContent = user.dob || '';
    document.getElementById('gender').textContent = user.gender || '';
    document.getElementById('phone').textContent = user.phone || user.sdt || user.mobile || '';
    document.getElementById('email').textContent = user.email || user.username || '';
    document.getElementById('avatarImg').src = user.avatar || '../assets/icons/user-avatar.svg';

    // Khi nhấn vào tên khách hàng
    document.getElementById('profileName').addEventListener('click', function() {
        alert('Bạn đã nhấn vào tên khách hàng!');
        // Có thể mở modal chỉnh sửa thông tin ở đây
    });

    // Đăng xuất khi nhấn vào menu Đăng xuất
    const logoutMenu = document.querySelector('.menu li:last-child');
    if (logoutMenu) {
        logoutMenu.style.cursor = 'pointer';
        logoutMenu.addEventListener('click', function() {
            if (window.api && typeof window.api.logout === 'function') {
                window.api.logout();
            } else {
                // Xóa token và chuyển về trang chủ nếu không có api.logout
                localStorage.removeItem('token');
                localStorage.removeItem('userProfile');
                window.location.href = 'homepage.html';
            }
        });
    }

    // Click logo DriveNow để về homepage (giữ trạng thái đăng nhập)
    const logo = document.getElementById('logoDriveNow');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'homepage.html';
        });
    }

    // Chuyển sang trang đổi mật khẩu khi nhấn menu Đổi mật khẩu
    const menuItems = document.querySelectorAll('.menu li');
    // Đổi mật khẩu là mục thứ 5 (bắt đầu từ 0)
    if (menuItems[4]) {
        menuItems[4].style.cursor = 'pointer';
        menuItems[4].addEventListener('click', function() {
            window.location.href = 'changepassword.html';
        });
    }
});
