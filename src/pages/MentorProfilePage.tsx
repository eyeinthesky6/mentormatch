import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Clock, Calendar, Briefcase, MapPin, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { MentorProfile } from '../types';

export function MentorProfilePage() {
  const { id } = useParams();

  const { data: mentor, isLoading } = useQuery({
    queryKey: ['mentor', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentor_profiles')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as MentorProfile & { profile: Profile };
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Mentor not found</h2>
          <p className="mt-2 text-gray-600">The mentor you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-8 sm:p-10 border-b">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <img
                src={mentor.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.profile.full_name)}`}
                alt={mentor.profile.full_name}
                className="h-32 w-32 rounded-full object-cover mb-4 sm:mb-0 sm:mr-8"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{mentor.profile.full_name}</h1>
                <p className="text-xl text-gray-600 mt-1">{mentor.title}</p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>Remote</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span>{mentor.years_of_experience} years of experience</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    <span>4.9 (120 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 sm:p-10">
            <div className="md:col-span-2 space-y-8">
              {/* About */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{mentor.profile.bio}</p>
              </section>

              {/* Reviews */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {/* Sample reviews - replace with actual data */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <img
                        src="https://ui-avatars.com/api/?name=John+Doe"
                        alt="John Doe"
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">John Doe</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Excellent mentor! Really helped me understand complex concepts and improve my skills.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Booking Card */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-gray-900">${mentor.hourly_rate}</p>
                  <p className="text-gray-600">per hour</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>60 minute session</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Flexible scheduling</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <LinkIcon className="h-5 w-5 mr-2" />
                    <span>Video conferencing</span>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = `/book/${mentor.id}`}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Book a Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}