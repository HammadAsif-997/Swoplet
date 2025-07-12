import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "../../../hooks/useApiRequest";
import { BASE_URL } from "../../constants/config";
import { useAuthRedirect } from '../../../hooks/useAuthRedirect';

const UserProfile = () => {
  useAuthRedirect();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(
    "https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png"
  );
  const [imageFile, setImageFile] = useState(null);
  const [bio, setBio] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    makeRequest: fetchProfile,
  } = useApiRequest();

  const {
    loading: updateLoading,
    error: updateError,
    makeRequest: updateProfile,
  } = useApiRequest();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    fetchProfile({
      url: `${BASE_URL}user`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    // eslint-disable-next-line
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile || !bio) {
      setUpdateSuccess(false);
      return;
    }
    const formData = new FormData();
    if (imageFile) formData.append("profileImage", imageFile);
    if (bio) formData.append("bio", bio);
    const { success } = await updateProfile({
      url: `${BASE_URL}user`,
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (success) {
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  const handleViewListings = () => {
    navigate("/mylistings");
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleRatingSellers = () => {
    navigate("/to-rate");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-300 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            {/* Name and Email */}
            <div className="text-center mb-8">
              {profileLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
              ) : profileData && profileData.username && profileData.email ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.username}
                  </h1>
                  <p className="text-gray-500 mt-1">{profileData.email}</p>
                  {profileData.bio && (
                    <p className="text-gray-700 mt-2">Bio: {profileData.bio}</p>
                  )}
                  {profileData.image_url && (
                    <img
                      src={profileData.image_url}
                      alt="Profile"
                      className="mx-auto mt-4 w-32 h-32 rounded-full object-cover border-2 border-blue-600"
                    />
                  )}
                </>
              ) : (
                <div className="text-red-600 text-center mb-4">
                  User data not available.
                </div>
              )}
              {profileError && (
                <div className="text-red-600 text-center mb-4">
                  {profileError}
                </div>
              )}
              {updateSuccess && (
                <div className="text-green-600 text-center mb-4 font-semibold">
                  Profile updated successfully!
                </div>
              )}
              {updateError && (
                <div className="text-red-600 text-center mb-4 font-semibold">
                  {updateError}
                </div>
              )}
            </div>

            {/* Bio Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Tell us about yourself..."
                rows="3"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mb-8">
              <button
                onClick={handleSubmit}
                disabled={updateLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
              >
                Update Profile
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium shadow-sm"
              >
                Cancel
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-4">
              <button
                  onClick={handleViewListings}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium shadow-sm"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path
                      fillRule="evenodd"
                      d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                  />
                </svg>
                View Listings
              </button>
              <button
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium shadow-sm">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                  />
                </svg>
                Wishlist
              </button>
              <button
                  onClick={handleRatingSellers}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium shadow-sm"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path
                      fillRule="evenodd"
                      d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                  />
                </svg>
                Rate the sellers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
