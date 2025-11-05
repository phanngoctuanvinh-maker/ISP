// Sample Data for the Application

const SampleData = {
    vehicles: [
        {
            id: 'V001',
            name: 'Toyota Camry',
            brand: 'Toyota',
            type: 'Sedan',
            seats: 5,
            plateNumber: '51A-12345',
            pricePerDay: 1200000,
            status: 'available',
            image: '🚗'
        },
        {
            id: 'V002',
            name: 'Honda CR-V',
            brand: 'Honda',
            type: 'SUV',
            seats: 7,
            plateNumber: '51B-67890',
            pricePerDay: 1500000,
            status: 'rented',
            image: '🚙'
        },
        {
            id: 'V003',
            name: 'Mazda 3',
            brand: 'Mazda',
            type: 'Sedan',
            seats: 5,
            plateNumber: '51C-11111',
            pricePerDay: 1000000,
            status: 'available',
            image: '🚗'
        },
        {
            id: 'V004',
            name: 'Ford Ranger',
            brand: 'Ford',
            type: 'Pickup',
            seats: 5,
            plateNumber: '51D-22222',
            pricePerDay: 1800000,
            status: 'maintenance',
            image: '🚚'
        }
    ],
    
    customers: [
        {
            id: 'KH001',
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            email: 'nguyenvana@gmail.com',
            idCard: '001234567890',
            totalRentals: 5,
            totalSpent: 15000000,
            status: 'active'
        },
        {
            id: 'KH002',
            name: 'Trần Thị B',
            phone: '0912345678',
            email: 'tranthib@gmail.com',
            idCard: '001234567891',
            totalRentals: 3,
            totalSpent: 8500000,
            status: 'active'
        },
        {
            id: 'KH003',
            name: 'Lê Văn C',
            phone: '0923456789',
            email: 'levanc@gmail.com',
            idCard: '001234567892',
            totalRentals: 7,
            totalSpent: 21000000,
            status: 'active'
        }
    ],
    
    orders: [
        {
            id: 'DH001',
            customerId: 'KH001',
            customerName: 'Nguyễn Văn A',
            vehicleId: 'V001',
            vehicleName: 'Toyota Camry',
            startDate: '2025-10-20',
            endDate: '2025-10-25',
            totalAmount: 6000000,
            status: 'pending'
        },
        {
            id: 'DH002',
            customerId: 'KH002',
            customerName: 'Trần Thị B',
            vehicleId: 'V002',
            vehicleName: 'Honda CR-V',
            startDate: '2025-10-19',
            endDate: '2025-10-24',
            totalAmount: 7500000,
            status: 'renting'
        },
        {
            id: 'DH003',
            customerId: 'KH003',
            customerName: 'Lê Văn C',
            vehicleId: 'V003',
            vehicleName: 'Mazda 3',
            startDate: '2025-10-18',
            endDate: '2025-10-21',
            totalAmount: 3000000,
            status: 'completed'
        }
    ],
    
    payments: [
        {
            id: 'TT001',
            orderId: 'DH003',
            customerId: 'KH003',
            customerName: 'Lê Văn C',
            amount: 3000000,
            method: 'transfer',
            date: '2025-10-18',
            status: 'paid'
        },
        {
            id: 'TT002',
            orderId: 'DH002',
            customerId: 'KH002',
            customerName: 'Trần Thị B',
            amount: 7500000,
            method: 'momo',
            date: null,
            status: 'unpaid'
        },
        {
            id: 'TT003',
            orderId: 'DH001',
            customerId: 'KH001',
            customerName: 'Nguyễn Văn A',
            amount: 6000000,
            method: 'cash',
            date: null,
            status: 'unpaid'
        }
    ],
    
    coupons: [
        {
            id: 'CP001',
            code: 'SUMMER2025',
            description: 'Giảm giá mùa hè',
            type: 'percent',
            value: 20,
            minAmount: 2000000,
            startDate: '2025-06-01',
            endDate: '2025-08-31',
            quantity: 50,
            used: 15,
            status: 'active'
        },
        {
            id: 'CP002',
            code: 'NEWYEAR',
            description: 'Chúc mừng năm mới',
            type: 'fixed',
            value: 500000,
            minAmount: 3000000,
            startDate: '2025-01-01',
            endDate: '2025-01-15',
            quantity: 100,
            used: 100,
            status: 'expired'
        },
        {
            id: 'CP003',
            code: 'FLASH50',
            description: 'Flash sale 50K',
            type: 'fixed',
            value: 50000,
            minAmount: 1000000,
            startDate: '2025-10-01',
            endDate: '2025-10-31',
            quantity: 200,
            used: 87,
            status: 'active'
        }
    ],
    
    // Statistics for dashboard
    stats: {
        totalVehicles: 45,
        rentedVehicles: 12,
        availableVehicles: 28,
        maintenanceVehicles: 3,
        brokenVehicles: 2,
        ordersToday: 5,
        ordersThisMonth: 28,
        revenueToday: 4500000,
        revenueThisMonth: 45200000,
        revenueThisYear: 520000000
    }
}