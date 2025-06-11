// src/pages/Admin/AdminRegistrationsPage.js

import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

// In JavaScript, interfaces are not used.
// The structure of the objects (RegisteredUser, RegisteredEvent, Ticket, Registration)
// will be inferred at runtime based on the data received from your API.

const AdminRegistrationsPage = () => { // Removed React.FC type
  const [registrations, setRegistrations] = useState([]); // Removed type annotation <Registration[]>
  const [loading, setLoading] = useState(true); // Removed type annotation <boolean>

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/registrations'); // Removed type annotation <{ registrations: Registration[] }>
      setRegistrations(res.data.registrations || []);
    } catch (err) { // Removed type annotation : any
      console.error('Error fetching registrations:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">All Ticket Registrations</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-blue-600">
          <FaSpinner className="animate-spin h-10 w-10 mr-3" aria-label="Loading registrations" />
          <span className="text-xl font-medium">Loading registrations...</span>
        </div>
      ) : registrations.length === 0 ? (
        <p className="text-gray-600 text-lg text-center mt-8">
          No ticket registrations found yet.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Title</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Price</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map(reg => (
                <tr key={reg._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{reg.user?.name || 'N/A'}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{reg.user?.email || 'N/A'}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{reg.event?.title || 'N/A'}</td>

                  {/* --- MODIFIED TICKET DISPLAY LOGIC --- */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {/* Check if reg.ticket exists before accessing its properties */}
                    {reg.ticket ? (
                      <div className="flex items-center space-x-1">
                        <span role="img" aria-label="ticket-emoji">🎫</span>
                        <span>{reg.ticket.type || 'N/A'}</span>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm font-bold text-green-700">
                    {/* Check if reg.ticket and reg.ticket.price exist and is a number */}
                    ₹{reg.ticket?.price !== undefined && reg.ticket.price !== null ? reg.ticket.price.toFixed(2) : '0.00'}
                  </td>
                  {/* --- END MODIFIED TICKET DISPLAY LOGIC --- */}

                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reg.registeredAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
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

export default AdminRegistrationsPage;