// src/pages/AllEventsPage.jsx

import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/events/approved');
      setEvents(res.data.events || []);
    } catch (err) {
      console.error('Error fetching approved events:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load events. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- Conditional Rendering for Loading/Error States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-blue-600">
        <FaSpinner className="animate-spin h-12 w-12 mr-4" aria-label="Loading events" />
        <span className="text-2xl font-medium">Loading exciting events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md max-w-lg mx-auto" role="alert">
        <p className="font-semibold text-lg">Error:</p>
        <p>{error}</p>
        <button
          onClick={fetchEvents}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-gray-800 leading-tight">
          Discover Upcoming Events
        </h2>

        {events.length === 0 ? (
          <p className="text-center text-gray-700 text-xl mt-12 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
            Currently, there are no approved events available. Check back soon!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              // Format date and time for better readability (e.g., "Oct 27, 2023, 10:00 AM")
              const formattedDateTime = eventDate.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

              const mediaContent = event.images?.[0] ? (
                <img src={event.images[0]} alt={event.title} className="w-full h-56 object-cover rounded-t-3xl" />
              ) : event.videos?.[0] ? (
                <video controls className="w-full h-56 object-cover rounded-t-3xl">
                  <source src={event.videos[0]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-medium rounded-t-3xl">
                  No Media Available
                </div>
              );

              return (
                <div
                  key={event._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  {mediaContent}

                  <div className="p-6">
                    <h3 className="text-3xl font-bold text-indigo-800 mb-3 leading-snug">{event.title}</h3>

                    <div className="text-gray-700 text-base mb-2 flex items-center gap-3">
                      <FaCalendarAlt className="text-xl text-purple-600" />{' '}
                      <span className="font-semibold">{formattedDateTime}</span>
                    </div>

                    <div className="text-gray-700 text-base mb-4 flex items-center gap-3">
                      <FaMapMarkerAlt className="text-xl text-green-600" />{' '}
                      <span className="font-semibold">{event.location}</span>
                    </div>

                    <p className="text-gray-700 text-sm mb-5 line-clamp-3">
                      {event.description || 'No description available for this event.'}
                    </p>

                    <Link
                      to={`/user/event/${event._id}`}
                      className="inline-block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 duration-300 shadow-md"
                    >
                      View Details & Book
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEventsPage;