import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { activityService } from '../../api/services/activityService';

const FeaturedActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const initActivities = () => {
    setLoading(true);
    activityService
      .list()
      .then((r) => setActivities(r.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(initActivities, []);

  return (
    <section className="container mx-auto px-4 pb-14">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Featured Activities</h2>
        <Link to="/activities" className="text-primary hover:underline">Browse activities</Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="card h-64 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.slice(0, 8).map((a) => (
            <Link key={a.id} to={`/activity/${a.id}`} className="card hover:shadow-xl transition">
              <img src={a.imageUrls?.[0]} alt={a.title} className="w-full h-44 object-cover rounded-lg mb-3" />
              <h3 className="font-semibold text-lg">{a.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-primary font-bold">Rp {a.price_discount?.toLocaleString?.()}</span>
                {a.price_discount < a.price && (
                  <span className="text-gray-500 line-through">Rp {a.price?.toLocaleString?.()}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedActivities;