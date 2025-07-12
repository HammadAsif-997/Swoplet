// Wishlist utility functions

import { BASE_URL } from '../constants/config';

/**
 * Add a product to the user's wishlist
 * @param {number} productId - The ID of the product to add
 * @returns {Promise<Object>} - Response with success status and message
 */
export const addToWishlist = async (productId) => {
  try {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Please log in to add items to your wishlist' 
      };
    }

    // Make API request to add product to wishlist
    const response = await fetch(`${BASE_URL}favourites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({
        user_id: parseInt(userId),
        product_id: parseInt(productId)
      })
    });

    const data = await response.json();

    if (response.ok && (data.status === 200 || data.status === 201)) {
      return { 
        success: true, 
        message: data.message || 'Product added to wishlist',
        data: data.data
      };
    } else {
      return { 
        success: false, 
        message: data.message || 'Failed to add product to wishlist' 
      };
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { 
      success: false, 
      message: 'An error occurred. Please try again.' 
    };
  }
};

/**
 * Remove a product from the user's wishlist
 * @param {number} productId - The ID of the product to remove
 * @returns {Promise<Object>} - Response with success status and message
 */
export const removeFromWishlist = async (productId) => {
  try {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Please log in to manage your wishlist' 
      };
    }

    // Make API request to remove product from wishlist
    const response = await fetch(`${BASE_URL}favourites?user_id=${userId}&product_id=${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    const data = await response.json();

    if (response.ok && data.status === 200) {
      return { 
        success: true, 
        message: data.message || 'Product removed from wishlist' 
      };
    } else {
      return { 
        success: false, 
        message: data.message || 'Failed to remove product from wishlist' 
      };
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { 
      success: false, 
      message: 'An error occurred. Please try again.' 
    };
  }
};

/**
 * Check if a product is in the user's wishlist
 * @param {number} productId - The ID of the product to check
 * @returns {Promise<boolean>} - True if product is in wishlist
 */
export const isProductInWishlist = async (productId) => {
  try {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!userId) {
      return false;
    }

    // Make API request to get user's wishlist
    const response = await fetch(`${BASE_URL}favourites?user_id=${userId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    const data = await response.json();

    if (response.ok && data.status === 200 && data.data && data.data.favourites) {
      // Check if the product is in the wishlist
      return data.data.favourites.some(item => 
        item.product_id === productId || 
        (item.productlisting && item.productlisting.id === productId)
      );
    }
    
    return false;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};
