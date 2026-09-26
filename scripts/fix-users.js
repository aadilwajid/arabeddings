import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Generate proper bcrypt hashes
const users = [
  {
    id: 'user-001',
    email: 'admin@arabeddings.com',
    password: 'password',
    name: 'Admin',
    role: 'superadmin',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-002',
    email: 'manager@arabeddings.com',
    password: 'manager123',
    name: 'Store Manager',
    role: 'manager',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-003',
    email: 'support@arabeddings.com',
    password: 'support123',
    name: 'Support Team',
    role: 'support',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

// Hash passwords
const hashedUsers = users.map(user => ({
  ...user,
  password: bcrypt.hashSync(user.password, 10)
}));

// Write to file
fs.writeFileSync(
  path.join(DATA_DIR, 'users.json'),
  JSON.stringify(hashedUsers, null, 2)
);

console.log('✓ Fixed user passwords with valid bcrypt hashes');
console.log('');
console.log('Admin Credentials:');
console.log('  Email: admin@arabeddings.com');
console.log('  Password: password');
console.log('');
console.log('Manager Credentials:');
console.log('  Email: manager@arabeddings.com');
console.log('  Password: manager123');
console.log('');
console.log('Support Credentials:');
console.log('  Email: support@arabeddings.com');
console.log('  Password: support123');
