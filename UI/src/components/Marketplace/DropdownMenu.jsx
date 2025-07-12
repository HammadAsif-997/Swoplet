import React from "react";
import { useNavigate, Link } from "react-router-dom";

function DropdownMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative group inline-block">
      {/* Trigger Button */}
      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div
        className="absolute right-0 top-full mt-1 w-44 bg-white border rounded-lg shadow-lg
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    transition-all duration-200 z-50"
      >
        <Link
          to="/userprofile"
          className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
        >
          My Profile
        </Link>
        <Link
          to="/wishlist"
          className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
        >
          My Wishlist
        </Link>
        <Link
          to="/messages"
          className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
        >
          My Messages
        </Link>
        <a
          href="#"
          className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
          onClick={handleLogout}
        >
          Logout
        </a>
      </div>
    </div>
  );
}

export default DropdownMenu;
