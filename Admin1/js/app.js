// Main Application
const App = {
    currentPage: 'dashboard',
    
    init() {
        this.setupNavigation();
        this.setupModalCloseOnOutsideClick();
        this.loadPage('dashboard');
    },
    
    setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetPage = item.getAttribute('data-page');
                this.navigateTo(targetPage);
            });
        });
    },
    
    navigateTo(pageName) {
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
        
        // Load page
        this.loadPage(pageName);
        this.currentPage = pageName;
    },
    
    loadPage(pageName) {
        const mainContent = document.getElementById('mainContent');
        
        // Clear current content
        mainContent.innerHTML = '';
        
        // Load page content based on page name
        switch(pageName) {
            case 'dashboard':
                DashboardPage.render(mainContent);
                break;
            case 'vehicles':
                VehiclesPage.render(mainContent);
                break;
            case 'customers':
                CustomersPage.render(mainContent);
                break;
            case 'orders':
                OrdersPage.render(mainContent);
                break;
            case 'payments':
                PaymentsPage.render(mainContent);
                break;
            case 'coupons':
                CouponsPage.render(mainContent);
                break;
        }
    },
    
    setupModalCloseOnOutsideClick() {
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});