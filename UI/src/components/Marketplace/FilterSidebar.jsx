import React, { useState, useEffect } from "react";

function FilterSidebar({ filters, onFilterChange, categories = [], conditions = [] }) {
  const handleCategoryChange = (category) => {
    const updatedCategories = filters.categories.some(c => c.id === category.id)
      ? filters.categories.filter(c => c.id !== category.id)
      : [...filters.categories, category];
    onFilterChange({ categories: updatedCategories });
  };

  const handleConditionChange = (condition) => {
    const updatedConditions = filters.conditions.some(c => c.id === condition.id)
      ? filters.conditions.filter(c => c.id !== condition.id)
      : [...filters.conditions, condition];
    onFilterChange({ conditions: updatedConditions });
  };

  const handleMinPriceChange = (value) => {
    onFilterChange({
      priceRange: { ...filters.priceRange, min: parseInt(value) }
    });
  };

  const handleMaxPriceChange = (value) => {
    onFilterChange({
      priceRange: { ...filters.priceRange, max: parseInt(value) }
    });
  };

  const handleLocationChange = (value) => {
    onFilterChange({ location: value });
  };

  return (
    <div className="w-64 p-4 border-r space-y-6">
      <h2 className="font-semibold text-lg">Filters</h2>

      {/* Categories */}
      <div>
        <h3 className="font-medium mb-2">Categories</h3>
        <div className="space-y-1">
          {categories.length > 0 ? (
            categories.map(category => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.categories.some(c => c.id === category.id)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span>{category.name}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          )}
        </div>
      </div>

      {/* Price Range with Labels and two sliders */}
      <div>
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Min: €{filters.priceRange.min}</span>
          <span>Max: €{filters.priceRange.max}</span>
        </div>

        {/* Min price slider */}
        <div className="mb-4">
          <label className="text-xs text-gray-500">Minimum Price</label>
          <input
            type="range"
            min="0"
            max={filters.priceRange.max}
            value={filters.priceRange.min}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Max price slider */}
        <div>
          <label className="text-xs text-gray-500">Maximum Price</label>
          <input
            type="range"
            min={filters.priceRange.min}
            max="1000"
            value={filters.priceRange.max}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="font-medium mb-2">Location</h3>
        <input
          type="text"
          placeholder="Enter location..."
          value={filters.location}
          onChange={(e) => handleLocationChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.target.blur();
            }
          }}
          className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {filters.location && (
          <button
            onClick={() => handleLocationChange("")}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Clear location
          </button>
        )}
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-medium mb-2">Condition</h3>
        <div className="space-y-1">
          {conditions.length > 0 ? (
            conditions.map(condition => (
              <label key={condition.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.conditions.some(c => c.id === condition.id)}
                  onChange={() => handleConditionChange(condition)}
                />
                <span>{condition.name}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Loading conditions...</p>
          )}
        </div>
      </div>

      {/* Reset Filters Button */}
      <button
        onClick={() => onFilterChange({
          categories: [],
          conditions: [],
          priceRange: { min: 0, max: 1000 },
          location: "",

        })}
        className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition mb-2"
      >
        Reset Filters
      </button>
    </div>
  );
}

export default FilterSidebar;