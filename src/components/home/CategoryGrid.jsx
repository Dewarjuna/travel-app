import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../api/services/categoryService';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const initCategories = () => {
    setLoading(true);
    categoryService
      .list()
      .then((r) => setCategories(r.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(initCategories, []);

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Categories</h2>
        <Link to="/activities" className="text-primary hover:underline">See all</Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/activities?category=${c.id}`}
              className="card hover:shadow-lg transition text-center"
            >
              <p className="font-semibold">{c.name}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryGrid;