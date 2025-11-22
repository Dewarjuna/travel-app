const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);
  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      
      {/* Show "1 ..." for gaps */}
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            1
          </button>
          {start > 2 && <span className="px-2">...</span>}
        </>
      )}
      
      {/* Page numbers */}
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      {/* Show "... N" for gaps */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;