// src/pages/admin/components/CategoryDetailModal.jsx
import { memo, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody } from '../../../components/modal';
import fallbackImg from '../../../assets/candi.jpg';

const InfoItem = memo(({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="text-sm text-gray-900">{value || '—'}</p>
  </div>
));

InfoItem.displayName = 'InfoItem';

const CategoryDetailModal = memo(({ isOpen, onClose, category }) => {
  const formattedDates = useMemo(() => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    return {
      created: category?.createdAt
        ? new Date(category.createdAt).toLocaleDateString('id-ID', options)
        : '—',
      updated: category?.updatedAt
        ? new Date(category.updatedAt).toLocaleDateString('id-ID', options)
        : '—',
    };
  }, [category?.createdAt, category?.updatedAt]);

  if (!category) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader
        title="Category Details"
        subtitle="Complete information about this category"
        onClose={onClose}
      />
      <ModalBody>
        <div className="space-y-6">
          {/* Image */}
          <div className="overflow-hidden rounded-xl">
            <img
              src={category.imageUrl || fallbackImg}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImg;
              }}
              alt={category.name}
              className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105 sm:h-56"
              loading="lazy"
            />
          </div>

          {/* Name & ID */}
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {category.name}
            </h3>
            {category.id && (
              <p className="mt-1 font-mono text-xs text-gray-400">
                ID: {category.id}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Created At" value={formattedDates.created} />
            <InfoItem label="Last Updated" value={formattedDates.updated} />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
});

CategoryDetailModal.displayName = 'CategoryDetailModal';

export default CategoryDetailModal;