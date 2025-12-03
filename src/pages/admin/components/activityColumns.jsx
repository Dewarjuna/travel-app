import Button from '../../../components/ui/Button';
import fallbackImg from '../../../assets/candi.jpg';

export const createActivityColumns = ({
  onDetail,
  onEdit,
  onDelete,
  deletingId,
}) => [
  {
    header: 'IMAGE',
    key: 'imageUrls',
    className: 'w-20',
    render: (item) => (
      <div className="h-12 w-16 overflow-hidden rounded-lg">
        <img
          src={item.imageUrls?.[0] || fallbackImg}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImg;
          }}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-200 hover:scale-110"
          loading="lazy"
        />
      </div>
    ),
  },
  {
    header: 'TITLE',
    key: 'title',
    className: 'min-w-[200px]',
    render: (item) => (
      <div className="max-w-xs">
        <p className="truncate font-semibold text-gray-900" title={item.title}>
          {item.title}
        </p>
        <p
          className="mt-0.5 line-clamp-2 text-xs text-gray-500"
          title={item.description}
        >
          {item.description || 'No description'}
        </p>
      </div>
    ),
  },
  {
    header: 'LOCATION',
    key: 'location',
    className: 'hidden sm:table-cell',
    render: (item) => (
      <div>
        <p className="font-medium text-gray-900">{item.city || '—'}</p>
        <p className="text-xs text-gray-500">{item.province || '—'}</p>
      </div>
    ),
  },
  {
    header: 'CATEGORY',
    key: 'category',
    className: 'hidden md:table-cell',
    render: (item) => (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
        {item.category?.name || '—'}
      </span>
    ),
  },
  {
    header: 'PRICE',
    key: 'price',
    align: 'right',
    className: 'hidden lg:table-cell',
    render: (item) => (
      <div className="text-right">
        <p className="font-semibold text-emerald-600">
          {item.price ? `Rp ${item.price.toLocaleString('id-ID')}` : '—'}
        </p>
        {item.price_discount && (
          <p className="text-xs text-gray-400 line-through">
            Rp {item.price_discount.toLocaleString('id-ID')}
          </p>
        )}
      </div>
    ),
  },
  {
    header: 'ACTIONS',
    key: 'actions',
    align: 'right',
    className: 'w-auto',
    render: (item) => (
      <div className="flex flex-wrap justify-end gap-1 sm:gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDetail(item);
          }}
          aria-label={`View details of ${item.title}`}
        >
          <span className="hidden sm:inline">Detail</span>
          <span className="sm:hidden">👁</span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          aria-label={`Edit ${item.title}`}
        >
          <span className="hidden sm:inline">Edit</span>
          <span className="sm:hidden">✏️</span>
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          loading={deletingId === item.id}
          aria-label={`Delete ${item.title}`}
        >
          <span className="hidden sm:inline">Delete</span>
          <span className="sm:hidden">🗑</span>
        </Button>
      </div>
    ),
  },
];