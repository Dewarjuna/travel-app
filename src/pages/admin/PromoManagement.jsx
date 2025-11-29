import { useState, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { promoService } from '../../api/services/promoService';
import { usePromos } from '../../hooks/usePromos';
import AdminTable from '../../components/layout/AdminTable';
import Button from '../../components/ui/Button';
import ImageUpload from '../../components/ui/ImageUpload';
import fallbackimg from '../../assets/candi.jpg';
import { notifySuccess, notifyError } from '../../components/ui/notifications';
const EMPTY_FORM = {
  title: '',
  description: '',
  imageUrl: '',
  terms_condition: '',
  promo_code: '',
  promo_discount_price: '',
  minimum_claim_price: '',
};

const PromoManagement = () => {
  const { promos, loading, error, refresh } = usePromos();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [detailPromo, setDetailPromo] = useState(null);

  // Delete
  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: 'Delete promo?',
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
        await promoService.remove(id);
        await refresh();
        setCurrentPage(1);
        notifySuccess('Promo deleted successfully');
      } catch (err) {
        notifyError('Failed to delete promo. Please try again later.');
        console.error('Failed to delete promo', err);
      } finally {
        setDeletingId(null);
      }
    },
    [refresh]
  );

  // Edit
  const startEdit = useCallback((promo) => {
    setFormState({
      title: promo.title || '',
      description: promo.description || '',
      imageUrl: promo.imageUrl || '',
      terms_condition: promo.terms_condition || '',
      promo_code: promo.promo_code || '',
      promo_discount_price:
        promo.promo_discount_price != null ? promo.promo_discount_price.toString() : '',
      minimum_claim_price:
        promo.minimum_claim_price != null ? promo.minimum_claim_price.toString() : '',
    });
    setFormErrors({});
    setSelected(promo);
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
  const openDetail = useCallback((promo) => {
    setDetailPromo(promo);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailPromo(null);
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
    const {
      title,
      description,
      imageUrl,
      terms_condition,
      promo_code,
      promo_discount_price,
      minimum_claim_price,
    } = formState;

    if (!title || !title.trim()) {
      errors.title = 'Title is required.';
    }

    if (!description || !description.trim()) {
      errors.description = 'Description is required.';
    }

    if (!imageUrl || !imageUrl.trim()) {
      errors.imageUrl = 'Image is required.';
    }

    if (!terms_condition || !terms_condition.trim()) {
      errors.terms_condition = 'Terms & conditions are required.';
    }

    if (!promo_code || !promo_code.trim()) {
      errors.promo_code = 'Promo code is required.';
    }

    const discountNumber =
      promo_discount_price === '' || promo_discount_price === undefined
        ? NaN
        : Number(promo_discount_price);
    if (Number.isNaN(discountNumber) || discountNumber <= 0) {
      errors.promo_discount_price = 'Discount price must be greater than 0.';
    }

    const minClaimNumber =
      minimum_claim_price === '' || minimum_claim_price === undefined
        ? NaN
        : Number(minimum_claim_price);
    if (Number.isNaN(minClaimNumber) || minClaimNumber <= 0) {
      errors.minimum_claim_price = 'Minimum claim price must be greater than 0.';
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
          title: formState.title.trim(),
          description: formState.description.trim(),
          imageUrl: formState.imageUrl.trim(),
          terms_condition: formState.terms_condition.trim(),
          promo_code: formState.promo_code.trim(),
          promo_discount_price:
            formState.promo_discount_price === '' ||
            formState.promo_discount_price === undefined
              ? undefined
              : Number(formState.promo_discount_price),
          minimum_claim_price:
            formState.minimum_claim_price === '' ||
            formState.minimum_claim_price === undefined
              ? undefined
              : Number(formState.minimum_claim_price),
        };

        if (selected) {
          await promoService.update(selected.id, payload);
          notifySuccess('Promo updated successfully');
        } else {
          await promoService.create(payload);
          notifySuccess('Promo created successfully');
        }

        setShowForm(false);
        setCurrentPage(1);
        await refresh();
      } catch (err) {
        notifyError('Failed to save promo. Please try again.');
        console.error('Failed to save promo', err);
      } finally {
        setSaving(false);
      }
    },
    [selected, formState, refresh, validateForm]
  );

  // AdminTable
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
            alt={item.title}
            className="h-12 w-20 rounded-lg object-cover"
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
        header: 'CODE',
        key: 'promo_code',
        render: (item) => (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {item.promo_code}
          </span>
        ),
      },
      {
        header: 'DISCOUNT',
        align: 'right',
        render: (item) => (
          <div className="text-right text-sm font-semibold text-emerald-600">
            {item.promo_discount_price
              ? `Rp ${item.promo_discount_price.toLocaleString('id-ID')}`
              : '-'}
          </div>
        ),
      },
      {
        header: 'MIN. CLAIM',
        align: 'right',
        render: (item) => (
          <div className="text-right text-xs text-gray-700">
            {item.minimum_claim_price
              ? `Rp ${item.minimum_claim_price.toLocaleString('id-ID')}`
              : '-'}
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
    () => ['title', 'description', 'promo_code'],
    []
  );

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-semibold text-red-600">
          Error loading promos
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
            Manage Promos
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage discount promos for DewaTravel.
          </p>
        </div>
        <Button size="lg" onClick={startCreate}>
          + Add New Promo
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        title="All Promos"
        data={promos || []}
        columns={columns}
        searchFields={searchFields}
        searchValue={search}
        onSearchChange={setSearch}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
        emptyMessage="No promos found. Try adjusting your search or add a new promo."
        searchPlaceholder="Search by title, description, or promo code..."
        onRowClick={openDetail}
      />

      {/* Detail modal */}
      {detailPromo && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Promo Detail
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Full information about this promo.
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
                  src={detailPromo.imageUrl || fallbackimg}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackimg;
                  }}
                  alt={detailPromo.title}
                  className="h-56 w-full rounded-lg object-cover sm:h-64"
                  loading="lazy"
                />
              </div>

              {/* Main info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {detailPromo.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {detailPromo.description}
                </p>
              </div>

              {/* Code & prices */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Promo Code</p>
                  <p className="text-gray-600">{detailPromo.promo_code || '—'}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Discount Price</p>
                  <p className="text-gray-600">
                    {detailPromo.promo_discount_price
                      ? `Rp ${detailPromo.promo_discount_price.toLocaleString('id-ID')}`
                      : '—'}
                  </p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">Minimum Claim Price</p>
                  <p className="text-gray-600">
                    {detailPromo.minimum_claim_price
                      ? `Rp ${detailPromo.minimum_claim_price.toLocaleString('id-ID')}`
                      : '—'}
                  </p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-gray-700">
                  Terms & Conditions
                </p>
                <div
                  className="prose max-w-none text-sm text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: detailPromo.terms_condition || '—',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {selected ? 'Edit Promo' : 'Add New Promo'}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Fill in the details below to {selected ? 'update' : 'create'} a
                  promo.
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
              {/* Basic info */}
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
                    Promo Code *
                  </label>
                  <input
                    name="promo_code"
                    value={formState.promo_code || ''}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm uppercase tracking-wide focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {formErrors.promo_code && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.promo_code}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formState.description || ''}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full resize-vertical rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  required
                />
                {formErrors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Prices */}
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Price (Rp) *
                  </label>
                  <input
                    type="number"
                    name="promo_discount_price"
                    value={formState.promo_discount_price}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                    min={0}
                  />
                  {formErrors.promo_discount_price && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.promo_discount_price}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Claim Price (Rp) *
                  </label>
                  <input
                    type="number"
                    name="minimum_claim_price"
                    value={formState.minimum_claim_price}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                    min={0}
                  />
                  {formErrors.minimum_claim_price && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.minimum_claim_price}
                    </p>
                  )}
                </div>
              </div>

              {/* Image */}
              <div>
                <ImageUpload
                  label="Promo Image *"
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
                  helperText="Upload one image for this promo."
                />
                {formErrors.imageUrl && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.imageUrl}</p>
                )}
              </div>

              {/* Terms & conditions */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Terms & Conditions *
                </label>
                <textarea
                  name="terms_condition"
                  value={formState.terms_condition || ''}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full resize-vertical rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-mono text-xs focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1. Valid until 31 Dec 2024&#10;2. Applicable for orders above Rp 500,000&#10;3. Cannot be combined with other promos"
                  required
                />
                {formErrors.terms_condition && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.terms_condition}
                  </p>
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
                  Save Promo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoManagement;