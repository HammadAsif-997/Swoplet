import React, { useState } from "react";
import { Heart, ChevronDown, Trash2, CheckSquare } from "lucide-react";

const WishlistHeader = ({
  itemCount,
  sortOption,
  onSortChange,
  filterOptions,
  onFilterChange,
  categories,
  bulkSelectMode,
  toggleBulkSelectMode,
  selectedCount,
  handleSelectAll,
  handleBulkDelete,
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filterOptions, category });
  };

  const handlePriceRangeChange = (min, max) => {
    onFilterChange({ ...filterOptions, priceRange: { min, max } });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-full mr-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">
              <span className="font-medium">{itemCount}</span> item
              {itemCount !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center transition-all duration-200"
              >
                Sort by
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              {showSortDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fadeIn">
                  <button
                    className={`block px-4 py-2.5 text-sm w-full text-left ${
                      sortOption === "price-asc"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onSortChange("price-asc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className={`block px-4 py-2.5 text-sm w-full text-left ${
                      sortOption === "price-desc"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onSortChange("price-desc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`block px-4 py-2.5 text-sm w-full text-left ${
                      sortOption === "name-asc"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onSortChange("name-asc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Name: A to Z
                  </button>
                  <button
                    className={`block px-4 py-2.5 text-sm w-full text-left ${
                      sortOption === "name-desc"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onSortChange("name-desc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Name: Z to A
                  </button>
                  <button
                    className={`block px-4 py-2.5 text-sm w-full text-left ${
                      sortOption === "date-desc"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onSortChange("date-desc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Newest First
                  </button>
                  <button
                    className={`block px-4 py-2.5 text-sm w-full text-left ${
                      sortOption === "date-asc"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onSortChange("date-asc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Oldest First
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center transition-all duration-200"
              >
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              {showFilterDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fadeIn">
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Category
                      </h3>
                      <div className="space-y-1">
                        {categories.map((category) => (
                          <label key={category} className="flex items-center">
                            <input
                              type="radio"
                              checked={filterOptions.category === category}
                              onChange={() => handleCategoryChange(category)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={
                              filterOptions.priceRange.min === 0 &&
                              filterOptions.priceRange.max === 1000
                            }
                            onChange={() => handlePriceRangeChange(0, 1000)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            All Prices
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={
                              filterOptions.priceRange.min === 0 &&
                              filterOptions.priceRange.max === 50
                            }
                            onChange={() => handlePriceRangeChange(0, 50)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Under $50
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={
                              filterOptions.priceRange.min === 50 &&
                              filterOptions.priceRange.max === 100
                            }
                            onChange={() => handlePriceRangeChange(50, 100)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            $50 - $100
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={
                              filterOptions.priceRange.min === 100 &&
                              filterOptions.priceRange.max === 200
                            }
                            onChange={() => handlePriceRangeChange(100, 200)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            $100 - $200
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={
                              filterOptions.priceRange.min === 200 &&
                              filterOptions.priceRange.max === 1000
                            }
                            onChange={() => handlePriceRangeChange(200, 1000)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            $200 & Above
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {bulkSelectMode ? (
              <>
                <button
                  onClick={handleSelectAll}
                  className="flex items-center px-4 py-2.5 text-sm text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  {selectedCount === itemCount ? "Deselect All" : "Select All"}
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedCount === 0}
                  className={`flex items-center px-4 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedCount})
                </button>
                <button
                  onClick={toggleBulkSelectMode}
                  className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={toggleBulkSelectMode}
                className="flex items-center px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Select Items
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistHeader;
