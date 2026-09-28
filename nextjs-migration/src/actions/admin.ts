"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function getAdminStats() {
  await requireAdmin()

  const [totalOrders, pendingOrders, totalRevenue, totalProducts, pendingPayments] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.product.count(),
    prisma.payment.count({ where: { status: "AWAITING_VERIFICATION" } }),
  ])

  return {
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total ? Number(totalRevenue._sum.total) : 0,
    totalProducts,
    pendingPayments,
  }
}

export async function getAllOrders() {
  await requireAdmin()

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
      payment: true,
      address: true,
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

export async function updateOrderStatus(orderId: string, status: string, note?: string) {
  await requireAdmin()

  const order = await prisma.order.update({
    where: { id: orderId },
     {
      status: status as any,
      statusHistory: {
        create: {
          status: status as any,
          note,
        },
      },
    },
  })

  revalidatePath("/admin/orders")
  return order
}

export async function verifyPayment(orderId: string) {
  await requireAdmin()

  const payment = await prisma.payment.update({
    where: { orderId },
     {
      status: "VERIFIED",
      verifiedAt: new Date(),
    },
  })

  await prisma.order.update({
    where: { id: orderId },
     {
      status: "CONFIRMED",
      statusHistory: {
        create: {
          status: "CONFIRMED",
          note: "Payment verified",
        },
      },
    },
  })

  revalidatePath("/admin/payments")
  return payment
}

export async function getAllCustomOrders() {
  await requireAdmin()

  return await prisma.customOrder.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function updateCustomOrder(
  orderId: string,
   {
    status?: string
    quotedPrice?: number
    adminNotes?: string
  }
) {
  await requireAdmin()

  const order = await prisma.customOrder.update({
    where: { id: orderId },
     {
      ...(data.status && { status: data.status as any }),
      ...(data.quotedPrice !== undefined && { quotedPrice: data.quotedPrice }),
      ...(data.adminNotes !== undefined && { adminNotes: data.adminNotes }),
    },
  })

  revalidatePath("/admin/custom-orders")
  return order
}
