import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  slug: string
  basePrice: number
  images: Array<{ url: string; alt?: string }>
  isFeatured?: boolean
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
          <Image
            src={product.images[0]?.url || "/placeholder.jpg"}
            alt={product.images[0]?.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.isFeatured && (
            <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
            Rs. {product.basePrice.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}
