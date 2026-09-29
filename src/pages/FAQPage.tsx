import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Orders & Shipping
  {
    id: '1',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-5 business days for major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad) and 5-7 business days for remote areas. Express delivery is available for 1-2 days in select cities.',
    category: 'Orders & Shipping'
  },
  {
    id: '2',
    question: 'Do you offer free shipping?',
    answer: 'Yes! We offer free shipping on all orders above PKR 5,000 across Pakistan. For orders below this amount, shipping charges vary by region: Punjab (PKR 200), Sindh (PKR 250), KPK (PKR 300), Balochistan (PKR 350), and Gilgit-Baltistan/AJK (PKR 400).',
    category: 'Orders & Shipping'
  },
  {
    id: '3',
    question: 'How can I track my order?',
    answer: 'You can track your order by visiting our Track Order page and entering your order number (e.g., ARA-2024-001). You\'ll find your order number in the confirmation email. You\'ll also receive SMS and email updates at each stage of delivery.',
    category: 'Orders & Shipping'
  },
  {
    id: '4',
    question: 'Can I change or cancel my order?',
    answer: 'You can change or cancel your order within 2 hours of placing it by contacting our customer support. Once an order has been processed or shipped, it cannot be modified. Please contact us immediately if you need to make changes.',
    category: 'Orders & Shipping'
  },

  // Payments
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer: 'We accept two payment methods: Cash on Delivery (COD) and Bank Transfer. For COD, you pay when you receive your order. For bank transfers, we\'ll provide our bank details after you place your order, and we\'ll process your order once payment is verified.',
    category: 'Payments'
  },
  {
    id: '6',
    question: 'Is Cash on Delivery available everywhere?',
    answer: 'Yes, Cash on Delivery is available across all major cities and towns in Pakistan. However, for some remote areas, we may require advance payment. You\'ll be informed during checkout if COD is available for your location.',
    category: 'Payments'
  },
  {
    id: '7',
    question: 'How do I make a bank transfer?',
    answer: 'After placing your order with the "Bank Transfer" option, you\'ll receive our bank details via email. Transfer the amount to our Meezan Bank account and include your order number in the reference. Once we verify the payment, we\'ll process your order.',
    category: 'Payments'
  },

  // Products
  {
    id: '8',
    question: 'What sizes do you offer?',
    answer: 'We offer products in Single, Double, Queen, and King sizes. Please check our Size Guide on each product page for exact dimensions. Pakistani bed sizes are: Single (3\' x 6\'3"), Double (4\'6" x 6\'3"), Queen (5\' x 6\'8"), and King (6\' x 6\'8").',
    category: 'Products'
  },
  {
    id: '9',
    question: 'Are your products authentic?',
    answer: 'Yes, all our products are 100% authentic and sourced from premium manufacturers. We use genuine Egyptian cotton, French linen, bamboo lyocell, and other high-quality materials as specified in product descriptions.',
    category: 'Products'
  },
  {
    id: '10',
    question: 'Do you offer custom orders?',
    answer: 'Yes! We specialize in custom orders for hotels, resorts, and bulk purchases. You can request custom sizes, fabrics, colors, and quantities through our Custom Order page. Our team will provide a personalized quote within 24-48 hours.',
    category: 'Products'
  },
  {
    id: '11',
    question: 'How do I choose the right product for me?',
    answer: 'Consider your climate, sleeping preferences, and budget. For hot summers, we recommend bamboo or percale cotton. For luxury, try Egyptian cotton or sateen. For allergies, choose hypoallergenic pillows. Check product descriptions and reviews for guidance.',
    category: 'Products'
  },

  // Returns & Refunds
  {
    id: '12',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for unused items in their original packaging with tags attached. Custom-made products, clearance items, and products with broken hygiene seals (like pillows) are not eligible for returns.',
    category: 'Returns & Refunds'
  },
  {
    id: '13',
    question: 'How do I return a product?',
    answer: 'To return a product: 1) Contact us at returns@arabeddings.com with your order number, 2) We\'ll review and provide return instructions within 24 hours, 3) Ship the item back to our address, 4) Once received and inspected, we\'ll process your refund within 5-7 business days.',
    category: 'Returns & Refunds'
  },
  {
    id: '14',
    question: 'When will I receive my refund?',
    answer: 'For Cash on Delivery orders, refunds are processed via bank transfer within 5-7 business days. For bank transfer payments, refunds go back to the original account within 5-7 business days. You\'ll receive an email confirmation once the refund is processed.',
    category: 'Returns & Refunds'
  },
  {
    id: '15',
    question: 'What if I receive a damaged product?',
    answer: 'If your product arrives damaged or defective, contact us within 48 hours of delivery with photos of the damage and your order number. We\'ll arrange a replacement or full refund at no cost to you.',
    category: 'Returns & Refunds'
  },

  // Account
  {
    id: '16',
    question: 'Do I need to create an account?',
    answer: 'While you can browse products without an account, creating one allows you to track orders, save addresses, manage your wishlist, and view order history. It makes future purchases faster and easier.',
    category: 'Account'
  },
  {
    id: '17',
    question: 'How do I reset my password?',
    answer: 'Click on "Sign In" and then "Forgot Password". Enter your registered email address, and we\'ll send you a password reset link. The link is valid for 24 hours. If you don\'t receive the email, check your spam folder or contact support.',
    category: 'Account'
  },
  {
    id: '18',
    question: 'Can I update my account information?',
    answer: 'Yes, you can update your name, email, phone number, and addresses from your Account Dashboard. Go to "My Account" > "Addresses" to manage your saved addresses, or contact support for other changes.',
    category: 'Account'
  },

  // General
  {
    id: '19',
    question: 'Are your products eco-friendly?',
    answer: 'Yes, we\'re committed to sustainability. Our bamboo products are made using closed-loop processes, organic cotton is GOTS certified, and we use minimal, recyclable packaging. Many products are OEKO-TEX® certified for safety and sustainability.',
    category: 'General'
  },
  {
    id: '20',
    question: 'Do you have a physical store?',
    answer: 'Yes, we have a physical store at Shop #12, Block B, DHA Phase 5, Lahore. You can visit during business hours (Monday-Saturday, 9am-6pm) to see and feel our products before purchasing.',
    category: 'General'
  },
  {
    id: '21',
    question: 'How can I contact customer support?',
    answer: 'You can reach us via: Email (hello@arabeddings.com), Phone (+92 321 1234567), or through our Contact page. We respond within 24 hours on business days. For urgent matters, please call us directly.',
    category: 'General'
  },
  {
    id: '22',
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within Pakistan. We\'re working on expanding to international shipping soon. Sign up for our newsletter to be notified when international shipping becomes available.',
    category: 'General'
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Find answers to common questions about our products and services
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No questions found matching your search.</p>
          </div>
        ) : (
          filteredFAQs.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1">
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {item.question}
                  </h3>
                </div>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="text-gray-400 flex-shrink-0 ml-4" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400 flex-shrink-0 ml-4" size={20} />
                )}
              </button>
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Still Have Questions */}
      <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Still Have Questions?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Can't find the answer you're looking for? Our customer support team is here to help.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/contact"
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Contact Support
          </Link>
          <a
            href="mailto:hello@arabeddings.com"
            className="px-6 py-3 border border-amber-600 text-amber-600 dark:text-amber-400 dark:border-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors font-medium"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
