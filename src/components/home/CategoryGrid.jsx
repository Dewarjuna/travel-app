import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useCategories } from '../../hooks/useCategories';

const CategoryGrid = () => {
  const { categories, loading } = useCategories();

  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Explore Categories</h2>
          <Link
            to="/activities"
            className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors flex items-center gap-1 group"
          >
            See all
            <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {loading ? (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="shrink-0 h-9 w-28 rounded-full bg-linear-to-r from-gray-100 to-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/activities?category=${category.id}`}
                className="group shrink-0 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium text-sm rounded-full border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;