import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeftIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useActivity } from '../hooks/useActivities';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { useCart } from '../hooks/useCart';
import Button from '../components/ui/Button';
import fallbackimg from '../assets/candi.jpg';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { activity, loading } = useActivity(id);
  const { addQuantityByActivity } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Helper to get the correct price
  const getActivityPrice = (activity) => {
    if (!activity) return 0;
    if (activity.price_discount == null) {
      return activity.price;
    }
    if (activity.price_discount > activity.price) {
      return activity.price;
    }
    return activity.price_discount;
  };

  // ✨ Check if valid discount exists
  const hasDiscount = (activity) => {
    if (!activity) return false;
    return activity.price_discount != null && activity.price_discount < activity.price;
  };

  useEffect(() => {
    if (activity) {
      console.log('detail activity', {
        id: activity.id,
        title: activity.title,
        price: getActivityPrice(activity),
        location: `${activity.city}, ${activity.province}`,
      });
    }
  }, [activity]);

  const handleAddToCart = async () => {
    if (!activity) return;

    if (!isAuthenticated) {
      addToast('Please login to add items to cart', 'error');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      // Add to existing quantity (21 + 2 = 23)
      await addQuantityByActivity(activity.id, quantity);

      console.log('addQuantityByActivity called', {
        activityId: activity.id,
        quantity,
      });
      addToast(`Added ${quantity} item(s) to cart!`, 'success');
      setQuantity(1);
    } catch (error) {
      console.log('gagal tambah ke cart', error);
      addToast(
        error.response?.data?.message || 'Failed to add to cart',
        'error',
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const safeQuantity = Math.max(1, newQuantity);
    setQuantity(safeQuantity);
    console.log('quantity berubah:', safeQuantity);
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
          <p className="text-xl font-bold text-gray-900 mb-4">
            Activity not found
          </p>
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

  // sanitize main image, avoid bad base64
  const rawMainImage = activity.imageUrls?.[0] || '';
  const mainIsBrokenData =
    rawMainImage.startsWith('data:image/') && !rawMainImage.includes(',');
  const mainImage = mainIsBrokenData
    ? fallbackimg
    : rawMainImage || fallbackimg;

  // Get display price and discount status
  const displayPrice = getActivityPrice(activity);
  const showDiscount = hasDiscount(activity);

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
              src={mainImage}
              alt={activity.title}
              className="w-full h-96 object-cover rounded-2xl shadow-xl mb-4 hover:shadow-2xl transition-shadow"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackimg;
              }}
            />
            {activity.imageUrls?.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {activity.imageUrls.slice(1, 4).map((url, i) => {
                  const isBrokenData =
                    url.startsWith('data:image/') && !url.includes(',');
                  const thumbSrc = isBrokenData
                    ? 'https://placehold.co/200x150?text=No+Image'
                    : url || 'https://placehold.co/200x150?text=No+Image';

                  return (
                    <img
                      key={i}
                      src={thumbSrc}
                      alt={`${activity.title} ${i + 2}`}
                      className="h-24 w-full object-cover rounded-xl cursor-pointer hover:opacity-80 hover:shadow-lg transition-all hover:-translate-y-1"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://placehold.co/200x150?text=No+Image';
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {activity.title}
            </h1>

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
                  Rp {displayPrice?.toLocaleString('id-ID')}
                </span>
                {showDiscount && (
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {activity.description}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    handleQuantityChange(Math.max(1, quantity - 1))
                  }
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