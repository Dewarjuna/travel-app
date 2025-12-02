// src/components/modal/ModalHeader.jsx
import Button from '../ui/Button';

const ModalHeader = ({ title, subtitle, onClose }) => {
  return (
    <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white px-6 py-4 sm:px-8">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{subtitle}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        aria-label="Close modal"
        className="shrink-0"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </div>
  );
};

export default ModalHeader;