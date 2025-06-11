// src/pages/Organizer/ViewAttendeesPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const ViewAttendeesPage = () => {
  const { eventId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendees = async () => {
    try {
      const res = await API.get(`/organizer/events/${eventId}/attendees`);
      setAttendees(res.data.attendees || []);
    } catch (error) {
      toast.error('Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Event Attendees</h2>
      {loading ? (
        <div className="text-gray-600">Loading attendees...</div>
      ) : attendees.length === 0 ? (
        <p>No attendees found for this event.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Ticket ID</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{attendee.user?.name || 'N/A'}</td>
                  <td className="p-3">{attendee.user?.email || 'N/A'}</td>
                  <td className="p-3">{attendee.ticket?._id || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewAttendeesPage;
