import { useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { bannerService } from '../../api/services/bannerService';
import { useEffect, useState as useState2 } from 'react';

const Hero = () => {
  const [q, setQ] = useState('');
  const nav = useNavigate();

  const [banners, setBanners] = useState2([]);
  const [loading, setLoading] = useState2(true);

  const initHero = () => {
    setLoading(true);
    bannerService
      .list()
      .then((r) => setBanners(r.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(initHero, []);

  const onSearch = (e) => {
    e.preventDefault();
    const params = q ? { q } : {};
    nav({ pathname: '/activities', search: createSearchParams(params).toString() });
  };

  return (
    <section className="bg-white border-b">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Find your next adventure
          </h1>
          <p className="text-gray-600 mt-3">
            Discover activities, unique experiences, and exclusive promos tailored for you.
          </p>
          <form onSubmit={onSearch} className="mt-6 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Search activities, cities, or provinces..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn-primary">Search</button>
          </form>
        </div>

        <div className="hidden md:block">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full h-32 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {banners.slice(0, 4).map((b) => (
                <img
                  key={b.id}
                  src={b.imageUrl}
                  alt={b.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;