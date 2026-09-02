import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import OverviewPage from './pages/dashboard/OverviewPage';
import AskGeniePage from './pages/dashboard/AskGeniePage';
import RoomsPage from './pages/dashboard/RoomsPage';
import BookingsPage from './pages/dashboard/BookingsPage';
import ApprovalsPage from './pages/dashboard/ApprovalsPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import ReportsPage from './pages/dashboard/ReportsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="genie" element={<AskGeniePage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
