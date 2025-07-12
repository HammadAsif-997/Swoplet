const WelcomeSection = ({ title, appName, description }) => (
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 px-4 md:px-16 text-center rounded-md shadow-sm">
    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
      {title} <span className="text-blue-600">{appName}</span>
    </h2>
    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
      {description}
    </p>
  </div>
);

export default WelcomeSection;
