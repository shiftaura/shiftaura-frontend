import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import { Calendar, MapPin, ExternalLink, ArrowLeft, CheckCircle2, FileText, Users, Loader2 } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await eventService.getUpcomingEvent(id);
        setEvent(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Upcoming event details could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-brand-600">
        <Loader2 className="animate-spin mb-4" size={32} />
        <span className="text-lg font-medium">Fetching event schedule...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <p className="font-semibold">{error || 'Event not found.'}</p>
          <Link to="/events" className="inline-block mt-4 text-sm text-brand-600 font-medium hover:underline">
            &larr; Return to Upcoming Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-600 transition">
        <ArrowLeft size={16} className="mr-2" /> Back to Upcoming Events
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {event.coverImage && (
          <div className="h-64 w-full bg-gray-100 overflow-hidden">
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full uppercase tracking-wider">
                {event.eventType || 'Hackathon'}
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{event.title}</h1>
            </div>

            <div className="flex gap-3">
              {event.officialLink && (
                <a
                  href={event.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Official Page <ExternalLink size={14} className="ml-2" />
                </a>
              )}
              {event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-brand-600 rounded-md text-sm font-medium text-white hover:bg-brand-700 transition"
                >
                  Register Portal <ExternalLink size={14} className="ml-2" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-gray-100 text-sm">
            <div className="flex items-start">
              <Calendar size={18} className="mr-3 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Timeline</p>
                <p className="text-gray-600">Starts: {formatDate(event.startDate)}</p>
                {event.endDate && <p className="text-gray-600">Ends: {formatDate(event.endDate)}</p>}
              </div>
            </div>

            <div className="flex items-start">
              <MapPin size={18} className="mr-3 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Location & Mode</p>
                <p className="text-gray-600">{event.location}</p>
                <p className="text-xs font-semibold text-brand-600 uppercase mt-0.5">{event.mode}</p>
              </div>
            </div>
          </div>

          <div className="py-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {event.description || 'No description provided.'}
              </p>
            </div>

            {Array.isArray(event.requirements) && event.requirements.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <CheckCircle2 size={18} className="mr-2 text-brand-600" /> Requirements Checklist
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-center p-2.5 bg-gray-50 rounded-md border border-gray-100">
                      <span className="w-2 h-2 rounded-full bg-brand-600 mr-2 shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.notes && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-900">
                <p className="font-semibold flex items-center mb-1">
                  <FileText size={16} className="mr-2 text-amber-700" /> Important Team Notes
                </p>
                <p>{event.notes}</p>
              </div>
            )}

            {Array.isArray(event.participants) && event.participants.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <Users size={18} className="mr-2 text-brand-600" /> Confirmed Team Participants
                </h2>
                <div className="flex flex-wrap gap-2">
                  {event.participants.map((participant, index) => (
                    <span key={index} className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-md text-xs font-semibold text-gray-800">
                      {participant.name || participant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}