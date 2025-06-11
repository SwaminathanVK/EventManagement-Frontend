// src/pages/Organizer/OrganizerDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { FaCalendarAlt, FaUsers, FaPlusCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrganizerDashboard = () => {
  const [eventsCount, setEventsCount] = useState(0);
  const [attendeesCount, setAttendeesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const eventsRes = await API.get('/organizer/myEvents');
      const events = eventsRes.data.events || [];
      setEventsCount(events.length);

      // Calculate total attendees across all events
      const attendeesPromises = events.map((event) =>
        API.get(`/organizer/events/${event._id}/attendees`)
      );
      const attendeesResults = await Promise.all(attendeesPromises);

      const totalAttendees = attendeesResults.reduce((acc, res) => {
        return acc + (res.data.attendees?.length || 0);
      }, 0);

      setAttendeesCount(totalAttendees);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Organizer Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded shadow flex items-center gap-4">
          <FaCalendarAlt size={40} className="text-blue-600" />
          <div>
            <p className="text-2xl font-semibold">{eventsCount}</p>
            <p className="text-gray-700">Events Created</p>
          </div>
        </div>

        <div className="bg-green-100 p-6 rounded shadow flex items-center gap-4">
          <FaUsers size={40} className="text-green-600" />
          <div>
            <p className="text-2xl font-semibold">{attendeesCount}</p>
            <p className="text-gray-700">Total Attendees</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/organizer/myevents')}
          className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
        >
          View My Events
        </button>
        <button
          onClick={() => navigate('/organizer/createevent')}
          className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <FaPlusCircle /> Create New Event
        </button>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
