"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function createOrder(data: {
  items: Array<{
    variantId: string
    quantity: number
    productName: string
    variantName: string
    sku: string
    unitPrice: number
  }>
  address: {
    fullName: string
    phone: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode?: string
  }
  paymentMethod: "COD" | "BANK_TRANSFER"
  bankReference?: string
  shippingMethodId: string
  notes?: string
}) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const shippingMethod = await prisma.shippingMethod.findUnique({
    where: { id: data.shippingMethodId },
  })

  const shippingFee =
    subtotal >= Number(shippingMethod?.freeOverAmount || 5000) ? 0 : Number(shippingMethod?.rate || 250)

  const total = subtotal + shippingFee

  const orderNumber = `ARA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`

  const address = await prisma.address.create({
     {
      userId: user.id,
      ...data.address,
      country: "PK",
    },
  })

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
       {
        orderNumber,
        userId: user.id,
        addressId: address.id,
        status: "PENDING",
        subtotal,
        shippingFee,
        total,
        currency: "PKR",
        notes: data.notes,
        shippingMethodId: data.shippingMethodId,
        statusHistory: {
          create: {
            status: "PENDING",
            note: "Order placed",
          },
        },
      },
    })

    await tx.orderItem.createMany({
       data.items.map((item) => ({
        orderId: newOrder.id,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        sku: item.sku,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        total: item.unitPrice * item.quantity,
      })),
    })

    await tx.payment.create({
       {
        orderId: newOrder.id,
        method: data.paymentMethod,
        status: data.paymentMethod === "BANK_TRANSFER" ? "AWAITING_VERIFICATION" : "PENDING",
        amount: total,
        reference: data.bankReference,
      },
    })

    // Decrement stock
    for (const item of data.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
         { stock: { decrement: item.quantity } },
      })
    }

    return newOrder
  })

  revalidatePath("/account/orders")
  return order
}

export async function getUserOrders() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payment: true,
      address: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  })

  return orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    total: Number(order.total),
    payment: order.payment
      ? {
          ...order.payment,
          amount: Number(order.payment.amount),
        }
      : null,
  }))
}

export async function trackOrderByNumber(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payment: true,
      address: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!order) return null

  return {
    ...order,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    total: Number(order.total),
    payment: order.payment
      ? {
          ...order.payment,
          amount: Number(order.payment.amount),
        }
      : null,
  }
}
