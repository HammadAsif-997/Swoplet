import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import Pagination from "./Pagination";
import ProductCard from "../Common/ProductCard";
import SearchBar from "../Common/SearchBar";
import { BASE_URL } from "../../constants/config";
import { useApiRequest } from "../../../hooks/useApiRequest";
import useDebounce from "../../../hooks/useDebounce";

function Marketplace() {
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortConfig, setSortConfig] = useState({
    sort_by: "created_at",
    sort_order: "DESC"
  });

  const [filters, setFilters] = useState({
    categories: [],
    conditions: [],
    priceRange: { min: 0, max: 1000 },
    location: "",
    searchQuery: ""
  });

  const {
    loading,
    error,
    makeRequest: fetchProducts
  } = useApiRequest(null, 'POST', null, false);

  // Set search query from ?search param on mount
  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";

    setFilters((prev) => ({
      ...prev,
      searchQuery: initialSearch
    }));

    setCurrentPage(1);
  }, []);

  // Load category/condition options only
  useEffect(() => {
    const fetchCategoriesAndConditions = async () => {
      try {
        const [catRes, condRes] = await Promise.all([
          fetch(`${BASE_URL}product-categories`),
          fetch(`${BASE_URL}product-conditions`)
        ]);

        const [catData, condData] = await Promise.all([
          catRes.json(),
          condRes.json()
        ]);

        if (catData.status === 200) setCategoryOptions(catData.data);
        if (condData.status === 200) setConditionOptions(condData.data);
      } catch (error) {
        console.error("Error loading categories or conditions:", error);
      }
    };
    fetchCategoriesAndConditions();
  }, []);


  const fetchFilteredProducts = async () => {
    const payload = {
      page: currentPage,
      limit: itemsPerPage,
      sort_by: sortConfig.sort_by,
      sort_order: sortConfig.sort_order
    };

    const trimmedQuery = filters.searchQuery?.trim();

    if (trimmedQuery && trimmedQuery.length > 0) {
      payload.query = trimmedQuery;
    }

    if (filters.categories.length > 0) {
      payload.category_ids = filters.categories.map(c => c.id);
    }

    if (filters.conditions.length > 0) {
      payload.condition_ids = filters.conditions.map(c => c.id);
    }

    if (filters.priceRange.min > 0) {
      payload.min_price = filters.priceRange.min;
    }

    if (filters.priceRange.max >= 0) {
      payload.max_price = filters.priceRange.max;
    }

    if (filters.location?.trim()) {
      payload.location = filters.location.trim();
    }

    const result = await fetchProducts({
      url: `${BASE_URL}products/search`,
      method: "POST",
      body: payload
    });

    if (result.success && result.data) {
      setProducts(result.data.products || []);
      setTotalItems(result.data.pagination?.total || 0);
      setTotalPages(result.data.pagination?.pages || 1);
    }
  };


  const debouncedFetchProducts = useDebounce(fetchFilteredProducts, 500);

  useEffect(() => {
    debouncedFetchProducts();
  }, [filters, currentPage, itemsPerPage, sortConfig]);

  const handleSearch = (query) => {
    console.log("query")
    setFilters(prev => ({ ...prev, searchQuery: query }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortChange = (sortOrder) => {
    let sort_by = "created_at", sort_order = "DESC";
    if (sortOrder === "oldest") sort_order = "ASC";
    if (sortOrder === "price_low") [sort_by, sort_order] = ["price", "ASC"];
    if (sortOrder === "price_high") [sort_by, sort_order] = ["price", "DESC"];
    setSortConfig({ sort_by, sort_order });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Shared Search Bar */}
      <SearchBar onSearch={handleSearch} value={filters.searchQuery} />

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="text-white bg-blue-600 px-4 py-2 rounded"
        >
          {sidebarOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        {(sidebarOpen || window.innerWidth >= 768) && (
          <aside className="w-full md:w-64 border-r bg-white">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categoryOptions}
              conditions={conditionOptions}
            />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">{totalItems} items found</p>
            <select
              className="border px-2 py-1 rounded"
              value={
                sortConfig.sort_by === "created_at"
                  ? sortConfig.sort_order === "DESC" ? "newest" : "oldest"
                  : sortConfig.sort_order === "ASC" ? "price_low" : "price_high"
              }
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchFilteredProducts}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No products found matching your criteria
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default Marketplace;
