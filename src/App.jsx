// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './Context/AuthContext.jsx'; 

// --- Public Pages ---
import LoginPage from './Pages/Auth/LoginPage.jsx'; 
import RegisterPage from './Pages/Auth/Registerpage.jsx'; 
import HomePage from './Pages/User/HomePage.jsx'; 
import EventDetailsPage from './Pages/User/EventDetailsPage.jsx'; 
import AllEventsPage from './Pages/User/AllEventsPage.jsx'; 

// --- Shared Components / Protected Route ---
import Navbar from './Components/Navbar.jsx'; 
import ProtectedRoute from './Routes/ProtectedRoute.jsx'; 

// --- User-Specific Pages (Accessible by 'user', 'organizer', 'admin' roles typically) ---
import UserDashboard from './Pages/User/UserDashboard.jsx'; 
import UserProfilePage from './Pages/User/UserProfilePage.jsx'; 
import UserTicketsPage from './Pages/User/UserTicketsPage.jsx'; 
import BookingSuccessPage from './Pages/User/BookingSuccessPage.jsx'; 
import PaymentSuccessPage from './Pages/User/PaymentSuccessPage.jsx'; 
import PaymentCancelPage from './Pages/User/PaymentCancelPage.jsx';
import TransferTicketModal from './Pages/User/TransferTicketModal.jsx'
import UserRoutes from './Routes/UserRoutes.jsx';

// --- Organizer-Specific Pages (Accessible by 'organizer', 'admin' roles) ---
import OrganizerDashboard from './Pages/Organizer/OrganizerDashboard.jsx'; 
import CreateEventPage from './Pages/Organizer/CreateEventPage.jsx'; 
import EditEventPage from './Pages/Organizer/EditEventPage.jsx'; 
import EventStatsPage from './Pages/Organizer/EventStatsPage.jsx'; 
import ExportAttendeesPage from './Pages/Organizer/ExportAttendeesPage.jsx';
import MyEventsPage from './Pages/Organizer/MyEventsPage.jsx'; 
import ViewAttendeesPage from './Pages/Organizer/ViewAttendeesPage.jsx'; 

// --- Admin-Specific Pages (Accessible by 'admin' role) ---
import AdminDashboardPage from './Pages/Admin/AdminDashboardPage.jsx'; // Corrected to .js and Page suffix
import AdminPendingEventsPage from './Pages/Admin/AdminPendingEventsPage.jsx'; // Corrected to .js
import AdminRegistrationsPage from './Pages/Admin/AdminRegistrationsPage.jsx'; // Corrected to .js
import AdminAllEventsPage from './Pages/Admin/AdminAllEventsPage.jsx'; // Corrected capitalization and to .js
import AdminCreateEventPage from './Pages/Admin/AdminCreateEventPage.jsx'; // Corrected to .jsx
import AdminAllOrganizersPage from './Pages/Admin/AdminAllOrganizersPage.jsx'; // Corrected to .js
import AdminAllUsersPage from './Pages/Admin/AdminAllUsersPage.jsx'; // Corrected to .js
import AdminEditEventPage from './Pages/Admin/AdminEditEventPage.jsx'; // Corrected to .jsx

// --- Toastify CSS ---
import 'react-toastify/dist/ReactToastify.css';

// --- Layout Components ---
const UserLayout = () => { 
  return (
    <>
      <div className="min-h-screen pt-16">
        <Outlet />
      </div>
    </>
  );
};

const OrganizerLayout = () => { 
  return (
    <>
      <div className="min-h-screen pt-16">
        <Outlet />
      </div>
    </>
  );
};

const AdminLayout = () => { 
  return (
    <>
      <div className="min-h-screen pt-16">
        <Outlet />
      </div>
    </>
  );
};


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar /> 
        <Routes>
          {/* --- Public Routes (Accessible to everyone) --- */}
          <Route path="/" element={<HomePage />} /> {/* Main landing page */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<AllEventsPage />} /> {/* Public list of all events */}
          <Route path="/events/:eventId" element={<EventDetailsPage />} /> {/* Public event details */}


          {/* --- User Routes (Protected - typically 'user', 'organizer', 'admin' can access their personal dashboards) --- */}
          <Route path="/user/*" element={<UserLayout />}>
            {/* Index route for /user - redirects to dashboard by default */}
            <Route index element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}><UserDashboard /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}><UserDashboard /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}><UserProfilePage /></ProtectedRoute>} />
            <Route path="my-tickets" element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}><UserTicketsPage/></ProtectedRoute>} />
          
            <Route path="booking-success" element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}><BookingSuccessPage /></ProtectedRoute>} />
            <Route path="payment/success" element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}><PaymentSuccessPage /></ProtectedRoute>} />
            <Route path="payment/cancel" element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}><PaymentCancelPage /></ProtectedRoute>} />
            
            {/* Organizer's Create Event page accessed via user prefix (if organizer is also a user) */}
            <Route path="create-event" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><CreateEventPage /></ProtectedRoute>} />

            {/* Transfer Ticket Modal route - Typically this would be a modal within another page like MyTicketsPage,
                but included here as a route as per original structure. Requires default props for Modal component. */}
            <Route path="transfer-ticket" element={
              <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
                <TransferTicketModal
                  isOpen={true} // Force open for standalone route
                  onClose={() => console.log('TransferModal route: onClose called')} // Placeholder
                  refreshTickets={() => console.log('TransferModal route: refreshTickets called')} // Placeholder
                  ticketId={"placeholder_ticket_id"} // Placeholder for required prop
                />
              </ProtectedRoute>
            } />

            {/* Catch-all for unmatched routes within /user */}
            <Route path="*" element={<div className="text-center p-10 text-red-600 text-2xl font-bold">404 - User Section Page Not Found</div>} />
          </Route>


          {/* --- Organizer Routes (Protected - typically 'organizer', 'admin' roles) --- */}
          <Route path="/organizer/*" element={<OrganizerLayout />}>
            {/* Index route for /organizer - redirects to dashboard by default */}
            <Route index element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerDashboard /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerDashboard /></ProtectedRoute>} />
            <Route path="createevent" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><CreateEventPage /></ProtectedRoute>} />
            <Route path="editevent/:eventId" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><EditEventPage /></ProtectedRoute>} />
            <Route path="eventstats/:eventId" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><EventStatsPage /></ProtectedRoute>} />
            <Route path="exportattendees/:eventId" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><ExportAttendeesPage /></ProtectedRoute>} />
            <Route path="myevents" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><MyEventsPage /></ProtectedRoute>} />
            <Route path="viewattendees/:eventId" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><ViewAttendeesPage /></ProtectedRoute>} />
            {/* Catch-all for unmatched routes within /organizer */}
            <Route path="*" element={<div className="text-center p-10 text-red-600 text-2xl font-bold">404 - Organizer Section Page Not Found</div>} />
          </Route>


          {/* --- Admin Routes (Protected - typically 'admin' role only) --- */}
          <Route path="/admin/*" element={<AdminLayout />}>
            {/* Index route for /admin - redirects to dashboard by default */}
            <Route index element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="pending-events" element={<ProtectedRoute allowedRoles={['admin']}><AdminPendingEventsPage /></ProtectedRoute>} />
            <Route path="registrations" element={<ProtectedRoute allowedRoles={['admin']}><AdminRegistrationsPage /></ProtectedRoute>} />
            <Route path="allEvents" element={<ProtectedRoute allowedRoles={['admin']}><AdminAllEventsPage /></ProtectedRoute>} />
            <Route path="events/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminCreateEventPage /></ProtectedRoute>} />
            <Route path="allorganizers" element={<ProtectedRoute allowedRoles={['admin']}><AdminAllOrganizersPage /></ProtectedRoute>} />
            <Route path="allusers" element={<ProtectedRoute allowedRoles={['admin']}><AdminAllUsersPage /></ProtectedRoute>} />
            <Route path="edit-event/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminEditEventPage /></ProtectedRoute>} />
            {/* Catch-all for unmatched routes within /admin */}
            <Route path="*" element={<div className="text-center p-10 text-red-600 text-2xl font-bold">404 - Admin Section Page Not Found</div>} />
          </Route>


          {/* --- Global Catch-all for any unmatched route --- */}
          <Route path="*" element={<div className="text-center p-20 text-red-700 text-3xl font-bold">404 Not Found</div>} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;