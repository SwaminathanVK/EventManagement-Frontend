// src/routes/UserRoutes.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './/ProtectedRoute.jsx'; 

import HomePage from '../Pages/User/HomePage.jsx'; 
import EventDetailsPage from '../Pages/User/EventDetailsPage.jsx';
import BookingSuccessPage from '../Pages/User/BookingSuccessPage.jsx'; 
import AllEventsPage from '../Pages/User/AllEventsPage.jsx'; 
import PaymentSuccessPage from '../Pages/User/PaymentSuccessPage.jsx'; 
import PaymentCancelPage from '../Pages/User/PaymentCancelPage.jsx'; 
import TransferTicketModal from '../Pages/User/TransferTicketModal.jsx';
import UserProfilePage from '../Pages/User/UserProfilePage.jsx'; 
import UserTicketsPage from '../Pages/User/UserTicketsPage.jsx'; 
import UserDashboard from '../Pages/User/UserDashboard.jsx'; 
import AdminCreateEventPage from '../Pages/Admin/AdminCreateEventPage.jsx'; 


const UserRoutes = () => { // Removed React.FC type
  return (
    // This component should be wrapped inside a <Routes> component in your main App.jsx
    // For example: <Route path="/user/*" element={<UserRoutes />} />
    // The "/*" is crucial for enabling nested routes.
    <Routes>
      {/*
        All paths inside this <Routes> component are relative to its parent route.
        If the parent route in App.jsx is <Route path="/user/*" ...>,
        then a path like "dashboard" here means the full path '/user/dashboard'.
      */}

      {/* Default/Index route for /user - redirects to dashboard */}
      <Route
        index // This makes /user (the parent path) redirect to /user/dashboard
        element={<Navigate to="dashboard" replace />}
      />

      {/* User Dashboard */}
      <Route
        path="dashboard" // Corresponds to /user/dashboard
        element={
          <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}> {/* Users, Organizers, Admins can access their dashboard */}
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* User Profile Page */}
      <Route
        path="profile" // Corresponds to /user/profile
        element={
          <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      {/* User Tickets Page */}
      <Route
        path="my-tickets" // Changed to 'my-tickets' for consistency with UserTicketsPage component
        element={
          <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
            <UserTicketsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Event Details Page - Typically public, but if user-specific features are needed, keep it here */}
      {/* If this is meant to be the public event details page, it should be in your main App.jsx's Routes, not here. */}
      {/* If it's a *user-specific* event view (e.g., showing booking options for logged-in users only), then it belongs here. */}
      {/* The original code had `/events/:eventId` which indicates a public route. I'm keeping it here as `event/:eventId` for a user-specific view. */}
      <Route
        path="event/:eventId" // Corresponds to /user/event/:eventId (e.g., /user/event/123)
        element={
          <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
            <EventDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Create Event Page (Organizers only) */}
      <Route
        path="create-event" // Corresponds to /user/create-event
        element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}> {/* Only organizers and admins can create events */}
            <AdminCreateEventPage /> {/* Assuming this is the shared create event page */}
          </ProtectedRoute>
        }
      />

      {/* Booking Success Page */}
      <Route
        path="booking-success" // Corresponds to /user/booking-success
        element={
          <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
            <BookingSuccessPage />
          </ProtectedRoute>
        }
      />

      {/* Payment Success Page */}
      <Route
        path="/payment-success" // Corresponds to /user/payment-success
        element={
          <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
            <PaymentSuccessPage />
          </ProtectedRoute>
        }
      />

      {/* Payment Cancel Page */}
      <Route
        path="payment/cancel" // Corresponds to /user/payment-cancel
        element={
          <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
            <PaymentCancelPage />
          </ProtectedRoute>
        }
      />

      {/* Transfer Ticket Page (Modal/Component) - Likely not a full page, but included as per original */}
      {/* This component is typically used as a modal within another page (like UserTicketsPage or UserDashboard)
          rather than a standalone page route. Keeping it as a route for now as per your original structure,
          but confirm if this is truly a dedicated "page" or a modal. */}
      <Route
        path="transfer-ticket" // Corresponds to /user/transfer-ticket
        element={
          <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
            <TransferTicketModal
              isOpen={true} // As a standalone page, always open
              onClose={() => alert('This is a modal displayed as a page. Close not handled.')} // Placeholder
              refreshTickets={() => console.log('Refreshing tickets from TransferTicketPage')} // Placeholder
              ticketId={''} // Placeholder, as no dynamic ID from URL easily
            />
          </ProtectedRoute>
        }
      />

      {/* Catch-all for any unmatched routes within /user/* */}
      {/* IMPORTANT: This should generally be at the end of the Routes list. */}
      <Route path="*" element={<div className="text-center p-10 text-red-600 text-2xl font-bold">404 - User Section Page Not Found</div>} />

    </Routes>
  );
};

export default UserRoutes;