import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  TrashIcon, 
  MinusIcon, 
  PlusIcon,
  CreditCardIcon 
} from '@heroicons/react/24/outline';
import { cartService } from '../api/services/cartService';
import { paymentMethodService } from '../api/services/paymentMethod';
import { transactionService } from '../api/services/transactionService';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cartRes, payRes] = await Promise.all([
        cartService.list(),
        paymentMethodService.list(),
      ]);
      setCartItems(cartRes.data || []);
      setPaymentMethods(payRes.data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      addToast('Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const total = cartItems.reduce((sum, item) => {
    const price = item.activity?.price_discount || item.price_discount || 0;
    const qty = item.quantity || 0;
    return sum + (price * qty);
  }, 0);

  const handleUpdateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;
    try {
      await cartService.update(cartId, newQty);
      await fetchData();
      addToast('Quantity updated', 'success');
    } catch (error) {
      console.error('Error updating quantity:', error);
      addToast('Failed to update quantity', 'error');
    }
  };

  const handleRemove = async (cartId) => {
    try {
      await cartService.remove(cartId);
      await fetchData();
      addToast('Item removed from cart', 'success');
    } catch (error) {
      console.error('Error removing item:', error);
      addToast('Failed to remove item', 'error');
    }
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      addToast('Please select a payment method', 'error');
      return;
    }

    if (cartItems.length === 0) {
      addToast('Cart is empty', 'error');
      return;
    }

    setCheckingOut(true);
    try {
      const cartIds = cartItems.map(item => item.id);
      await transactionService.create(cartIds, selectedPaymentMethod);
      addToast('Checkout successful!', 'success');
      navigate('/transactions');
    } catch (error) {
      console.error('Checkout error:', error);
      addToast(error.response?.data?.message || 'Checkout failed', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-10 w-64 bg-linear-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 bg-white rounded-2xl animate-pulse shadow-md" />
              ))}
            </div>
            <div className="h-96 bg-white rounded-2xl animate-pulse shadow-md" />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
            <ShoppingCartIcon className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-600 text-lg mb-8">
            Start exploring amazing activities and add them to your cart
          </p>
          <Button onClick={() => navigate('/activities')} fullWidth>
            Browse Activities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <ShoppingCartIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map(item => {
                const activity = item.activity || item;
                const imageUrl = activity.imageUrls?.[0] || activity.imageUrl || '';
                const title = activity.title || 'Unknown Activity';
                const priceDiscount = activity.price_discount || 0;
                const quantity = item.quantity || 1;

                return (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-2xl border border-gray-100 p-6 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex gap-5">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-28 h-28 object-cover rounded-xl shrink-0 shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                          {title}
                        </h3>
                        <p className="text-blue-600 font-bold text-xl mb-4">
                          Rp {priceDiscount.toLocaleString('id-ID')}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                              className="w-10 h-10 rounded-xl bg-white border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={quantity <= 1}
                            >
                              <MinusIcon className="w-5 h-5" />
                            </button>
                            <span className="w-14 text-center font-bold text-xl text-gray-900">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                              className="w-10 h-10 rounded-xl bg-white border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                            >
                              <PlusIcon className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1 font-medium">Subtotal</p>
                            <p className="font-bold text-2xl text-gray-900">
                              Rp {(priceDiscount * quantity).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="shrink-0 p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all hover:shadow-md"
                        title="Remove from cart"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>Tax</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span className="bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <CreditCardIcon className="w-5 h-5 inline mr-2" />
                  Payment Method
                </label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                >
                  <option value="">Select payment method...</option>
                  {paymentMethods.map(pm => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button onClick={handleCheckout} disabled={checkingOut || !selectedPaymentMethod} loading={checkingOut} fullWidth>
                Proceed to Checkout
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing your purchase you agree to our terms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;