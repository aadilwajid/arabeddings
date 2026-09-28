import { requireAdmin } from "@/lib/session"
import { getAdminStats, getAllOrders } from "@/actions/admin"
import Link from "next/link"

export default async function AdminDashboard() {
  await requireAdmin()

  const [stats, orders] = await Promise.all([
    getAdminStats(),
    getAllOrders(),
  ])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Rs. {stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Orders</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalOrders}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.pendingOrders}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalProducts}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-b dark:border-gray-700">
                    <td className="py-3">{order.orderNumber}</td>
                    <td className="py-3">{order.address?.fullName}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      Rs. {Number(order.total).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
