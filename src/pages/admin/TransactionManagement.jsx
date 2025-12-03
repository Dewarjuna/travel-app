import { useState, useMemo, useCallback } from 'react';
import { useAdminTransactions } from '../../hooks/useAdminTransactions';
import { useModal } from '../../hooks/useModal';
import AdminTable from '../../components/layout/AdminTable';
import Button from '../../components/ui/Button';
import TransactionDetailModal from './components/TransactionDetailModal';
import StatusUpdateModal from './components/StatusUpdateModal';
import { createTransactionColumns } from './components/transactionColumns';

const SEARCH_FIELDS = ['invoiceId', 'id', 'payment_method.name'];

const TransactionManagement = () => {
  // Data fetching
  const {
    transactions,
    loading,
    error,
    actionLoading,
    refresh,
    updateStatus,
    clearError,
  } = useAdminTransactions();

  // UI State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal controls
  const detailModal = useModal();
  const statusModal = useModal();

  // Handle status change
  const handleStatusChange = useCallback(
    async (newStatus) => {
      if (!statusModal.data) return;
      try {
        await updateStatus(statusModal.data.id, newStatus);
        statusModal.close();
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    },
    [statusModal, updateStatus]
  );

  // Table columns - memoized with dependencies
  const columns = useMemo(
    () =>
      createTransactionColumns({
        onDetail: detailModal.open,
        onUpdateStatus: statusModal.open,
      }),
    [detailModal.open, statusModal.open]
  );

  // Stats calculations
  const stats = useMemo(() => {
    if (!transactions?.length) {
      return { total: 0, pending: 0, success: 0, failed: 0, totalRevenue: 0 };
    }

    return {
      total: transactions.length,
      pending: transactions.filter((t) => t.status === 'pending').length,
      success: transactions.filter((t) => t.status === 'success').length,
      failed: transactions.filter((t) => t.status === 'failed').length,
      totalRevenue: transactions
        .filter((t) => t.status === 'success')
        .reduce((sum, t) => sum + (t.totalAmount || 0), 0),
    };
  }, [transactions]);

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            Failed to load transactions
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {error || 'Something went wrong. Please try again.'}
          </p>
        </div>
        <Button onClick={() => { clearError(); refresh(); }}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Transaction Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and monitor all transactions in the system
          </p>
        </div>
        <Button
          variant="secondary"
          size="lg"
          onClick={refresh}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <svg
            className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="text-xs font-medium uppercase text-gray-500">
            Total Transaksi
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <p className="text-xs font-medium uppercase text-gray-500">Pending</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <p className="text-xs font-medium uppercase text-gray-500">Sukses</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-green-600">{stats.success}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <p className="text-xs font-medium uppercase text-gray-500">Gagal</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-red-600">{stats.failed}</p>
        </div>
        <div className="col-span-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:col-span-4 lg:col-span-1">
          <p className="text-xs font-medium uppercase text-gray-500">
            Total Revenue
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {stats.totalRevenue
              ? `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`
              : 'Rp 0'}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <AdminTable
        title="All Transactions"
        data={transactions || []}
        columns={columns}
        searchFields={SEARCH_FIELDS}
        searchValue={search}
        onSearchChange={setSearch}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
        emptyMessage="No transactions found."
        searchPlaceholder="Search by invoice ID or payment method..."
        onRowClick={detailModal.open}
      />

      {/* Detail Modal */}
      <TransactionDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        transaction={detailModal.data}
      />

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={statusModal.isOpen}
        onClose={statusModal.close}
        transaction={statusModal.data}
        onStatusChange={handleStatusChange}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default TransactionManagement;