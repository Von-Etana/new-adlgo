export const COLORS = {
    primary: '#1A1A1A',
    secondary: '#4CAF50',
    background: '#F8F9FA',
    white: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    error: '#FF0000',
    success: '#4CAF50',
};

export const DIMENSIONS = {
    padding: 24,
    borderRadius: 20,
};

export const SERVICES = [
    { id: 'send', title: 'Send Package', icon: 'package', color: '#E3F2FD', route: 'CreateDelivery' },
    { id: 'airtime', title: 'Buy Airtime', icon: 'smartphone', color: '#FFF3E0', route: 'Wallet' },
    { id: 'bills', title: 'Pay Bills', icon: 'lightbulb', color: '#E8F5E9', route: 'Wallet' },
    { id: 'history', title: 'History', icon: 'clock', color: '#F3E5F5', route: 'Activity' },
];

export const RECENT_ACTIVITY = [
    { id: '1', title: 'Delivery to Gwarinpa', status: 'Delivered', date: 'Today, 2:30 PM' },
    { id: '2', title: 'Airtime Purchase', status: 'Success', date: 'Yesterday, 10:00 AM' },
];

export const MOCK_DRIVERS = [
    { id: '1', name: 'Musa Driver', rating: 4.8, vehicle: 'Toyota Camry', price: 1800, time: '5 mins' },
    { id: '2', name: 'John Bike', rating: 4.5, vehicle: 'Bajaj Bike', price: 1500, time: '2 mins' },
    { id: '3', name: 'Chinedu Van', rating: 4.9, vehicle: 'Ford Transit', price: 2500, time: '10 mins' },
];

export const BILL_PROVIDERS = [
    { id: 'mtn', name: 'MTN', color: '#FFCC00' },
    { id: 'airtel', name: 'Airtel', color: '#FF0000' },
    { id: 'glo', name: 'Glo', color: '#00FF00' },
    { id: 'dstv', name: 'DSTV', color: '#00A1E4' },
];
