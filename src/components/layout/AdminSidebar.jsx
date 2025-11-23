import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  MapIcon, 
  TagIcon, 
  PhotoIcon, 
  GiftIcon, 
  UsersIcon, 
  ShoppingCartIcon 
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ isOpen }) => {
  const menuItems = [
    { path: '/admin', icon: HomeIcon, label: 'Dashboard', end: true },
    { path: '/admin/activities', icon: MapIcon, label: 'Activities' },
    { path: '/admin/categories', icon: TagIcon, label: 'Categories' },
    { path: '/admin/banners', icon: PhotoIcon, label: 'Banners' },
    { path: '/admin/promos', icon: GiftIcon, label: 'Promos' },
    { path: '/admin/users', icon: UsersIcon, label: 'Users' },
    { path: '/admin/transactions', icon: ShoppingCartIcon, label: 'Transactions' },
  ];

  return (
    <aside className={`bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 border-b border-gray-700">
        <h2 className={`font-bold text-xl ${!isOpen && 'hidden'}`}>DewaTravel Admin</h2>
        {!isOpen && <span className="text-xl font-bold">DT</span>}
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="w-6 h-6 shrink-0" />
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;