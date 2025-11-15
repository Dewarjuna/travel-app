import { useState, useCallback, useEffect } from 'react';
import { transactionService } from '../api/services/transactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

const fetchTransactions = useCallback(async function () {
    setLoading(true);
    try {
      const data = await transactionService.myList();
      const sorted = Array.isArray(data)
        ? [...data].sort(//ngelist dari yang terbaru
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          )
        : [];

      setTransactions(sorted);
      console.log('semua transaksi', sorted.length);
    } catch (err) {
      console.log('gagal load transaksi', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = useCallback(async function(cartIds, paymentMethodId) {
    setCreating(true);
    try {
      const res = await transactionService.create(cartIds, paymentMethodId);
      console.log('checkout berhasil', res);
      await fetchTransactions();
      return res;
    } catch (error) {
      console.log('checkout gagal', error);
      throw error;
    } finally {
      setCreating(false);
    }
  }, [fetchTransactions]);

  return { transactions, loading, refresh: fetchTransactions, createTransaction, creating };
}