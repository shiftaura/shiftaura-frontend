import { useState } from 'react';
import { Link } from 'react-router-dom';
import { joinRequestService } from '../../services/joinRequest.service';
import { 
  CheckCircle, 
  Loader2, 
  Send, 
  User, 
  Mail, 
  Building2, 
  GraduationCap, 
  Code, 
  Globe, 
  FileText 
} from 'lucide-react';

export default function Join() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    year: '',
    skills: '',
    github: '',
    linkedin: '',
    portfolio: '',
    reason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Clean and structure skills string into an array of strings
      const payload = {
        ...formData,
        skills: formData.skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      };

      await joinRequestService.submitRequest(payload);
      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 
        'Unable to submit your application. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-brand-600">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Application Received</h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for applying to join the team! Our leads review new join requests regularly. If your skillset matches an open project, we will get in touch via email.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/"
              className="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Return Home
            </Link>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  college: '',
                  year: '',
                  skills: '',
                  github: '',
                  linkedin: '',
                  portfolio: '',
                  reason: ''
                });
                setIsSubmitted(false);
              }}
              className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Join the Team</h1>
        <p className="mt-2 text-base text-gray-600">
          Interested in competing in hackathons and building practical open-source projects? Fill out the form below.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Name & Email */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User size={16} />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={isSubmitting}
                value={formData.name}
                onChange={handleChange}
                placeholder="Ada Lovelace"
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isSubmitting}
                value={formData.email}
                onChange={handleChange}
                placeholder="member@university.edu"
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* College & Year */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700">
              College / Institution *
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Building2 size={16} />
              </span>
              <input
                id="college"
                name="college"
                type="text"
                required
                disabled={isSubmitting}
                value={formData.college}
                onChange={handleChange}
                placeholder="RKGIT, Ghaziabad"
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Current Year of Study *
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <GraduationCap size={16} />
              </span>
              <input
                id="year"
                name="year"
                type="text"
                required
                disabled={isSubmitting}
                value={formData.year}
                onChange={handleChange}
                placeholder="2nd Year / 3rd Year"
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills & Competencies *
          </label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Code size={16} />
            </span>
            <input
              id="skills"
              name="skills"
              type="text"
              required
              disabled={isSubmitting}
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, Python, Tailwind, System Design (comma separated)"
              className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700">
              GitHub URL
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Globe size={16} />
              </span>
              <input
                id="github"
                name="github"
                type="url"
                disabled={isSubmitting}
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Globe size={16} />
              </span>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                disabled={isSubmitting}
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
              Portfolio / Website
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Globe size={16} />
              </span>
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                disabled={isSubmitting}
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://mysite.dev"
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Statement of Intent */}
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Why do you want to join the team? *
          </label>
          <div className="relative mt-1">
            <textarea
              id="reason"
              name="reason"
              rows={4}
              required
              disabled={isSubmitting}
              value={formData.reason}
              onChange={handleChange}
              placeholder="Tell us about the projects you want to build and what you bring to the team..."
              className="w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}