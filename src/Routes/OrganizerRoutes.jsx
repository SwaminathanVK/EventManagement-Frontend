// src/Routes/OrganizerRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.js'; // Assuming ProtectedRoute is .js
import OrganizerDashboard from '../Pages/Organizer/OrganizerDashboard.jsx'; // Corrected to .jsx
import CreateEventPage from '../Pages/Organizer/CreateEventPage.js'; // Corrected to .js
import EditEventPage from '../Pages/Organizer/EditEventPage.js'; // Corrected to .js
import EventStatsPage from '../Pages/Organizer/EventStatsPage.js'; // Corrected to .js
import ExportAttendeesPage from '../Pages/Organizer/ExportAttendeesPage.js'; // Corrected to .js
import MyEventsPage from '../Pages/Organizer/MyEventsPage.js'; // Corrected to .js
import ViewAttendeesPage from '../Pages/Organizer/ViewAttendeesPage.js'; // Corrected to .js

const OrganizerRoutes = () => { // Removed React.FC type
  return (
    <Routes>
      {/*
        This setup uses a "layout route" for ProtectedRoute.
        All nested routes inside it will inherit its element (ProtectedRoute).
        This means only users with the 'organizer' role can access any of these paths.

        The paths for the nested routes should be relative to their parent route
        if `OrganizerRoutes` itself is nested under a path like `/organizer/*`.
        If your top-level `Routes` in `App.jsx` already includes:
        <Route path="/organizer/*" element={<OrganizerRoutes />} />
        Then the relative paths below will automatically form:
        /organizer/dashboard
        /organizer/createevent
        etc.
      */}
      <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
        <Route path="dashboard" element={<OrganizerDashboard />} />
        <Route path="createevent" element={<CreateEventPage />} />
        <Route path="editevent/:eventId" element={<EditEventPage />} />
        <Route path="eventstats/:eventId" element={<EventStatsPage />} />
        <Route path="exportattendees/:eventId" element={<ExportAttendeesPage />} />
        <Route path="myevents" element={<MyEventsPage />} />
        <Route path="viewattendees/:eventId" element={<ViewAttendeesPage />} />
      </Route>
    </Routes>
  );
};

export default OrganizerRoutes;