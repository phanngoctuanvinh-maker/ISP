// Validate email format
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validate phone (chỉ số, 9-11 ký tự)
function validatePhone(phone) {
  const regex = /^[0-9]{9,11}$/;
  return regex.test(phone);
}

// Xử lý form submit
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profileForm");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // validate email
    if (!validateEmail(emailInput.value)) {
      emailError.textContent = "Invalid email format!";
      isValid = false;
    } else {
      emailError.textContent = "";
    }

    // validate phone
    if (!validatePhone(phoneInput.value)) {
      phoneError.textContent = "Phone must be 9-11 digits!";
      isValid = false;
    } else {
      phoneError.textContent = "";
    }

    if (isValid) {
      alert("Profile updated successfully!");
      // ở đây có thể gọi API hoặc submit form thật
    }
  });
});
