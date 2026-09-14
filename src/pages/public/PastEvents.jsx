import { useState, useEffect } from 'react';
import { eventService } from '../../services/event.service';
import EventCard from '../../components/events/EventCard';
import { Loader2, Calendar } from 'lucide-react';

export default function PastEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await eventService.getPastEvents();
        // The API returns { success: true, data: [...] }
        setEvents(response.data || []);
      } catch (err) {
        console.error('Error fetching past events:', err);
        setError('Failed to load past events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Past Events & Achievements
        </h1>
        <p className="text-lg text-gray-600">
          A track record of hackathons, project showcases, and competitions our team has participated in.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-brand-600">
          <Loader2 className="animate-spin mb-4" size={32} />
          <span className="text-lg font-medium">Loading past events...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mx-auto max-w-2xl rounded-md border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && events.length === 0 && (
        <div className="mx-auto max-w-2xl rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <Calendar className="mx-auto mb-3 text-gray-400" size={44} />
          <p className="text-lg font-medium text-gray-900">No past events yet.</p>
          <p className="text-sm text-gray-500 mt-1">Check back soon as we wrap up our latest projects.</p>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event._id || event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}