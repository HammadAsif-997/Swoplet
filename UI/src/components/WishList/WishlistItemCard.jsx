import React from "react";
import { Trash2, ExternalLink, Check } from "lucide-react";

const WishlistItemCard = ({
  item,
  onRemove,
  bulkSelectMode,
  isSelected,
  onSelect,
}) => {
  const { id, name, price, image, description, category } = item;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(id);
  };

  const handleCardClick = () => {
    if (bulkSelectMode) {
      onSelect(id);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300
        flex flex-col h-full
        ${bulkSelectMode ? "cursor-pointer transform hover:scale-[1.02]" : ""}
        ${isSelected ? "ring-2 ring-blue-500" : ""}
      `}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3">
          {bulkSelectMode && (
            <div
              className={`
                w-6 h-6 flex items-center justify-center rounded-full border-2
                ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-blue-800 border-transparent"
                    : "bg-white border-gray-300"
                }
              `}
            >
              {isSelected && <Check className="h-4 w-4 text-white" />}
            </div>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {name}
          </h3>
          <span className="font-bold text-blue-600">{formatPrice(price)}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
          {description}
        </p>
        {!bulkSelectMode && (
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => window.open("#", "_blank")}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center group"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </button>
            <button
              onClick={handleRemoveClick}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group"
            >
              <Trash2 className="h-4 w-4 mr-2 text-gray-500 group-hover:text-red-500 transition-colors" />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistItemCard;
