import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ message }) => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md">
        <div className="bg-red-100 p-6 inline-block rounded-full mb-6">
          <AlertTriangle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorState;