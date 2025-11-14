import { CheckCircleIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import PromoGrid from '../components/home/PromoGrid';
import FeaturedActivities from '../components/home/FeaturedActivities';

const Home = () => {
  //throw new Error('test error boundary');
  return (
    <div className="min-h-screen">
      <Hero />
      <CategoryGrid />
      <FeaturedActivities />
      <PromoGrid />
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Choose TravelApp?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of travelers who trust us for their adventures
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircleIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">
                Find the best deals with our price match guarantee and exclusive discounts
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ClockIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our team is always ready to help you plan your perfect adventure
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <SparklesIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Curated Experiences</h3>
              <p className="text-gray-600">
                Hand-picked activities and destinations for unforgettable memories
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-linear-to-br from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100 text-sm md:text-base">Activities</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100 text-sm md:text-base">Happy Travelers</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-blue-100 text-sm md:text-base">Destinations</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">4.8★</div>
              <div className="text-blue-100 text-sm md:text-base">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Explore amazing destinations and create memories that last a lifetime
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/activities"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
              >
                Browse All Activities
              </a>
              <a
                href="/register"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg border-2 border-blue-600 transition-all duration-200 text-lg"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;