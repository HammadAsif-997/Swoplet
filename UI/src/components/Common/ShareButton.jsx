import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "react-toastify";

const ShareButton = ({ 
  productId, 
  productTitle = "product", 
  className = "",
  variant = "icon" // "icon" | "button" | "full"
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/product/${productId}`;

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Try to use native Web Share API first (mobile/modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: productTitle,
          text: `Check out this ${productTitle} on Swoplet!`,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // If user cancels sharing or API fails, fall back to copy
        if (error.name !== 'AbortError') {
          console.log("Share API failed, falling back to copy:", error);
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      // Final fallback - show the URL in a prompt for manual copy
      if (window.prompt) {
        window.prompt("Copy this link:", shareUrl);
      } else {
        toast.error("Failed to copy link. Please copy manually from the address bar.");
      }
    }
  };

  const buttonClasses = {
    icon: "p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200",
    button: "px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-all duration-200 flex items-center gap-2 text-sm",
    full: "w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        className={`${buttonClasses.icon} ${className}`}
        title="Share this product"
        aria-label="Share product"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Share2 className="w-4 h-4 text-gray-600" />
        )}
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleShare}
        className={`${buttonClasses.button} ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Share
          </>
        )}
      </button>
    );
  }

  // Full button variant
  return (
    <button
      onClick={handleShare}
      className={`${buttonClasses.full} ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5" />
          Link Copied!
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5" />
          Share Product
        </>
      )}
    </button>
  );
};

export default ShareButton;