import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/Common/ProductCard";
import AdminProductCard from "./ProductCard";
import { useApiRequest } from "../../../hooks/useApiRequest";
import { BASE_URL } from "../../constants/config";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    makeRequest: fetchProducts,
  } = useApiRequest();
  const { makeRequest: updateStatus } = useApiRequest();
  const {
    data: reportedUsersData,
    loading: reportedUsersLoading,
    error: reportedUsersError,
    makeRequest: fetchReportedUsers,
  } = useApiRequest();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email !== "admin@hs-fulda.de") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "pending") {
      fetchProducts({
        url: `${BASE_URL}products/search`,
        method: "POST",
        body: { status: 0 },
        headers: { "Content-Type": "application/json" },
      });
    } else if (activeTab === "approved") {
      fetchProducts({
        url: `${BASE_URL}products/search`,
        method: "POST",
        body: { status: 1 },
        headers: { "Content-Type": "application/json" },
      });
    } else if (activeTab === "rejected") {
      fetchProducts({
        url: `${BASE_URL}products/search`,
        method: "POST",
        body: { status: 2 },
        headers: { "Content-Type": "application/json" },
      });
    }
  }, [activeTab, fetchProducts]);

  useEffect(() => {
    if (activeTab === "reported") {
      fetchReportedUsers({
        url: `${BASE_URL}reported-users`,
        method: "GET",
      });
    }
  }, [activeTab, fetchReportedUsers]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleApprove = useCallback(
    async (productId) => {
      await updateStatus({
        url: `${BASE_URL}listings/${productId}/update-status`,
        method: "PUT",
        body: { status: 1 },
        headers: { "Content-Type": "application/json" },
      });
      fetchProducts({
        url: `${BASE_URL}products/search`,
        method: "POST",
        body: { status: 0 },
        headers: { "Content-Type": "application/json" },
      });
    },
    [updateStatus, fetchProducts]
  );

  const handleReject = useCallback(
    async (productId) => {
      await updateStatus({
        url: `${BASE_URL}listings/${productId}/update-status`,
        method: "PUT",
        body: { status: 2 },
        headers: { "Content-Type": "application/json" },
      });
      fetchProducts({
        url: `${BASE_URL}products/search`,
        method: "POST",
        body: { status: 0 },
        headers: { "Content-Type": "application/json" },
      });
    },
    [updateStatus, fetchProducts]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-[1600px] mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-black tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage and monitor all listings
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => handleTabChange("pending")}
            className={`p-4 rounded-lg shadow-sm transition-all duration-200 ${
              activeTab === "pending"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold">Pending</span>
              <span className="text-sm mt-1">View pending listings</span>
            </div>
          </button>

          <button
            onClick={() => handleTabChange("approved")}
            className={`p-4 rounded-lg shadow-sm transition-all duration-200 ${
              activeTab === "approved"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold">Approved</span>
              <span className="text-sm mt-1">View approved listings</span>
            </div>
          </button>

          <button
            onClick={() => handleTabChange("rejected")}
            className={`p-4 rounded-lg shadow-sm transition-all duration-200 ${
              activeTab === "rejected"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold">Rejected</span>
              <span className="text-sm mt-1">View rejected listings</span>
            </div>
          </button>

          <button
            onClick={() => handleTabChange("reported")}
            className={`p-4 rounded-lg shadow-sm transition-all duration-200 ${
              activeTab === "reported"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold">Reported</span>
              <span className="text-sm mt-1">View reported users</span>
            </div>
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Listings
          </h2>
          <div className="text-gray-600">
            {/* Content will be dynamically loaded based on activeTab */}
            {activeTab === "pending" && (
              <div className="mb-8">
                {productsLoading ? (
                  <div className="text-center text-blue-700">
                    Loading pending products...
                  </div>
                ) : productsData &&
                  Array.isArray(productsData.products) &&
                  productsData.products.filter(
                    (product) => product.status === 0
                  ).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {productsData.products
                      .filter((product) => product.status === 0)
                      .map((product) => (
                        <AdminProductCard
                          key={product.id}
                          title={product.title}
                          image={
                            product.media_link ||
                            product.image_url ||
                            "https://via.placeholder.com/150"
                          }
                          description={product.description}
                          price={product.price}
                          location={product.location}
                          category={product.category?.name}
                          condition={product.condition?.name}
                          creator={product.creator?.username}
                          mediafiles={product.mediafiles}
                          onApprove={() => handleApprove(product.id)}
                          onReject={() => handleReject(product.id)}
                        />
                      ))}
                  </div>
                ) : productsError ? (
                  <div className="text-center text-red-600">
                    {productsError}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No pending products found.
                  </div>
                )}
              </div>
            )}
            {activeTab === "approved" && (
              <div className="mb-8">
                {productsLoading ? (
                  <div className="text-center text-blue-700">
                    Loading approved products...
                  </div>
                ) : productsError ? (
                  <div className="text-center text-red-600">
                    {productsError}
                  </div>
                ) : productsData &&
                  Array.isArray(productsData.products) &&
                  productsData.products.filter(
                    (product) => product.status === 1
                  ).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {productsData.products
                      .filter((product) => product.status === 1)
                      .map((product) => (
                        <AdminProductCard
                          key={product.id}
                          title={product.title}
                          image={
                            product.media_link ||
                            product.image_url ||
                            "https://via.placeholder.com/150"
                          }
                          description={product.description}
                          price={product.price}
                          location={product.location}
                          category={product.category?.name}
                          condition={product.condition?.name}
                          creator={product.creator?.username}
                          mediafiles={product.mediafiles}
                          showMenu={false}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No approved products found.
                  </div>
                )}
              </div>
            )}
            {activeTab === "rejected" && (
              <div className="mb-8">
                {productsLoading ? (
                  <div className="text-center text-blue-700">
                    Loading rejected products...
                  </div>
                ) : productsError ? (
                  <div className="text-center text-red-600">
                    {productsError}
                  </div>
                ) : productsData &&
                  Array.isArray(productsData.products) &&
                  productsData.products.filter(
                    (product) => product.status === 2
                  ).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {productsData.products
                      .filter((product) => product.status === 2)
                      .map((product) => (
                        <AdminProductCard
                          key={product.id}
                          title={product.title}
                          image={
                            product.media_link ||
                            product.image_url ||
                            "https://via.placeholder.com/150"
                          }
                          description={product.description}
                          price={product.price}
                          location={product.location}
                          category={product.category?.name}
                          condition={product.condition?.name}
                          creator={product.creator?.username}
                          mediafiles={product.mediafiles}
                          showMenu={false}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No rejected products found.
                  </div>
                )}
              </div>
            )}
            {activeTab === "reported" && (
              <div className="mb-8">
                {reportedUsersLoading ? (
                  <div className="text-center text-blue-700">
                    Loading reported users...
                  </div>
                ) : reportedUsersError ? (
                  <div className="text-center text-red-600">
                    {reportedUsersError}
                  </div>
                ) : reportedUsersData &&
                  Array.isArray(reportedUsersData) &&
                  reportedUsersData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportedUsersData.map((report, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl shadow p-6 flex flex-col items-center"
                      >
                        <div className="text-lg font-bold text-blue-800 mb-2">
                          {report.reportedUser?.username || "Unknown User"}
                        </div>
                        <div className="text-gray-600">
                          User ID: {report.reportedUser?.id}
                        </div>
                        <div className="text-red-600 font-semibold mt-2">
                          Reports: {report.reportedUser?.report_count || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No reported users found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ProductCard />
    </div>
  );
};

export default AdminDashboard;
