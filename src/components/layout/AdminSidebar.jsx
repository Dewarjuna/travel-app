import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  TagIcon,
  PhotoIcon,
  GiftIcon,
  UsersIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { path: '/admin', icon: HomeIcon, label: 'Dashboard', end: true },
  { path: '/admin/activities', icon: MapIcon, label: 'Activities' },
  { path: '/admin/categories', icon: TagIcon, label: 'Categories' },
  { path: '/admin/banners', icon: PhotoIcon, label: 'Banners' },
  { path: '/admin/promos', icon: GiftIcon, label: 'Promos' },
  { path: '/admin/users', icon: UsersIcon, label: 'Users' },
  { path: '/admin/transactions', icon: ShoppingCartIcon, label: 'Transactions' },
];

const AdminSidebar = ({ isOpen }) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30
        flex flex-col
        bg-gray-900 text-white
        border-r border-gray-800
        transition-[width,transform] duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-20 translate-x-0 md:translate-x-0'}
        md:static md:translate-x-0 md:shrink-0
      `}
      aria-label="Admin navigation"
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 text-lg font-bold">
          DT
        </div>
        {isOpen && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide">
              DewaTravel
            </span>
            <span className="text-xs text-gray-400">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map(({ path, icon: Icon, label, end }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  `
                  group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm
                  transition-colors duration-150
                  ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `
                }
              >
                <Icon className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-white" />
                {isOpen && (
                  <span className="truncate">
                    {label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 px-3 py-3 text-xs text-gray-500">
        {isOpen ? (
          <div className="flex flex-col">
            <span>Logged in as Admin</span>
            <span className="text-[10px] text-gray-600">v1.0.0</span>
          </div>
        ) : (
          <span className="block text-center text-[10px]">v1.0.0</span>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;