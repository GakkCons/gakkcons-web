// components/Error.tsx
import React from 'react';
import '../style.css';

interface ErrorProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

const Error: React.FC<ErrorProps> = ({ message, onClose, isOpen }) => {
  if (!isOpen) return null; // Don't render the error if not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-left text-red-600 mb-4">Error</h2>
        <p className="text-md text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
