import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
  createdAt: string;
}

export function getDiscountCodes(): DiscountCode[] {
  const filepath = path.join(DATA_DIR, 'discounts.json');
  if (!fs.existsSync(filepath)) {
    // Create default discount codes
    const defaults: DiscountCode[] = [
      {
        id: 'disc-001',
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrder: 2000,
        usageLimit: 1000,
        usedCount: 0,
        expiresAt: '2026-12-31T23:59:59Z',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'disc-002',
        code: 'FLAT500',
        type: 'fixed',
        value: 500,
        minOrder: 5000,
        usageLimit: 500,
        usedCount: 0,
        expiresAt: '2026-12-31T23:59:59Z',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'disc-003',
        code: 'EID20',
        type: 'percentage',
        value: 20,
        minOrder: 10000,
        maxDiscount: 3000,
        usageLimit: 200,
        usedCount: 0,
        expiresAt: '2026-04-30T23:59:59Z',
        active: true,
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(filepath, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

export function saveDiscountCodes(codes: DiscountCode[]): void {
  fs.writeFileSync(path.join(DATA_DIR, 'discounts.json'), JSON.stringify(codes, null, 2));
}

export function validateDiscountCode(code: string, orderTotal: number): { valid: boolean; discount: number; message: string; code?: DiscountCode } {
  const codes = getDiscountCodes();
  const discountCode = codes.find(c => c.code.toUpperCase() === code.toUpperCase());

  if (!discountCode) {
    return { valid: false, discount: 0, message: 'Invalid discount code' };
  }

  if (!discountCode.active) {
    return { valid: false, discount: 0, message: 'This code is no longer active' };
  }

  if (new Date(discountCode.expiresAt) < new Date()) {
    return { valid: false, discount: 0, message: 'This code has expired' };
  }

  if (discountCode.usedCount >= discountCode.usageLimit) {
    return { valid: false, discount: 0, message: 'This code has reached its usage limit' };
  }

  if (orderTotal < discountCode.minOrder) {
    return { valid: false, discount: 0, message: `Minimum order of Rs ${discountCode.minOrder.toLocaleString()} required` };
  }

  let discount = 0;
  if (discountCode.type === 'percentage') {
    discount = Math.floor(orderTotal * discountCode.value / 100);
    if (discountCode.maxDiscount && discount > discountCode.maxDiscount) {
      discount = discountCode.maxDiscount;
    }
  } else {
    discount = discountCode.value;
  }

  return { valid: true, discount, message: `Rs ${discount.toLocaleString()} discount applied!`, code: discountCode };
}

export function useDiscountCode(codeId: string): void {
  const codes = getDiscountCodes();
  const code = codes.find(c => c.id === codeId);
  if (code) {
    code.usedCount += 1;
    saveDiscountCodes(codes);
  }
}

export function createDiscountCode(code: Omit<DiscountCode, 'id' | 'usedCount' | 'createdAt'>): DiscountCode {
  const codes = getDiscountCodes();
  const newCode: DiscountCode = {
    ...code,
    id: `disc-${Date.now()}`,
    usedCount: 0,
    createdAt: new Date().toISOString()
  };
  codes.push(newCode);
  saveDiscountCodes(codes);
  return newCode;
}

export function deleteDiscountCode(id: string): void {
  const codes = getDiscountCodes().filter(c => c.id !== id);
  saveDiscountCodes(codes);
}

export function updateDiscountCode(id: string, updates: Partial<DiscountCode>): void {
  const codes = getDiscountCodes();
  const index = codes.findIndex(c => c.id === id);
  if (index >= 0) {
    codes[index] = { ...codes[index], ...updates };
    saveDiscountCodes(codes);
  }
}
