import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const AdminHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Welcome, {user?.name || 'Admin'}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;