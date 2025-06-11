import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const ExportAttendeesPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendees, setAttendees] = useState([]);

  // Fetch events created by organizer
  const fetchMyEvents = async () => {
    try {
      const res = await API.get('/organizer/myEvents');
      setEvents(res.data.events || []);
    } catch (err) {
      toast.error('Failed to fetch events');
    }
  };

  // Fetch attendees for selected event
  const fetchAttendees = async (eventId) => {
    try {
      const res = await API.get(`/organizer/events/${eventId}/attendees`);
      setAttendees(res.data.attendees || []);
    } catch (err) {
      toast.error('Failed to fetch attendees');
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId);
    }
  }, [selectedEventId]);

  const exportToCSV = () => {
    if (attendees.length === 0) {
      toast.warning('No attendees to export');
      return;
    }

    const headers = ['Name', 'Email', 'Ticket Type', 'Booking Date'];
    const rows = attendees.map((attendee) => [
      attendee.user?.name || 'N/A',
      attendee.user?.email || 'N/A',
      attendee.ticket?.type || 'N/A',
      new Date(attendee.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `attendees_${selectedEventId}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Export Attendees</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Select Event:</label>
        <select
          className="w-full border border-gray-300 p-2 rounded"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">-- Select an event --</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {attendees.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Attendees ({attendees.length})
            </h3>
            <table className="w-full mt-2 border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Ticket Type</th>
                  <th className="p-2 border">Booking Date</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{a.user?.name || 'N/A'}</td>
                    <td className="p-2 border">{a.user?.email || 'N/A'}</td>
                    <td className="p-2 border">{a.ticket?.type || 'N/A'}</td>
                    <td className="p-2 border">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Export as CSV
          </button>
        </>
      )}
    </div>
  );
};

export default ExportAttendeesPage;
