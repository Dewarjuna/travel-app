import { useState, useMemo, useCallback } from 'react';
import { useActivities } from '../../hooks/useActivities';
import { useCategories } from '../../hooks/useCategories';
import { useModal } from '../../hooks/useModal';
import { useActivityManagement } from '../../hooks/useActivityManagement';
import AdminTable from '../../components/layout/AdminTable';
import Button from '../../components/ui/Button';
import ActivityDetailModal from './components/ActivityDetailModal';
import ActivityFormModal from './components/ActivityFormModal';
import { createActivityColumns } from './components/activityColumns';

const SEARCH_FIELDS = ['title', 'city', 'province', 'category.name'];

const ActivityManagement = () => {
  // Data fetching
  const { activities, loading, error, refresh } = useActivities();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // UI State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal controls
  const detailModal = useModal();
  const formModal = useModal();

  // CRUD operations
  const { saving, deletingId, handleSubmit, handleDelete } =
    useActivityManagement(refresh);

  // Handle form submit with modal close
  const onFormSubmit = useCallback(
    async (payload, id) => {
      const success = await handleSubmit(payload, id);
      if (success) {
        formModal.close();
        setCurrentPage(1);
      }
    },
    [handleSubmit, formModal]
  );

  // Handle delete with page reset
  const onDelete = useCallback(
    async (id) => {
      const success = await handleDelete(id);
      if (success) {
        setCurrentPage(1);
      }
    },
    [handleDelete]
  );

  // Table columns - memoized with dependencies
  const columns = useMemo(
    () =>
      createActivityColumns({
        onDetail: detailModal.open,
        onEdit: formModal.open,
        onDelete,
        deletingId,
      }),
    [detailModal.open, formModal.open, onDelete, deletingId]
  );

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            Failed to load activities
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {error.message || 'Something went wrong. Please try again.'}
          </p>
        </div>
        <Button onClick={refresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Activity Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage travel activities for your platform
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => formModal.open(null)}
          className="w-full sm:w-auto"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Activity
        </Button>
      </header>

      {/* Stats Cards (Optional Enhancement) */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="text-xs font-medium uppercase text-gray-500">
            Total Activities
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {activities?.length || 0}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="text-xs font-medium uppercase text-gray-500">
            Categories
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {categories?.length || 0}
          </p>
        </div>
        <div className="hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:block">
          <p className="text-xs font-medium uppercase text-gray-500">
            Avg. Price
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {activities?.length
              ? `Rp ${Math.round(
                  activities.reduce((sum, a) => sum + (a.price || 0), 0) /
                    activities.length
                ).toLocaleString('id-ID')}`
              : '—'}
          </p>
        </div>
        <div className="hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:block">
          <p className="text-xs font-medium uppercase text-gray-500">
            With Discount
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {activities?.filter((a) => a.price_discount).length || 0}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <AdminTable
        title="All Activities"
        data={activities || []}
        columns={columns}
        searchFields={SEARCH_FIELDS}
        searchValue={search}
        onSearchChange={setSearch}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
        emptyMessage="No activities found. Create your first activity to get started!"
        searchPlaceholder="Search by title, city, province, or category..."
        onRowClick={detailModal.open}
      />

      {/* Detail Modal */}
      <ActivityDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        activity={detailModal.data}
      />

      {/* Form Modal */}
      <ActivityFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSubmit={onFormSubmit}
        activity={formModal.data}
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        saving={saving}
      />
    </div>
  );
};

export default ActivityManagement;