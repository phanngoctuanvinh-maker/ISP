let lastScrollTop = 0;
const mainHeader = document.querySelector('.main-header');
const headerHeight = mainHeader.offsetHeight;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Thêm class scrolled khi scroll xuống
    if (scrollTop > 50) {
        mainHeader.classList.add('scrolled');
    } else {
        mainHeader.classList.remove('scrolled');
    }

    // Ẩn/hiện header dựa vào hướng scroll
    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
        // Scroll xuống -> ẩn header
        mainHeader.style.transform = 'translateY(-100%)';
    } else {
        // Scroll lên -> hiện header
        mainHeader.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});


// Open login/register modals over homepage by fetching modal HTML
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.auth-buttons .btn-login');
    const registerBtn = document.querySelector('.auth-buttons .btn-register');

    async function loadAndShowModal(pagePath, modalId) {
        try {
            const res = await fetch(pagePath, { cache: 'no-store' });
            const html = await res.text();
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const modalEl = temp.querySelector('#' + modalId);
            if (!modalEl) return;

            // Remove inline display to let Bootstrap control visibility
            modalEl.style.display = '';
            // Ensure unique id to avoid duplicates
            const existing = document.getElementById(modalId);
            if (existing) existing.remove();
            document.body.appendChild(modalEl);

            if (typeof bootstrap === 'undefined') return;
            const instance = bootstrap.Modal.getOrCreateInstance(modalEl, { backdrop: true, keyboard: true });
            instance.show();

            modalEl.addEventListener('hidden.bs.modal', () => {
                modalEl.remove();
            }, { once: true });
        } catch (e) {
            console.error('Failed to load modal:', e);
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadAndShowModal('./login.html', 'loginModal');
        });
    }
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadAndShowModal('./register.html', 'registerModal');
        });
    }
});

// Contact icon toggles pre-rendered contact-quick-menu (defined in HTML)
document.addEventListener('DOMContentLoaded', () => {
    const contactIcon = document.querySelector('.contact-icon');
    // Prefer the menu nested inside the icon if present
    const nestedMenu = contactIcon ? contactIcon.querySelector('.contact-quick-menu') : null;
    const contactMenuEl = nestedMenu || document.querySelector('.contact-quick-menu');
    if (contactMenuEl) contactMenuEl.style.display = 'none';
    if (!contactIcon || !contactMenuEl) return;

    contactIcon.style.cursor = 'pointer';
    contactIcon.addEventListener('click', (e) => {
        // If click is inside the menu, allow default (do not block links)
        const clickedInMenu = contactMenuEl.contains(e.target);
        if (clickedInMenu) return;
        e.preventDefault();
        e.stopPropagation();
        const isHidden = contactMenuEl.style.display === 'none';
        contactMenuEl.style.display = isHidden ? 'flex' : 'none';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        const clickedInside = contactMenuEl.contains(e.target);
        const clickedIcon = contactIcon.contains(e.target);
        if (!clickedInside && !clickedIcon) {
            contactMenuEl.style.display = 'none';
        }
    });
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

const hero = document.querySelector('.hero-image');
if (hero) {
  const slides = Array.from(hero.querySelectorAll('img'));
  let index = 0;
  slides.forEach((img, i) => {
    img.style.opacity = i === 0 ? '1' : '0';
  });
  setInterval(() => {
    const current = slides[index];
    index = (index + 1) % slides.length;
    const next = slides[index];
    if (current && next) {
      current.style.opacity = '0';
      next.style.opacity = '1';
    }
  }, 10000);
}

// Route type switching (nội thành / liên tỉnh / liên tỉnh 1 chiều)
const routeOptions = document.querySelectorAll('input[name="route-type"]');
const panelNoiThanh = document.querySelector('.panel-noi-thanh');
const panelLienTinh = document.querySelector('.panel-lien-tinh');
const panelLienTinh1c = document.querySelector('.panel-lien-tinh-1c');
function showPanel(value){
  if(!panelNoiThanh || !panelLienTinh || !panelLienTinh1c) return;
  panelNoiThanh.style.display = value === 'noi-thanh' ? 'block' : 'none';
  panelLienTinh.style.display = value === 'lien-tinh' ? 'block' : 'none';
  panelLienTinh1c.style.display = value === 'lien-tinh-mot-chieu' ? 'block' : 'none';
}
routeOptions.forEach(r => {
  r.addEventListener('change', (e) => showPanel(e.target.value));
});
// Initialize on load
const checked = document.querySelector('input[name="route-type"]:checked');
if (checked) showPanel(checked.value);

document.addEventListener('DOMContentLoaded', function() {
    // Đảm bảo api.js đã được load
    if (window.api) {
        checkLoginStatus();
    }
    
    // Auth buttons handling
    const btnRegister = document.querySelector('.btn-register');
    const btnLogin = document.querySelector('.btn-login');
    
    if (btnRegister) {
        btnRegister.addEventListener('click', function() {
            openAuthPage('register.html');
        });
    }
    
    if (btnLogin) {
        btnLogin.addEventListener('click', function() {
            openAuthPage('login.html');
        });
    }
    
    // Dashboard Tabs Toggle - Switch Form Content
    const dashboardTabs = document.querySelectorAll('.search-tabs .tab');
    const driverContent = document.getElementById('driverContent');
    const longTermContent = document.getElementById('longTermContent');
    
    if (dashboardTabs.length > 0) {
        dashboardTabs[0].classList.add('active');
    }
    
    dashboardTabs.forEach((tab, index) => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all tabs
            dashboardTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabText = this.textContent.trim().toLowerCase();
            console.log('Dashboard tab clicked:', tabText);
            
            // Switch form content
            if (tabText.includes('dài hạn') || tabText.includes('dai han')) {
                driverContent.classList.remove('active');
                longTermContent.classList.add('active');
            } else {
                longTermContent.classList.remove('active');
                driverContent.classList.add('active');
            }
        });
    });

    // Search button handler for Driver
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pickupLocation = document.querySelector('.location-input')?.value || '';
            const timeRange = document.querySelector('.time-input-field')?.value || '';
            const routeType = document.querySelector('input[name="route-type"]:checked')?.value || '';
            
            const params = new URLSearchParams({
                location: pickupLocation,
                time: timeRange,
                route: routeType
            });
            
            window.location.href = `searchcar.html?${params.toString()}`;
        });
    }

    // Search button handler for Long Term
    const btnSearchLongTerm = document.getElementById('btnSearchLongTerm');
    if (btnSearchLongTerm) {
        btnSearchLongTerm.addEventListener('click', function(e) {
            e.preventDefault();
            const citySelect = document.getElementById('cityLongTermSelect');
            const selectedCity = citySelect?.value;
            
            console.log('Long term - Selected city:', selectedCity);
            
            if (!selectedCity) {
                alert('Vui lòng chọn thành phố!');
                citySelect.focus();
                return;
            }
            
            window.location.href = `carsubscription.html?city=${selectedCity}`;
        });
    }

    // Banner Handler
    document.addEventListener('click', function(e) {
        const bannerBtn = e.target.closest('.banner-btn');
        if (!bannerBtn) return;
        
        e.preventDefault();
        const btnText = bannerBtn.textContent.trim().toLowerCase();
        
        console.log('Banner clicked:', btnText);
        
        if (btnText.includes('dài hạn') || btnText.includes('dai han')) {
            window.location.href = 'carsubscription.html';
        } else if (btnText.includes('tài xế') || btnText.includes('tai xe')) {
            window.location.href = 'srearchcar.html';
        }
    });
    
    function checkLoginStatus() {
        if (api && api.isLoggedIn()) {
            const user = api.getCurrentUser();
            updateAuthButtons(user);
        }
    }

    function updateAuthButtons(user) {
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons && user) {
            authButtons.innerHTML = `
                <div class="user-info">
                    <span class="user-name" id="userNameClickable" style="cursor:pointer;">Xin chào, ${user.fullName || user.username}</span>
                </div>
            `;
            // Thêm sự kiện click để chuyển sang trang profile
            setTimeout(() => {
                const userNameEl = document.getElementById('userNameClickable');
                if (userNameEl) {
                    userNameEl.addEventListener('click', function() {
                        window.location.href = 'profileuser.html';
                    });
                }
            }, 0);
        }
    }

    function handleLogout() {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            api.logout();
        }
    }

    // Make function global
    window.handleLogout = handleLogout;

    // Function to open auth pages as overlay
    function openAuthPage(page) {
        const overlay = document.createElement('div');
        overlay.className = 'auth-overlay';
        overlay.innerHTML = `
            <div class="auth-iframe-container">
                <button class="auth-close-btn" onclick="this.parentElement.parentElement.remove(); document.body.style.overflow='';">
                    <i class="fas fa-times"></i>
                </button>
                <iframe src="${page}" frameborder="0"></iframe>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
                document.body.style.overflow = '';
            }
        });
    }

    // Function to handle long-term rental search
    function handleLongTermRentalSearch() {
        const citySelect = document.querySelector('select[name="city"]') || document.querySelector('#longTermCity');
        
        if (citySelect && citySelect.selectedIndex > 0) {
            // Lấy TEXT hiển thị (Hồ Chí Minh) thay vì VALUE (hcm)
            const selectedCityText = citySelect.options[citySelect.selectedIndex].text;
            
            // Lưu tên thành phố đầy đủ vào localStorage
            localStorage.setItem('selectedCity', selectedCityText);
            
            // Chuyển hướng đến trang tìm kiếm với tên thành phố đầy đủ
            window.location.href = `carsubscription.html?city=${encodeURIComponent(selectedCityText)}`;
        } else {
            alert('Vui lòng chọn thành phố');
        }
    }

    // Gắn sự kiện cho nút tìm kiếm thuê dài hạn
    document.addEventListener('DOMContentLoaded', function() {
        const searchBtn = document.querySelector('#searchLongTermBtn') || document.querySelector('button[type="submit"]');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLongTermRentalSearch();
            });
        }
    });
});



const togglePicker = document.getElementById('togglePicker');
const picker = document.getElementById('picker');
const applyTime = document.getElementById('applyTime');
const timeDisplay = document.getElementById('timeDisplay');
const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');

// Toggle picker
togglePicker.addEventListener('click', () => {
  const isOpen = picker.style.display === 'block';
  picker.style.display = isOpen ? 'none' : 'block';
  togglePicker.classList.toggle('open');
});

// Apply time
applyTime.addEventListener('click', () => {
  if (startTime.value && endTime.value) {
    const start = new Date(startTime.value).toLocaleString('vi-VN');
    const end = new Date(endTime.value).toLocaleString('vi-VN');
    timeDisplay.value = `${start} - ${end}`;
    picker.style.display = 'none';
    togglePicker.classList.remove('open');
  }
});

// Close picker when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.time-section')) {
    picker.style.display = 'none';
    togglePicker.classList.remove('open');
  }
});

function initAutocomplete() {
  const input = document.getElementById("pickupInput");

  // Tạo autocomplete cho ô nhập
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['geocode'], // hoặc ['establishment'] nếu muốn gợi ý tên địa điểm
    componentRestrictions: { country: "vn" }, // chỉ gợi ý ở Việt Nam
  });

  // Khi người dùng chọn địa điểm
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      console.log("Địa điểm:", place.formatted_address);
      console.log("Tọa độ:", lat, lng);
    } else {
      console.log("Không tìm thấy thông tin địa điểm");
    }
  });
}

// Gọi hàm sau khi Maps script tải xong
google.maps.event.addDomListener(window, 'load', initAutocomplete);