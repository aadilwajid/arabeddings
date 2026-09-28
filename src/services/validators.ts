/**
 * ARA BEDDINGS - Validation Service
 * Data validation for forms and API inputs
 */

import { logger } from './logger';

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

class ValidationService {
  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation (Pakistani format)
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Password validation
  isValidPassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate login form
  validateLogin(email: string, password: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validate registration form
  validateRegistration(name: string, email: string, phone: string, password: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(email)) {
      errors.email = 'Invalid email format';
    }

    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!this.isValidPhone(phone)) {
      errors.phone = 'Invalid Pakistani phone number (e.g., 03211234567)';
    }

    const passwordValidation = this.isValidPassword(password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.errors.join(', ');
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validate address
  validateAddress(address: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
  }): ValidationResult {
    const errors: Record<string, string> = {};

    if (!address.fullName || address.fullName.trim().length < 2) {
      errors.fullName = 'Full name is required';
    }

    if (!address.phone) {
      errors.phone = 'Phone number is required';
    } else if (!this.isValidPhone(address.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (!address.line1 || address.line1.trim().length < 5) {
      errors.line1 = 'Address line 1 is required';
    }

    if (!address.city) {
      errors.city = 'City is required';
    }

    if (!address.state) {
      errors.state = 'Province/State is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validate checkout
  validateCheckout(cart: any[], address: any, paymentMethod: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!cart || cart.length === 0) {
      errors.cart = 'Cart is empty';
    }

    const addressValidation = this.validateAddress(address);
    if (!addressValidation.valid) {
      Object.assign(errors, addressValidation.errors);
    }

    if (!paymentMethod) {
      errors.paymentMethod = 'Payment method is required';
    } else if (!['COD', 'BANK_TRANSFER'].includes(paymentMethod)) {
      errors.paymentMethod = 'Invalid payment method';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validate custom order
  validateCustomOrder(data: {
    fullName: string;
    email: string;
    phone: string;
    itemType: string;
    quantity: number;
    deliveryAddress: string;
  }): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.fullName = 'Full name is required';
    }

    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (!data.phone) {
      errors.phone = 'Phone number is required';
    } else if (!this.isValidPhone(data.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (!data.itemType) {
      errors.itemType = 'Item type is required';
    }

    if (!data.quantity || data.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    if (!data.deliveryAddress || data.deliveryAddress.trim().length < 10) {
      errors.deliveryAddress = 'Delivery address is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validate coupon code
  validateCoupon(code: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!code) {
      errors.code = 'Coupon code is required';
    } else if (code.length < 3) {
      errors.code = 'Invalid coupon code';
    } else if (!/^[A-Z0-9]+$/.test(code)) {
      errors.code = 'Coupon code must be alphanumeric';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validate product review
  validateReview(rating: number, title: string, body: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!rating || rating < 1 || rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    if (!title || title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!body || body.trim().length < 10) {
      errors.body = 'Review must be at least 10 characters';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Sanitize input
  sanitize(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  // Validate file upload
  validateFile(file: File, allowedTypes: string[], maxSizeMB: number): ValidationResult {
    const errors: Record<string, string> = {};

    if (!allowedTypes.includes(file.type)) {
      errors.type = `File type ${file.type} is not allowed`;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.size = `File size must be less than ${maxSizeMB}MB`;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export const validators = new ValidationService();

// Make validators available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).validators = validators;
}
