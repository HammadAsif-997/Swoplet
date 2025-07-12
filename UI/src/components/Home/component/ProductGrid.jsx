import ProductCard from "../../Common/ProductCard";
import Button from "../../Common/Button";


const ProductGrid = ({ products }) => {

    return (
        <div>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-4 mt-2">Featured Products</h2>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, 12).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Go to Marketplace */}
            <div className="flex justify-center mt-8">
                <Button href="/marketplace">Go to MarketPlace</Button>
            </div>


        </div>
    );
};

export default ProductGrid;
