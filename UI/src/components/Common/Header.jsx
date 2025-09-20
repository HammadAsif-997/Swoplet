import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../Marketplace/DropdownMenu";
import { useContacts } from "../../context/ContactContext";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userId"));
  const [unreadCount, setUnreadCount] = useState(0);

  // Safely get context only when needed
  let contextData = null;
  try {
    // Only use context if we're in a route that provides it
    if (window.location.pathname === '/messages') {
      contextData = useContacts();
    }
  } catch (error) {
    // Context not available, use fallback
    contextData = null;
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("userId"));
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 🔔 Fetch unread messages count
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    // Use real-time count if available, otherwise fall back to API
    if (contextData && contextData.totalUnreadCount !== undefined) {
      setUnreadCount(contextData.totalUnreadCount);
      
      // No need for additional socket listeners - context handles it
      return;
    } else {
      // Fallback to API polling for other pages or when context unavailable
      const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/+$/, "");

      const fetchUnread = async () => {
        try {
          const res = await fetch(`${base}/messages/unread-count?user_id=${encodeURIComponent(userId)}`);
          if (!res.ok) return;

          const json = await res.json();
          const count = json?.data?.count || 0;
          setUnreadCount(count);
        } catch (err) {
          console.error("Failed to fetch unread count", err);
        }
      };

      fetchUnread();
      const interval = setInterval(fetchUnread, 10000); // refresh every 10s
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, contextData?.totalUnreadCount]);

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

            {/* 💬 Blue Chat Icon with Unread Badge */}
            {isLoggedIn && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/messages")}
                title="Messages"
              >
                {/* Blue chat bubble icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h2v3l4-3h6a2 2 0 002-2z" />
                </svg>

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
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
