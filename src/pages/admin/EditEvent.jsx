import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import { memberService } from '../../services/member.service';
import ImageUploader from '../../components/upload/ImageUploader';
import MultiImageUploader from '../../components/upload/MultiImageUploader';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Loader2, 
  Check, 
  AlertTriangle,
  Images 
} from 'lucide-react';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'HACKATHON',
    startDate: '',
    endDate: '',
    location: '',
    mode: 'OFFLINE',
    registrationLink: '',
    officialLink: '',
    coverImage: '',
    notes: '',
    result: '',
    participantIds: []
  });

  const [existingGallery, setExistingGallery] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [currentReq, setCurrentReq] = useState('');
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Converts backend ISO date string to HTML datetime-local format
  const toDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localTime = new Date(date.getTime() - offset);
    return localTime.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setStatusMessage({ type: '', text: '' });

        // Load members list for participant assignments and event details in parallel
        const [membersRes, eventRes] = await Promise.all([
          memberService.adminGetMembers(),
          eventService.getUpcomingEvent(id)
        ]);

        setTeamMembers(membersRes.data || []);

        const event = eventRes.data;
        if (event) {
          setFormData({
            title: event.title || '',
            description: event.description || '',
            eventType: event.eventType || 'HACKATHON',
            startDate: toDateTimeLocal(event.startDate),
            endDate: toDateTimeLocal(event.endDate),
            location: event.location || '',
            mode: event.mode || 'OFFLINE',
            registrationLink: event.registrationLink || '',
            officialLink: event.officialLink || '',
            coverImage: event.coverImage || '',
            notes: event.notes || '',
            result: event.result || '',
            participantIds: (event.participants || []).map((p) => p._id || p.id || p)
          });

          setRequirements(event.requirements || []);
          setExistingGallery(event.gallery || event.images || []);
        }
      } catch (err) {
        setStatusMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to load event details.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRequirement = (e) => {
    e.preventDefault();
    if (currentReq.trim()) {
      setRequirements([...requirements, currentReq.trim()]);
      setCurrentReq('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleParticipantToggle = (memberId) => {
    setFormData((prev) => {
      const exists = prev.participantIds.includes(memberId);
      return {
        ...prev,
        participantIds: exists
          ? prev.participantIds.filter((pId) => pId !== memberId)
          : [...prev.participantIds, memberId]
      };
    });
  };

  const handleGalleryUpload = async (newImageUrls) => {
    try {
      setStatusMessage({ type: '', text: '' });
      await eventService.addGalleryImages(id, newImageUrls);
      setExistingGallery((prev) => [...prev, ...newImageUrls]);
      setStatusMessage({ type: 'success', text: 'Gallery images added successfully.' });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save gallery images.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        requirements
      };

      await eventService.updateEvent(id, payload);
      setStatusMessage({ type: 'success', text: 'Event updated successfully.' });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update event details.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-brand-600">
        <Loader2 className="animate-spin mb-3" size={32} />
        <span className="text-sm font-medium">Loading event data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/admin/events"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-600 transition"
      >
        <ArrowLeft size={16} className="mr-1.5" /> Back to Events
      </Link>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-sm text-gray-500 mt-1">Modify schedules, podium finishes, and event media.</p>
        </div>
        <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full uppercase tracking-wider">
          {formData.eventType}
        </span>
      </div>

      {statusMessage.text && (
        <div
          className={`p-4 rounded-md border text-sm flex items-center ${
            statusMessage.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          {statusMessage.type === 'error' ? (
            <AlertTriangle size={18} className="mr-2 shrink-0" />
          ) : (
            <Check size={18} className="mr-2 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Event Cover Image</label>
          <ImageUploader
            type="event"
            currentImage={formData.coverImage}
            onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
          />
        </div>

        {/* Basic Event Info */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Event Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Event Type *</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 bg-white"
              >
                <option value="HACKATHON">HACKATHON</option>
                <option value="WORKSHOP">WORKSHOP</option>
                <option value="COMPETITION">COMPETITION</option>
                <option value="PROJECT">PROJECT</option>
                <option value="MEETUP">MEETUP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Mode *</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 bg-white"
              >
                <option value="OFFLINE">OFFLINE</option>
                <option value="ONLINE">ONLINE</option>
                <option value="HYBRID">HYBRID</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Start Date & Time *</label>
              <input
                type="datetime-local"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Location / Venue *</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
        </div>

        {/* Links, Results & Notes */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Registration Link</label>
              <input
                type="url"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Official Website</label>
              <input
                type="url"
                name="officialLink"
                value={formData.officialLink}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Podium Result</label>
            <input
              type="text"
              name="result"
              value={formData.result}
              onChange={handleChange}
              placeholder="e.g. 1st Place Winners, Top 5 Finalist"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Team Notes</label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
          <label className="block text-sm font-semibold text-gray-900">Event Requirements</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentReq}
              onChange={(e) => setCurrentReq(e.target.value)}
              placeholder="Add requirement item..."
              className="flex-grow rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
            <button
              type="button"
              onClick={handleAddRequirement}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {requirements.map((req, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 bg-gray-100 border border-gray-200 text-gray-800 text-xs font-medium rounded-full"
              >
                {req}
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(idx)}
                  className="ml-1.5 text-gray-400 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Participants Selection */}
        {teamMembers.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <label className="block text-sm font-semibold text-gray-900">Assigned Team Participants</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {teamMembers.map((member) => {
                const mId = member._id || member.id;
                const isSelected = formData.participantIds.includes(mId);

                return (
                  <div
                    key={mId}
                    onClick={() => handleParticipantToggle(mId)}
                    className={`flex items-center p-3 rounded-md border cursor-pointer transition text-xs font-medium ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-900'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mr-2 text-brand-600 rounded"
                    />
                    <span className="truncate">{member.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Save Metadata Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/admin/events"
            className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-6 py-2.5 bg-brand-600 rounded-md text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Gallery Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Images size={20} className="text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900">Event Gallery</h2>
        </div>
        <p className="text-xs text-gray-500">
          Upload competition photos and highlight reels. Each image is authorized by your backend and sent directly to Cloudinary.
        </p>

        <MultiImageUploader onUploadComplete={handleGalleryUpload} />

        {existingGallery.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">Uploaded Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {existingGallery.map((imgUrl, idx) => (
                <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}