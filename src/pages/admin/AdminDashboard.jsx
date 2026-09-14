import { Link } from 'react-router-dom';
import { Users, Calendar, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
        <p className="text-sm text-gray-500 mt-1">Manage team members, scheduled events, and applicant requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/members"
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-brand-600 transition flex flex-col justify-between"
        >
          <div>
            <Users className="text-brand-600 mb-3" size={28} />
            <h2 className="text-lg font-bold text-gray-900">Manage Members</h2>
            <p className="text-xs text-gray-500 mt-1">Add new members, modify roles, and handle activations.</p>
          </div>
          <span className="text-xs font-semibold text-brand-600 mt-4 inline-block">Open Roster &rarr;</span>
        </Link>

        <Link
          to="/admin/events"
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-brand-600 transition flex flex-col justify-between"
        >
          <div>
            <Calendar className="text-brand-600 mb-3" size={28} />
            <h2 className="text-lg font-bold text-gray-900">Manage Events</h2>
            <p className="text-xs text-gray-500 mt-1">Schedule hackathons, manage galleries, and assign attendees.</p>
          </div>
          <span className="text-xs font-semibold text-brand-600 mt-4 inline-block">Open Schedule &rarr;</span>
        </Link>

        <Link
          to="/admin/join-requests"
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-brand-600 transition flex flex-col justify-between"
        >
          <div>
            <UserPlus className="text-brand-600 mb-3" size={28} />
            <h2 className="text-lg font-bold text-gray-900">Join Requests</h2>
            <p className="text-xs text-gray-500 mt-1">Review pending candidate submissions and onboard applicants.</p>
          </div>
          <span className="text-xs font-semibold text-brand-600 mt-4 inline-block">Review Requests &rarr;</span>
        </Link>
      </div>
    </div>
  );
}