import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const STATUS_OPTIONS = [
  {
    value: 'success',
    label: 'Sukses',
    description: 'Transaksi berhasil diselesaikan',
    icon: CheckCircleIcon,
    color: 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100',
    activeColor:
      'border-green-500 bg-green-100 text-green-900 ring-2 ring-green-500',
  },
  {
    value: 'failed',
    label: 'Gagal',
    description: 'Transaksi gagal atau dibatalkan',
    icon: XCircleIcon,
    color: 'border-red-300 bg-red-50 text-red-800 hover:bg-red-100',
    activeColor: 'border-red-500 bg-red-100 text-red-900 ring-2 ring-red-500',
  },
];

// All possible statuses for display
const ALL_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: ClockIcon,
    color: 'bg-yellow-100 text-yellow-800',
  },
  success: {
    label: 'Sukses',
    icon: CheckCircleIcon,
    color: 'bg-green-100 text-green-800',
  },
  failed: {
    label: 'Gagal',
    icon: XCircleIcon,
    color: 'bg-red-100 text-red-800',
  },
};

// Spinner Component
const Spinner = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

function StatusUpdateModal({
  isOpen,
  onClose,
  transaction,
  onStatusChange,
  isLoading,
}) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [confirmStep, setConfirmStep] = useState(false);
  const modalRef = useRef(null);

  // Check if transaction can be updated (only pending can be updated)
  const canUpdate = transaction?.status === 'pending';

  // Reset when transaction changes
  useEffect(() => {
    if (transaction) {
      setSelectedStatus(null);
      setConfirmStep(false);
    }
  }, [transaction?.id]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmStep(false);
      setSelectedStatus(null);
    }
  }, [isOpen]);

  // Handle escape key and body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        if (confirmStep) {
          setConfirmStep(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, isLoading, confirmStep]);

  const handleNext = () => {
    if (selectedStatus && canUpdate) {
      setConfirmStep(true);
    }
  };

  const handleBack = () => {
    setConfirmStep(false);
  };

  const handleConfirm = () => {
    if (selectedStatus && canUpdate) {
      onStatusChange(selectedStatus);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setConfirmStep(false);
      setSelectedStatus(null);
      onClose();
    }
  };

  // Early return if not open or no transaction
  if (!isOpen || !transaction) return null;

  const currentStatusConfig =
    ALL_STATUS_CONFIG[transaction.status] || ALL_STATUS_CONFIG.pending;
  const CurrentStatusIcon = currentStatusConfig.icon;
  const newStatusOption = STATUS_OPTIONS.find(
    (s) => s.value === selectedStatus
  );
  const NewStatusIcon = newStatusOption?.icon;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? handleClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2
              id="status-modal-title"
              className="text-lg font-bold text-gray-900"
            >
              {confirmStep ? 'Konfirmasi Perubahan' : 'Update Status'}
            </h2>
            <p className="text-sm text-gray-500">
              {transaction.invoiceId || '-'}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Tutup modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Show message if status is not pending */}
          {!canUpdate ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <LockClosedIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Status Tidak Dapat Diubah
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Transaksi dengan status{' '}
                <span className="font-medium">{currentStatusConfig.label}</span>{' '}
                tidak dapat diubah lagi.
              </p>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${currentStatusConfig.color}`}
              >
                <CurrentStatusIcon className="h-4 w-4" />
                {currentStatusConfig.label}
              </div>
            </div>
          ) : confirmStep ? (
            // Confirmation Step
            <div className="space-y-6">
              {/* Warning Icon */}
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                  <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                </div>
              </div>

              {/* Confirmation Text */}
              <div className="text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Yakin ingin mengubah status?
                </h3>
                <p className="text-sm text-gray-500">
                  Status transaksi akan diubah dan{' '}
                  <span className="font-medium text-red-600">
                    tidak dapat dikembalikan
                  </span>
                  .
                </p>
              </div>

              {/* Status Change Info */}
              <div className="space-y-4 rounded-xl bg-gray-50 p-4">
                {/* Transaction Info */}
                <div className="border-b border-gray-200 pb-3 text-center">
                  <p className="text-xs text-gray-500">Transaksi</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {transaction.invoiceId}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(transaction.totalAmount)}
                  </p>
                </div>

                {/* Status Change Visualization */}
                <div className="flex items-center justify-center gap-3">
                  {/* From Status */}
                  <div className="text-center">
                    <p className="mb-1 text-xs text-gray-500">Dari</p>
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${currentStatusConfig.color}`}
                    >
                      <CurrentStatusIcon className="h-3.5 w-3.5" />
                      {currentStatusConfig.label}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>

                  {/* To Status */}
                  <div className="text-center">
                    <p className="mb-1 text-xs text-gray-500">Ke</p>
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                        newStatusOption?.activeColor ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {NewStatusIcon && <NewStatusIcon className="h-3.5 w-3.5" />}
                      {newStatusOption?.label || selectedStatus}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Status Selection Step
            <div className="space-y-4">
              {/* Current Status */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="mb-2 text-xs text-gray-500">Status Saat Ini</p>
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${currentStatusConfig.color}`}
                >
                  <CurrentStatusIcon className="h-4 w-4" />
                  {currentStatusConfig.label}
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Pilih status baru untuk transaksi ini:
              </p>

              {/* Status Options - Only success and failed */}
              <div className="space-y-3">
                {STATUS_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedStatus === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => setSelectedStatus(option.value)}
                      disabled={isLoading}
                      className={`
                        relative flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all
                        ${isSelected ? option.activeColor : option.color}
                        ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      `}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isSelected ? 'bg-white/50' : 'bg-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="text-xs opacity-75">{option.description}</p>
                      </div>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          {!canUpdate ? (
            // Only show close button if status cannot be updated
            <button
              onClick={handleClose}
              className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Tutup
            </button>
          ) : confirmStep ? (
            <>
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Kembali
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Konfirmasi</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleNext}
                disabled={isLoading || !selectedStatus}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Lanjutkan
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default StatusUpdateModal;