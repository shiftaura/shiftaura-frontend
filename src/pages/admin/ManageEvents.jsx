import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  MapPin, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await eventService.adminGetEvents();
      setEvents(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch team events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently remove "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await eventService.deleteEvent(id);
      await fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule hackathons, assign attendees, and publish results.</p>
        </div>

        <Link
          to="/admin/events/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-brand-700 transition shrink-0"
        >
          <Plus size={16} className="mr-1.5" /> Schedule Event
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex items-center">
          <AlertTriangle size={18} className="mr-2 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-brand-600">
          <Loader2 className="animate-spin mb-3" size={32} />
          <span className="text-sm font-medium">Loading event roster...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Calendar className="mx-auto mb-2 text-gray-400" size={36} />
          <p className="text-base font-semibold text-gray-900">No events scheduled.</p>
          <p className="text-xs text-gray-500 mt-1">Click "Schedule Event" above to create your first event.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Dates</th>
                  <th className="px-6 py-3">Location / Mode</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => {
                  const eventId = event._id || event.id;
                  const isProcessing = deletingId === eventId;

                  return (
                    <tr key={eventId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {event.coverImage ? (
                            <img
                              src={event.coverImage}
                              alt=""
                              className="h-10 w-14 rounded object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-14 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                              <Calendar size={18} />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{event.title}</p>
                            {event.result && (
                              <span className="inline-block text-xs font-semibold text-amber-700 mt-0.5">
                                ★ {event.result}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                          {event.eventType || 'HACKATHON'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600">
                        {formatDate(event.startDate)}
                        {event.endDate && event.endDate !== event.startDate ? ` - ${formatDate(event.endDate)}` : ''}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin size={13} className="mr-1 text-gray-400 shrink-0" />
                          <span>{event.location}</span>
                          <span className="ml-1.5 uppercase font-semibold text-gray-400 text-[10px]">
                            ({event.mode})
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleDelete(eventId, event.title)}
                          className="inline-flex items-center p-1.5 text-gray-400 hover:text-red-600 rounded transition disabled:opacity-40"
                          aria-label={`Delete ${event.title}`}
                        >
                          {isProcessing ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}