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

const ActivityDetailModal = memo(({ isOpen, onClose, activity }) => {
  const formattedPrice = useMemo(() => {
    if (!activity?.price) return '—';
    return `Rp ${activity.price.toLocaleString('id-ID')}`;
  }, [activity?.price]);

  const formattedDiscountPrice = useMemo(() => {
    if (!activity?.price_discount) return null;
    return `Rp ${activity.price_discount.toLocaleString('id-ID')}`;
  }, [activity?.price_discount]);

  const images = useMemo(() => {
    return activity?.imageUrls?.length ? activity.imageUrls : [fallbackImg];
  }, [activity?.imageUrls]);

  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader
        title="Activity Details"
        subtitle="Complete information about this activity"
        onClose={onClose}
      />
      <ModalBody>
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {images.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="group relative aspect-video overflow-hidden rounded-xl"
              >
                <img
                  src={url}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImg;
                  }}
                  alt={`${activity.title} - Image ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Title & Description */}
          <div className="space-y-2 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {activity.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {activity.description || 'No description available.'}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoItem label="Category" value={activity.category?.name} />
            <InfoItem
              label="Location"
              value={
                activity.city || activity.province
                  ? `${activity.city || ''}, ${activity.province || ''}`
                  : null
              }
            />
            <InfoItem label="Price" value={formattedPrice} />
            {formattedDiscountPrice && (
              <InfoItem label="Discount Price" value={formattedDiscountPrice} />
            )}
          </div>

          {/* Additional Info */}
          {(activity.rating || activity.total_reviews) && (
            <div className="flex flex-wrap gap-4 rounded-xl bg-gray-50 p-4">
              {activity.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{activity.rating}</span>
                </div>
              )}
              {activity.total_reviews && (
                <span className="text-sm text-gray-600">
                  ({activity.total_reviews} reviews)
                </span>
              )}
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
});

ActivityDetailModal.displayName = 'ActivityDetailModal';

export default ActivityDetailModal;