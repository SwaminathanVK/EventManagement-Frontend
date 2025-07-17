//  /src/pages/PaymentSuccessPage.jsx

import React, { useEffect, useState } from 'react'; // Added useState
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Added useLocation
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTicketAlt, FaHome, FaSpinner, FaTimesCircle } from 'react-icons/fa'; // Added more icons
import API from '../../api/axios'; // Import your API instance
import { useAuth } from '../../Context/AuthContext'; // Import useAuth

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To access URL query parameters
  const { isAuthenticated, loading } = useAuth(); // Track auth readiness

  const [confirmationStatus, setConfirmationStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id'); // Get the session_id from URL

    // Run only after auth is loaded and user is authenticated
    if (!loading && isAuthenticated && sessionId) {
      const confirmPayment = async () => {
        try {
          const res = await API.post('api/payment/confirm/payment', { sessionId });

          if (res.status === 200) {
            setConfirmationStatus('success');
            toast.success('Payment successfully verified and tickets confirmed!', {
              autoClose: 5000,
              position: 'top-center',
            });
            // Optional: Redirect to my-tickets after a delay for user to read success message
            setTimeout(() => {
              navigate('/user/my-tickets');
            }, 5000); // Redirect after 5 seconds
          } else {
            // This part might be hit if the backend sends a non-200 but not an error status
            setConfirmationStatus('error');
            setErrorMessage(res.data?.message || 'Payment verification failed with an unexpected status.');
            toast.error(res.data?.message || 'Failed to verify payment. Please contact support.', { autoClose: false });
          }
        } catch (err) {
          console.error('Error confirming payment:', err);
          setConfirmationStatus('error');
          setErrorMessage(err.response?.data?.message || 'An error occurred during payment verification. Please try again or contact support.');
          toast.error(err.response?.data?.message || 'Payment verification failed. Please contact support.', { autoClose: false });
        }
      };

      confirmPayment();
    } else {
      // No session_id found in URL or user not authenticated
      setConfirmationStatus('error');
      setErrorMessage('Payment session ID missing or user not authenticated. Cannot verify payment.');
      toast.error('Payment verification failed: Missing session ID or not authenticated.', { autoClose: false });
    }
  }, [location, isAuthenticated, loading, navigate]); // Rerun if URL location changes or auth status changes

  // Conditional rendering based on confirmation status
  if (confirmationStatus === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-blue-50 text-center px-4 py-10">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300">
          <FaSpinner className="text-blue-500 text-8xl mx-auto mb-6 animate-spin" />
          <h2 className="text-3xl font-extrabold text-blue-700 mb-4">Verifying Payment...</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Please wait while we confirm your payment and process your tickets. Do not close this page.
          </p>
        </div>
      </div>
    );
  }

  if (confirmationStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-red-50 text-center px-4 py-10">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 hover:scale-[1.01]">
          <FaTimesCircle className="text-red-500 text-8xl mx-auto mb-6 animate-shake" />
          <h2 className="text-4xl font-extrabold text-red-700 mb-4">Payment Verification Failed!</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {errorMessage || 'There was an issue verifying your payment. Your tickets may not have been issued.'}
          </p>
          <p className="text-md text-gray-600 mb-8">
            Please check your email for a confirmation or contact support if you believe this is an error.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/user/my-tickets"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaTicketAlt className="mr-2 -ml-1 h-5 w-5" />
              Check My Tickets
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaHome className="mr-2 -ml-1 h-5 w-5" />
              Browse More Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default success display (after 'success' status is set)
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-green-50 text-center px-4 py-10">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 hover:scale-[1.01]">
        <FaCheckCircle className="text-green-500 text-8xl mx-auto mb-6 animate-bounce-in" />
        <h2 className="text-4xl font-extrabold text-green-700 mb-4">Payment Successful!</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Fantastic! Your booking has been successfully confirmed. Your tickets are ready!
        </p>
        <p className="text-md text-gray-600 mb-8">
          You'll automatically be redirected to your **My Tickets** page in a few seconds.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/user/my-tickets"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaTicketAlt className="mr-2 -ml-1 h-5 w-5" />
            View My Tickets
          </Link>
          <Link
            to="/events"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaHome className="mr-2 -ml-1 h-5 w-5" />
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;