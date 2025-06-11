// import React, { useEffect, useState } from 'react';
// import API from '../../Services/api';

// const StatsOverviewPage = () => {
//   const [stats, setStats] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await API.get('/organizer/stats/overview');
//         setStats(res.data);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load stats');
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6">Organizer Stats Overview</h2>

//       {error && <p className="text-red-500">{error}</p>}

//       {stats ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white rounded shadow p-4">
//             <h3 className="text-lg font-semibold text-gray-700">Total Events</h3>
//             <p className="text-2xl font-bold text-blue-600">{stats.totalEvents}</p>
//           </div>
//           <div className="bg-white rounded shadow p-4">
//             <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
//             <p className="text-2xl font-bold text-green-600">₹ {stats.totalRevenue}</p>
//           </div>
//           <div className="bg-white rounded shadow p-4">
//             <h3 className="text-lg font-semibold text-gray-700">Tickets Sold</h3>
//             <p className="text-2xl font-bold text-purple-600">{stats.totalTickets}</p>
//           </div>
//           <div className="bg-white rounded shadow p-4">
//             <h3 className="text-lg font-semibold text-gray-700">Total Attendees</h3>
//             <p className="text-2xl font-bold text-orange-500">{stats.totalAttendees}</p>
//           </div>
//         </div>
//       ) : (
//         !error && <p>Loading stats...</p>
//       )}
//     </div>
//   );
// };

// export default StatsOverviewPage;
