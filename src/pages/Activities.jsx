import { useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { useActivities } from '../hooks/useActivities';
import { useCategories } from '../hooks/useCategories';
import fallbackimg from '../assets/candi.jpg';

const Activities = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';

  const { activities: allActivities, loading: activitiesLoading } = useActivities(categoryId);
  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    console.log('semua activities', {
      totalActivities: allActivities.length,
      activitiesLoading,
      categoryId: categoryId || 'All Categories',
      searchQuery: searchQuery || 'No search query'
    });
  }, [allActivities, activitiesLoading, categoryId, searchQuery]);

  useEffect(() => {
    console.log('semua categories', {
      totalCategories: categories.length,
      categoriesLoading
    });
  }, [categories, categoriesLoading]);

  const filteredActivities = useMemo(() => {
    if (!searchQuery) {
      console.log('activities no filter');
      return allActivities;
    }
    
    const filtered = allActivities.filter(activity =>
      activity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.province?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    console.log('semua activities difilter', {
      searchQuery,
      originalCount: allActivities.length,
      filteredCount: filtered.length,
      filteredActivities: filtered.map(a => a.title)
    });
    
    return filtered;
  }, [searchQuery, allActivities]);

  const handleCategoryChange = (value) => {
    console.log('kategori berubah:', value || 'Semua Kategori');
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set('category', value);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (value) => {
    console.log('search berubah:', value || 'kosong');
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set('q', value);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const calculateDiscount = (price, discountPrice) => {
    if (!price || !discountPrice || price === discountPrice) return null;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const loading = activitiesLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Activities</h1>
          <p className="text-gray-600 text-lg">
            {categoryId ? `${filteredActivities.length} activities found` : 'Discover amazing experiences across Indonesia'}
          </p>
        </div>

        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(({ id, name }) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Search by name, location..."
                defaultValue={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {(categoryId || searchQuery) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              {categoryId && (
                <button
                  onClick={() => handleCategoryChange('')}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1.5"
                >
                  {categories.find(c => c.id === categoryId)?.name}
                  <span className="text-lg">×</span>
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1.5"
                >
                  "{searchQuery}"
                  <span className="text-lg">×</span>
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-80 rounded-2xl bg-linear-to-br from-gray-200 to-gray-300 animate-pulse" />
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-20 text-center">
            <div className="inline-block p-6 bg-linear-to-br from-gray-100 to-gray-200 rounded-full mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">No activities found</p>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                handleCategoryChange('');
                handleSearchChange('');
              }}
              className="px-6 py-3 bg-linear-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredActivities.map(activity => {
              const discount = calculateDiscount(activity.price, activity.price_discount);

              return (
                <Link
                  key={activity.id}
                  to={`/activities/${activity.id}`}
                  className="group flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
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
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {discount && (
                      <div className="absolute top-3 left-3 bg-linear-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                        {discount}% OFF
                      </div>
                    )}
                    
                    {activity.rating && (
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-gray-900">{activity.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex-1">
                      {(activity.city || activity.province) && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          <span className="line-clamp-1">
                            {activity.city && activity.province
                              ? `${activity.city}, ${activity.province}`
                              : activity.city || activity.province}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {activity.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{activity.description}</p>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-blue-600">
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
    </div>
  );
};

export default Activities;