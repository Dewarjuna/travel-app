import { useState, useMemo, useCallback } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useModal } from '../../hooks/useModal';
import { useCategoryManagement } from '../../hooks/useCategoryManagement';
import AdminTable from '../../components/layout/AdminTable';
import Button from '../../components/ui/Button';
import CategoryDetailModal from './components/CategoryDetailModal';
import CategoryFormModal from './components/CategoryFormModal';
import { createCategoryColumns } from './components/categoryColumns';

// Icons as components for reusability
const TagIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const AlertIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const SEARCH_FIELDS = ['name'];

const CategoryManagement = () => {
  // Data fetching
  const { categories, loading, error, refresh } = useCategories();

  // UI State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal controls
  const detailModal = useModal();
  const formModal = useModal();

  // CRUD operations
  const { saving, deletingId, handleSubmit, handleDelete } =
    useCategoryManagement(refresh);

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
      createCategoryColumns({
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
            <AlertIcon className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            Failed to load categories
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
            Category Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Organize activities with categories
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => formModal.open(null)}
          className="w-full sm:w-auto"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Add Category
        </Button>
      </header>

      {/* Stats Card */}
      <div className="mb-6">
        <div className="rounded-xl bg-linear-to-r from-blue-500 to-blue-600 p-4 text-white shadow-lg sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">
                Total Categories
              </p>
              <p className="mt-1 text-3xl font-bold">
                {categories?.length || 0}
              </p>
            </div>
            <div className="rounded-full bg-white/20 p-3">
              <TagIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <AdminTable
        title="All Categories"
        data={categories || []}
        columns={columns}
        searchFields={SEARCH_FIELDS}
        searchValue={search}
        onSearchChange={setSearch}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
        emptyMessage="No categories found. Create your first category to get started!"
        searchPlaceholder="Search by category name..."
        onRowClick={detailModal.open}
        itemsPerPage={10}
      />

      {/* Detail Modal */}
      <CategoryDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        category={detailModal.data}
      />

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSubmit={onFormSubmit}
        category={formModal.data}
        saving={saving}
      />
    </div>
  );
};

export default CategoryManagement;