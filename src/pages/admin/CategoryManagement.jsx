import { useState, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { categoryService } from '../../api/services/categoryService';
import { useCategories } from '../../hooks/useCategories';
import AdminTable from '../../components/layout/AdminTable';
import Button from '../../components/ui/Button';
import ImageUpload from '../../components/ui/ImageUpload';
import fallbackimg from '../../assets/candi.jpg';
import { notifySuccess, notifyError } from '../../components/ui/notifications';

const EMPTY_FORM = {
  name: '',
  imageUrl: '',
};

const CategoryManagement = () => {
  const { categories, loading, error, refresh } = useCategories();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [detailCategory, setDetailCategory] = useState(null);

  // Delete
  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: 'Delete category?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      setDeletingId(id);
      try {
        await categoryService.remove(id);
        await refresh();
        setCurrentPage(1);
        notifySuccess('Category deleted successfully');
      } catch (err) {
        const backendMessage = err.response?.data?.errors || err.response?.data?.message;

        if (
          typeof backendMessage === 'string' &&
          (backendMessage.includes('foreign key') || backendMessage.includes('constraint'))
        ) {
          notifyError(
            'This category cannot be deleted because it is still in use by activities.'
          );
        } else {
          notifyError('Failed to delete category. Please try again later.');
        }

        console.error('Failed to delete category', err);
      } finally {
        setDeletingId(null);
      }
    },
    [refresh]
  );

  // Edit
  const startEdit = useCallback((category) => {
    setFormState({
      name: category.name || '',
      imageUrl: category.imageUrl || '',
    });
    setFormErrors({});
    setSelected(category);
    setShowForm(true);
  }, []);

  // Create
  const startCreate = useCallback(() => {
    setFormState(EMPTY_FORM);
    setFormErrors({});
    setSelected(null);
    setShowForm(true);
  }, []);

  // Detail
  const openDetail = useCallback((category) => {
    setDetailCategory(category);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailCategory(null);
  }, []);

  // Form change
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  // Validation
  const validateForm = useCallback(() => {
    const errors = {};
    const { name, imageUrl } = formState;

    if (!name || !name.trim()) {
      errors.name = 'Category name is required.';
    }

    if (!imageUrl || !imageUrl.trim()) {
      errors.imageUrl = 'Image is required.';
    }

    return errors;
  }, [formState]);

  // Submit
  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setSaving(true);

      try {
        const payload = {
          name: formState.name.trim(),
          imageUrl: formState.imageUrl.trim(),
        };

        if (selected) {
          await categoryService.update(selected.id, payload);
          notifySuccess('Category updated successfully');
        } else {
          await categoryService.create(payload);
          notifySuccess('Category created successfully');
        }

        setShowForm(false);
        setCurrentPage(1);
        await refresh();
      } catch (err) {
        notifyError('Failed to save category. Please try again.');
        console.error('Failed to save category', err);
      } finally {
        setSaving(false);
      }
    },
    [selected, formState, refresh, validateForm]
  );

  // Columns for AdminTable
  const columns = useMemo(
    () => [
      {
        header: 'IMAGE',
        key: 'imageUrl',
        render: (item) => (
          <img
            src={item.imageUrl || fallbackimg}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackimg;
            }}
            alt={item.name}
            className="h-12 w-16 rounded-lg object-cover"
          />
        ),
      },
      {
        header: 'NAME',
        key: 'name',
        render: (item) => (
          <div>
            <p className="font-semibold text-gray-900">{item.name}</p>
          </div>
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
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                startEdit(item);
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              loading={deletingId === item.id}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [deletingId, handleDelete, startEdit, openDetail]
  );

  const searchFields = useMemo(() => ['name'], []);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-semibold text-red-600">
          Error loading categories
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
            Manage Categories
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View, create, and update activity categories for DewaTravel.
          </p>
        </div>
        <Button size="lg" onClick={startCreate}>
          + Add New Category
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        title="All Categories"
        data={categories || []}
        columns={columns}
        searchFields={searchFields}
        searchValue={search}
        onSearchChange={setSearch}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
        emptyMessage="No categories found. Try adjusting your search or add a new category."
        searchPlaceholder="Search by category name..."
        onRowClick={openDetail}
      />

      {/* Detail modal */}
      {detailCategory && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Category Detail
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Full information about this category.
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
              {/* Image */}
              <div>
                <img
                  src={detailCategory.imageUrl || fallbackimg}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackimg;
                  }}
                  alt={detailCategory.name}
                  className="h-48 w-full rounded-lg object-cover"
                  loading="lazy"
                />
              </div>

              {/* Main info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {detailCategory.name}
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Created</p>
                  <p className="text-gray-600">
                    {detailCategory.createdAt
                      ? new Date(detailCategory.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Last Updated</p>
                  <p className="text-gray-600">
                    {detailCategory.updatedAt
                      ? new Date(detailCategory.updatedAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {selected ? 'Edit Category' : 'Add New Category'}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Fill in the details below to {selected ? 'update' : 'create'} a
                  category.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                ariaLabel="Close"
                onClick={() => setShowForm(false)}
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Category Name *
                </label>
                <input
                  name="name"
                  value={formState.name || ''}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., Beach, Mountain, City Tour"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <ImageUpload
                  label="Category Image *"
                  value={formState.imageUrl ? [formState.imageUrl] : []}
                  onChange={(urls) => {
                    setFormState((prev) => ({
                      ...prev,
                      imageUrl: urls[0] || '',
                    }));
                    setFormErrors((prev) => {
                      if (!prev.imageUrl) return prev;
                      const next = { ...prev };
                      delete next.imageUrl;
                      return next;
                    });
                  }}
                  multiple={false}
                  maxImages={1}
                  helperText="Upload one image for this category."
                />
                {formErrors.imageUrl && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.imageUrl}</p>
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  disabled={saving}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="md" loading={saving}>
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;