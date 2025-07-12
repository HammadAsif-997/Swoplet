import React, { useState, useEffect } from "react";
import { BASE_URL, userId } from "../../constants/config";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_IMAGES = 4;

const EditProduct = () => {
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    location: "",
    images: [],
    tags: "",
  });

  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    price: "",
    image: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(BASE_URL + "product-categories");
      const data = await response.json();
      if (data.status === 200) {
        setCategories(data.data);
      } else {
        toast.error("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchConditions = async () => {
      const response = await fetch(BASE_URL + "product-conditions");
      const data = await response.json();
      if (data.status === 200) {
        setConditions(data.data);
      } else {
        toast.error("Failed to fetch conditions.");
      }
    };
    fetchConditions();
  }, []);


  // Fetch product data for editing
  const fetchProduct = async () => {
    try {
      const response = await fetch(`${BASE_URL}listings?id=${productId}`);
      const data = await response.json();
      if (response.ok) {
        const product = data.data;
        setFormData({
          name: product.title,
          description: product.description,
          category: product.category_id,
          condition: product.product_condition_id,
          price: product.price,
          location: product.location,
          images: product.mediafiles || [], // Existing images
          tags: product.tags || "",
        });
      } else {
        toast.error("Failed to fetch product details.");
      }
    } catch (error) {
      toast.error("Error fetching product data.");
    }
  };

  // Fetch product details for editing
  useEffect(() => {

    fetchProduct();
  }, [productId]);





  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length <= MAX_IMAGES) {
      setFormData({
        ...formData,
        images: [...formData.images, ...files], // append new images
      });
      setErrorMessages((prev) => ({ ...prev, image: "" }));
    } else {
      setErrorMessages((prev) => ({
        ...prev,
        image: `You can upload a maximum of ${MAX_IMAGES} images.`,
      }));
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for price
    if (formData.price < 0) {
      setErrorMessages((prev) => ({
        ...prev,
        price: "Price cannot be negative.",
      }));
      return;
    }

    // Ensure at least one image is selected
    if (formData.images.length === 0) {
      setErrorMessages((prev) => ({
        ...prev,
        image: "At least one image is required.",
      }));
      return;
    }

    setIsLoading(true);

    // Process tags as an array (split by commas)
    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

    // Handle image URLs: Only upload new images, merge with old ones
    let mediafiles = [];
    let existingImages = formData.images.filter((img) => img.file_path); // Keep existing images

    // Upload new images and get the URLs
    const newImages = formData.images.filter((img) => img instanceof File);
    if (newImages.length > 0) {
      mediafiles = await uploadImage(newImages);
    }

    // Combine existing images with new ones
    const finalMediafiles = [...existingImages, ...mediafiles].map((file) => ({
      file_path: file.file_path || file,
    }));

    if (!Array.isArray(finalMediafiles)) {
      console.error("mediafiles is not an array:", finalMediafiles);
      toast.error("Something went wrong with the image upload.");
      setIsLoading(false);
      return;
    }

    const productData = {
      title: formData.name,
      description: formData.description,
      category_id: formData.category,
      price: parseFloat(formData.price),
      product_condition_id: formData.condition,
      location: formData.location,
      created_by_id: userId,
      mediafiles: finalMediafiles,
      tags: tagsArray,
    };

    try {
      const response = await fetch(`${BASE_URL}listings/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.status === 200) {
        toast.success("Product updated successfully!");
        await fetchProduct();
      } else {
        toast.error("Failed to update product: " + data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong while updating the product!");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow-sm space-y-6">
      <h2 className="text-2xl font-bold text-center">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          rows="3"
          required
        />
        {/* Category and Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Condition</option>
              {conditions.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Price and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            {errorMessages.price && <p className="text-red-500 text-sm">{errorMessages.price}</p>}
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Location</option>
              <option value="berlin">Berlin</option>
              <option value="munich">Munich</option>
              <option value="hamburg">Hamburg</option>
            </select>
          </div>
        </div>
        {/* Tags Input */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            name="tags"
            placeholder="Enter tags separated by commas"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {/* Image Uploads */}
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2">
            {formData.images.map((image, i) => (
              <div
                key={i}
                className="relative border w-20 h-20 rounded flex items-center justify-center overflow-hidden bg-gray-50"
              >
                {image instanceof File ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={image.file_path || image}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                )}
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
                  onClick={() => handleRemoveImage(i)}
                >
                  ×
                </button>
              </div>
            ))}
            {formData.images.length < MAX_IMAGES && (
              <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-blue-500 transition-colors duration-200">
                <label className="cursor-pointer w-full h-full flex flex-col justify-center items-center text-gray-400 hover:text-blue-500 transition-colors duration-200">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
          {errorMessages.image && <p className="text-red-500 text-sm">{errorMessages.image}</p>}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditProduct;
