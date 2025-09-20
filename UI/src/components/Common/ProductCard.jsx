import React, { useState } from "react";
import Button from "./Button";
import ShareButton from "./ShareButton";
function ProductCard({
  product,
  isInWishlistPage = false,
  isInWishlist = false,
  onWishlistToggle,
  onRemoveFavourite,
}) {
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const imageSrc =
    product.mediafiles?.[0]?.file_path ||
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
  const category = product.category?.name || "Uncategorized";
  const condition = product.condition?.name || "Unknown Condition";

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem("userId") || !onWishlistToggle) return;

    setLoading(true);
    try {
      await onWishlistToggle(product.id);
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onRemoveFavourite) return;

    setLoading(true);
    try {
      await onRemoveFavourite(product.id);
    } catch (error) {
      console.error("Remove favourite failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="relative h-48 mb-2 overflow-hidden rounded">
        <img
          src={imageSrc}
          alt={product.title}
          className="w-full h-full object-contain"
        />

        {/* Share button overlay */}
        <div className="absolute top-2 right-2">
          <ShareButton 
            productId={product.id} 
            productTitle={product.title}
            variant="icon"
          />
        </div>

        {/* Wishlist button overlay */}
        {/* {!isInWishlistPage && (
          <button
            onClick={handleWishlistClick}
            disabled={loading}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${isInWishlist
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white text-gray-600 hover:bg-gray-100"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          > */}
        {/* Heart Icon */}
        {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )} */}
      </div>

      {/* Title & Info */}
      <h3 className="font-semibold text-lg truncate" title={product.title}>
        {product.title}
      </h3>
      <p className="text-sm text-gray-600">{category}</p>
      <p className="text-sm text-gray-600">{condition}</p>
      <p className="text-sm text-gray-500 truncate" title={product.location}>
        📍 {product.location}
      </p>
      <p className="text-blue-600 font-bold mt-1">
        €{parseFloat(product.price).toFixed(2)}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-2">
        <Button href={`/product/${product.id}`}>View Details</Button>

        {isInWishlistPage ? (
          <button
            onClick={handleRemoveClick}
            disabled={loading}
            className="text-red-500 text-sm hover:underline disabled:opacity-50"
          >
            Remove
          </button>
        ) : (
          <span className="text-xs text-gray-500">
            {new Date(product.created_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
