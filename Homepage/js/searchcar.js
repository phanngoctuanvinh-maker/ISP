//filter của search v3

// ===== DATABASE - Dữ liệu xe mẫu =====
const carsDatabase = [
    {
        id: 1,
        name: "Toyota Vios",
        brand: "toyota",
        type: "sedan",
        transmission: "auto",
        fuel: "xang",
        seats: 4,
        year: 2023,
        price: 800000,
        distance: 5,
        deliveryFee: 0,
        fuelConsumption: 5.5,
        features: ["map", "bluetooth"],
        rating: 4.8,

        electric: false
    },
    {
        id: 2,
        name: "Honda City",
        brand: "honda",
        type: "sedan",
        transmission: "auto",
        fuel: "xang",
        seats: 4,
        year: 2022,
        price: 750000,
        distance: 8,
        deliveryFee: 50000,
        fuelConsumption: 5.8,
        features: ["bluetooth", "camera360"],
        rating: 4.7,
        image: "../car/car/OIP.webp",
        electric: false
    },
    {
        id: 3,
        name: "VinFast VF e34",
        brand: "vinfast",
        type: "cuv-5",
        transmission: "auto",
        fuel: "dien",
        seats: 5,
        year: 2024,
        price: 900000,
        distance: 3,
        deliveryFee: 0,
        fuelConsumption: 0,
        features: ["map", "bluetooth", "camera360"],
        rating: 4.9,
        image: "../car/car/OIP.webp",
        electric: true
    },
    {
        id: 4,
        name: "Hyundai Tucson",
        brand: "hyundai",
        type: "cuv-5",
        transmission: "auto",
        fuel: "xang",
        seats: 5,
        year: 2023,
        price: 1200000,
        distance: 10,
        deliveryFee: 100000,
        fuelConsumption: 7.2,
        features: ["map", "bluetooth"],
        rating: 4.6,
        image: "../car/car/OIP.webp",
        electric: false
    },
    {
        id: 5,
        name: "Kia Morning",
        brand: "kia",
        type: "mini",
        transmission: "manual",
        fuel: "xang",
        seats: 4,
        year: 2021,
        price: 500000,
        distance: 15,
        deliveryFee: 50000,
        fuelConsumption: 4.5,
        features: ["bluetooth"],
        rating: 4.5,
        image: "../car/car/OIP.webp",
        electric: false
    },
    {
        id: 6,
        name: "Mazda CX-5",
        brand: "mazda",
        type: "cuv-5",
        transmission: "auto",
        fuel: "diesel",
        seats: 5,
        year: 2023,
        price: 1500000,
        distance: 7,
        deliveryFee: 0,
        fuelConsumption: 6.8,
        features: ["map", "bluetooth", "camera360"],
        rating: 4.8,
        image: "../car/car/OIP.webp",
        electric: false
    },
    {
        id: 7,
        name: "Ford Ranger",
        brand: "ford",
        type: "pickup",
        transmission: "auto",
        fuel: "diesel",
        seats: 5,
        year: 2022,
        price: 1800000,
        distance: 20,
        deliveryFee: 150000,
        fuelConsumption: 8.5,
        features: ["map", "bluetooth"],
        rating: 4.7,
        image: "../car/car/OIP.webp",
        electric: false
    },
    {
        id: 8,
        name: "Toyota Fortuner",
        brand: "toyota",
        type: "suv-7",
        transmission: "auto",
        fuel: "diesel",
        seats: 7,
        year: 2023,
        price: 2000000,
        distance: 12,
        deliveryFee: 100000,
        fuelConsumption: 7.8,
        features: ["map", "bluetooth", "camera360"],
        rating: 4.9,
        image: "../car/car/OIP.webp",
        electric: false
    },
    {
        id: 9,
        name: "Mitsubishi Xpander",
        brand: "mitsubishi",
        type: "mpv",
        transmission: "auto",
        fuel: "xang",
        seats: 7,
        year: 2022,
        price: 950000,
        distance: 6,
        deliveryFee: 50000,
        fuelConsumption: 6.5,
        features: ["bluetooth"],
        rating: 4.6,
        image: "../car/car/OIP.webp",
        electric: false
    },
    {
        id: 10,
        name: "VinFast Lux SA2.0",
        brand: "vinfast",
        type: "suv-7",
        transmission: "auto",
        fuel: "xangdien",
        seats: 7,
        year: 2024,
        price: 2500000,
        distance: 4,
        deliveryFee: 0,
        fuelConsumption: 5.0,
        features: ["map", "bluetooth", "camera360"],
        rating: 4.8,
        image: "../car/car/OIP.webp",
        electric: false
    },
    {
        id: 11,
        name: "Honda CR-V",
        brand: "honda",
        type: "cuv-5",
        transmission: "auto",
        fuel: "xang",
        seats: 5,
        year: 2023,
        price: 1400000,
        distance: 9,
        deliveryFee: 80000,
        fuelConsumption: 7.0,
        features: ["map", "bluetooth", "camera360"],
        rating: 4.7,
        image: "../car/car/OIP.webp",
        electric: false
    },
    {
        id: 12,
        name: "Kia Sorento",
        brand: "kia",
        type: "suv-7",
        transmission: "auto",
        fuel: "diesel",
        seats: 7,
        year: 2023,
        price: 1900000,
        distance: 11,
        deliveryFee: 100000,
        fuelConsumption: 7.5,
        features: ["map", "bluetooth", "camera360"],
        rating: 4.8,
        image: "../car/car/OIP.webp",
        electric: false
    }
];

// ===== FILTER STATE - Trạng thái bộ lọc =====
let filterState = {
    carType: null,
    brands: [],
    transmission: 'all',
    electric: null,
    sort: 'optimal',
    price: 5000000,
    distance: 200,
    seats: 2,
    year: 2000,
    deliveryFee: 500000,
    fuel: 'all',
    fuelConsumption: 25,
    features: []
};

let allCars = [...carsDatabase];
let filteredCars = [...carsDatabase];

// ===== MAIN INIT =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Search car page loaded');
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    const time = urlParams.get('time');
    const route = urlParams.get('route');
    
    // Display search info
    if (location) {
        const locationElement = document.querySelector('.search-info-item:first-child span');
        if (locationElement) {
            locationElement.textContent = location;
        }
    }
    
    if (time) {
        const timeElement = document.querySelector('.search-info-item:last-child span');
        if (timeElement) {
            timeElement.textContent = time;
        }
    }
    
    console.log('Search params:', { location, time, route });
    
    // Render initial cars
    renderCars(filteredCars);
    
    // Initialize all filters
    initBasicFilters();
    initCarTypeModal();
    initCarBrandModal();
    initTransmissionModal();
    initAdvancedFilterModal();
});

// ===== RENDER FUNCTIONS =====
function renderCars(cars) {
    const carsGrid = document.querySelector('.cars-grid');
    if (!carsGrid) return;
    
    if (cars.length === 0) {
        carsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-car-side" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <p style="font-size: 18px; color: #666;">Không tìm thấy xe phù hợp</p>
                <p style="font-size: 14px; color: #999;">Vui lòng thử điều chỉnh bộ lọc</p>
            </div>
        `;
        return;
    }
    
    carsGrid.innerHTML = cars.map(car => `
        <div class="car-card-result" data-car-id="${car.id}">
            <div class="car-image-wrapper">
                <img src="../car/car/OIP.webp" alt="${car.name}" class="car-result-img">
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.car-card-result').forEach(card => {
        card.addEventListener('click', function() {
            const carId = this.dataset.carId;
            console.log('Car clicked:', carId);
            // TODO: Navigate to car detail page
        });
    });
}

// ===== FILTER LOGIC =====
function applyFilters() {
    filteredCars = allCars.filter(car => {
        // Filter by car type
        if (filterState.carType && car.type !== filterState.carType) {
            return false;
        }
        
        // Filter by brands
        if (filterState.brands.length > 0 && !filterState.brands.includes(car.brand)) {
            return false;
        }
        
        // Filter by transmission
        if (filterState.transmission !== 'all' && car.transmission !== filterState.transmission) {
            return false;
        }
        
        // Filter by electric
        if (filterState.electric === 'electric' && !car.electric) {
            return false;
        }
        if (filterState.electric === 'hybrid' && car.fuel !== 'xangdien') {
            return false;
        }
        
        // Filter by price
        if (car.price > filterState.price) {
            return false;
        }
        
        // Filter by distance
        if (car.distance > filterState.distance) {
            return false;
        }
        
        // Filter by seats
        if (car.seats < filterState.seats) {
            return false;
        }
        
        // Filter by year
        if (car.year < filterState.year) {
            return false;
        }
        
        // Filter by delivery fee
        if (car.deliveryFee > filterState.deliveryFee) {
            return false;
        }
        
        // Filter by fuel type
        if (filterState.fuel !== 'all' && car.fuel !== filterState.fuel) {
            return false;
        }
        
        // Filter by fuel consumption
        if (car.fuelConsumption > filterState.fuelConsumption && car.fuel !== 'dien') {
            return false;
        }
        
        // Filter by features
        if (filterState.features.length > 0) {
            const hasAllFeatures = filterState.features.every(feature => 
                car.features.includes(feature)
            );
            if (!hasAllFeatures) {
                return false;
            }
        }
        
        return true;
    });
    
    // Apply sorting
    sortCars();
    
    // Render filtered cars
    renderCars(filteredCars);
    
    console.log('Filtered cars:', filteredCars.length, 'of', allCars.length);
}

function sortCars() {
    switch(filterState.sort) {
        case 'distance':
            filteredCars.sort((a, b) => a.distance - b.distance);
            break;
        case 'price-low':
            filteredCars.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCars.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredCars.sort((a, b) => b.rating - a.rating);
            break;
        default: // optimal
            filteredCars.sort((a, b) => {
                const scoreA = (a.rating * 0.4) - (a.distance * 0.3) - (a.price / 1000000 * 0.3);
                const scoreB = (b.rating * 0.4) - (b.distance * 0.3) - (b.price / 1000000 * 0.3);
                return scoreB - scoreA;
            });
    }
}

// ===== BASIC FILTERS =====
function initBasicFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabText = this.textContent.trim();
            
            // Handle "Tất cả" button
            if (tabText === 'Tất cả') {
                resetAllFilters();
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                return;
            }
            
            // Handle electric filters
            if (tabText.includes('Xe Điện')) {
                filterState.electric = filterState.electric === 'electric' ? null : 'electric';
                this.classList.toggle('active');
                applyFilters();
            }
            
            if (tabText.includes('Xe Xăng &Điện')) {
                filterState.electric = filterState.electric === 'hybrid' ? null : 'hybrid';
                this.classList.toggle('active');
                applyFilters();
            }
        });
    });
}

function resetAllFilters() {
    filterState = {
        carType: null,
        brands: [],
        transmission: 'all',
        electric: null,
        sort: 'optimal',
        price: 5000000,
        distance: 200,
        seats: 2,
        year: 2000,
        deliveryFee: 500000,
        fuel: 'all',
        fuelConsumption: 25,
        features: []
    };
    
    // Remove active states
    document.querySelectorAll('.filter-tab').forEach(tab => {
        if (!tab.textContent.includes('Tất cả')) {
            tab.classList.remove('active');
        }
    });
    
    // Reset modals
    document.querySelectorAll('.car-type-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    document.querySelectorAll('.brand-card-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    applyFilters();
}

// ===== CAR TYPE MODAL =====
function initCarTypeModal() {
    const carTypeModal = document.getElementById('carTypeModal');
    const carTypeItems = document.querySelectorAll('.car-type-item');
    const applyBtn = document.getElementById('applyCarType');
    let selectedType = null;
    
    carTypeItems.forEach(item => {
        item.addEventListener('click', function() {
            carTypeItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedType = this.dataset.type;
        });
    });
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            if (selectedType) {
                filterState.carType = selectedType;
                
                // Activate the filter button
                const carTypeBtn = document.querySelector('[data-bs-target="#carTypeModal"]');
                if (carTypeBtn) {
                    carTypeBtn.classList.add('active');
                }
                
                applyFilters();
                bootstrap.Modal.getInstance(carTypeModal).hide();
            }
        });
    }
}

// ===== CAR BRAND MODAL =====
function initCarBrandModal() {
    const carBrandModal = document.getElementById('carBrandModal');
    const brandCards = document.querySelectorAll('.brand-card-item');
    const applyBtn = document.getElementById('applyCarBrand');
    
    brandCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const selectedBrands = Array.from(document.querySelectorAll('.brand-card-item.selected'))
                .map(card => card.dataset.brand);
            
            filterState.brands = selectedBrands;
            
            // Update button state
            const brandBtn = document.getElementById('carBrandFilterBtn');
            if (brandBtn) {
                if (selectedBrands.length > 0) {
                    brandBtn.classList.add('active');
                } else {
                    brandBtn.classList.remove('active');
                }
            }
            
            applyFilters();
            bootstrap.Modal.getInstance(carBrandModal).hide();
        });
    }
}

// ===== TRANSMISSION MODAL =====
function initTransmissionModal() {
    const transmissionModal = document.getElementById('transmissionModal');
    const applyBtn = document.getElementById('applyTransmission');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const selectedOption = document.querySelector('input[name="transmissionOption"]:checked');
            
            if (selectedOption) {
                filterState.transmission = selectedOption.value;
                
                // Update button state
                const transBtn = document.getElementById('transmissionFilterBtn');
                if (transBtn) {
                    if (selectedOption.value !== 'all') {
                        transBtn.classList.add('active');
                    } else {
                        transBtn.classList.remove('active');
                    }
                }
                
                applyFilters();
                bootstrap.Modal.getInstance(transmissionModal).hide();
            }
        });
    }
}

// ===== ADVANCED FILTER MODAL =====
function initAdvancedFilterModal() {
    const advancedFilterModal = document.getElementById('advancedFilterModal');
    const applyBtn = document.getElementById('applyAdvancedFilter');
    const clearBtn = document.getElementById('clearAdvancedFilter');
    const advancedFilterBtn = document.getElementById('advancedFilterBtn');
    
    // Initialize sliders
    const rangeSliders = advancedFilterModal.querySelectorAll('.form-range');
    
    rangeSliders.forEach(slider => {
        slider.addEventListener('input', () => {
            updateSliderTrack(slider);
            updateSliderValueDisplay(slider);
        });
        updateSliderTrack(slider);
        updateSliderValueDisplay(slider);
    });
    
    // Apply button
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            // Get sort option
            const sortSelect = advancedFilterModal.querySelector('select');
            if (sortSelect) {
                const sortValue = sortSelect.value;
                filterState.sort = sortValue === 'Tối ưu' ? 'optimal' :
                                  sortValue === 'Khoảng cách gần nhất' ? 'distance' :
                                  sortValue === 'Giá thấp nhất' ? 'price-low' :
                                  sortValue === 'Giá cao nhất' ? 'price-high' :
                                  sortValue === 'Đánh giá tốt nhất' ? 'rating' : 'optimal';
            }
            
            // Get range values
            filterState.price = parseFloat(document.getElementById('price-range').value);
            filterState.distance = parseFloat(document.getElementById('distance-range').value);
            filterState.seats = parseInt(document.getElementById('seats-range').value);
            filterState.year = parseInt(document.getElementById('year-range').value);
            filterState.deliveryFee = parseFloat(document.getElementById('delivery-fee-range').value);
            filterState.fuelConsumption = parseFloat(document.getElementById('fuel-consumption-range').value);
            
            // Get transmission
            const transRadio = advancedFilterModal.querySelector('input[name="transmission"]:checked');
            if (transRadio) {
                filterState.transmission = transRadio.value;
            }
            
            // Get fuel type
            const fuelRadio = advancedFilterModal.querySelector('input[name="fuel"]:checked');
            if (fuelRadio) {
                filterState.fuel = fuelRadio.id === 'fuel-all' ? 'all' :
                                   fuelRadio.id === 'fuel-xang' ? 'xang' :
                                   fuelRadio.id === 'fuel-diesel' ? 'diesel' :
                                   fuelRadio.id === 'fuel-dien' ? 'dien' :
                                   fuelRadio.id === 'fuel-xangdien' ? 'xangdien' : 'all';
            }
            
            // Get features
            const featureCheckboxes = advancedFilterModal.querySelectorAll('input[type="checkbox"]:checked');
            filterState.features = Array.from(featureCheckboxes).map(cb => {
                if (cb.id === 'feature-map') return 'map';
                if (cb.id === 'feature-bluetooth') return 'bluetooth';
                if (cb.id === 'feature-camera360') return 'camera360';
            }).filter(Boolean);
            
            // Update button state
            if (advancedFilterBtn) {
                advancedFilterBtn.classList.add('active');
            }
            
            applyFilters();
            bootstrap.Modal.getInstance(advancedFilterModal).hide();
        });
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            resetAdvancedFilters();
            if (advancedFilterBtn) {
                advancedFilterBtn.classList.remove('active');
            }
            applyFilters();
        });
    }
}

function resetAdvancedFilters() {
    const advancedFilterModal = document.getElementById('advancedFilterModal');
    
    // Reset select
    const select = advancedFilterModal.querySelector('select');
    if (select) select.selectedIndex = 0;
    
    // Reset sliders
    const rangeSliders = advancedFilterModal.querySelectorAll('.form-range');
    rangeSliders.forEach(slider => {
        if (slider.id === 'fuel-consumption-range') {
            slider.value = slider.max;
        } else if (slider.id === 'seats-range' || slider.id === 'year-range') {
            slider.value = slider.min;
        } else {
            slider.value = slider.min;
        }
        updateSliderTrack(slider);
        updateSliderValueDisplay(slider);
    });
    
    // Reset radios
    const radios = advancedFilterModal.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        if (radio.id.endsWith('-all')) radio.checked = true;
    });
    
    // Reset checkboxes
    const checkboxes = advancedFilterModal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    // Reset filter state
    filterState.sort = 'optimal';
    filterState.price = 5000000;
    filterState.distance = 200;
    filterState.seats = 2;
    filterState.year = 2000;
    filterState.deliveryFee = 500000;
    filterState.fuel = 'all';
    filterState.fuelConsumption = 25;
    filterState.features = [];
}

// ===== SLIDER HELPERS =====
function updateSliderTrack(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const value = parseFloat(slider.value);
    const percentage = ((value - min) / (max - min)) * 100;
    const gradient = `linear-gradient(to right, #60d394 0%, #60d394 ${percentage}%, #e9ecef ${percentage}%, #e9ecef 100%)`;
    slider.style.background = gradient;
}

function updateSliderValueDisplay(slider) {
    const display = slider.nextElementSibling;
    if (!display || !display.classList.contains('range-value-display')) return;
    
    const value = parseFloat(slider.value);
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const unit = slider.dataset.unit || '';
    
    if (slider.id === 'delivery-fee-range' && value === min) {
        display.textContent = 'Miễn phí';
    } else if (slider.id === 'fuel-consumption-range' && value === max) {
        display.textContent = `Từ dưới ${value}L/100km`;
    } else if (value === min && (slider.id === 'price-range' || slider.id === 'distance-range' || slider.id === 'year-range' || slider.id === 'seats-range')) {
        display.textContent = 'Bất kì';
    } else if (unit === 'đ') {
        display.textContent = `Dưới ${value.toLocaleString('vi-VN')}${unit}`;
    } else if (unit === 'km') {
        display.textContent = `Dưới ${value}${unit}`;
    } else if (slider.id === 'seats-range') {
        display.textContent = `${value} chỗ`;
    } else if (slider.id === 'year-range') {
        display.textContent = `Từ ${value}`;
    } else {
        display.textContent = value;
    }
}