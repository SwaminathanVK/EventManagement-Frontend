// src/Routes/AdminRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx'; // Assuming ProtectedRoute is .js
import AdminDashboardPage from '../Pages/Admin/AdminDashboardPage.js'; // Corrected to .js and Page suffix
import AdminPendingEventsPage from '../Pages/Admin/AdminPendingEventsPage.jsx'; // Corrected to .js
import AdminRegistrationsPage from '../Pages/Admin/AdminRegistrationsPage.jsx'; // Corrected to .js
import AdminAllEventsPage from '../Pages/Admin/AdminAllEventsPage.jsx'; // Corrected capitalization and to .js
import AdminCreateEventPage from '../Pages/Admin/AdminCreateEventPage.jsx'; // Kept .jsx based on prior conversion
import AdminAllOrganizersPage from '../Pages/Admin/AdminAllOrganizersPage.jsx'; // Corrected to .js
import AdminAllUsersPage from '../Pages/Admin/AdminAllUsersPage.jsx'; // Corrected to .js
import AdminEditEventPage from '../Pages/Admin/AdminEditEventPage.jsx'; // Kept .jsx based on prior conversion


const AdminRoutes = () => { // Removed React.FC type
  return (
    // ProtectedRoute should handle checking if the user has 'admin' role
    // and redirecting otherwise.
    <ProtectedRoute allowedRoles={['admin']}>
      <Routes>
        {/*
          Nested routes. The base path for these routes is determined by
          where <AdminRoutes /> is rendered within the main App.jsx (or similar) Routes.
          For example, if <Route path="/admin/*" element={<AdminRoutes />} /> is used,
          then:
          - /admin/dashboard will render AdminDashboardPage
          - /admin/pending-events will render AdminPendingEventsPage
          - /admin/edit-event/:id will render AdminEditEventPage (the relative path handles this)
        */}
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/pending-events" element={<AdminPendingEventsPage />} />
        <Route path="/registrations" element={<AdminRegistrationsPage />} />
        <Route path="/allEvents" element={<AdminAllEventsPage />} />
        <Route path="/events/create" element={<AdminCreateEventPage />} />
        <Route path="/allorganizers" element={<AdminAllOrganizersPage />} />
        <Route path="/allusers" element={<AdminAllUsersPage />} />
        <Route path="/edit-event/:id" element={<AdminEditEventPage />} /> {/* Corrected to be consistent with others. */}

        {/* Add a default admin route or redirect for /admin if needed */}
        {/* <Route path="/" element={<Navigate to="/admin/dashboard" replace />} /> */}
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;