import Button from '../../../components/ui/Button';
import fallbackImg from '../../../assets/candi.jpg';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export const createCategoryColumns = ({
  onDetail,
  onEdit,
  onDelete,
  deletingId,
}) => [
  {
    header: 'IMAGE',
    key: 'imageUrl',
    className: 'w-20',
    render: (item) => (
      <div className="h-12 w-16 overflow-hidden rounded-lg">
        <img
          src={item.imageUrl || fallbackImg}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImg;
          }}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-200 hover:scale-110"
          loading="lazy"
        />
      </div>
    ),
  },
  {
    header: 'NAME',
    key: 'name',
    className: 'min-w-[150px]',
    render: (item) => (
      <p className="font-semibold text-gray-900">{item.name}</p>
    ),
  },
  {
    header: 'CREATED',
    key: 'createdAt',
    className: 'hidden md:table-cell',
    render: (item) => (
      <span className="text-sm text-gray-600">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '—'}
      </span>
    ),
  },
  {
    header: 'ACTIONS',
    key: 'actions',
    align: 'right',
    className: 'w-auto whitespace-nowrap',
    render: (item) => (
      <div className="flex flex-nowrap justify-end gap-1 sm:gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDetail(item);
          }}
          aria-label={`View details of ${item.name}`}
        >
          <span className="hidden sm:inline">Detail</span>
          <EyeIcon className="h-4 w-4 sm:hidden" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          aria-label={`Edit ${item.name}`}
        >
          <span className="hidden sm:inline">Edit</span>
          <PencilSquareIcon className="h-4 w-4 sm:hidden" />
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          loading={deletingId === item.id}
          aria-label={`Delete ${item.name}`}
        >
          <span className="hidden sm:inline">Delete</span>
          <TrashIcon className="h-4 w-4 sm:hidden" />
        </Button>
      </div>
    ),
  },
];