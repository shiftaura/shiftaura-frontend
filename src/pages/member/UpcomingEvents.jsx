import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import { MapPin, Calendar as CalendarIcon, ExternalLink, Loader2, Users } from 'lucide-react';

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setIsLoading(true);
        setError('');
        // Securely fetch private events using the interceptor (with JWT token)
        const response = await eventService.getUpcomingEvents();
        
        // Ensure we default to an empty array if data is missing
        setEvents(response.data || []);
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
        setError('Failed to load upcoming events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="text-gray-500 mt-2">Private team schedule and hackathons.</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-brand-600">
          <Loader2 className="animate-spin mb-4" size={32} />
          <span className="text-lg font-medium">Loading events...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && events.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <CalendarIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-lg font-medium text-gray-900">No upcoming team events.</p>
          <p className="text-gray-500 mt-1">Check back later for new hackathons and meetings.</p>
        </div>
      )}

      {/* Data State: Events Grid */}
      {!isLoading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event._id || event.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
              {/* Optional Cover Image */}
              {event.coverImage && (
                <img 
                  src={event.coverImage} 
                  alt={event.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                  <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                    {event.eventType || 'Event'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-3 mt-auto">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon size={16} className="mr-2 text-gray-400" />
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span>{event.location} • {event.mode}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <Link 
                    to={`/events/${event._id || event.id}`}
                    className="text-brand-600 hover:text-brand-800 font-medium text-sm transition"
                  >
                    View Full Details &rarr;
                  </Link>
                  
                  {event.registrationLink && (
                    <a 
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                      Register <ExternalLink size={14} className="ml-2" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}