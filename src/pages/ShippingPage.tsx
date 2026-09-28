import React from 'react';
import { Truck, Clock, MapPin, Package, CheckCircle } from 'lucide-react';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';

export default function ShippingPage() {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Shipping Information</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Fast, reliable delivery across Pakistan
        </p>
      </div>

      {/* Free Shipping Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Truck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Free Shipping!</h2>
            <p className="text-amber-50">
              On all orders above {formatPKR(settings.freeShippingThreshold)} across Pakistan
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Times */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock className="text-amber-600 dark:text-amber-400" />
          Delivery Times
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Standard Delivery</h3>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">3-5 Days</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              For major cities: Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad
            </p>
          </div>
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Remote Areas</h3>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">5-7 Days</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              For smaller cities and rural areas across Pakistan
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Rates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <MapPin className="text-amber-600 dark:text-amber-400" />
          Shipping Rates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Region</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Standard Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Free Shipping Above</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 text-gray-900 dark:text-white">Punjab</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(200)}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(settings.freeShippingThreshold)}</td>
              </tr>
              <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 text-gray-900 dark:text-white">Sindh</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(250)}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(settings.freeShippingThreshold)}</td>
              </tr>
              <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 text-gray-900 dark:text-white">Khyber Pakhtunkhwa</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(300)}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(settings.freeShippingThreshold)}</td>
              </tr>
              <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 text-gray-900 dark:text-white">Balochistan</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(350)}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(settings.freeShippingThreshold)}</td>
              </tr>
              <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 text-gray-900 dark:text-white">Gilgit-Baltistan & AJK</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(400)}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatPKR(settings.freeShippingThreshold)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Processing */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Package className="text-amber-600 dark:text-amber-400" />
          Order Processing
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Order Placed</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your order is received and confirmed
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Processing (1-2 days)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We prepare and pack your order with care
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Shipped</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You'll receive a tracking number via SMS/email
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Delivered</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your order arrives at your doorstep
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-300 mb-4 flex items-center gap-2">
          <CheckCircle className="text-amber-600 dark:text-amber-400" />
          Important Notes
        </h2>
        <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
            <span>All orders are processed within 1-2 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
            <span>Delivery times may vary during peak seasons and holidays</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
            <span>Cash on Delivery (COD) is available for all orders</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
            <span>Bank transfer orders are processed after payment verification</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
            <span>You'll receive SMS/email updates at each stage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
            <span>Track your order anytime using your order number</span>
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Have questions about shipping?
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
