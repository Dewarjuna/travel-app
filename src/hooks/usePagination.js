import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Calculate and memoize the sliced items for current page
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  // Change page safely (between 1 and totalPages)
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
    //window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};