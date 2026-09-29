"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function createCustomOrder(data: {
  fullName: string
  email: string
  phone: string
  itemType: string
  size?: string
  quantity: number
  fabric?: string
  color?: string
  deliveryAddress: string
  notes?: string
}) {
  const user = await getCurrentUser()

  const reference = `ARA-CUSTOM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`

  const customOrder = await prisma.customOrder.create({
     {
      reference,
      userId: user?.id,
      ...data,
      status: "SUBMITTED",
    },
  })

  revalidatePath("/drug-order")
  return customOrder
}

export async function getCustomOrders() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  return await prisma.customOrder.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCustomOrderByReference(reference: string) {
  return await prisma.customOrder.findUnique({
    where: { reference },
  })
}
