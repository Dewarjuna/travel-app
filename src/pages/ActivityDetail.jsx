import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, MapPinIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useActivity } from '../hooks/useActivities';
import { cartService } from '../api/services/cartService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const { activity, loading } = useActivity(id);
  
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (activity) {
      console.log('detail activity', {
        id: activity.id,
        title: activity.title,
        price: activity.price_discount,
        location: `${activity.city}, ${activity.province}`
      });
    }
  }, [activity]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      addToast('Please login to add items to cart', 'error');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await cartService.add(activity.id, quantity);
      
      if (quantity > 1) {
        const cartResponse = await cartService.list();
        const cartItems = cartResponse.data || [];
        const addedItem = cartItems.find(item => 
          (item.activityId || item.activity?.id) === activity.id
        );
        
        if (addedItem) {
          await cartService.update(addedItem.id, quantity);
        }
      }
      
      console.log('berhasil tambah ke cart', { activityId: activity.id, quantity });
      addToast(`Added ${quantity} item(s) to cart!`, 'success');
      setQuantity(1);
    } catch (error) {
      console.log('gagal tambah ke cart', error);
      addToast(error.response?.data?.message || 'Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    console.log('quantity berubah:', newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-linear-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-linear-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
              <div className="h-20 bg-linear-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
              <div className="h-12 bg-linear-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 mb-4">Activity not found</p>
          <button
            onClick={() => navigate('/activities')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate('/activities')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-all hover:-translate-x-1"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Activities
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={activity.imageUrls?.[0]}
              alt={activity.title}
              className="w-full h-96 object-cover rounded-2xl shadow-xl mb-4 hover:shadow-2xl transition-shadow"
            />
            {activity.imageUrls?.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {activity.imageUrls.slice(1, 4).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${activity.title} ${i + 2}`}
                    className="h-24 w-full object-cover rounded-xl cursor-pointer hover:opacity-80 hover:shadow-lg transition-all hover:-translate-y-1"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{activity.title}</h1>

            {(activity.city || activity.province) && (
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPinIcon className="w-5 h-5" />
                <span>
                  {activity.city && activity.province
                    ? `${activity.city}, ${activity.province}`
                    : activity.city || activity.province}
                </span>
              </div>
            )}

            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Rp {activity.price_discount?.toLocaleString('id-ID')}
                </span>
                {activity.price_discount < activity.price && (
                  <span className="text-xl text-gray-400 line-through">
                    Rp {activity.price?.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
              {activity.rating && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="text-lg">⭐</span>
                  <span className="font-semibold">{activity.rating}</span>
                  <span className="text-gray-500 text-sm">
                    ({activity.total_reviews || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{activity.description}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-white border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  <MinusIcon className="w-5 h-5" />
                </button>
                <span className="text-3xl font-bold w-16 text-center text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-12 h-12 rounded-xl bg-white border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Button onClick={handleAddToCart} loading={addingToCart} fullWidth>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;