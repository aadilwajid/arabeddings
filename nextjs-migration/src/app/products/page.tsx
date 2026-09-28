import { getProducts, getCategories } from "@/actions/products"
import { ProductCard } from "@/components/ProductCard"
import Link from "next/link"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const [products, categories] = await Promise.all([
    getProducts({
      category: searchParams.category,
      search: searchParams.search,
    }),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        All Products
      </h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600"
                >
                  All Products
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
