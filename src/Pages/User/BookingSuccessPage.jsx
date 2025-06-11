// src/pages/User/BookingSuccessPage.js

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

// In JavaScript, interfaces are not used.
// The structure of the objects (EventInfo, ConfirmedBookingInfo)
// will be inferred at runtime based on the data received from your API.

const BookingSuccessPage = () => { // Removed React.FC type
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id'); // Get the session ID from the URL
  const [loading, setLoading] = useState(true); // Removed type annotation <boolean>
  const [bookingInfo, setBookingInfo] = useState(null); // Removed type annotation <ConfirmedBookingInfo | null>
  const [error, setError] = useState(null); // Removed type annotation <string | null>

  useEffect(() => {
    const confirmBooking = async () => {
      if (!sessionId) {
        // If no session ID, it's an invalid access
        setError('Invalid booking attempt: Session ID is missing.');
        toast.error('Missing payment session details. Please try booking again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null); // Clear previous errors

        // Make the API call to confirm the payment and booking
        // In JavaScript, no explicit type annotation for the API response is needed
        const res = await API.post('/payment/confirm', { sessionId });

        setBookingInfo(res.data.registration); // Set the confirmed booking information
        toast.success('Your booking has been successfully confirmed!');
      } catch (err) { // Removed type annotation : any
        console.error('Booking confirmation failed:', err); // Log the full error for debugging
        const errorMessage = err.response?.data?.message || 'Failed to confirm your booking. Please try again or contact support.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false); // Always set loading to false
      }
    };

    confirmBooking(); // Call the async function
  }, [sessionId]); // Re-run effect if sessionId changes (though it shouldn't on this page normally)

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-600">
        <FaSpinner className="animate-spin h-16 w-16 mb-4" aria-label="Confirming booking" />
        <p className="text-xl font-medium">Confirming your booking, please wait...</p>
      </div>
    );
  }

  if (error || !bookingInfo) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white shadow-xl rounded-lg text-center border border-red-200">
        <FaExclamationCircle className="text-red-500 text-6xl mx-auto mb-5" />
        <h2 className="text-3xl font-bold mb-3 text-red-700">Booking Unsuccessful!</h2>
        <p className="mb-6 text-gray-700 text-lg">
          {error || 'There was an issue confirming your booking. The payment might have failed, or the session expired.'}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          If you believe this is an error, please check your email for a confirmation, or contact support with your payment details.
        </p>
        <Link
          to="/events"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 text-lg shadow-md"
        >
          Browse Other Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-white shadow-xl rounded-lg text-center border border-green-200">
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-5 animate-bounce-once" />
      <h2 className="text-3xl font-bold mb-3 text-green-700">Booking Successful!</h2>
      <p className="mb-5 text-gray-700 text-lg">
        Congratulations! Your ticket for:
        <br />
        <span className="font-extrabold text-indigo-700 text-2xl mt-2 block">{bookingInfo.event?.title || 'An event'}</span>
        has been successfully confirmed.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Your Booking ID: <strong className="text-gray-800 break-all">{bookingInfo._id}</strong>
      </p>
      <Link
        to="/user/my-tickets"
        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 text-lg shadow-md transform hover:scale-105"
      >
        View My Tickets
      </Link>
    </div>
  );
};

export default BookingSuccessPage;