import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/event.service';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch upcoming events when the component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // This makes a protected GET request to /api/events/upcoming
        const response = await eventService.getUpcomingEvents();
        
        // Assuming the backend returns { success: true, data: [...] }
        setUpcomingEvents(response.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load upcoming events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Member'}!
        </h1>
        <p className="text-gray-500 mt-2">
          Here is what's happening with the team right now.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-1 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <User className="text-brand-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
          </div>
          <div className="flex-grow">
            <p className="text-sm text-gray-600 mb-1"><strong>Role:</strong> {user?.role}</p>
            <p className="text-sm text-gray-600"><strong>Email:</strong> {user?.email}</p>
          </div>
          <Link 
            to="/profile" 
            className="mt-6 flex items-center justify-between text-sm text-brand-600 hover:text-brand-800 font-medium transition"
          >
            <span>Edit Profile</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Upcoming Events Preview Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="text-brand-600" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            </div>
            <Link to="/events" className="text-sm text-brand-600 hover:text-brand-800 font-medium">
              View All
            </Link>
          </div>

          {/* Conditional rendering based on loading, error, and empty states */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Loader2 className="animate-spin mb-2" size={24} />
              <span className="text-sm">Loading events...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-md">
              <p>No upcoming team events.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event._id || event.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition">
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.startDate).toLocaleDateString()} • {event.mode}
                    </p>
                  </div>
                  <Link 
                    to={`/events/${event._id || event.id}`}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-700 rounded-md transition"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}