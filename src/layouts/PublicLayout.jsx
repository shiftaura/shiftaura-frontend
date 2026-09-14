import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-xl font-bold text-brand-900">
              Shiftaura
            </Link>
            <nav className="flex space-x-6 items-center">
              <Link to="/team" className="text-gray-600 hover:text-brand-600 font-medium">Team</Link>
              <Link to="/events/past" className="text-gray-600 hover:text-brand-600 font-medium">Past Events</Link>
              <Link to="/join" className="text-gray-600 hover:text-brand-600 font-medium">Join Team</Link>
              
              {isAuthenticated ? (
                <Link 
                  to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} 
                  className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 transition font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="text-brand-600 font-medium hover:text-brand-900">Login</Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* The Outlet renders the current child route (e.g., Landing, Login) */}
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} shiftaura. All rights reserved.</p>
      </footer>
    </div>
  );
}