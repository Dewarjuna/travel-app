import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 relative">
          <div className="text-[180px] font-black bg-linear-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent leading-none">
            404
          </div>
          <div className="absolute inset-0 text-[180px] font-black text-gray-200 blur-sm -z-10">
            404
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => nav('/')}>
              Go Back Home
            </Button>
            <Button onClick={() => nav('/activities')}>
              Browse Activities
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Lost? Try using the navigation menu above or{' '}
          <button 
            onClick={() => nav(-1)} 
            className="text-blue-600 hover:text-blue-700 font-semibold underline"
          >
            go back to previous page
          </button>
        </p>
      </div>
    </div>
  );
};

export default NotFound;