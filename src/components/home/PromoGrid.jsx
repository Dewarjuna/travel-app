import { useEffect, useState } from 'react';
import { TagIcon } from '@heroicons/react/24/outline';
import { usePromos } from '../../hooks/usePromos';
const PromoGrid = () => {
  const {promos, loading} = usePromos();

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Special Offers</h2>
          <p className="text-gray-600 mt-1">Don't miss out on these amazing deals</p>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-48 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                {promo.imageUrl && (
                  <div className="relative h-40 overflow-hidden bg-linear-to-br from-blue-50 to-blue-100 shrink-0">
                    <img
                      src={promo.imageUrl}
                      alt={promo.title || promo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                    
                    {/* Promo Badge */}
                    {promo.promo_discount_price_percentage && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {promo.promo_discount_price_percentage}% OFF
                      </div>
                    )}
                  </div>
                )}

                {/* Content Section - Flexible to fill space */}
                <div className="flex-1 flex flex-col p-5">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {promo.title || promo.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {promo.description}
                    </p>
                  </div>

                  {/* Promo Code - Always at bottom */}
                  {promo.promo_code && (
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 p-3 bg-linear-to-r from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-lg">
                        <TagIcon className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 font-medium">Promo Code</p>
                          <p className="text-sm font-bold text-blue-600 tracking-wider">
                            {promo.promo_code}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Accent Line */}
                <div className="h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoGrid;