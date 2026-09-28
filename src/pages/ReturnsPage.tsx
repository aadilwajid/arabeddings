import React from 'react';
import { RotateCcw, CheckCircle, AlertCircle, Clock, Package } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Returns & Refunds</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your satisfaction is our priority
        </p>
      </div>

      {/* 30-Day Guarantee */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <RotateCcw size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">30-Day Return Policy</h2>
            <p className="text-green-50">
              Not satisfied? Return within 30 days for a full refund
            </p>
          </div>
        </div>
      </div>

      {/* Eligibility */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <CheckCircle className="text-green-600 dark:text-green-400" />
          Eligibility Criteria
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Product must be unused</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Items should be in original condition with tags attached
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Original packaging</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please return items in their original packaging
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Within 30 days</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Return request must be made within 30 days of delivery
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Proof of purchase</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order number or receipt required
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Returnable Items */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-red-900 dark:text-red-300 mb-4 flex items-center gap-2">
          <AlertCircle className="text-red-600 dark:text-red-400" />
          Non-Returnable Items
        </h2>
        <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
          <li className="flex items-start gap-2">
            <span className="text-red-600 dark:text-red-400 mt-1">•</span>
            <span>Custom-made or personalized products</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 dark:text-red-400 mt-1">•</span>
            <span>Items marked as "Final Sale" or "Clearance"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 dark:text-red-400 mt-1">•</span>
            <span>Products with hygiene seals broken (pillows, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 dark:text-red-400 mt-1">•</span>
            <span>Items damaged due to misuse or improper care</span>
          </li>
        </ul>
      </div>

      {/* Return Process */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Package className="text-amber-600 dark:text-amber-400" />
          How to Return
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 dark:text-amber-400 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Contact Us</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email us at returns@arabeddings.com or call +92 321 1234567 with your order number and reason for return
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 dark:text-amber-400 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Get Approval</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We'll review your request and provide return instructions within 24 hours
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 dark:text-amber-400 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Ship Back</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pack the item securely and ship to the provided address. Keep the tracking number
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 dark:text-amber-400 font-bold">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Get Refund</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Once we receive and inspect the item, we'll process your refund within 5-7 business days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock className="text-amber-600 dark:text-amber-400" />
          Refund Timeline
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Payment Method</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Refund Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4 text-gray-900 dark:text-white">Cash on Delivery</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">5-7 business days via bank transfer</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4 text-gray-900 dark:text-white">Bank Transfer</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">5-7 business days to original account</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Damaged/Defective */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-300 mb-4">
          Received Damaged or Defective Product?
        </h2>
        <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
          If your product arrived damaged or defective, please contact us immediately within 48 hours of delivery. We'll arrange a replacement or full refund at no cost to you.
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Please provide photos of the damage along with your order number when contacting us.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Need to initiate a return?
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Contact Support
          </a>
          <a
            href="/track-order"
            className="inline-flex items-center gap-2 px-6 py-3 border border-amber-600 text-amber-600 dark:text-amber-400 dark:border-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors font-medium"
          >
            Track Your Order
          </a>
        </div>
      </div>
    </div>
  );
}
