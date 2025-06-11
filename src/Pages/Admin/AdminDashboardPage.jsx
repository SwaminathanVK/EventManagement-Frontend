// src/pages/Admin/AdminDashboardPage.js

import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import {
  FaUsers,
  FaUserPlus,
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaMoneyBillWave,
  FaSpinner,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// --- Currency Formatter ---
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// --- StatCard Component (Updated Prop Name) ---
// Changed 'icon: Icon' to 'IconComponent' directly
const StatCard = ({ IconComponent, label, value, valueColor = 'text-gray-900' }) => (
  <div
    className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-5 hover:shadow-lg transition transform hover:-translate-y-1 duration-300"
    role="region"
    aria-label={label}
  >
    {/* Use IconComponent directly */}
    <IconComponent className="text-blue-600 text-5xl flex-shrink-0" />
    <div>
      <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">{label}</p>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  </div>
);

// --- AdminDashboardPage Component ---

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get('/admin/dashboard');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
        toast.error(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // --- Render based on loading/error state ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-blue-600">
        <FaSpinner className="animate-spin h-10 w-10 mr-3" aria-label="Loading dashboard data" />
        <span className="text-xl font-medium">Loading Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
        <p className="font-semibold text-lg">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  const users = stats?.users ?? { total: 0, newThisMonth: 0 };
  const events = stats?.events ?? { total: 0, pending: 0, approved: 0 };
  const registrations = stats?.registrations ?? 0;
  const revenue = stats?.revenue ?? 0;

  return (
    <section className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">Admin Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          // Pass the icon component directly to the new prop name 'IconComponent'
          IconComponent={FaUsers}
          label="Total Users"
          value={users.total}
          valueColor="text-blue-700"
        />
        <StatCard
          // Pass the icon component directly to the new prop name 'IconComponent'
          IconComponent={FaUserPlus}
          label="New Users This Month"
          value={users.newThisMonth}
          valueColor="text-green-600"
        />
        <div
          className="bg-white shadow-md rounded-xl p-6 space-y-3 hover:shadow-lg transition transform hover:-translate-y-1 duration-300"
          aria-label="Events statistics"
          role="region"
        >
          <h2 className="text-lg font-bold text-gray-700 mb-3">Events Overview</h2>
          <div className="flex justify-between items-center text-gray-600 font-medium pb-2 border-b border-gray-200">
            <span>Total Events</span>
            <span className="text-2xl font-semibold text-gray-900">{events.total}</span>
          </div>
          <div className="flex justify-between items-center text-yellow-600 font-medium py-1">
            <span>Pending</span>
            <span className="text-xl font-bold">{events.pending}</span>
          </div>
          <div className="flex justify-between items-center text-green-600 font-medium py-1">
            <span>Approved</span>
            <span className="text-xl font-bold">{events.approved}</span>
          </div>
          <div className="mt-4 text-right">
            <a href="/admin/allEvents" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">View All Events &rarr;</a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <StatCard
          // Pass the icon component directly to the new prop name 'IconComponent'
          IconComponent={FaTicketAlt}
          label="Total Registrations"
          value={registrations}
          valueColor="text-purple-700"
        />
        <StatCard
          // Pass the icon component directly to the new prop name 'IconComponent'
          IconComponent={FaMoneyBillWave}
          label="Total Revenue"
          value={currencyFormatter.format(revenue)}
          valueColor="text-green-800"
        />
      </div>
    </section>
  );
};

export default AdminDashboardPage;