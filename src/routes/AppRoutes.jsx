import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PublicLayout from '../layouts/PublicLayout';
import MemberLayout from '../layouts/MemberLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Team from '../pages/public/Team';
import MemberDetail from '../pages/public/MemberDetail';
import PastEvents from '../pages/public/PastEvents';
import Join from '../pages/public/Join';

// Member Pages
import Dashboard from '../pages/member/Dashboard';
import UpcomingEvents from '../pages/member/UpcomingEvents';
import EventDetails from '../pages/member/EventDetails';
import Profile from '../pages/member/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import JoinRequests from '../pages/admin/JoinRequests';
import ManageMembers from '../pages/admin/ManageMembers';
import ManageEvents from '../pages/admin/ManageEvents';
import CreateEvent from '../pages/admin/CreateEvent';
import EditEvent from '../pages/admin/EditEvent';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/:id" element={<MemberDetail />} />
        <Route path="/events/past" element={<PastEvents />} />
        <Route path="/join" element={<Join />} />
      </Route>

      {/* MEMBER PROTECTED ROUTES */}
      <Route
        element={
          <ProtectedRoute>
            <MemberLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<UpcomingEvents />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ADMIN PROTECTED ROUTES */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/members" element={<ManageMembers />} />
        <Route path="/admin/events" element={<ManageEvents />} />
        <Route path="/admin/events/new" element={<CreateEvent />} />
        <Route path="/admin/events/:id/edit" element={<EditEvent />} />
        <Route path="/admin/join-requests" element={<JoinRequests />} />
      </Route>
    </Routes>
  );
};