import { useState, useCallback, useEffect } from 'react';
import { paymentMethodService } from '../api/services/paymentMethod';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPaymentMethods = useCallback(async () => {
    setLoading(true);
    try {
      const paymentData = await paymentMethodService.list();
      setPaymentMethods(paymentData);
    } catch (err) {
      console.log('gagal load payment methods', err);
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);
  return {paymentMethods,loading,refresh: fetchPaymentMethods,
  };
}