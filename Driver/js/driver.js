// --- Handle logout ---
function handleLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    window.location.href = "login.html"; // điều hướng tạm thời
  }
}

const el = document.getElementById('#ddriver-name')
if(el){
  el.textContent = `Tài xế${driveName}`;
}