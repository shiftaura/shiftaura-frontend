import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import { memberService } from '../../services/member.service';
import ImageUploader from '../../components/upload/ImageUploader';
import { 
  ArrowLeft, 
  Calendar, 
  Plus, 
  X, 
  Loader2, 
  Check 
} from 'lucide-react';

export default function CreateEvent() {
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

  const [requirements, setRequirements] = useState(['Laptop', 'College ID']);
  const [currentReq, setCurrentReq] = useState('');
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch registered team members so admin can check off participants
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await memberService.adminGetMembers();
        setTeamMembers(response.data || []);
      } catch (err) {
        console.error('Could not load members list for participants assignment', err);
      }
    };
    loadMembers();
  }, []);

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

  const handleParticipantToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.participantIds.includes(id);
      return {
        ...prev,
        participantIds: exists
          ? prev.participantIds.filter((pId) => pId !== id)
          : [...prev.participantIds, id]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        requirements
      };

      await eventService.createEvent(payload);
      navigate('/admin/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule event. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/admin/events"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-600 transition"
      >
        <ArrowLeft size={16} className="mr-1.5" /> Back to Events
      </Link>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Schedule New Team Event</h1>
        <p className="text-sm text-gray-500 mt-1">Configure competition details, schedule requirements, and assign participants.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image Uploader */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Event Cover Image</label>
          <ImageUploader
            type="event"
            currentImage={formData.coverImage}
            onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
          />
        </div>

        {/* Basic Event Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Event Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Smart India Hackathon 2026"
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
              placeholder="Provide event details, objectives, and problem statements..."
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
              placeholder="e.g. RKGIT Campus, Ghaziabad or Discord"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
        </div>

        {/* Links & Results */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Registration Link</label>
              <input
                type="url"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleChange}
                placeholder="https://devfolio.co/..."
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
                placeholder="https://hackathon.org"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Podium Result (Optional)</label>
            <input
              type="text"
              name="result"
              value={formData.result}
              onChange={handleChange}
              placeholder="e.g. 1st Place Winners / Finalists"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Internal Team Notes</label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Private instructions: Arrive 30 minutes early, bring power extensions..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
        </div>

        {/* Dynamic Requirements List */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
          <label className="block text-sm font-semibold text-gray-900">Event Requirements</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentReq}
              onChange={(e) => setCurrentReq(e.target.value)}
              placeholder="Add item (e.g. Hardware Kit, GitHub setup)"
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

        {/* Participant Selection */}
        {teamMembers.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <label className="block text-sm font-semibold text-gray-900">Assign Participating Members</label>
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

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/admin/events"
            className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2.5 bg-brand-600 rounded-md text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Scheduling Event...
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Publish Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}