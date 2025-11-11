import { useEffect, useState } from 'react';
import { promoService } from '../../api/services/promoService';

const PromoGrid = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  const initPromos = () => {
    setLoading(true);
    promoService
      .list()
      .then((r) => setPromos(r.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(initPromos, []);

  return (
    <section className="container mx-auto px-4 pb-10">
      <h2 className="text-xl font-bold mb-4">Promos</h2>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-28 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start gap-3">
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.title || p.name} className="w-20 h-20 object-cover rounded" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{p.title || p.name}</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{p.description}</p>
                  {p.promo_code && (
                    <span className="inline-block mt-2 text-xs bg-gray-100 border px-2 py-1 rounded">
                      Code: {p.promo_code}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PromoGrid;