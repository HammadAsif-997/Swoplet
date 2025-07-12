const Carousel = ({images, mainImage}) => (
    
    
    <><div className="relative w-full">
        <img
            src={images[mainImage]}
            alt="Main"
            className="w-full max-h-[500px] object-cover rounded-lg" />
        <button
            onClick={() => setMainImage((mainImage - 1 + images.length) % images.length)}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 z-10"
        >
            <ChevronLeft size={24} />
        </button>
        <button
            onClick={() => setMainImage((mainImage + 1) % images.length)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 z-10"
        >
            <ChevronRight size={24} />
        </button>
    </div>
    {/* Thumbnails */}
    <div className="flex justify-center flex-wrap gap-4 mt-4">
            {images.map((img, idx) => (
                <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    onClick={() => setMainImage(idx)}
                    className={`h-20 w-28 object-cover rounded cursor-pointer border-2 ${mainImage === idx ? "border-blue-500" : "border-gray-300"}`} />
            ))}
        </div></>


)

export default Carousel