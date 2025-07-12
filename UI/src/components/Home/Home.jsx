import { useState } from "react";
import { useEffect } from "react";
import { useApiRequest } from "../../../hooks/useApiRequest";

import SearchBar from "../Common/SearchBar";
import ErrorState from "../Common/ErrorState";
import LoadingState from "../Common/LoadingState";

import Banner from "./component/Banner";
import WelcomeSection from "./component/WelcomeSection";
import ProductGrid from "./component/ProductGrid";

import { BASE_URL } from "../../constants/config";
import { useNavigate } from "react-router-dom";



function Home() {

  // === Constants ===
  const BANNER_PROPS = {
    title: "Buy, Sell & Exchange",
    imageUrl: "https://www.hs-fulda.de/fileadmin/user_upload/Hochschulkommunikation/Startseite_2025/HS-Sommer-HK-148.jpg",
    description: "Within Fulda"
  };

  const WELCOME_PROPS = {
    title: "👋 Welcome to",
    appName: "Swoplet Marketplace",
    description: "Discover amazing products, connect with sellers around Fulda, and easily list your own items to sell or exchange. 🚀"
  };
  const navigate = useNavigate();
  const { data: products, loading, error, makeRequest } = useApiRequest(
    `${BASE_URL}products/approved`
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    makeRequest();
  }, []);

  function renderContent() {
    if (loading) return <LoadingState />;
    if (error || !products || products.length === 0) {
      return <ErrorState message={error || "No products found"} onRetry={makeRequest} />;
    }

    return <ProductGrid products={products} />;
  }

  const handleSearch = (query) => {
    setSearch(query)
    navigate(`/marketplace?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SearchBar onSearch={handleSearch} value={search} />
      <Banner {...BANNER_PROPS} />
      <WelcomeSection {...WELCOME_PROPS} />

      <section className="px-4 md:px-16 py-6">
        {renderContent()}
      </section>
    </div>


  );
}

export default Home;

