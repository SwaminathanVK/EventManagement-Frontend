// src/pages/EventDetailsPage.jsx

import React, { useEffect, useState } from 'react'; // Removed ChangeEvent
import { Link, useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaMapMarkerAlt, FaSpinner, FaInfoCircle, FaTicketAlt } from 'react-icons/fa'; // Added more icons

// In JavaScript, we don't use interfaces.
// The structure of 'TicketType' and 'Event' objects will be inferred at runtime
// based on the data received from the API.

const EventDetailsPage = () => { // Removed React.FC type
  const { eventId } = useParams(); // Removed type annotation for eventId from useParams
  const navigate = useNavigate();

  const [event, setEvent] = useState(null); // Removed type annotation <Event | null>
  const [selectedTicketType, setSelectedTicketType] = useState(''); // Removed type annotation <string>
  const [quantity, setQuantity] = useState(1); // Removed type annotation <number>
  const [loading, setLoading] = useState(true); // Removed type annotation <boolean>
  const [bookingLoading, setBookingLoading] = useState(false); // Removed type annotation <boolean>
  const [error, setError] = useState(null); // Removed type annotation <string | null>

  // Function to fetch event details from the backend
  const fetchEvent = async () => {
    setLoading(true); // Set loading true before fetching
    setError(null); // Clear previous errors
    try {
      // In JavaScript, no explicit type annotation for API response is needed
      const res = await API.get(`/events/${eventId}`);
      setEvent(res.data.event);

      // Optionally pre-select the first ticket type if available
      if (res.data.event.ticketTypes && res.data.event.ticketTypes.length > 0) {
        setSelectedTicketType(res.data.event.ticketTypes[0].type);
      }
    } catch (err) { // Removed type annotation : any
      console.error('Error fetching event details:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load event details.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Set loading false after fetch attempt
    }
  };

  // useEffect hook to fetch event details when the component mounts or eventId changes
  useEffect(() => {
    if (eventId) { // Ensure eventId is available before fetching
      fetchEvent();
    } else {
      setLoading(false); // If no eventId, stop loading state
      setError('Event ID is missing from the URL. Cannot fetch details.');
      toast.error('Event ID is missing from the URL.');
    }
  }, [eventId]); // Dependency array: re-run if eventId changes

  // Function to handle booking (initiates Stripe checkout session)
  const handleBook = async () => {
    // Frontend validation
    if (!selectedTicketType || quantity < 1) {
      toast.error('Please select a ticket type and enter a valid quantity.');
      return;
    }

    const selectedTicket = event?.ticketTypes?.find(t => t.type === selectedTicketType);
    if (!selectedTicket) {
      toast.error('Selected ticket type is invalid.');
      return;
    }
    if (quantity > selectedTicket.quantity) {
      toast.error(`Requested quantity exceeds available tickets (${selectedTicket.quantity} left).`);
      return;
    }
    if (selectedTicket.quantity === 0) {
      toast.error('Selected ticket type is sold out.');
      return;
    }

    setBookingLoading(true); // Set booking loading true
    try {
      // Send booking details to your backend's checkout endpoint
      // In JavaScript, no explicit type annotation for the API response is needed
      const res = await API.post('/payment/checkout', {
        eventId,
        ticketType: selectedTicketType, // This correctly sends the 'type' string (e.g., "General", "VIP")
        quantity,
      });

      // If the backend successfully provides a Stripe checkout URL, redirect the user
      if (res.data && res.data.url) {
        window.location.href = res.data.url; // Redirects browser to Stripe's hosted page
      } else {
        toast.error('Failed to get Stripe checkout URL from backend.');
      }
    } catch (err) { // Removed type annotation : any
      console.error('Booking error:', err);
      // Display specific error message from backend if available, otherwise a generic one
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false); // Set booking loading false after attempt
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-blue-600">
        <FaSpinner className="animate-spin h-16 w-16 mb-4" aria-label="Loading event details" />
        <span className="text-2xl font-medium">Loading event details...</span>
      </div>
    );
  }

  // Render "Event not found" or error message
  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center p-10 bg-white shadow-xl rounded-2xl border border-red-300 max-w-md mx-auto transform transition-transform duration-300 hover:scale-[1.01]">
          <FaInfoCircle className="text-red-500 text-7xl mx-auto mb-6 animate-fade-in" />
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {error || 'Oops! The event you\'re looking for might not exist, or there was an issue loading its details.'}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  // Determine which media to display (image or video)
  const mediaContent = event.images?.[0] ? (
    <img
      src={event.images[0]} // Display the first image from the array
      alt={event.title}
      className="w-full h-96 object-cover rounded-xl shadow-lg border border-gray-200"
    />
  ) : event.videos?.[0] ? (
    <video controls className="w-full h-96 object-cover rounded-xl shadow-lg border border-gray-200">
      <source src={event.videos[0]} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ) : (
    <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-medium rounded-xl shadow-lg border border-gray-200">
      No Media Available
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-2xl rounded-2xl my-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Event Details */}
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{event.title}</h2>

          <div className="flex items-center text-gray-700 text-lg mb-3 gap-3">
            <FaCalendarAlt className="text-2xl text-indigo-600" />
            <span className="font-semibold">
              {new Date(event.date).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
              })}
            </span>
          </div>
          <div className="flex items-center text-gray-700 text-lg mb-6 gap-3">
            <FaMapMarkerAlt className="text-2xl text-green-600" />
            <span className="font-semibold">{event.location}</span>
          </div>

          <p className="mb-8 text-gray-800 leading-relaxed text-base">{event.description || 'No description provided for this event.'}</p>

          {mediaContent}
        </div>

        {/* Right Column: Booking Section */}
        <div className="lg:w-96 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-inner border border-blue-200 sticky top-8 self-start">
          <h4 className="text-3xl font-bold text-blue-800 mb-5 flex items-center gap-3">
            <FaTicketAlt className="text-blue-600" /> Book Your Ticket
          </h4>

          {/* Ticket Type Selector */}
          <div className="mb-5">
            <label htmlFor="ticketTypeSelect" className="block text-gray-700 text-base font-semibold mb-2">Choose Ticket Type</label>
            <select
              id="ticketTypeSelect"
              name="ticketType"
              value={selectedTicketType}
              onChange={(e) => setSelectedTicketType(e.target.value)} // Removed type annotation : ChangeEvent<HTMLSelectElement>
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-base focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="">Select a Ticket Type</option>
              {event.ticketTypes && event.ticketTypes.length > 0 ? (
                event.ticketTypes.map((type) => (
                  <option key={type._id} value={type.type} disabled={type.quantity === 0}>
                    {type.type} - ₹{type.price} {type.quantity > 0 ? `(${type.quantity} left)` : '(Sold Out)'}
                  </option>
                ))
              ) : (
                <option disabled>No ticket types available</option>
              )}
            </select>
            {selectedTicketType && event.ticketTypes?.find(t => t.type === selectedTicketType)?.quantity === 0 && (
                <p className="text-red-500 text-sm mt-1">This ticket type is currently sold out.</p>
            )}
          </div>

          {/* Quantity Input */}
          <div className="mb-6">
            <label htmlFor="quantityInput" className="block text-gray-700 text-base font-semibold mb-2">Quantity</label>
            <input
              id="quantityInput"
              name="quantity"
              type="number"
              value={quantity}
              min={1}
              // Set max quantity to the available quantity of the selected ticket type, if selected
              max={selectedTicketType ? (event.ticketTypes?.find(t => t.type === selectedTicketType)?.quantity || 1) : undefined}
              onChange={(e) => { // Removed type annotation : ChangeEvent<HTMLInputElement>
                const val = Number(e.target.value);
                setQuantity(val > 0 ? val : 1); // Ensure quantity is at least 1
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-base focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
            {quantity > (selectedTicketType && event.ticketTypes?.find(t => t.type === selectedTicketType)?.quantity || Infinity) && (
                <p className="text-red-500 text-sm mt-1">Quantity exceeds available stock.</p>
            )}
          </div>

          {/* Display Total Price */}
          {selectedTicketType && quantity > 0 && event.ticketTypes?.find(t => t.type === selectedTicketType) && (
            <div className="mb-6 text-xl font-bold text-gray-800 text-center">
              Total: ₹{(quantity * (event.ticketTypes.find(t => t.type === selectedTicketType)?.price || 0)).toFixed(2)}
            </div>
          )}

          {/* Proceed to Pay Button */}
          <button
            onClick={handleBook}
            disabled={bookingLoading || !selectedTicketType || quantity < 1 || (selectedTicketType && event.ticketTypes?.find(t => t.type === selectedTicketType)?.quantity === 0) || (quantity > (selectedTicketType && event.ticketTypes?.find(t => t.type === selectedTicketType)?.quantity || Infinity))}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookingLoading ? (
              <>
                <FaSpinner className="animate-spin mr-3" /> Processing...
              </>
            ) : (
              'Proceed to Pay'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;