import { Link } from 'react-router-dom';
import {
  MapIcon,
  UsersIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  ChevronRightIcon,
  SparklesIcon,
  TagIcon,
  PhotoIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { useActivities } from '../../hooks/useActivities';
import { useAdminTransactions } from '../../hooks/useAdminTransactions';
import { useUsers } from '../../hooks/useUser';

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
    <div className="flex items-center justify-between">
      <div className="h-12 w-12 rounded-xl bg-gray-200" />
      <div className="h-4 w-16 rounded bg-gray-200" />
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-4 w-24 rounded bg-gray-200" />
      <div className="h-8 w-32 rounded bg-gray-200" />
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <Link
      to={stat.href}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-gray-200"
    >
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 ${stat.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div
            className={`rounded-xl ${stat.bgLight} p-3 transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className={`h-6 w-6 ${stat.textColor}`} />
          </div>
          <ChevronRightIcon className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gray-600" />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-600">
            {stat.name}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-gray-400">{stat.description}</p>
        </div>
      </div>
    </Link>
  );
};

// Quick Action Card in Hero
const QuickActionCard = ({ href, label, value }) => (
  <Link
    to={href}
    className="group flex-1 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
  >
    <p className="text-sm font-medium text-blue-100">{label}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
    <div className="mt-2 flex items-center gap-1 text-xs text-blue-200 opacity-0 transition-opacity group-hover:opacity-100">
      View details
      <ChevronRightIcon className="h-3 w-3" />
    </div>
  </Link>
);

// Quick Action Link
const QuickActionLink = ({ href, label, icon: Icon }) => (
  <Link
    to={href}
    className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md hover:ring-gray-200"
  >
    <div className="rounded-lg bg-gray-50 p-2 transition-colors group-hover:bg-blue-50">
      <Icon className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-500" />
    </div>
    <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900">
      {label}
    </span>
    <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-400" />
  </Link>
);

const Dashboard = () => {
  const { activities, loading: activitiesLoading } = useActivities();
  const { transactions, loading: transactionsLoading } = useAdminTransactions();
  const { users, loading: usersLoading } = useUsers();

  const loading = activitiesLoading || transactionsLoading || usersLoading;

  // Calculate real metrics
  const totalActivities = activities?.length || 0;
  const totalUsers = users?.length || 0;
  const totalTransactions = transactions?.length || 0;
  const successfulTransactions =
    transactions?.filter((t) => t.status === 'success') || [];
  const totalRevenue = successfulTransactions.reduce(
    (sum, t) => sum + (t.totalAmount || 0),
    0
  );

  const successRate =
    totalTransactions > 0
      ? ((successfulTransactions.length / totalTransactions) * 100).toFixed(1)
      : '0';

  const avgTransaction =
    successfulTransactions.length > 0
      ? Math.round(totalRevenue / successfulTransactions.length)
      : 0;

  const stats = [
    {
      name: 'Total Activities',
      value: totalActivities.toLocaleString('id-ID'),
      icon: MapIcon,
      href: '/admin/activities',
      bgLight: 'bg-blue-50',
      bgGradient: 'bg-gradient-to-br from-blue-50/50 to-transparent',
      textColor: 'text-blue-600',
      description: 'Active travel packages',
    },
    {
      name: 'Total Users',
      value: totalUsers.toLocaleString('id-ID'),
      icon: UsersIcon,
      href: '/admin/users',
      bgLight: 'bg-purple-50',
      bgGradient: 'bg-gradient-to-br from-purple-50/50 to-transparent',
      textColor: 'text-purple-600',
      description: 'Registered accounts',
    },
    {
      name: 'Total Transactions',
      value: totalTransactions.toLocaleString('id-ID'),
      icon: ShoppingCartIcon,
      href: '/admin/transactions',
      bgLight: 'bg-emerald-50',
      bgGradient: 'bg-gradient-to-br from-emerald-50/50 to-transparent',
      textColor: 'text-emerald-600',
      description: 'All time bookings',
    },
    {
      name: 'Total Revenue',
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      icon: BanknotesIcon,
      href: '/admin/transactions',
      bgLight: 'bg-amber-50',
      bgGradient: 'bg-gradient-to-br from-amber-50/50 to-transparent',
      textColor: 'text-amber-600',
      description: 'From successful transactions',
    },
  ];

  const quickActions = [
    { label: 'Manage Activities', href: '/admin/activities', icon: MapIcon },
    { label: 'Manage Categories', href: '/admin/categories', icon: TagIcon },
    { label: 'Manage Banners', href: '/admin/banners', icon: PhotoIcon },
    { label: 'Manage Promos', href: '/admin/promos', icon: TicketIcon },
    { label: 'Manage Users', href: '/admin/users', icon: UsersIcon },
    { label: 'View Transactions', href: '/admin/transactions', icon: ShoppingCartIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Overview of your travel platform performance
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Live data
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section aria-label="Statistics" className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : stats.map((stat) => <StatCard key={stat.name} stat={stat} />)}
          </div>
        </section>

        {/* Welcome Card */}
        <section aria-label="Welcome" className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-500 to-indigo-600 p-6 text-white shadow-xl sm:p-8">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-start gap-3">
                <div className="hidden rounded-lg bg-white/20 p-2 backdrop-blur-sm sm:block">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Welcome to Admin Panel
                  </h2>
                  <p className="mt-2 max-w-2xl text-blue-100">
                    Manage your travel platform activities, users, and
                    transactions from this centralized dashboard.
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <QuickActionCard
                  href="/admin/transactions"
                  label="Success Rate"
                  value={`${successRate}%`}
                />
                <QuickActionCard
                  href="/admin/transactions"
                  label="Avg. Transaction"
                  value={`Rp ${avgTransaction.toLocaleString('id-ID')}`}
                />
                <QuickActionCard
                  href="/admin/activities"
                  label="Active Listings"
                  value={totalActivities.toString()}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section aria-label="Quick actions">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <QuickActionLink
                key={action.label}
                href={action.href}
                label={action.label}
                icon={action.icon}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;