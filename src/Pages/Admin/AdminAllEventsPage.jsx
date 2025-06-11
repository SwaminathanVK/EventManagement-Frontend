// src/pages/Admin/AdminAllEventsPage.js

import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { FaCheck, FaTimes, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// In JavaScript, we don't use explicit interfaces.
// The structure of 'Organizer' and 'Event' objects will be determined at runtime.

const AdminAllEventsPage = () => { // Removed React.FC
  const [events, setEvents] = useState([]); // Removed type annotation <Event[]>
  const [loading, setLoading] = useState(true); // Removed type annotation <boolean>
  const navigate = useNavigate();

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/allEvents'); // Removed explicit type <{ events: Event[] }>
      setEvents(res.data.events || []);
    } catch (err) { // Removed type annotation : any
      toast.error(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const updateEventStatus = async (eventId, status) => { // Removed type annotations for eventId, status
    try {
      await API.put(`/admin/events/${eventId}/status`, { status }); // Removed explicit type <Event>
      toast.success(`Event ${status} successfully`);
      fetchAllEvents(); // Refresh the list
    } catch (err) { // Removed type annotation : any
      toast.error(err.response?.data?.message || 'Failed to update event status');
    }
  };

  const deleteEvent = async (eventId) => { // Removed type annotation for eventId
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await API.delete(`/admin/events/${eventId}`); // Removed explicit type <any>
      toast.success("Event deleted successfully");
      fetchAllEvents(); // Refresh the list
    } catch (err) { // Removed type annotation : any
      toast.error(err.response?.data?.message || "Failed to delete event");
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Events</h2>
      <button
        onClick={() => navigate('/admin/events/create')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        + Create Event
      </button>

      {loading ? (
        <div className="flex justify-center items-center mt-10 text-gray-500">
          <FaSpinner className="animate-spin mr-2" /> Loading events...
        </div>
      ) : events.length === 0 ? (
        <p className="mt-4 text-gray-700">No events found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map(event => (
                <tr key={event._id}>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{event.title}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{event.organizer?.name || 'N/A'}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.DateTimeFormat('en-IN', {
                      dateStyle: 'medium'
                    }).format(new Date(event.date))}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm capitalize">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${event.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${event.status === 'rejected' || event.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {event.status === 'pending' && (
                        <>
                          <button
                            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 flex items-center justify-center transition-colors duration-200"
                            onClick={() => updateEventStatus(event._id, 'approved')}
                            title="Approve"
                          >
                            <FaCheck size={14} />
                          </button>
                          <button
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 flex items-center justify-center transition-colors duration-200"
                            onClick={() => updateEventStatus(event._id, 'rejected')}
                            title="Reject"
                          >
                            <FaTimes size={14} />
                          </button>
                        </>
                      )}
                      <button
                        className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 flex items-center justify-center transition-colors duration-200"
                        onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                        title="Edit Event"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="bg-red-700 text-white p-2 rounded-full hover:bg-red-800 flex items-center justify-center transition-colors duration-200"
                        onClick={() => deleteEvent(event._id)}
                        title="Delete Event"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAllEventsPage;