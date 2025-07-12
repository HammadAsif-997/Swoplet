import React from "react";
import { Heart } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 inline-block rounded-full mb-6">
          <Heart className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Your wishlist is empty
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Items added to your wishlist will appear here. Start browsing and save
          your favorite items!
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Explore Products
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
