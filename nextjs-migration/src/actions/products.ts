"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProducts(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}) {
  const where: any = { isActive: true }

  if (filters?.category) {
    where.category = { slug: filters.category }
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ]
  }

  if (filters?.minPrice) {
    where.basePrice = { gte: filters.minPrice }
  }

  if (filters?.maxPrice) {
    where.basePrice = { ...where.basePrice, lte: filters.maxPrice }
  }

  const orderBy: any = {}
  switch (filters?.sortBy) {
    case "price-low":
      orderBy.basePrice = "asc"
      break
    case "price-high":
      orderBy.basePrice = "desc"
      break
    case "newest":
      orderBy.createdAt = "desc"
      break
    default:
      orderBy.isFeatured = "desc"
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: {
        where: { isActive: true },
        include: {
          optionValues: {
            include: {
              optionValue: {
                include: { option: true },
              },
            },
          },
        },
      },
    },
  })

  return products.map((product) => ({
    ...product,
    basePrice: Number(product.basePrice),
    variants: product.variants.map((v) => ({
      ...v,
      price: Number(v.price),
      comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
      optionValues: v.optionValues.map((ov) => ({
        optionId: ov.optionValue.optionId,
        optionName: ov.optionValue.option.name,
        value: ov.optionValue.value,
      })),
    })),
  }))
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: {
        where: { isActive: true },
        include: {
          optionValues: {
            include: {
              optionValue: {
                include: { option: true },
              },
            },
          },
        },
      },
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true } } },
      },
    },
  })

  if (!product) return null

  return {
    ...product,
    basePrice: Number(product.basePrice),
    variants: product.variants.map((v) => ({
      ...v,
      price: Number(v.price),
      comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
      optionValues: v.optionValues.map((ov) => ({
        optionId: ov.optionValue.optionId,
        optionName: ov.optionValue.option.name,
        value: ov.optionValue.value,
      })),
    })),
    reviews: product.reviews.map((r) => ({
      ...r,
      userName: r.user.name,
    })),
  }
}

export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1 },
      variants: {
        where: { isActive: true },
        select: { price: true },
      },
    },
  })

  return products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
  }))
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  })
}
