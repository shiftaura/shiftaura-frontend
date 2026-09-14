import { Link } from 'react-router-dom';
import { Globe, User } from 'lucide-react';

// Lightweight, dependency-free brand icons
function GithubIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

export default function MemberCard({ member }) {
  const {
    _id,
    id,
    name = 'Team Member',
    role = 'Member',
    bio = '',
    skills = [],
    avatar,
    github,
    linkedin,
    portfolio,
  } = member || {};

  const memberId = _id || id;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-150 hover:border-brand-600">
      <div className="flex flex-grow flex-col items-center p-6 text-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gray-100 bg-brand-50 text-brand-600">
          {avatar ? (
            <img
              src={avatar}
              alt={`${name}'s avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            <User size={40} className="text-gray-400" />
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <p className="mt-1 text-sm font-medium text-brand-600">{role}</p>

        {bio && (
          <p className="mt-3 line-clamp-3 text-sm text-gray-600">
            {bio}
          </p>
        )}

        {Array.isArray(skills) && skills.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {skills.slice(0, 4).map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex items-center space-x-3 text-gray-500">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-gray-900"
              aria-label={`${name}'s GitHub profile`}
            >
              <GithubIcon size={18} />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-brand-600"
              aria-label={`${name}'s LinkedIn profile`}
            >
              <LinkedinIcon size={18} />
            </a>
          )}
          {portfolio && (
            <a
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-brand-600"
              aria-label={`${name}'s Portfolio site`}
            >
              <Globe size={18} />
            </a>
          )}
        </div>

        {memberId && (
          <Link
            to={`/team/${memberId}`}
            className="text-sm font-medium text-brand-600 transition hover:text-brand-900"
          >
            View Profile &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}