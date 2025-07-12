import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white mx-4 mb-4 mt-8">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <Link
              to="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
            >
              Swoplet
            </Link>
            <p className="text-gray-500 text-sm mt-1">
              Your trusted marketplace for buying and selling
            </p>
            <p className="mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium shadow-sm border border-blue-100">
              This website is for educational purposes only
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Swoplet
            </p>
            <p className="text-gray-400 text-xs mt-0.5">All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
