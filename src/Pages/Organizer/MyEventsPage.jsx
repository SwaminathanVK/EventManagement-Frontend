import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get('/organizer/myEvents');
      setEvents(res.data.events || []);
    } catch (error) {
      toast.error('Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setDeletingId(eventId);
      await API.delete(`/organizer/events/${eventId}`);
      toast.success('Event deleted successfully');
      fetchMyEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Events</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading your events...</div>
      ) : events.length === 0 ? (
        <p>You have not created any events yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-t">
                  <td className="py-3 px-4">{event.title}</td>
                  <td className="py-3 px-4">
                    {new Intl.DateTimeFormat('en-IN', {
                      dateStyle: 'medium',
                    }).format(new Date(event.date))}
                  </td>
                  <td className="py-3 px-4 capitalize">{event.status}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => navigate(`/organizer/editevent/${event._id}`)}
                        title="Edit Event"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        disabled={deletingId === event._id}
                        title="Delete Event"
                        className={`text-red-600 hover:text-red-800 ${
                          deletingId === event._id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => navigate(`/organizer/viewattendees/${event._id}`)}
                        title="View Attendees"
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaUsers />
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

export default MyEventsPage;
