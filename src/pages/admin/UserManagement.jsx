import { useState, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useUsers } from '../../hooks/useUser';
import { userService } from '../../api/services/userService';
import AdminTable from '../../components/layout/AdminTable';
import Button from '../../components/ui/Button';
import fallbackimg from '../../assets/candi.jpg';
import { notifySuccess, notifyError } from '../../components/ui/notifications';

const UserManagement = () => {
  const { users, loading, error, refresh } = useUsers();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [detailUser, setDetailUser] = useState(null);

  // Role update
  const handleChangeRole = useCallback(
    async (user, newRole) => {
      if (user.role === newRole) return;

      const result = await Swal.fire({
        title: 'Change user role?',
        text: `Change role of ${user.name || user.email} to "${newRole}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, change',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      setUpdatingId(user.id);
      try {
        await userService.updateRole(user.id, newRole);
        await refresh();
        notifySuccess('User role updated successfully');
      } catch (err) {
        notifyError('Failed to update user role. Please try again.');
        console.error('Failed to update role', err);
      } finally {
        setUpdatingId(null);
      }
    },
    [refresh]
  );

  // Detail
  const openDetail = useCallback((user) => {
    setDetailUser(user);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailUser(null);
  }, []);

  // Columns for AdminTable
  const columns = useMemo(
    () => [
      {
        header: 'USER',
        key: 'name',
        render: (item) => (
          <div className="flex items-center gap-3">
            <img
              src={item.profilePictureUrl || fallbackimg}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackimg;
              }}
              alt={item.name || item.email}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {item.name || '—'}
              </p>
              <p className="truncate text-xs text-gray-500">
                {item.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: 'ROLE',
        key: 'role',
        render: (item) => (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              item.role === 'admin'
                ? 'bg-purple-50 text-purple-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {item.role}
          </span>
        ),
      },
      {
        header: 'PHONE',
        key: 'phoneNumber',
        render: (item) => (
          <span className="text-sm text-gray-700">
            {item.phoneNumber || '—'}
          </span>
        ),
      },
      {
        header: 'ACTIONS',
        align: 'right',
        render: (item) => (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                openDetail(item);
              }}
            >
              Detail
            </Button>
            <Button
              size="sm"
              variant={item.role === 'admin' ? 'secondary' : 'primary'}
              loading={updatingId === item.id}
              onClick={(e) => {
                e.stopPropagation();
                const targetRole = item.role === 'admin' ? 'user' : 'admin';
                handleChangeRole(item, targetRole);
              }}
            >
              {item.role === 'admin' ? 'Set as User' : 'Set as Admin'}
            </Button>
          </div>
        ),
      },
    ],
    [updatingId, handleChangeRole, openDetail]
  );

  const searchFields = useMemo(
    () => ['name', 'email', 'phoneNumber', 'role'],
    []
  );

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-semibold text-red-600">
          Error loading users
        </p>
        <Button variant="secondary" onClick={refresh}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-0 sm:py-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View all users and manage their roles.
          </p>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        title="All Users"
        data={users || []}
        columns={columns}
        searchFields={searchFields}
        searchValue={search}
        onSearchChange={setSearch}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
        emptyMessage="No users found."
        searchPlaceholder="Search by name, email, phone, or role..."
        onRowClick={openDetail}
      />

      {/* Detail modal */}
      {detailUser && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  User Detail
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Full information about this user.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                ariaLabel="Close detail"
                onClick={closeDetail}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={detailUser.profilePictureUrl || fallbackimg}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackimg;
                  }}
                  alt={detailUser.name || detailUser.email}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {detailUser.name || '—'}
                  </p>
                  <p className="text-sm text-gray-600">{detailUser.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Role</p>
                  <p className="text-gray-600">{detailUser.role}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Phone</p>
                  <p className="text-gray-600">
                    {detailUser.phoneNumber || '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;