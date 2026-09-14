import { useState, useEffect } from 'react';
import { memberService } from '../../services/member.service';
import MemberCard from '../../components/members/MemberCard';
import { Loader2, Users } from 'lucide-react';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoading(true);
        const response = await memberService.getPublicMembers();
        setMembers(response.data || []);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Meet the Team</h1>
        <p className="text-lg text-gray-600">
          We are a group of dedicated engineers, developers, and creators collaborating to build modern solutions.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-brand-600">
          <Loader2 className="animate-spin mb-4" size={32} />
          <span className="text-lg font-medium">Loading team profiles...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-red-50 text-red-700 text-center rounded-md border border-red-200 max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {!isLoading && !error && members.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 max-w-3xl mx-auto">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-lg font-medium text-gray-900">No public members found.</p>
        </div>
      )}

      {!isLoading && !error && members.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <MemberCard key={member._id || member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}