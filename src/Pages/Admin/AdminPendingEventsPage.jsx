// src/pages/Admin/AdminPendingEventsPage.js

import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

// In JavaScript, we don't use interfaces.
// The structure of 'createdBy' and 'event' objects will be inferred at runtime
// based on the data received from the API.

const AdminPendingEventsPage = () => { // Removed React.FC type
  const [pendingEvents, setPendingEvents] = useState([]); // Removed type annotation <PendingEvent[]>
  const [loading, setLoading] = useState(true); // Removed type annotation <boolean>

  const fetchPendingEvents = async () => {
    setLoading(true); // Ensure loading state is set true before fetch
    try {
      // In JavaScript, no explicit type annotation for API response is needed
      const res = await API.get('/admin/pending-events');
      setPendingEvents(res.data.events || []); // Handle potential empty array
    } catch (err) { // Removed type annotation : any
      console.error('Error fetching pending events:', err);
      toast.error(err.response?.data?.message || 'Failed to load pending events.');
    } finally {
      setLoading(false); // Always set loading to false when fetch ends
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []); // Empty dependency array means this runs once on component mount

  const handleApproval = async (eventId, status) => { // Removed type annotations for eventId and status
    try {
      // In JavaScript, no explicit type annotation for API call is needed
      await API.put(`/admin/events/${eventId}/status`, { status });
      toast.success(`Event ${status} successfully!`);
      // Optimistically remove the event from the list after successful update
      setPendingEvents(prevEvents => prevEvents.filter(ev => ev._id !== eventId));
    } catch (err) { // Removed type annotation : any
      console.error(`Error updating event status to ${status}:`, err);
      toast.error(err.response?.data?.message || 'Failed to update event status.');
    }
  };

  // --- Render based on loading state ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-blue-600">
        <FaSpinner className="animate-spin h-10 w-10 mr-3" aria-label="Loading pending events" />
        <span className="text-xl font-medium">Loading pending events...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">Events Pending Review</h1>

      {pendingEvents.length === 0 ? (
        <p className="text-gray-600 text-lg mt-8 text-center">
          🎉 Great news! There are no pending events to review at the moment.
        </p>
      ) : (
        <div className="space-y-6">
          {pendingEvents.map(event => (
            <div key={event._id} className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 transition-shadow duration-300 hover:shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{event.title}</h2>
                  <p className="text-gray-600 text-base mb-2 line-clamp-2">{event.description}</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Organizer:</span> {event?.createdBy?.name || 'N/A'} ({event?.createdBy?.email || 'N/A'})
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Location:</span> {event.location || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 flex-shrink-0">
                  <button
                    onClick={() => handleApproval(event._id, 'approved')}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition duration-200 text-lg font-medium"
                    title="Approve Event"
                  >
                    <FaCheckCircle className="text-xl" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(event._id, 'rejected')}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition duration-200 text-lg font-medium"
                    title="Reject Event"
                  >
                    <FaTimesCircle className="text-xl" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingEventsPage;