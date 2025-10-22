// ============= USER DROPDOWN =============
function toggleDropdown() {
  const dropdown = document.getElementById("adminDropdown");
  if (dropdown) {
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
  }
}

// Ẩn dropdown khi click ra ngoài
document.addEventListener("click", function (event) {
  const icon = document.querySelector(".user-icon");
  const dropdown = document.getElementById("adminDropdown");
  if (dropdown && !dropdown.contains(event.target) && !icon.contains(event.target)) {
    dropdown.style.display = "none";
  }
});

// ============= LOGOUT =============
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "../../web/login.html";
  }
}

// ============= HIGHLIGHT ACTIVE PAGE =============
document.addEventListener("DOMContentLoaded", function () {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop();
  
  // Find and highlight the active menu item
  const menuLinks = document.querySelectorAll(".menu a, .menu button");
  menuLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && href.includes(currentPage)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
