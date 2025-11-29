// src/components/layout/AdminHeader.jsx
import {
  Bars3Icon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const AdminHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const displayName = user?.name || 'Admin';

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: menu + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              DewaTravel Admin
            </span>
            <span className="text-xs text-gray-500">
              Manage activities, users & transactions
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification (placeholder) */}
          <button
            type="button"
            className="relative hidden sm:inline-flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
          </button>

          {/* User block */}
          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-900">
                Welcome, {displayName}
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 overflow-hidden">
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={displayName}
                  className="h-9 w-9 object-cover"
                  loading="lazy"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8" />
              )}
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            leftIcon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
          >
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;