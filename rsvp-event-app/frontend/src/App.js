import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import EventsPage from './pages/events/EventsPage';
import EventDetailsPage from './pages/events/EventDetailsPage';
import CreateEventPage from './pages/events/CreateEventPage';
import EditEventPage from './pages/events/EditEventPage';
import GuestsPage from './pages/guests/GuestsPage';
import GuestDetailsPage from './pages/guests/GuestDetailsPage';
import RsvpPage from './pages/rsvp/RsvpPage';
import RsvpConfirmationPage from './pages/rsvp/RsvpConfirmationPage';
import PublicEventPage from './pages/events/PublicEventPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';
import ActivityLogsPage from './pages/admin/ActivityLogsPage';
import HelpPage from './pages/help/HelpPage';

// Context and Hooks
import { useAuth } from './context/AuthContext';

// Guards
const PrivateRoute = ({ element, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return element;
};

function App() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Public Routes */}
        <Route path="/rsvp/:token" element={<RsvpPage />} />
        <Route path="/rsvp/confirmation" element={<RsvpConfirmationPage />} />
        <Route path="/events/public/:id" element={<PublicEventPage />} />
        
        {/* Main App Routes */}
        <Route 
          path="/" 
          element={<PrivateRoute element={<MainLayout />} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="events">
            <Route index element={<EventsPage />} />
            <Route path="create" element={<CreateEventPage />} />
            <Route path=":id" element={<EventDetailsPage />} />
            <Route path=":id/edit" element={<EditEventPage />} />
          </Route>
          <Route path="guests">
            <Route index element={<GuestsPage />} />
            <Route path=":id" element={<GuestDetailsPage />} />
          </Route>
          <Route path="help" element={<HelpPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute
              element={<AdminLayout />}
              requiredRoles={['admin']}
            />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
          <Route path="logs" element={<ActivityLogsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default App;
