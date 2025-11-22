import { Link } from 'react-router-dom';
import { ChevronRightIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { useActivities } from '../../hooks/useActivities';
import fallbackimg from '../../assets/candi.jpg';

const FeaturedActivities = () => {
  const { activities, loading } = useActivities();

  const calculateDiscount = (price, discountPrice) => {
    if (!price || !discountPrice || price === discountPrice) return null;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Activities</h2>
            <p className="text-gray-600 mt-1">Discover amazing experiences</p>
          </div>
          <Link
            to="/activities"
            className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors flex items-center gap-1 group"
          >
            Browse all
            <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-80 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {activities.slice(0, 8).map((activity) => {
              const discount = calculateDiscount(activity.price, activity.price_discount);

              return (
                <Link
                  key={activity.id}
                  to={`/activities/${activity.id}`}
                  className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={activity.imageUrls?.[0]}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackimg;
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                    {discount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                        {discount}% OFF
                      </div>
                    )}

                    {activity.rating && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-semibold text-gray-900">
                          {activity.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col p-4">
                    <div className="flex-1">
                      {(activity.city || activity.province) && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <MapPinIcon className="w-3 h-3" />
                          <span className="line-clamp-1">
                            {activity.city && activity.province
                              ? `${activity.city}, ${activity.province}`
                              : activity.city || activity.province}
                          </span>
                        </div>
                      )}

                      <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {activity.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {activity.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          Rp {activity.price_discount?.toLocaleString('id-ID')}
                        </span>
                        {activity.price_discount < activity.price && (
                          <span className="text-sm text-gray-400 line-through">
                            Rp {activity.price?.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedActivities;