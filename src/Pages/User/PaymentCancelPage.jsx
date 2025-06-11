// src/pages/PaymentCancelPage.jsx

import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTimesCircle, FaArrowLeft, FaHome } from 'react-icons/fa';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Display a more specific toast message if needed, or keep generic
    toast.info('Your payment was cancelled. No charges were made.', {
      autoClose: 5000, // Keep the toast visible a bit longer
      position: 'top-center',
    });

    const timer = setTimeout(() => {
      navigate('/user/dashboard'); // Redirect to dashboard after 5 seconds
    }, 5000); // Increased timeout for better readability of message

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 text-center px-4 py-10">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 hover:scale-[1.01]">
        <FaTimesCircle className="text-red-500 text-8xl mx-auto mb-6 animate-pulse-fade" />
        <h2 className="text-4xl font-extrabold text-red-700 mb-4">Payment Unsuccessful</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          It looks like your payment was cancelled or did not go through. Don't worry, no charges have been applied.
        </p>
        <p className="text-md text-gray-600 mb-8">
          You will be automatically redirected to your **Dashboard** in a few seconds.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/events"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaHome className="mr-2 -ml-1 h-5 w-5" />
            Browse Events
          </Link>
          <Link
            to="/user/dashboard"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;