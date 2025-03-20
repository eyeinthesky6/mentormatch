import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, MessageSquare, Star } from 'lucide-react';

export function HowItWorksPage() {
  const steps = [
    {
      icon: BookOpen,
      title: 'Browse Mentors',
      description: 'Explore our diverse community of experienced mentors across various fields and specialties.'
    },
    {
      icon: Calendar,
      title: 'Book a Session',
      description: 'Choose a convenient time slot and schedule your one-on-one mentoring session.'
    },
    {
      icon: MessageSquare,
      title: 'Connect and Learn',
      description: 'Meet with your mentor virtually and get personalized guidance to achieve your goals.'
    },
    {
      icon: Star,
      title: 'Share Feedback',
      description: 'Rate your experience and help other mentees find the right mentor for their journey.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">How MentorMatch Works</h1>
          <p className="text-xl opacity-90">
            Your journey to professional growth starts here. Connect with experienced mentors
            and take your career to the next level.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
                <step.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MentorMatch?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Expert Mentors</h3>
              <p className="text-gray-600">
                Connect with industry professionals who have proven track records and extensive experience.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Book sessions at times that work for you, with mentors from around the world.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Personalized Guidance</h3>
              <p className="text-gray-600">
                Get tailored advice and actionable insights specific to your career goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who are accelerating their careers with MentorMatch.
          </p>
          <div className="space-x-4">
            <Link
              to="/browse"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700"
            >
              Find a Mentor
            </Link>
            <Link
              to="/signup"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold border border-indigo-600 hover:bg-indigo-50"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}