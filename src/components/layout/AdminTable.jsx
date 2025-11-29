import { useMemo } from 'react';
import fallbackimg from '../../assets/candi.jpg';
import Pagination from '../ui/Pagination';

const DEFAULT_ITEMS_PER_PAGE = 10;

const AdminTable = ({
  data = [],
  columns = [],
  searchFields = [],
  searchValue = '',
  onSearchChange,
  currentPage = 1,
  onPageChange,
  loading = false,
  emptyMessage = 'No data found.',
  searchPlaceholder = 'Search...',
  className = '',
  title,
  actions,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  onRowClick, // NEW: optional row click handler
}) => {
  const trimmedSearch = searchValue.trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!trimmedSearch || searchFields.length === 0) return data;

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(trimmedSearch);
      })
    );
  }, [data, trimmedSearch, searchFields]);

  const filteredLength = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(filteredLength / itemsPerPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const currentData = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, safePage, itemsPerPage]);

  const from = filteredLength === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const to = Math.min(safePage * itemsPerPage, filteredLength);

  return (
    <section className={`space-y-4 ${className}`}>
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {title && (
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              {title}
            </h2>
          )}

          {onSearchChange && (
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-400">
                🔍
              </span>
              <input
                className="w-56 rounded-xl border border-gray-200 bg-gray-50/60 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400
                           focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {actions}
        </div>
      </div>

      {/* Table / states */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 sm:py-16">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin sm:h-10 sm:w-10" />
            <p className="text-sm text-gray-500">Loading data…</p>
          </div>
        ) : !currentData.length ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center sm:py-16">
            <span className="text-3xl">📭</span>
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={col.key || idx}
                      className="border-b border-gray-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-6 sm:text-xs"
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.header}
                        {col.description && (
                          <span className="text-[10px] text-gray-400">
                            {col.description}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, rowIdx) => (
                  <tr
                    key={item.id || rowIdx}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    className={`
                      border-b border-gray-100 last:border-b-0
                      ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'}
                      transition-colors hover:bg-blue-50/60
                      ${onRowClick ? 'cursor-pointer' : ''}
                    `}
                  >
                    {columns.map((col, colIdx) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                      const value =
                        col.key && !col.render
                          ? col.key.split('.').reduce((obj, key) => obj?.[key], item)
                          : undefined;

                      const isImageKey =
                        col.key === 'image' ||
                        col.key === 'imageUrl' ||
                        col.key === 'imageUrls';

                      return (
                        <td
                          key={col.key || colIdx}
                          className={`px-4 py-3 align-middle sm:px-6 sm:py-4 ${alignClass}`}
                        >
                          {col.render ? (
                            col.render(item)
                          ) : isImageKey ? (
                            <img
                              src={
                                Array.isArray(value)
                                  ? value?.[0]
                                  : value || fallbackimg
                              }
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackimg;
                              }}
                              alt={item.title || item.name || 'Image'}
                              className="h-12 w-16 rounded-lg object-cover shadow-sm"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-gray-900">
                              {value ?? '-'}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="text-[11px] text-gray-500 sm:text-xs">
              Showing {from}–{to} of {filteredLength}
            </p>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminTable;