import { Link } from 'react-router-dom';
import { Users, Trophy, Code } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Innovating Through Collaboration
          </h1>
          <p className="text-lg md:text-xl text-brand-50 max-w-2xl mx-auto">
            We are a dedicated team of student developers, engineers, and creators building impactful solutions and competing in top-tier hackathons.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link 
              to="/join" 
              className="bg-white text-brand-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Apply to Join
            </Link>
            <Link 
              to="/events/past" 
              className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-800 transition"
            >
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights / About Section */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3 p-6">
            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
              <Code size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Modern Stack</h3>
            <p className="text-gray-600">
              Building scalable, full-stack applications using modern web technologies and engineering best practices.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6">
            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
              <Trophy size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Hackathons & Events</h3>
            <p className="text-gray-600">
              Consistently participating in and securing podium finishes at national level hackathons and tech fests.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6">
            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Collaborative Growth</h3>
            <p className="text-gray-600">
              Fostering an environment of peer-to-peer learning, code reviews, and shared technical architecture.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 px-4 text-center border-t border-gray-200">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Ready to build with us?</h2>
          <p className="text-gray-600">
            We are always looking for passionate problem solvers. If you love tracking algorithms, debugging architectures, or designing intuitive UIs, we want you on the team.
          </p>
          <Link 
            to="/join" 
            className="inline-block bg-brand-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-brand-700 transition mt-4"
          >
            Submit Join Request
          </Link>
        </div>
      </section>
    </div>
  );
}