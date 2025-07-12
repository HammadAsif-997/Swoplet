import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Common/Footer/Footer";
import Marketplace from "./components/Marketplace/Marketplace";
import "./App.css";
import Home from "./components/Home/Home";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import AuthNavbar from "./components/Common/AuthNavbar/AuthNavbar";
import Header from "./components/Common/Header";
import EditProduct from "./Pages/CreateEditProduct/EditProduct";
import WishlistPage from "./components/WishList/WishlistPage";
import UserProfile from "./Pages/UserProfile/UserProfile";
import MyListings from "./Pages/MyListings/MyListings";
import ProductCard from "./components/Common/ProductCard";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import ProductDetailPage from "./Pages/ProductDetail/ProductDetailPage";
import CreateProduct from "./Pages/CreateEditProduct/CreateProduct";
import ImageUpload from "./components/ImageUpload";
import ChatPageOld from "./Pages/Chat/ChatPageOld";
import SellerToReview from "./components/Review/SellerToReview.jsx";

// ✅ Main App component (wraps Router)
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// ✅ Define AppContent below App()
function AppContent() {
  const location = useLocation();
  const { pathname } = location;

  // Conditions
  const showAuthNavbar = pathname == "/login" || pathname == "/signup";
  // const showCommonHeaderbar = pathname !== "/login" && pathname !== "/signup" && pathname !== "/marketplace";
  const showCommonHeaderbar = pathname !== "/login" && pathname !== "/signup";

  return (
    <div className="app">
      {showAuthNavbar && <AuthNavbar />}
      {showCommonHeaderbar && (
        <>
          <Header />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ImageUpload" element={<ImageUpload />} />
        ImageUpload
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/edit-product/:productId" element={<EditProduct />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/mylistings" element={<MyListings />} />
        <Route path="/productcard" element={<ProductCard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/productdetail" element={<ProductDetailPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/messages" element={<ChatPageOld />} />
        {/* <Route path="/messages" element={<ChatPage />} /> */}
        <Route path="/to-rate" element={<SellerToReview />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
