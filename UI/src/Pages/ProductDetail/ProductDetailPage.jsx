import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "../../components/Common/SearchBar";
import React, { useState, useEffect } from "react";
import { useApiRequest } from "../../../hooks/useApiRequest";
import { BASE_URL, userId } from "../../constants/config";
import LoadingState from "../../components/Common/LoadingState";
import ErrorState from "../../components/Common/ErrorState";
import { useParams, useNavigate } from "react-router-dom";
import { initiateChatWithSeller } from "../../utils/chatUtils";
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Get user ID from localStorage with fallback to config
  const currentUserId = userId;
  console.log("Current User ID:", currentUserId);
  
  const [mainImage, setMainImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToFavourite, setIsAddingToFavourite] = useState(false);
  const [isProductInFavourite, setIsProductInFavourite] = useState(false);
  const [isContactingSeller, setIsContactingSeller] = useState(false);

  // Use API hook to fetch product details
  const {
    data: product,
    loading,
    error,
    makeRequest,
  } = useApiRequest(`${BASE_URL}listings?id=${productId}`);

  // Fetch product data on component mount
  useEffect(() => {
    makeRequest();
  }, [makeRequest]);

  // Fetch user's favourites and check if current product is in favourites
  useEffect(() => {
    if (!currentUserId) return;

    const fetchFavourites = async () => {
      try {
        const response = await fetch(`${BASE_URL}favourites?user_id=${currentUserId}`);
        const data = await response.json();
        if (data.status === 200) {
          const exists = data.data.favourites.some(
            fav => fav.product_id === parseInt(productId, 10)
          );
          setIsProductInFavourite(exists);
        }
      } catch (error) {
        console.warn("Could not fetch favourites:", error);
      }
    };

    fetchFavourites();
  }, [productId, currentUserId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <p>{product.description}</p>;
      case "details":
        return (
          <ul className="list-disc pl-5">
            <li>Category: {product.category.name}</li>
            <li>Condition: {product.condition.name}</li>
            <li>Location: {product.location}</li>
          </ul>
        );
      case "seller":
        return (
          <ul className="list-disc pl-5">
            <li>Name: {product.creator.username}</li>
            <li>Contact: {product.creator.email}</li>

            {/*Seller review section*/}
            <li className="mt-4 mb-1 font-semibold text-blue-700">Seller Rating</li>
            <li className="list-none p-0 m-0">
              <div className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100 shadow-sm w-fit">
                {/* Star rating display */}
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <span
                      key={star}
                      className={`text-xl ${star <= (product.seller_reviews?.avg_rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-blue-700 font-bold text-base">
                  {product.seller_reviews?.avg_rating ? product.seller_reviews.avg_rating.toFixed(1) : "No reviews yet"}
                </span>
                {product.seller_reviews?.total_rating && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {product.seller_reviews.total_rating} reviews
                  </span>
                )}
              </div>
            </li>
          </ul>
        );
      default:
        return null;
    }
  };

  // Function to handle "Add to Favourite" or "Remove from Favourite" button click
  const handleFavouriteToggle = async () => {
    // If not logged in, redirect to login
    if (!currentUserId) {
      navigate("/login");
      return;
    }

    setIsAddingToFavourite(true);

    try {
      if (isProductInFavourite) {
        // Remove from favourites
        const response = await fetch(
          `${BASE_URL}favourites?user_id=${currentUserId}&product_id=${product.id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          setIsProductInFavourite(false);
          toast.success("Removed from favourites!"); // Display success toast
        } else {
          toast.error("Unable to remove from favourites"); // Display error toast
        }
      } else {
        // Add to favourites
        const response = await fetch(`${BASE_URL}favourites?user_id=${currentUserId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUserId,
            product_id: product.id
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setIsProductInFavourite(true);
          toast.success("Added to favourites!"); // Display success toast
        } else {
          toast.error("Unable to add to favourites: " + data.message); // Display error toast
        }
      }
    } catch (error) {
      console.error("Error adding/removing from favourite:", error);
      toast.error("Network error"); // Display network error toast
    } finally {
      setIsAddingToFavourite(false);
    }
  };

  // Function to handle "Contact Seller" button click
  const handleContactSeller = async () => {
    // If not logged in, redirect to login
    if (!currentUserId) {
      navigate("/login");
      return;
    }

    // Don't allow contacting yourself
    if (parseInt(currentUserId) === product.created_by_id) {
      alert("You cannot contact yourself!");
      return;
    }

    setIsContactingSeller(true);

    try {
      const result = await initiateChatWithSeller(
        parseInt(currentUserId),
        product.created_by_id,
        product.id,
        `Hi, I'm interested in your product "${product.title}".`
      );

      // Store information about the chat we want to open
      localStorage.setItem('activeChatInfo', JSON.stringify({
        sellerId: product.created_by_id,
        productId: product.id,
        sellerName: product.creator.username,
        productTitle: product.title
      }));

      // Navigate to chat page regardless of whether chat existed or was newly created
      navigate("/messages");
    } catch (error) {
      console.error("Error contacting seller:", error);
      alert("Failed to contact seller. Please try again.");
    } finally {
      setIsContactingSeller(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error || !product || product.length === 0) {
    return (
      <ErrorState
        message={error || "No products found"}
        onRetry={makeRequest}
      />
    );
  }

  // Split the tags into an array and render dynamically
  const tags = product.tags?.split(",") || [];

  return (
    <>
      <div className="w-full min-h-screen p-4 md:p-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Carousel and Thumbnails */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative w-full">
              <img
                src={product.mediafiles[mainImage]?.file_path}
                alt="Main"
                className="w-full max-h-[500px] object-cover rounded-lg"
              />
              <button
                onClick={() =>
                  setMainImage(
                    (mainImage - 1 + product.mediafiles.length) %
                    product.mediafiles.length
                  )
                }
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() =>
                  setMainImage((mainImage + 1) % product.mediafiles.length)
                }
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 z-10"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center flex-wrap gap-4 mt-4">
              {product.mediafiles.map((img, idx) => (
                <img
                  key={idx}
                  src={img.file_path}
                  alt={`Thumb ${idx}`}
                  onClick={() => setMainImage(idx)}
                  className={`h-20 w-28 object-cover rounded cursor-pointer border-2 ${mainImage === idx ? "border-blue-500" : "border-gray-300"
                    }`}
                />
              ))}
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-4 border-b">
                {["description", "details", "seller"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-4 capitalize ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                        : "text-gray-500"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm">{renderTabContent()}</div>
            </div>

            <p className="text-xs text-gray-500">
              Posted on: {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Right Sidebar */}
          <div className="bg-gray-50 rounded-lg p-6 shadow space-y-4">
            <h1 className="text-xl font-bold">{product.title}</h1>
            <div className="flex gap-2 text-xs flex-wrap">
              {/* Render tags dynamically */}
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-blue-200 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-lg font-semibold text-green-700">
              £{product.price}
            </p>

            {/* Contact Seller Button */}
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              onClick={handleContactSeller}
              disabled={isContactingSeller || parseInt(currentUserId) === product.created_by_id}
            >
              {isContactingSeller
                ? "Contacting..."
                : parseInt(currentUserId) === product.created_by_id
                  ? "Your Product"
                  : "Contact Seller"}
            </button>

            {/* Add to Favourite Button */}
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              onClick={handleFavouriteToggle}
              disabled={isAddingToFavourite}
            >
              {isAddingToFavourite
                ? "Processing..."
                : isProductInFavourite
                  ? "Remove from Favourite"
                  : "Add to Favourite"}
            </button>

            <div className="bg-yellow-100 p-4 rounded text-sm">
              <p className="font-medium mb-2">
                Want to know avg. market price of this product?
              </p>
              <button className="bg-yellow-400 text-white px-4 py-1 rounded shadow">
                Predict Price
              </button>
              <p className="mt-2 text-gray-700">£4.50 – £7.50</p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer to display the toast notifications */}
    </>
  );
};

export default ProductDetailPage;
