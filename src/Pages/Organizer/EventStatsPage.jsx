import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const EventStatsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/organizer/myEvents');
        const eventsData = res.data.events || [];
        setEvents(eventsData);

        const statsData = {};
        const chartData = [];

        for (const event of eventsData) {
          const attendeesRes = await API.get(
            `/organizer/events/${event._id}/attendees`
          );
          const attendees = attendeesRes.data.attendees || [];

          const ticketTypeCounts = {};
          let revenue = 0;

          attendees.forEach((a) => {
            const type = a.ticket?.type || 'Unknown';
            ticketTypeCounts[type] = (ticketTypeCounts[type] || 0) + 1;
            revenue += a.ticket?.price || 0;
          });

          statsData[event._id] = {
            attendeesCount: attendees.length,
            ticketTypeCounts,
            revenue,
          };

          chartData.push({
            title: event.title,
            attendeesCount: attendees.length,
            revenue,
          });
        }

        setStats(statsData);
        setChartData(chartData);
      } catch (err) {
        toast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const [chartData, setChartData] = useState([]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Event Statistics</h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading stats...</div>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold mb-4">Attendees per Event</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="title"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendeesCount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold mb-4">Revenue per Event (₹)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="title"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={80}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => {
              const stat = stats[event._id] || {};
              return (
                <div
                  key={event._id}
                  className="border border-gray-300 rounded-lg p-4 shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-700 mb-1">
                    Date:{' '}
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      dateStyle: 'medium',
                    })}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Total Attendees:{' '}
                    <span className="font-bold">{stat.attendeesCount || 0}</span>
                  </p>
                  <p className="text-gray-700 mb-1">
                    Revenue: ₹{' '}
                    <span className="font-bold">
                      {(stat.revenue || 0).toLocaleString('en-IN')}
                    </span>
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">Tickets Breakdown:</p>
                    {stat.ticketTypeCounts &&
                    Object.keys(stat.ticketTypeCounts).length > 0 ? (
                      <ul className="ml-4 list-disc">
                        {Object.entries(stat.ticketTypeCounts).map(
                          ([type, count]) => (
                            <li key={type}>
                              {type}: {count}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 ml-4">
                        No ticket data available.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default EventStatsPage;
