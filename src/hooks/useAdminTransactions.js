import { useState, useCallback, useEffect } from 'react';
import { transactionService } from '../api/services/transactionService';

export function useAdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all transactions (admin)
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.all();
      const sorted = Array.isArray(data)
        ? [...data].sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          )
        : [];
      setTransactions(sorted);
      console.log('All transactions loaded:', sorted.length);
      return sorted;
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update transaction status
  const updateStatus = useCallback(async (id, status) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await transactionService.updateStatus(id, status);
      // Update local state
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
      console.log('Status updated:', id, status);
      return res;
    } catch (err) {
      console.error('Failed to update status:', err);
      const message = err.response?.data?.errors || err.response?.data?.message || 'Failed to update status';
      setError(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto fetch on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    actionLoading,
    error,
    refresh: fetchTransactions,
    updateStatus,
    clearError,
  };
}

export default useAdminTransactions;