import { useState, useEffect } from 'react';
import { joinRequestService } from '../../services/joinRequest.service';
import { 
  Check, 
  X, 
  Loader2, 
  Globe, 
  GraduationCap, 
  Building2, 
  Calendar, 
  FileText,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

export default function JoinRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State for Approving with a Temporary Password
  const [activeRequestForApproval, setActiveRequestForApproval] = useState(null);
  const [tempPassword, setTempPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);

  const fetchRequests = async (statusFilter) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await joinRequestService.getRequests(statusFilter || undefined);
      setRequests(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load join requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(filter);
  }, [filter]);

  // Generate a randomized default password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pass = 'Hub@';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(pass);
  };

  const handleOpenAcceptModal = (request) => {
    setActiveRequestForApproval(request);
    generateRandomPassword();
  };

  const handleConfirmAccept = async (e) => {
    e.preventDefault();
    if (!activeRequestForApproval) return;

    try {
      setIsProcessingApproval(true);
      const reqId = activeRequestForApproval._id || activeRequestForApproval.id;

      // Sends status and the generated temporary password to backend
      await joinRequestService.updateRequest(reqId, 'ACCEPTED', tempPassword);

      alert(`Request Accepted! Initial password set to: ${tempPassword}`);
      setActiveRequestForApproval(null);
      setTempPassword('');
      await fetchRequests(filter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept join request.');
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to REJECT this request?')) return;

    try {
      await joinRequestService.updateRequest(id, 'REJECTED');
      await fetchRequests(filter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject request.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicant Join Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Review candidate applications and onboard members.</p>
        </div>

        <div className="flex gap-2">
          {['', 'PENDING', 'ACCEPTED', 'REJECTED'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition ${
                filter === status
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-brand-600">
          <Loader2 className="animate-spin mb-3" size={32} />
          <span className="text-sm font-medium">Loading applications...</span>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && requests.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-lg font-medium text-gray-900">No join requests found.</p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !error && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((req) => {
            const reqId = req._id || req.id;

            return (
              <div
                key={reqId}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-6 hover:border-gray-300 transition"
              >
                <div className="space-y-3 flex-grow">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-900">{req.name}</h2>
                    <span className="text-sm text-gray-500">&lt;{req.email}&gt;</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)}`}>
                      {req.status || 'PENDING'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Building2 size={14} className="mr-1.5 text-gray-400" />
                      <span>{req.college}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap size={14} className="mr-1.5 text-gray-400" />
                      <span>Year: {req.year}</span>
                    </div>
                    {req.createdAt && (
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1.5 text-gray-400" />
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {Array.isArray(req.skills) && req.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {req.reason && (
                    <div className="bg-gray-50 border border-gray-100 p-3 rounded-md text-xs text-gray-700 mt-2">
                      <p className="font-semibold text-gray-900 flex items-center mb-1">
                        <FileText size={12} className="mr-1 text-gray-500" /> Intent Statement
                      </p>
                      <p className="whitespace-pre-line">{req.reason}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-1 text-xs">
                    {req.github && (
                      <a href={req.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                        <GithubIcon size={14} /> GitHub
                      </a>
                    )}
                    {req.linkedin && (
                      <a href={req.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-600 flex items-center gap-1">
                        <LinkedinIcon size={14} /> LinkedIn
                      </a>
                    )}
                    {req.portfolio && (
                      <a href={req.portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-600 flex items-center gap-1">
                        <Globe size={14} /> Portfolio
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col justify-end items-end gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                  {req.status !== 'ACCEPTED' && (
                    <button
                      type="button"
                      onClick={() => handleOpenAcceptModal(req)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-green-700 transition"
                    >
                      <Check size={14} className="mr-1" />
                      Accept & Onboard
                    </button>
                  )}

                  {req.status !== 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => handleReject(reqId)}
                      className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold rounded-md shadow-sm hover:bg-red-100 transition"
                    >
                      <X size={14} className="mr-1" />
                      Reject
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Password Assignment & Onboarding Modal */}
      {activeRequestForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-gray-900">
                <KeyRound className="text-brand-600" size={20} />
                <h2 className="text-base font-bold">Approve & Assign Password</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveRequestForApproval(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAccept} className="p-6 space-y-4">
              <p className="text-xs text-gray-600">
                Approving <strong>{activeRequestForApproval.name}</strong> ({activeRequestForApproval.email}). Assign a temporary password so they can log in to the Member Dashboard.
              </p>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Initial Login Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm pr-10 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-xs text-brand-600 hover:underline font-medium"
                >
                  Regenerate Password
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveRequestForApproval(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingApproval}
                  className="inline-flex items-center px-4 py-2 bg-brand-600 rounded-md text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {isProcessingApproval ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-1.5" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-1.5" />
                      Confirm & Create Member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}