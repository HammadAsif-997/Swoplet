import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../Marketplace/DropdownMenu";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userId"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("userId"));
    };

    // Listen for changes across tabs/windows
    window.addEventListener("storage", handleStorageChange);

    // Run once on mount
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCreateClick = () => navigate("/create-product");
  const handleLoginClick = () => navigate("/login");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-bold text-black hover:text-gray-800 transition-colors duration-300"
          >
            Swoplet
          </a>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleCreateClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Post an item
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 text-sm font-medium rounded-md text-blue-600 border border-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                Login
              </button>
            )}

            {isLoggedIn && (
              <div className="ml-4">
                <DropdownMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
