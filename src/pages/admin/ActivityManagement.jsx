import { useState, useMemo, useCallback } from 'react';
import { activityService } from '../../api/services/activityService';
import { useActivities } from '../../hooks/useActivities';
import { useCategories } from '../../hooks/useCategories';
import AdminTable from '../../components/layout/AdminTable';
import Button from '../../components/ui/Button';
import fallbackimg from '../../assets/candi.jpg';
import ImageUpload from '../../components/ui/ImageUpload';
import { notifySuccess, notifyError } from '../../components/ui/notifications';
import Swal from 'sweetalert2';

const EMPTY_FORM = {
  categoryId: '',
  title: '',
  description: '',
  city: '',
  province: '',
  price: '',
  price_discount: '',
  imageUrls: [],
};

const ActivityManagement = () => {
  const { activities, loading, error, refresh } = useActivities();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(null); // for edit
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [detailActivity, setDetailActivity] = useState(null); // for detail view

// Delete
const handleDelete = useCallback(
  async (id) => {
    const result = await Swal.fire({
      title: 'Delete activity?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444', // red-500
      cancelButtonColor: '#6b7280',  // gray-500
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      await activityService.remove(id);
      await refresh();
      setCurrentPage(1);
      notifySuccess('Activity deleted successfully');
    } catch (err) {
      const backendMessage = err.response?.data?.errors || err.response?.data?.message;

      if (
        typeof backendMessage === 'string' &&
        backendMessage.includes('carts_activityId_fkey')
      ) {
        notifyError(
          'This activity cannot be deleted because it is still in one or more carts.'
        );
      } else {
        notifyError('Failed to delete activity. Please try again later.');
      }

      console.error('Failed to delete activity', err);
    } finally {
      setDeletingId(null);
    }
  },
  [refresh]
);

  // Edit
  const startEdit = useCallback((activity) => {
    setFormState({
      categoryId: activity.categoryId || activity.category?.id || '',
      title: activity.title || '',
      description: activity.description || '',
      city: activity.city || '',
      province: activity.province || '',
      price: activity.price?.toString() ?? '',
      price_discount: activity.price_discount?.toString() ?? '',
      imageUrls: activity.imageUrls || [],
    });
    setFormErrors({});
    setSelected(activity);
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
  const openDetail = useCallback((activity) => {
    setDetailActivity(activity);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailActivity(null);
  }, []);

  // Form change
  const handleFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
    const { categoryId, title, city, province, price, imageUrls } = formState;

    if (!categoryId) {
      errors.categoryId = 'Category is required.';
    }

    if (!title || !title.trim()) {
      errors.title = 'Title is required.';
    }

    if (!city || !city.trim()) {
      errors.city = 'City is required.';
    }

    if (!province || !province.trim()) {
      errors.province = 'Province is required.';
    }

    const priceNumber =
      price === '' || price === undefined ? NaN : Number(price);

    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      errors.price = 'Price must be greater than 0.';
    }

    if (!imageUrls || imageUrls.length === 0) {
      errors.imageUrls = 'At least one image is required.';
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
          ...formState,
          price:
            formState.price === '' || formState.price === undefined
              ? undefined
              : Number(formState.price),
          price_discount:
            formState.price_discount === '' || formState.price_discount === undefined
              ? undefined
              : Number(formState.price_discount),
        };

        if (selected) {
          await activityService.update(selected.id, payload);
        } else {
          await activityService.create(payload);
        }

        setShowForm(false);
        setCurrentPage(1);
        await refresh();
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
        key: 'imageUrls',
        render: (item) => (
          <img
            src={item.imageUrls?.[0] || fallbackimg}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackimg;
            }}
            alt={item.title}
            className="h-12 w-16 rounded-lg object-cover"
          />
        ),
      },
      {
        header: 'TITLE',
        key: 'title',
        render: (item) => (
          <div className="max-w-xs">
            <p className="truncate font-semibold text-gray-900">{item.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
              {item.description}
            </p>
          </div>
        ),
      },
      {
        header: 'LOCATION',
        render: (item) => (
          <div>
            <p className="font-medium text-gray-900">{item.city || '-'}</p>
            <p className="text-xs text-gray-500">{item.province || '-'}</p>
          </div>
        ),
      },
      {
        header: 'CATEGORY',
        render: (item) => (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {item.category?.name || '-'}
          </span>
        ),
      },
      {
        header: 'PRICE',
        align: 'right',
        render: (item) => (
          <div className="text-right font-semibold text-emerald-600">
            {item.price ? `Rp ${item.price.toLocaleString('id-ID')}` : '-'}
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

  const searchFields = useMemo(
    () => ['title', 'city', 'province', 'category.name'],
    []
  );

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-semibold text-red-600">
          Error loading activities
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
            Manage Activities
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View, create, and update travel activities for DewaTravel.
          </p>
        </div>
        <Button size="lg" onClick={startCreate}>
          + Add New Activity
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        title="All Activities"
        data={activities || []}
        columns={columns}
        searchFields={searchFields}
        searchValue={search}
        onSearchChange={setSearch}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
        emptyMessage="No activities found. Try adjusting your search or add a new activity."
        searchPlaceholder="Search by title, city, province, or category..."
        onRowClick={openDetail}
      />

      {/* Detail modal */}
      {detailActivity && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Activity Detail
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Full information about this activity.
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
              {/* Images */}
              <div className="grid gap-3 sm:grid-cols-3">
                {detailActivity.imageUrls?.length ? (
                  detailActivity.imageUrls.map((url, idx) => (
                    <img
                      key={url || idx}
                      src={url || fallbackimg}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackimg;
                      }}
                      alt={detailActivity.title}
                      className="h-32 w-full rounded-lg object-cover sm:h-36"
                      loading="lazy"
                    />
                  ))
                ) : (
                  <img
                    src={fallbackimg}
                    alt={detailActivity.title}
                    className="h-32 w-full rounded-lg object-cover sm:h-36"
                  />
                )}
              </div>

              {/* Main info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {detailActivity.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {detailActivity.description || 'No description.'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Category</p>
                  <p className="text-gray-600">
                    {detailActivity.category?.name || '—'}
                  </p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Location</p>
                  <p className="text-gray-600">
                    {detailActivity.city || '—'}, {detailActivity.province || '—'}
                  </p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Price</p>
                  <p className="text-gray-600">
                    {detailActivity.price
                      ? `Rp ${detailActivity.price.toLocaleString('id-ID')}`
                      : '—'}
                  </p>
                </div>
                {detailActivity.price_discount ? (
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-gray-700">
                      Discounted Price
                    </p>
                    <p className="text-gray-600">
                      Rp {detailActivity.price_discount.toLocaleString('id-ID')}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {selected ? 'Edit Activity' : 'Add New Activity'}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Fill in the details below to {selected ? 'update' : 'create'} an
                  activity.
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
              {/* Category & Images */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Category *
                  </label>

                  {categoriesError ? (
                    <>
                      <input
                        name="categoryId"
                        value={formState.categoryId || ''}
                        onChange={handleFormChange}
                        placeholder="Paste category ID from Categories page"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <p className="mt-1 text-xs text-red-500">
                        Failed to load categories, please paste the ID manually.
                      </p>
                    </>
                  ) : (
                    <select
                      name="categoryId"
                      value={formState.categoryId || ''}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      required
                      disabled={categoriesLoading}
                    >
                      <option value="">
                        {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                      </option>
                      {Array.isArray(categories) &&
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  )}

                  {formErrors.categoryId && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.categoryId}
                    </p>
                  )}
                </div>

                <div>
                  <ImageUpload
                    label="Images *"
                    value={formState.imageUrls || []}
                    onChange={(urls) => {
                      setFormState((prev) => ({
                        ...prev,
                        imageUrls: urls,
                      }));
                      setFormErrors((prev) => {
                        if (!prev.imageUrls) return prev;
                        const next = { ...prev };
                        delete next.imageUrls;
                        return next;
                      });
                    }}
                    helperText="Upload one or more images; URLs will be saved automatically."
                  />
                  {formErrors.imageUrls && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.imageUrls}
                    </p>
                  )}
                </div>
              </div>

              {/* Main fields */}
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={formState.title || ''}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formState.price}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                    min={0}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    name="city"
                    value={formState.city || ''}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Province *
                  </label>
                  <input
                    name="province"
                    value={formState.province || ''}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {formErrors.province && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.province}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formState.description || ''}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full resize-vertical rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
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
                  Save Activity
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityManagement;