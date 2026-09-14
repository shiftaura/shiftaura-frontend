import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, LayoutDashboard } from 'lucide-react';

export default function MemberLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-brand-900">Team Hub</span>
        </div>
        
        <nav className="flex-grow px-4 py-6 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 text-gray-700 hover:bg-brand-50 hover:text-brand-600 px-3 py-2 rounded-md transition">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/events" className="flex items-center space-x-3 text-gray-700 hover:bg-brand-50 hover:text-brand-600 px-3 py-2 rounded-md transition">
            <Calendar size={20} />
            <span className="font-medium">Upcoming Events</span>
          </Link>
          <Link to="/profile" className="flex items-center space-x-3 text-gray-700 hover:bg-brand-50 hover:text-brand-600 px-3 py-2 rounded-md transition">
            <User size={20} />
            <span className="font-medium">My Profile</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold mr-3">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
}