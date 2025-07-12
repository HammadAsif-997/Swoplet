import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

function SearchBar({ onSearch, value = "" }) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value); // update if parent changes
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <div className="bg-white py-6 px-4 md:px-16 shadow-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
          <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm border border-gray-200 w-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
            <FiSearch className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              name="search"
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium flex items-center justify-center gap-2">
            <FiSearch className="h-5 w-5" />
            Search
          </button>
        </form>
      </div>
    </div>
  );
}


export default SearchBar;