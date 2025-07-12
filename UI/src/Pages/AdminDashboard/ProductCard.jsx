import React, { useState } from "react";

const AdminProductCard = ({
  title = "Product Title",
  image = "https://via.placeholder.com/150",
  status = "Pending",
  description = "",
  price = "",
  location = "",
  category = "",
  condition = "",
  creator = "",
  mediafiles = [],
  onApprove = () => {},
  onReject = () => {},
  showMenu = true,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const statusColor =
    status === "Approved"
      ? "bg-green-100 text-green-700"
      : status === "Rejected"
      ? "bg-red-100 text-red-700"
      : status === "Reported"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

  const images =
    mediafiles.length > 0 ? mediafiles.map((m) => m.file_path) : [image];

  return (
    <>
      <div
        className="relative bg-white rounded-3xl shadow-xl p-6 flex flex-col w-full max-w-xs border border-gray-100 hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        {showMenu && (
          <div
            className="w-full flex justify-end mb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute top-12 right-4 z-10 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-fade-in">
                <button
                  onClick={() => {
                    onApprove();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    onReject();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-center items-center mb-4">
          <img
            src={images[0]}
            alt={title}
            className="w-48 h-48 object-cover rounded-2xl border-2 border-blue-100 shadow-md bg-gray-50"
          />
        </div>
        <h3 className="text-xl font-bold mb-1 text-center text-blue-900 truncate w-full">
          {title}
        </h3>
        {description && (
          <p className="text-gray-700 text-sm mb-2 line-clamp-2 text-center">
            {description}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-700 mb-2">
          {price && (
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              ${price}
            </span>
          )}
          {location && (
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              📍 {location}
            </span>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 mb-2">
          {category && (
            <span className="bg-blue-50 px-2 py-0.5 rounded">{category}</span>
          )}
          {condition && (
            <span className="bg-green-50 px-2 py-0.5 rounded">{condition}</span>
          )}
        </div>
        {creator && (
          <div className="text-xs text-gray-400 mt-1 text-center">
            By: {creator}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            {/* Carousel */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <img
                  src={images[carouselIndex]}
                  alt={title}
                  className="w-80 h-80 object-cover rounded-2xl border-2 border-blue-100 shadow-md bg-gray-50"
                />
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-blue-100"
                      onClick={() =>
                        setCarouselIndex(
                          (i) => (i - 1 + images.length) % images.length
                        )
                      }
                    >
                      <svg
                        className="w-5 h-5 text-blue-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-blue-100"
                      onClick={() =>
                        setCarouselIndex((i) => (i + 1) % images.length)
                      }
                    >
                      <svg
                        className="w-5 h-5 text-blue-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`w-3 h-3 rounded-full ${
                        idx === carouselIndex ? "bg-blue-700" : "bg-gray-300"
                      }`}
                      onClick={() => setCarouselIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
              {title}
            </h2>
            <div className="flex flex-wrap justify-center gap-3 text-lg text-gray-700 mb-2">
              {price && (
                <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded">
                  ${price}
                </span>
              )}
              {location && (
                <span className="bg-gray-100 px-3 py-1 rounded">
                  📍 {location}
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 mb-2">
              {category && (
                <span className="bg-blue-50 px-3 py-1 rounded">{category}</span>
              )}
              {condition && (
                <span className="bg-green-50 px-3 py-1 rounded">
                  {condition}
                </span>
              )}
            </div>
            {description && (
              <p className="text-gray-700 text-base mb-4 text-center">
                {description}
              </p>
            )}
            {creator && (
              <div className="text-sm text-gray-400 mb-2 text-center">
                By: {creator}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProductCard;
