import { useEffect } from 'react';
import { TagIcon } from '@heroicons/react/24/outline';
import { usePromos } from '../../hooks/usePromos';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../ui/Pagination';
import fallbackimg from '../../assets/candi.jpg';

const PromoGrid = () => {
  const { promos, loading } = usePromos();
  useEffect(() => {
    console.log('promos loaded:', promos.length);
  }, [promos]);

  // PAGINATION LOGIC
  const itemsPerPage = 6;
  const {
    currentItems,
    currentPage,
    totalPages,
    goToPage
  } = usePagination(promos, itemsPerPage);

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Special Offers</h2>
          <p className="text-gray-600 mt-1">Don't miss out on these amazing deals</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="h-48 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No promos available at the moment</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
              {currentItems.map(promo => {
                const imageSrc =
                  promo.imageUrl && promo.imageUrl.trim() !== ''
                    ? promo.imageUrl
                    : fallbackimg;

                return (
                  <div
                    key={promo.id}
                    className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-40 overflow-hidden bg-linear-to-br from-blue-50 to-blue-100 shrink-0">
                      <img
                        src={imageSrc}
                        alt={promo.title || promo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={e => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackimg;
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                      {promo.promo_discount_price_percentage && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          {promo.promo_discount_price_percentage}% OFF
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col p-5">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                          {promo.title || promo.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {promo.description}
                        </p>
                      </div>

                      {promo.promo_code && (
                        <div className="mt-auto">
                          <div className="flex items-center gap-2 p-3 bg-linear-to-r from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-lg">
                            <TagIcon className="w-5 h-5 text-blue-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-600 font-medium">Promo Code</p>
                              <p className="text-sm font-bold text-blue-600 tracking-wider truncate">
                                {promo.promo_code}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 shrink-0" />
                  </div>
                );
              })}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PromoGrid;