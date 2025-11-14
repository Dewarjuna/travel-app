import { useEffect, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { bannerService } from '../../api/services/bannerService';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await bannerService.list();
      setBanners(response.data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = searchQuery ? { q: searchQuery } : {};
    navigate({
      pathname: '/activities',
      search: createSearchParams(params).toString(),
    });
  };

  return (
    <section className="relative bg-linear-to-br from-white to-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Content Section */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Find your next
                <span className="block text-primary mt-1">adventure</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Discover unique activities, exciting experiences, and exclusive
                promos tailored just for you.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="text"
                className="flex-1 px-5 py-3.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                placeholder="Search activities, cities, or destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search activities"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
              >
                Search
              </button>
            </form>
          </div>

          {/* Banner Grid Section */}
          <div className="hidden md:block">
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-4/3 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {banners.slice(0, 4).map((banner) => (
                  <div
                    key={banner.id}
                    className="group relative aspect-4/3 overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;