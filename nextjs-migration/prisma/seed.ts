import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Create admin user
  const adminPasswordHash = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@arabeddings.com" },
    update: {},
    create: {
      email: "admin@arabeddings.com",
      name: "Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      phone: "+92 300 1234567",
    },
  })
  console.log("✅ Admin user created:", admin.email)

  // Create demo customer
  const customerPasswordHash = await bcrypt.hash("customer123", 10)
  const customer = await prisma.user.upsert({
    where: { email: "demo@arabeddings.com" },
    update: {},
    create: {
      email: "demo@arabeddings.com",
      name: "Ahmed Khan",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "+92 321 1234567",
    },
  })
  console.log("✅ Demo customer created:", customer.email)

  // Create categories
  const categories = [
    { name: "Bed Sheets", slug: "bed-sheets", sortOrder: 1 },
    { name: "Duvet Covers", slug: "duvet-covers", sortOrder: 2 },
    { name: "Pillowcases", slug: "pillowcases", sortOrder: 3 },
    { name: "Comforters", slug: "comforters", sortOrder: 4 },
    { name: "Blankets", slug: "blankets", sortOrder: 5 },
    { name: "Pillows", slug: "pillows", sortOrder: 6 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log("✅ Categories created")

  // Create shipping zones
  const zones = [
    { name: "Punjab", provinces: ["PUNJAB"] },
    { name: "Sindh", provinces: ["SINDH"] },
    { name: "Khyber Pakhtunkhwa", provinces: ["KPK"] },
    { name: "Balochistan", provinces: ["BALOCHISTAN"] },
    { name: "Gilgit-Baltistan & AJK", provinces: ["GB", "AJK"] },
  ]

  for (const zone of zones) {
    const createdZone = await prisma.shippingZone.upsert({
      where: { id: zone.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: zone.name.toLowerCase().replace(/\s+/g, "-"),
        name: zone.name,
        provinces: zone.provinces,
      },
    })

    const baseRate = zone.name === "Punjab" ? 250 : zone.name === "Sindh" ? 300 : 350

    await prisma.shippingMethod.upsert({
      where: { id: `${createdZone.id}-standard` },
      update: {},
      create: {
        id: `${createdZone.id}-standard`,
        zoneId: createdZone.id,
        name: "Standard Delivery",
        rate: baseRate,
        freeOverAmount: 5000,
        minDays: 3,
        maxDays: 5,
      },
    })
  }
  console.log("✅ Shipping zones created")

  // Create site settings
  const settings = [
    {
      key: "bank_transfer_details",
      value:
        "Bank: Meezan Bank Limited\nAccount Title: ARA BEDDINGS\nAccount Number: 0123-4567-8901-2345\nIBAN: PK36MEZN0012345678901234",
    },
    { key: "free_shipping_threshold", value: "5000" },
    { key: "store_name", value: "ARA BEDDINGS" },
    { key: "store_email", value: "hello@arabeddings.com" },
    { key: "store_phone", value: "+92 321 1234567" },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log("✅ Site settings created")

  console.log("🎉 Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
