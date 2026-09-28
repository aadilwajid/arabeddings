import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(\+92|0)?3[0-9]{9}$/, "Invalid Pakistani phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^(\+92|0)?3[0-9]{9}$/, "Invalid phone number"),
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "Province is required"),
  postalCode: z.string().optional(),
})

export const checkoutSchema = z.object({
  address: addressSchema,
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]),
  bankReference: z.string().optional(),
  shippingMethodId: z.string(),
  notes: z.string().optional(),
})

export const customOrderSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^(\+92|0)?3[0-9]{9}$/, "Invalid phone number"),
  itemType: z.string().min(1, "Item type is required"),
  size: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  fabric: z.string().optional(),
  color: z.string().optional(),
  deliveryAddress: z.string().min(10, "Delivery address is required"),
  notes: z.string().optional(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().min(10, "Review must be at least 10 characters"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type CustomOrderInput = z.infer<typeof customOrderSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
