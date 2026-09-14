import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, CalendarDays, UserPlus, LogOut, ShieldCheck } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
      isActive
        ? 'bg-brand-50 text-brand-600 font-semibold'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <ShieldCheck className="text-brand-600 mr-2" size={22} />
          <span className="text-lg font-bold text-gray-900 tracking-tight">Admin Console</span>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          <NavLink to="/admin" end className={navItemClass}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/members" className={navItemClass}>
            <Users size={18} />
            <span>Manage Members</span>
          </NavLink>
          <NavLink to="/admin/events" className={navItemClass}>
            <CalendarDays size={18} />
            <span>Manage Events</span>
          </NavLink>
          <NavLink to="/admin/join-requests" className={navItemClass}>
            <UserPlus size={18} />
            <span>Join Requests</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-3 px-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-brand-600 font-medium">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}