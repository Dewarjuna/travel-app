import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  XMarkIcon,
  ClockIcon,
  PhotoIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';


// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);
};


// Format date - with error handling
const formatDate = (dateString) => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Invalid date:', dateString);
    return '-';
  }
};


// Status configuration
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon,
  },
  success: {
    label: 'Sukses',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
  },
  failed: {
    label: 'Gagal',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon,
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'bg-gray-100 text-gray-800',
    icon: XCircleIcon,
  },
};


// Info Row Component
const InfoRow = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
      <Icon className="h-4 w-4 text-gray-500" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="wrap-break-word text-sm font-medium text-gray-900">
        {value || '-'}
      </p>
    </div>
  </div>
);


function TransactionDetailModal({ isOpen, onClose, transaction }) {
  const modalRef = useRef(null);

  // Handle escape key and body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Early return if not open or no transaction
  if (!isOpen || !transaction) return null;

  const items = transaction.transaction_items || [];
  const paymentMethod = transaction.payment_method;
  const statusConfig = STATUS_CONFIG[transaction.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  // Calculate subtotal using base price only (matching backend logic)
  const subtotal = items.reduce((sum, item) => {
    const basePrice = item.price || 0;
    const quantity = item.quantity || 1;
    return sum + (basePrice * quantity);
  }, 0);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2
              id="detail-modal-title"
              className="text-lg font-bold text-gray-900"
            >
              Detail Transaksi
            </h2>
            <p className="text-sm text-gray-500">
              {transaction.invoiceId || '-'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Tutup modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Status & Date Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${statusConfig.color}`}
            >
              <StatusIcon className="h-4 w-4" />
              {statusConfig.label}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4" />
              {formatDate(transaction.orderDate)}
            </div>
          </div>

          {/* Transaction Info */}
          <div className="space-y-4 rounded-xl bg-gray-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <DocumentTextIcon className="h-4 w-4" />
              Informasi Transaksi
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow
                icon={DocumentTextIcon}
                label="Invoice ID"
                value={transaction.invoiceId}
              />
              <InfoRow
                icon={ClockIcon}
                label="Tanggal Order"
                value={formatDate(transaction.orderDate)}
              />
              <InfoRow
                icon={ClockIcon}
                label="Tanggal Expired"
                value={formatDate(transaction.expiredDate)}
              />
              <InfoRow
                icon={DocumentTextIcon}
                label="Transaction ID"
                value={
                  <span className="break-all font-mono text-xs">
                    {transaction.id}
                  </span>
                }
              />
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="space-y-4 rounded-xl bg-gray-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <CreditCardIcon className="h-4 w-4" />
              Metode Pembayaran
            </h3>

            {paymentMethod ? (
              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-3">
                {/* Payment Method Image */}
                <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-2">
                  {paymentMethod.imageUrl ? (
                    <img
                      src={paymentMethod.imageUrl}
                      alt={paymentMethod.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <BanknotesIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                {/* Payment Method Details */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {paymentMethod.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {paymentMethod.virtual_account_name}
                  </p>
                  <p className="mt-1 font-mono text-sm text-blue-600">
                    {paymentMethod.virtual_account_number}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Tidak ada data pembayaran</p>
            )}

            {/* Payment Proof */}
            {transaction.proofPaymentUrl && (
              <div className="border-t border-gray-200 pt-3">
                <p className="mb-2 text-xs text-gray-500">Bukti Pembayaran</p>
                <a
                  href={transaction.proofPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <PhotoIcon className="h-4 w-4" />
                  Lihat Bukti Pembayaran
                </a>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-4 rounded-xl bg-gray-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <ShoppingBagIcon className="h-4 w-4" />
              Item Pesanan ({items.length})
            </h3>

            <div className="space-y-3">
              {items.length > 0 ? (
                items.map((item, index) => {
                  const price = item.price || 0;
                  const quantity = item.quantity || 1;
                  const itemTotal = price * quantity;

                  return (
                    <div
                      key={item.id || index}
                      className="flex gap-4 rounded-lg border border-gray-200 bg-white p-3"
                    >
                      {/* Product Image */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {item.imageUrls && item.imageUrls.length > 0 ? (
                          <img
                            src={item.imageUrls[0]}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                          {item.title || 'Product'}
                        </p>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {quantity} x {formatCurrency(price)}
                          </span>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(itemTotal)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <ShoppingBagIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-sm text-gray-500">Tidak ada item</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3 rounded-xl bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Ringkasan Pesanan
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal ({items.length} item)
                </span>
                <span className="text-gray-900">{formatCurrency(subtotal)}</span>
              </div>

              <div className="mt-3 border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(transaction.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


export default TransactionDetailModal;