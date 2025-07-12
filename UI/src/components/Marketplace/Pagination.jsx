import React from "react";

function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;
  
  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Current page and surroundings
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 2 && currentPage > 3) {
        pageNumbers.push('...');
      } else {
        pageNumbers.push(i);
      }
    }
    
    // Add ellipsis if needed
    if (currentPage + 2 < totalPages) {
      pageNumbers.push('...');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="flex justify-center space-x-2">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
      >
        &laquo; Prev
      </button>
      
      {renderPageNumbers().map((page, idx) => (
        <button 
          key={idx}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          className={`px-3 py-1 border rounded ${
            page === currentPage 
              ? 'bg-blue-600 text-white' 
              : page === '...' 
                ? 'cursor-default' 
                : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-100'}`}
      >
        Next &raquo;
      </button>    </div>
  );
}

export default Pagination; // ✅ this is required