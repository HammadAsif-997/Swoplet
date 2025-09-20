import { useEffect, useState } from "react";
import { BASE_URL } from "../../constants/config";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";
import ProductCard from "../Common/ProductCard";
import { useAuthRedirect } from '../../../hooks/useAuthRedirect';

const Wishlist = () => {
    useAuthRedirect();
    
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');

    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const fetchFavourites = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${BASE_URL}favourites?user_id=${userId}`
            );
            if (!res.ok) throw new Error(`Failed to load wishlist (${res.status})`);
            const json = await res.json();
            // <-- pull out the correct array
            const favs = Array.isArray(json.data.favourites)
                ? json.data.favourites
                : [];
            setFavourites(favs);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavourite = async (productId) => {
        setDeleting(true);
        try {
            const res = await fetch(
                `${BASE_URL}favourites?user_id=${userId}&product_id=${productId}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error(`Failed to remove favourite (${res.status})`);
            await fetchFavourites();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        if (userId) fetchFavourites();
    }, []);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;

    return (
        <div className="px-4 md:px-16 py-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>

            {deleting && (
                <p className="text-sm text-gray-500 mb-2">Updating...</p>
            )}

            {favourites.length === 0 ? (
                <p className="text-gray-600">No items in your wishlist.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favourites.map(fav => (
                        <ProductCard
                            key={fav.product_id}
                            product={fav.productlisting}
                            isInWishlistPage
                            isInWishlist
                            onRemoveFavourite={handleRemoveFavourite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
