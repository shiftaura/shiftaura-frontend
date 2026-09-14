import { useState, useEffect } from 'react';
import { memberService } from '../../services/member.service';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  Loader2, 
  X, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');

  // Modal State for New Member Creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER'
  });

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await memberService.adminGetMembers();
      setMembers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch team members.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRoleToggle = async (id, currentRole) => {
    const nextRole = currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';
    if (!window.confirm(`Change this member's role to ${nextRole}?`)) return;

    try {
      setActionLoadingId(id);
      await memberService.adminUpdateMember(id, { role: nextRole });
      await fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update role.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = !currentStatus;
    try {
      setActionLoadingId(id);
      await memberService.adminUpdateMember(id, { isActive: nextStatus });
      await fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update account status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoadingId(id);
      await memberService.deleteMember(id);
      await fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete member.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingNew(true);
    try {
      await memberService.createMember(newMemberForm);
      setIsModalOpen(false);
      setNewMemberForm({ name: '', email: '', password: '', role: 'MEMBER' });
      await fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create new member.');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    const query = searchQuery.toLowerCase();
    return (
      m.name?.toLowerCase().includes(query) ||
      m.email?.toLowerCase().includes(query) ||
      m.role?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">Add members, update authorization roles, and toggle access.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-brand-700 transition shrink-0"
        >
          <Plus size={16} className="mr-1.5" /> Add Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full bg-white rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
        />
      </div>

      {/* Error Notice */}
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
          <span className="text-sm font-medium">Fetching roster...</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Users className="mx-auto mb-2 text-gray-400" size={36} />
          <p className="text-base font-semibold text-gray-900">No members match your criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Responsive Table for Desktop, Scrollable on Small Viewports */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map((member) => {
                  const mId = member._id || member.id;
                  const isProcessing = actionLoadingId === mId;
                  const isActive = member.isActive !== false; // defaults to active

                  return (
                    <tr key={mId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-full bg-brand-50 border border-gray-200 flex items-center justify-center font-bold text-brand-600 shrink-0">
                            {member.avatar ? (
                              <img src={member.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                            ) : (
                              member.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{member.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{member.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRoleToggle(mId, member.role)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                            member.role === 'ADMIN'
                              ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                          }`}
                        >
                          {member.role === 'ADMIN' ? (
                            <ShieldCheck size={12} className="mr-1 text-purple-600" />
                          ) : (
                            <Shield size={12} className="mr-1 text-blue-600" />
                          )}
                          {member.role || 'MEMBER'}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleStatusToggle(mId, isActive)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                            isActive
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleDeleteMember(mId, member.name)}
                          className="inline-flex items-center p-1.5 text-gray-400 hover:text-red-600 rounded transition disabled:opacity-40"
                          aria-label={`Delete ${member.name}`}
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

      {/* New Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add Team Member</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newMemberForm.email}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                  placeholder="member@university.edu"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={newMemberForm.password}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, password: e.target.value })}
                  placeholder="Temporary password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Role</label>
                <select
                  value={newMemberForm.role}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 bg-white"
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="inline-flex items-center px-4 py-2 bg-brand-600 rounded-md text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {isSubmittingNew ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <Check size={16} className="mr-1.5" />}
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}