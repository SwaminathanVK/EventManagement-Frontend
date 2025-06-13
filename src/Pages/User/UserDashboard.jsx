// src/pages/UserDashboard.jsx

import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimes, FaExchangeAlt, FaDownload, FaUserCircle, FaEnvelope, FaSpinner, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import TransferTicketModal from '../User/TransferTicketModal'; // Import the TransferTicketModal

// In JavaScript, we don't define interfaces explicitly.
// The structure of the data will be inferred at runtime.

const UserDashboard = () => {
  const { user: authUser, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // --- Redirect if not authenticated ---
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to view your dashboard.", { autoClose: 3000 });
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // --- Fetch user profile info and registrations ---
  const fetchDashboardData = async () => {
    if (!isAuthenticated) {
      setLoadingDashboard(false);
      return;
    }

    setLoadingDashboard(true);
    try {
      // Fetch user profile
      const userProfileRes = await API.get('/user/profile');
      setUserProfile(userProfileRes.data.user);

      // Fetch user's registrations
      const registrationsRes = await API.get('/registration/my-tickets'); // Corrected endpoint
      setRegistrations(registrationsRes.data.registrations);

    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      toast.error(err.response?.data?.message || 'Failed to load your dashboard data.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    // Only attempt to fetch data if auth context has finished loading AND user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchDashboardData();
    }
  }, [authLoading, isAuthenticated]);

  // --- Cancel ticket handler ---
  const cancelTicket = async (registrationId) => {
    const confirmCancellation = window.confirm('Are you sure you want to cancel this ticket? This action cannot be undone and may not be refundable.');
    if (!confirmCancellation) {
      return;
    }

    try {
      await API.post(`/registration/cancel/${registrationId}`);
      toast.success('Ticket cancelled successfully!');
      fetchDashboardData(); // Re-fetch to update the list
    } catch (err) {
      console.error("Ticket cancellation failed:", err);
      toast.error(err.response?.data?.message || 'Failed to cancel ticket.');
    }
  };

  // --- Open Transfer Ticket Modal ---
  const openTransferModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  // --- Close Transfer Ticket Modal ---
  const closeTransferModal = () => {
    setIsModalOpen(false);
    setSelectedTicketId(null);
  };

  // --- Download Ticket handler ---
  const downloadTicket = (registration) => {
    toast.info(`Attempting to generate ticket for ${registration.event.title}...`, { autoClose: 2000 });
    // In a real application, this would trigger a backend endpoint
    // that generates and serves a PDF or QR code image for the ticket.
    // For now, it's a placeholder.
    // Example: window.open(`${API.defaults.baseURL}/tickets/download/${registration._id}`, '_blank');
    alert(`Simulating ticket download for ${registration.event.title}. In a real app, a file would download.`);
  };

  // --- Helper for Date Formatting ---
  const formatDateTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error("Invalid date string:", isoString);
      return 'Invalid Date';
    }
  };

  // --- Conditional Rendering for Loading and Errors ---
  if (authLoading || loadingDashboard) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-700 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Loading your dashboard data...</p>
        </div>
      </div>
    );
  }

  // If not authenticated (and not loading anymore), the useEffect above will redirect.
  // This ensures 'userProfile' is available when we proceed.
  if (!userProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600 text-lg font-semibold">
            <FaTimes className="inline-block mr-2" /> Error loading user profile. Please try again.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // --- Main Dashboard Content ---
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">
          Welcome, <span className="text-indigo-600">{userProfile.name}!</span>
        </h1>

        {/* User Profile Section */}
        <section className="mb-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FaUserCircle className="text-indigo-500 mr-3" /> Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col space-y-3 text-lg text-gray-700">
              <p className="flex items-center">
                <span className="font-semibold w-24">Name:</span> {userProfile.name}
              </p>
              <p className="flex items-center">
                <FaEnvelope className="text-indigo-400 mr-2" /> <span className="font-semibold">Email:</span> {userProfile.email}
              </p>
              <p className="flex items-center">
                <span className="font-semibold w-24">Role:</span> <span className="capitalize">{userProfile.role}</span>
              </p>
            </div>
            <div className="md:text-right text-center">
              <Link
                to="/user/profile"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                Edit Profile
                <svg className="ml-2 -mr-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828L14.207 8.621l-2.828-2.828z"></path></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Your Tickets Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FaTicketAlt className="text-indigo-500 mr-3" /> Your Tickets
          </h2>

          {registrations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-600 border border-dashed border-gray-300">
              <p className="text-lg mb-4">It looks like you haven't booked any tickets yet!</p>
              <Link
                to="/events/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
              >
                Explore Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((reg) => {
                const event = reg.event;
                const ticket = reg.ticket;
                const payment = reg.payment;
                const registrationDate = formatDateTime(reg.createdAt);
                const eventDate = formatDateTime(event.date);
                const isCancelled = reg.status === 'cancelled';
                const isUpcoming = new Date(event.date) > new Date();

                return (
                  <div
                    key={reg._id}
                    className={`bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border-l-4 ${isCancelled ? 'border-red-500 opacity-70' : 'border-indigo-500'} transition duration-300 transform hover:scale-[1.01]`}
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        <Link to={`/events/${event._id}`} className="hover:text-indigo-600 transition">
                          {event.title}
                        </Link>
                      </h3>
                      <p className="text-gray-700 text-sm mb-2 flex items-center">
                        <FaTicketAlt className="mr-2 text-indigo-400" /> <span className="font-semibold">{ticket.name} Ticket</span>
                        {ticket.price > 0 ? ` - $${ticket.price.toFixed(2)}` : ' - Free'}
                      </p>
                      <p className="text-gray-600 text-sm mb-1 flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-500" /> <span className="font-medium">Event Date:</span> {eventDate}
                      </p>
                      <p className="text-gray-600 text-sm mb-3 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-500" /> <span className="font-medium">Location:</span> {event.location}
                      </p>
                      <p className="text-gray-600 text-xs italic">
                        Booked On: {registrationDate}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Payment: <span className="capitalize">{payment.status || 'Unknown'}</span>
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCancelled ? 'bg-red-100 text-red-800' : (reg.status === 'transferred' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800')}`}>
                        Status: <span className="capitalize">{reg.status}</span>
                      </span>
                    </div>

                    <div className="flex flex-col space-y-3 w-full mt-auto">
                      <button
                        onClick={() => downloadTicket(reg)}
                        className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        title="Download Ticket"
                        disabled={isCancelled || payment.status !== 'completed'}
                      >
                        <FaDownload className="mr-2" /> Download Ticket
                      </button>

                      <button
                        onClick={() => openTransferModal(reg._id)}
                        className="w-full flex items-center justify-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        title="Transfer Ticket"
                        disabled={isCancelled || !isUpcoming || payment.status !== 'completed' || reg.status === 'transferred'}
                      >
                        <FaExchangeAlt className="mr-2" /> Transfer Ticket
                      </button>

                      <button
                        onClick={() => cancelTicket(reg._id)}
                        className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        title="Cancel Ticket"
                        disabled={isCancelled || !isUpcoming || payment.status !== 'completed'}
                      >
                        <FaTimes className="mr-2" /> Cancel Ticket
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Transfer Ticket Modal */}
        {selectedTicketId && (
          <TransferTicketModal
            ticketId={selectedTicketId}
            isOpen={isModalOpen}
            onClose={closeTransferModal}
            refreshTickets={fetchDashboardData}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;