import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import PromoGrid from '../components/home/PromoGrid';
import FeaturedActivities from '../components/home/FeaturedActivities';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Hero />
      <CategoryGrid />
      <PromoGrid />
      <FeaturedActivities />
    </div>
  );
};

export default Home;