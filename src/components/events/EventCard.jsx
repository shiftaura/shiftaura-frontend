import { Calendar, MapPin, Trophy } from 'lucide-react';

export default function EventCard({ event }) {
  const {
    title = 'Event',
    description = '',
    eventType = 'HACKATHON',
    startDate,
    endDate,
    location = 'Online',
    mode = 'ONLINE',
    coverImage,
    result
  } = event || {};

  // Format date display (e.g., Sep 21, 2026)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-150 hover:border-brand-600 hover:shadow-md">
      {/* Cover Image */}
      {coverImage ? (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
          <span className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider backdrop-blur-sm">
            {eventType}
          </span>
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-between border-b border-gray-100 bg-brand-50 px-6">
          <span className="text-xl font-bold text-brand-900">{title}</span>
          <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
            {eventType}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-grow flex-col p-6">
        {coverImage && (
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        )}

        {/* Result / Podium Finish Highlight */}
        {result && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-sm font-semibold text-amber-800">
            <Trophy size={18} className="text-amber-600 shrink-0" />
            <span>{result}</span>
          </div>
        )}

        <p className="line-clamp-3 text-sm text-gray-600 mb-6 flex-grow">
          {description || 'No description provided.'}
        </p>

        {/* Metadata Details */}
        <div className="space-y-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-500">
          <div className="flex items-center">
            <Calendar size={15} className="mr-2 text-gray-400 shrink-0" />
            <span>
              {formatDate(startDate)}
              {endDate && endDate !== startDate ? ` - ${formatDate(endDate)}` : ''}
            </span>
          </div>

          <div className="flex items-center">
            <MapPin size={15} className="mr-2 text-gray-400 shrink-0" />
            <span>
              {location} • <span className="uppercase text-brand-600">{mode}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}