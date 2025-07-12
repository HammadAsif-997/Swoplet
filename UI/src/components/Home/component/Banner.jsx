const Banner = ({ title, imageUrl, description }) => (
    <div
        className="h-64 md:h-80 bg-cover bg-center flex flex-col justify-center items-center text-white text-center"
        style={{ backgroundImage: `url('${imageUrl}')` }}
    >
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        <p className="text-xl md:text-2xl mt-3">{description}</p>
    </div>
);

export default Banner;
