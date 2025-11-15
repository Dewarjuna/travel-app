import { useState } from 'react';
import { 
  ClipboardDocumentListIcon,
  ChevronLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  CalendarIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useTransactions } from '../hooks/useTransactions.js';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';

const Transactions = () => {
  const { transactions, loading } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { addToast } = useToast();

  const getStatusConfig = (status) => {
    const configs = {
      success: {
        bg: 'bg-linear-to-r from-green-500 to-green-600',
        text: 'text-white',
        icon: CheckCircleIcon,
        label: 'Completed'
      },
      pending: {
        bg: 'bg-linear-to-r from-yellow-500 to-yellow-600',
        text: 'text-white',
        icon: ClockIcon,
        label: 'Pending'
      },
      failed: {
        bg: 'bg-linear-to-r from-red-500 to-red-600',
        text: 'text-white',
        icon: XCircleIcon,
        label: 'Failed'
      },
    };
    return configs[status] || {
      bg: 'bg-linear-to-r from-gray-500 to-gray-600',
      text: 'text-white',
      icon: ClockIcon,
      label: status
    };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-10 w-64 bg-linear-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-40 bg-white rounded-2xl animate-pulse shadow-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
            <ClipboardDocumentListIcon className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">No transactions yet</h1>
          <p className="text-gray-600 text-lg mb-8">
            Start booking amazing activities to see your orders here
          </p>
          <Button onClick={() => window.location.href = '/activities'} fullWidth>
            Browse Activities
          </Button>
        </div>
      </div>
    );
  }

  if (selectedTransaction) {
    const statusConfig = getStatusConfig(selectedTransaction.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <button
            onClick={() => setSelectedTransaction(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-all hover:-translate-x-1"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Back to Transactions
          </button>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
            <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Details</h1>
                <p className="text-gray-600">#{selectedTransaction.id}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 ${statusConfig.bg} rounded-xl shadow-lg`}>
                <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                <span className={`font-bold ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Transaction Date</p>
                  <p className="text-base font-bold text-blue-900">
                    {formatDate(selectedTransaction.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                  <CreditCardIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-700 mb-1">Payment Method</p>
                  <p className="text-base font-bold text-purple-900">
                    {selectedTransaction.payment_method?.name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBagIcon className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
              </div>
              <div className="space-y-3">
                {selectedTransaction.transaction_items?.map((item, i) => (
                  <div key={i} className="flex gap-5 p-5 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    {item.imageUrls?.[0] && (
                      <img
                        src={item.imageUrls[0]}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-xl shrink-0 shadow-sm"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 font-medium">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-blue-600">
                        Rp {(item.price_discount * item.quantity).toLocaleString('id-ID')}
                      </p>
                      {item.price > item.price_discount && (
                        <p className="text-sm text-gray-400 line-through">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t-2 border-gray-200">
              <div className="flex justify-between items-center p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl">
                <span className="text-xl font-bold text-gray-700">Total Amount</span>
                <span className="text-3xl font-black bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Rp {selectedTransaction.totalAmount?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <ClipboardDocumentListIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Transactions</h1>
            <p className="text-gray-600 mt-1">
              {transactions.length} {transactions.length === 1 ? 'order' : 'orders'} total
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {transactions.map(tx => {
            const statusConfig = getStatusConfig(tx.status);
            const StatusIcon = statusConfig.icon;

            return (
              <button
                key={tx.id}
                onClick={() => setSelectedTransaction(tx)}
                className="w-full bg-white rounded-2xl border border-gray-100 p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Transaction ID</p>
                    <p className="font-bold text-xl text-gray-900">#{tx.id}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 ${statusConfig.bg} rounded-xl shadow-lg`}>
                    <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                    <span className={`text-sm font-bold ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Date</p>
                    <p className="font-bold text-gray-900">{formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Items</p>
                    <p className="font-bold text-gray-900">{tx.transaction_items?.length || 0} items</p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Total</p>
                    <p className="font-bold text-xl text-blue-700">Rp {tx.totalAmount?.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Transactions;