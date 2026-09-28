import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@arabeddings.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@arabeddings.com',
      name: 'Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+92 300 1234567'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create demo customer
  const customerPasswordHash = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'demo@arabeddings.com' },
    update: {},
    create: {
      email: 'demo@arabeddings.com',
      name: 'Ahmed Khan',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      phone: '+92 321 1234567'
    }
  });
  console.log('✅ Demo customer created:', customer.email);

  // Create categories
  const categories = [
    { name: 'Bed Sheets', slug: 'bed-sheets', description: 'Premium bed sheets in every size and fabric', sortOrder: 1 },
    { name: 'Duvet Covers', slug: 'duvet-covers', description: 'Luxurious duvet covers for every season', sortOrder: 2 },
    { name: 'Pillowcases', slug: 'pillowcases', description: 'Silky, soft pillowcases for perfect sleep', sortOrder: 3 },
    { name: 'Comforters', slug: 'comforters', description: 'Warm, cozy comforters for every climate', sortOrder: 4 },
    { name: 'Blankets', slug: 'blankets', description: 'Throw blankets and bed blankets', sortOrder: 5 },
    { name: 'Pillows', slug: 'pillows', description: 'Quality pillows in all firmness levels', sortOrder: 6 }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }
  console.log('✅ Categories created');

  // Create shipping zones
  const zones = [
    { name: 'Punjab', provinces: ['PUNJAB'] },
    { name: 'Sindh', provinces: ['SINDH'] },
    { name: 'Khyber Pakhtunkhwa', provinces: ['KPK'] },
    { name: 'Balochistan', provinces: ['BALOCHISTAN'] },
    { name: 'Gilgit-Baltistan & AJK', provinces: ['GB', 'AJK'] }
  ];

  for (const zone of zones) {
    const createdZone = await prisma.shippingZone.upsert({
      where: { id: zone.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: zone.name.toLowerCase().replace(/\s+/g, '-'),
        name: zone.name,
        provinces: zone.provinces
      }
    });

    // Create shipping methods for each zone
    const baseRate = zone.name === 'Punjab' ? 250 : zone.name === 'Sindh' ? 300 : 350;
    
    await prisma.shippingMethod.upsert({
      where: { id: `${createdZone.id}-standard` },
      update: {},
      create: {
        id: `${createdZone.id}-standard`,
        zoneId: createdZone.id,
        name: 'Standard Delivery',
        rate: baseRate,
        freeOverAmount: 5000,
        minDays: 3,
        maxDays: 5
      }
    });

    if (zone.name === 'Punjab' || zone.name === 'Sindh' || zone.name === 'Khyber Pakhtunkhwa') {
      await prisma.shippingMethod.upsert({
        where: { id: `${createdZone.id}-express` },
        update: {},
        create: {
          id: `${createdZone.id}-express`,
          zoneId: createdZone.id,
          name: 'Express Delivery',
          rate: baseRate + 250,
          freeOverAmount: 10000,
          minDays: 1,
          maxDays: 2
        }
      });
    }
  }
  console.log('✅ Shipping zones created');

  // Create site settings
  const settings = [
    { key: 'bank_transfer_details', value: 'Bank: Meezan Bank Limited\nAccount Title: ARA BEDDINGS\nAccount Number: 0123-4567-8901-2345\nIBAN: PK36MEZN0012345678901234\nBranch: Main Branch, Karachi\n\nPlease include your order number in the transfer reference.' },
    { key: 'free_shipping_threshold', value: '5000' },
    { key: 'store_name', value: 'ARA BEDDINGS' },
    { key: 'store_email', value: 'hello@arabeddings.com' },
    { key: 'store_phone', value: '+92 321 1234567' }
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    });
  }
  console.log('✅ Site settings created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
