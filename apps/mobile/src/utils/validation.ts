// Validation utilities for mobile app

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
    if (!phone || phone.trim().length === 0) {
        return { isValid: false, error: 'Phone number is required' };
    }

    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s\-()]/g, '');

    // Check if it's a valid Nigerian phone number
    const nigerianPhoneRegex = /^(\+?234|0)[789]\d{9}$/;

    if (!nigerianPhoneRegex.test(cleanPhone)) {
        return { isValid: false, error: 'Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678)' };
    }

    return { isValid: true };
};

export const validateAmount = (amount: string | number): { isValid: boolean; error?: string } => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
        return { isValid: false, error: 'Please enter a valid amount' };
    }

    if (numAmount <= 0) {
        return { isValid: false, error: 'Amount must be greater than zero' };
    }

    if (numAmount > 1000000) {
        return { isValid: false, error: 'Amount cannot exceed ₦1,000,000' };
    }

    return { isValid: true };
};

export const validateMeterNumber = (meterNumber: string): { isValid: boolean; error?: string } => {
    if (!meterNumber || meterNumber.trim().length === 0) {
        return { isValid: false, error: 'Meter/Smartcard number is required' };
    }

    // Basic validation - should be numeric and between 10-15 digits
    const cleanNumber = meterNumber.replace(/\s/g, '');

    if (!/^\d{10,15}$/.test(cleanNumber)) {
        return { isValid: false, error: 'Please enter a valid meter/smartcard number (10-15 digits)' };
    }

    return { isValid: true };
};

export const formatPhone = (phone: string): string => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // If it starts with 0, replace with +234
    if (cleaned.startsWith('0')) {
        return `+234${cleaned.substring(1)}`;
    }

    // If it starts with 234, add +
    if (cleaned.startsWith('234')) {
        return `+${cleaned}`;
    }

    // If it's just the 10 digits, add +234
    if (cleaned.length === 10) {
        return `+234${cleaned}`;
    }

    return phone;
};
