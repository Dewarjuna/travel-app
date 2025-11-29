import { useState, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { bannerService } from '../../api/services/bannerService';
import { useBanners } from '../../hooks/useBanners';
import AdminTable from '../../components/layout/AdminTable';
import Button from '../../components/ui/Button';
import ImageUpload from '../../components/ui/ImageUpload';
import fallbackimg from '../../assets/candi.jpg';
import { notifyError, notifySuccess } from '../../components/ui/notifications';

const EMPTY_FORM = {
  name: '',
  imageUrl: '',
};

const BannerManagement = () => {
  const { banners, loading, error, refresh } = useBanners();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [detailBanner, setDetailBanner] = useState(null);

  // Delete
  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: 'Delete banner?',
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
        await bannerService.remove(id);
        await refresh();
        setCurrentPage(1);
        notifySuccess('Banner deleted successfully');
      } catch (err) {
        notifyError('Failed to delete banner. Please try again later.');
        console.error('Failed to delete banner', err);
      } finally {
        setDeletingId(null);
      }
    },
    [refresh]
  );

  // Edit
  const startEdit = useCallback((banner) => {
    setFormState({
      name: banner.name || '',
      imageUrl: banner.imageUrl || '',
    });
    setFormErrors({});
    setSelected(banner);
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
  const openDetail = useCallback((banner) => {
    setDetailBanner(banner);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailBanner(null);
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
      errors.name = 'Banner name is required.';
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
          await bannerService.update(selected.id, payload);
          notifySuccess('Banner updated successfully');
        } else {
          await bannerService.create(payload);
          notifySuccess('Banner created successfully');
        }

        setShowForm(false);
        setCurrentPage(1);
        await refresh();
      } catch (err) {
        notifyError('Failed to save banner. Please try again.');
        console.error('Failed to save banner', err);
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
            className="h-12 w-20 rounded-lg object-cover"
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
          Error loading banners
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
            Manage Banners
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage homepage banners for DewaTravel.
          </p>
        </div>
        <Button size="lg" onClick={startCreate}>
          + Add New Banner
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        title="All Banners"
        data={banners || []}
        columns={columns}
        searchFields={searchFields}
        searchValue={search}
        onSearchChange={setSearch}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
        emptyMessage="No banners found. Try adjusting your search or add a new banner."
        searchPlaceholder="Search by banner name..."
        onRowClick={openDetail}
      />

      {/* Detail modal */}
      {detailBanner && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Banner Detail
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Full information about this banner.
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
                  src={detailBanner.imageUrl || fallbackimg}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackimg;
                  }}
                  alt={detailBanner.name}
                  className="h-56 w-full rounded-lg object-cover sm:h-64"
                  loading="lazy"
                />
              </div>

              {/* Main info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {detailBanner.name}
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Created</p>
                  <p className="text-gray-600">
                    {detailBanner.createdAt
                      ? new Date(detailBanner.createdAt).toLocaleDateString('id-ID', {
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
                    {detailBanner.updatedAt
                      ? new Date(detailBanner.updatedAt).toLocaleDateString('id-ID', {
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
                  {selected ? 'Edit Banner' : 'Add New Banner'}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Fill in the details below to {selected ? 'update' : 'create'} a
                  banner.
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
                  Banner Name *
                </label>
                <input
                  name="name"
                  value={formState.name || ''}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., Summer Sale, London Trip"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <ImageUpload
                  label="Banner Image *"
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
                  helperText="Upload one image for this banner."
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
                  Save Banner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;