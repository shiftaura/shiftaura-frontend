import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { memberService } from '../../services/member.service';
import { ArrowLeft, Globe, User, Loader2 } from 'lucide-react';

function GithubIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await memberService.getPublicMember(id);
        setMember(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Member profile not found.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-brand-600">
        <Loader2 className="animate-spin mb-4" size={32} />
        <span className="text-lg font-medium">Loading profile details...</span>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <p className="font-semibold text-lg">{error || 'Member not found'}</p>
          <Link to="/team" className="inline-block mt-4 text-sm text-brand-600 font-medium hover:underline">
            &larr; Back to team roster
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/team" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-600 mb-8 transition">
        <ArrowLeft size={16} className="mr-2" /> Back to Team
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-8 sm:p-10 border-b border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-28 h-28 rounded-full bg-brand-50 border-2 border-gray-200 flex items-center justify-center overflow-hidden shrink-0 text-brand-600">
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-gray-400" />
            )}
          </div>

          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-3xl font-extrabold text-gray-900">{member.name}</h1>
            <p className="text-base font-semibold text-brand-600 mt-1">{member.role || 'Member'}</p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-gray-500">
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition">
                  <GithubIcon size={20} />
                </a>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition">
                  <LinkedinIcon size={20} />
                </a>
              )}
              {member.portfolio && (
                <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition">
                  <Globe size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 space-y-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {member.bio || 'No bio provided.'}
            </p>
          </div>

          {Array.isArray(member.skills) && member.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}