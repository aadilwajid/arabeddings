import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: January 2024</p>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to ARA BEDDINGS. These terms and conditions outline the rules and regulations for the use of our website and services.
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use ARA BEDDINGS if you do not agree to all of the terms and conditions stated on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. License</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Unless otherwise stated, ARA BEDDINGS and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this from ARA BEDDINGS for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">You must not:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Republish material from ARA BEDDINGS</li>
              <li>Sell, rent or sub-license material from ARA BEDDINGS</li>
              <li>Reproduce, duplicate or copy material from ARA BEDDINGS</li>
              <li>Redistribute content from ARA BEDDINGS</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Products and Pricing</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All prices are listed in Pakistani Rupees (PKR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices at any time without prior notice.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              Product descriptions, images, and specifications are provided for informational purposes only. While we strive for accuracy, we do not warrant that product descriptions or other content are accurate, complete, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Orders and Payment</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We offer two payment methods: Cash on Delivery (COD) and Bank Transfer. For bank transfers, orders will be processed only after payment verification.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              We reserve the right to refuse or cancel any order for reasons including but not limited to: product unavailability, errors in product or pricing information, or suspicion of fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Shipping and Delivery</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Shipping charges and delivery times vary based on your location within Pakistan. Free shipping is available on orders above PKR 5,000. Delivery times are estimates and not guaranteed.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              Risk of loss and title for items pass to you upon delivery of the items to the carrier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Returns and Refunds</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We offer a 30-day return policy for unused items in their original packaging. Custom-made products and items marked as "Final Sale" are not eligible for returns.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              Refunds will be processed within 5-7 business days after we receive and inspect the returned item.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In no event shall ARA BEDDINGS, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-none text-gray-700 dark:text-gray-300 space-y-2 ml-4 mt-3">
              <li>Email: hello@arabeddings.com</li>
              <li>Phone: +92 321 1234567</li>
              <li>Address: Shop #12, Block B, DHA Phase 5, Lahore, Pakistan</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
