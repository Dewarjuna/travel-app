import {
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
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
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
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
    color: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
    icon: ClockIcon,
  },
  success: {
    label: 'Sukses',
    color: 'bg-green-100 text-green-800 ring-green-600/20',
    icon: CheckCircleIcon,
  },
  failed: {
    label: 'Gagal',
    color: 'bg-red-100 text-red-800 ring-red-600/20',
    icon: XCircleIcon,
  },
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.color}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};

// Get first item title for display
const getFirstItemTitle = (row) => {
  const items = row?.transaction_items || [];
  if (items.length === 0) return '-';
  const firstItem = items[0];
  const title = firstItem?.title || 'Product';
  const truncatedTitle = title.length > 30 ? title.slice(0, 30) + '...' : title;

  if (items.length > 1) {
    return `${truncatedTitle} +${items.length - 1} lainnya`;
  }
  return title.length > 40 ? title.slice(0, 40) + '...' : title;
};

export const createTransactionColumns = ({ onDetail, onUpdateStatus }) => [
  {
    key: 'invoiceId',
    header: 'Invoice',
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">{row.invoiceId || '-'}</p>
        <p
          className="truncate text-xs text-gray-500"
          style={{ maxWidth: '150px' }}
          title={row.id || ''}
        >
          {row.id || '-'}
        </p>
      </div>
    ),
  },
  {
    key: 'items',
    header: 'Item',
    render: (row) => (
      <div>
        <p className="text-sm text-gray-900">{getFirstItemTitle(row)}</p>
        <p className="text-xs text-gray-500">
          {row.transaction_items?.length || 0} item
        </p>
      </div>
    ),
  },
  {
    key: 'payment_method',
    header: 'Pembayaran',
    render: (row) => {
      const paymentMethod = row.payment_method;
      const name = paymentMethod?.name || '-';
      const imageUrl = paymentMethod?.imageUrl || null;

      return (
        <div className="flex items-center gap-2">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="h-6 w-auto object-contain"
            />
          )}
          <span className="text-sm text-gray-900">{name}</span>
        </div>
      );
    },
  },
  {
    key: 'totalAmount',
    header: 'Total',
    render: (row) => (
      <p className="font-semibold text-gray-900">
        {formatCurrency(row.totalAmount)}
      </p>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status || 'pending'} />,
  },
  {
    key: 'orderDate',
    header: 'Tanggal',
    render: (row) => (
      <p className="text-sm text-gray-600">{formatDate(row.orderDate)}</p>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => (
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetail?.(row);
          }}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
          title="Lihat Detail"
        >
          <EyeIcon className="h-4 w-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus?.(row);
          }}
          disabled={row.status !== 'pending'}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          title={
            row.status === 'pending' ? 'Update Status' : 'Status sudah final'
          }
        >
          <CheckCircleIcon className="h-4 w-4" />
        </button>
      </div>
    ),
  },
];