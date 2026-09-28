import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, DollarSign, ArrowLeft } from 'lucide-react';
import { useStore } from '../store';

export default function DrugOrderStatusPage() {
  const { reference } = useParams<{ reference: string }>();
  const { drugOrders } = useStore();
  const order = drugOrders.find(o => o.reference === reference);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
        <p className="mt-2 text-gray-600">We couldn't find a custom order with that reference.</p>
        <Link to="/drug-order" className="mt-4 text-indigo-600 hover:underline">← Submit a new request</Link>
      </div>
    );
  }

  const statusSteps = ['SUBMITTED', 'UNDER_REVIEW', 'QUOTED', 'APPROVED', 'CONVERTED'];
  const currentStepIndex = statusSteps.indexOf(order.status);
  const isRejected = order.status === 'REJECTED';
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/drug-order" className="flex items-center text-indigo-600 hover:underline mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Custom Orders
      </Link>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Custom Order Status</h1>
            <p className="text-gray-500 font-mono mt-1">{order.reference}</p>
          </div>
          <span className={`px-4 py-2 text-sm font-medium rounded-full ${
            isRejected || isCancelled ? 'bg-red-100 text-red-700' :
            order.status === 'CONVERTED' ? 'bg-green-100 text-green-700' :
            order.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
            order.status === 'QUOTED' ? 'bg-purple-100 text-purple-700' :
            'bg-blue-100 text-blue-700'
          }`}>{order.status.replace('_', ' ')}</span>
        </div>

        {/* Status Timeline */}
        {!isRejected && !isCancelled && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= currentStepIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {i <= currentStepIndex ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 text-center">{step.replace('_', ' ')}</span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-indigo-400' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {isRejected && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <XCircle className="text-red-500" size={20} />
              <p className="font-medium text-red-700">This order has been rejected.</p>
            </div>
            {order.adminNotes && <p className="text-sm text-red-600 mt-2">{order.adminNotes}</p>}
          </div>
        )}

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">Item Type</p>
            <p className="font-medium text-gray-900">{order.itemType}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">Quantity</p>
            <p className="font-medium text-gray-900">{order.quantity}</p>
          </div>
          {order.size && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Size</p>
              <p className="font-medium text-gray-900">{order.size}</p>
            </div>
          )}
          {order.fabric && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Fabric</p>
              <p className="font-medium text-gray-900">{order.fabric}</p>
            </div>
          )}
          {order.color && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Color</p>
              <p className="font-medium text-gray-900">{order.color}</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">Submitted</p>
            <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {order.quotedPrice && (
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-purple-600" size={20} />
              <div>
                <p className="font-medium text-purple-900">Quoted Price: ${order.quotedPrice.toFixed(2)}</p>
                <p className="text-sm text-purple-700">Our team has reviewed your request and provided this quote.</p>
              </div>
            </div>
          </div>
        )}

        {order.adminNotes && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600"><strong>Admin Note:</strong> {order.adminNotes}</p>
          </div>
        )}

        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Delivery Address</p>
          <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
        </div>

        {order.notes && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">Your Notes</p>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
