// User types
export interface User {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    role: 'customer' | 'driver' | 'admin';
    createdAt?: string;
}

// Location types
export interface Location {
    lat: number;
    lng: number;
    address: string;
}

// Order types
export interface Order {
    id: string;
    userId: string;
    pickup: Location;
    dropoff: Location;
    offerPrice: number;
    finalPrice?: number;
    type: 'Express' | 'Standard';
    status: 'bidding' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    driverId?: string;
    createdAt: string;
    bids?: Bid[];
}

// Bid types
export interface Bid {
    id: string;
    orderId: string;
    driverId: string;
    amount: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    driverDetails?: {
        name: string;
        rating: number;
        vehicle: string;
        plate: string;
    };
}

// Wallet types
export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    currency: string;
}

export interface Transaction {
    id: string;
    walletId: string;
    amount: number;
    type: 'credit' | 'debit';
    category: string;
    reference?: string;
    createdAt: string;
}

// API Request/Response types
export interface LoginRequest {
    phone: string;
    password?: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface RegisterRequest {
    phone: string;
    name: string;
    email?: string;
    password?: string;
    role: 'customer' | 'driver';
}

export interface CreateOrderRequest {
    userId: string;
    pickup: Location;
    dropoff: Location;
    offerPrice: number;
    type: 'Express' | 'Standard';
}

export interface FundWalletRequest {
    amount: number;
    reference: string;
}

export interface PayBillRequest {
    provider: string;
    identifier: string;
    amount: number;
}

// Navigation types
export interface RootStackParamList {
    Login: undefined;
    Register: undefined;
    CustomerHome: undefined;
    DriverHome: undefined;
    CreateDelivery: undefined;
    Earnings: undefined;
    Wallet: undefined;
    BillPayment: { provider?: any };
}

// Component prop types
export interface RouteParams {
    provider?: {
        id: string;
        name: string;
        logo?: string;
        color: string;
    };
}
