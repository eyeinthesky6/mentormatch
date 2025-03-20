import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Booking } from '../types';

export function DashboardPage() {
  const { user } = useAuthStore();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          mentor:profiles!bookings_mentor_id_fkey(*),
          mentee:profiles!bookings_mentee_id_fkey(*)
        `)
        .or(`mentor_id.eq.${user?.id},mentee_id.eq.${user?.id}`)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as (Booking & {
        mentor: Profile;
        mentee: Profile;
      })[];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {bookings?.filter(b => b.status === 'confirmed').map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img
                        src={user?.id === booking.mentee_id 
                          ? booking.mentor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.mentor.full_name)}`
                          : booking.mentee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.mentee.full_name)}`
                        }
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{user?.id === booking.mentee_id ? booking.mentor.full_name : booking.mentee.full_name}</p>
                        <p className="text-sm text-gray-500">{new Date(booking.start_time).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100">
                      Reschedule
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Sessions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
            <div className="space-y-4">
              {bookings?.filter(b => b.status === 'completed').map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img
                        src={user?.id === booking.mentee_id 
                          ? booking.mentor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.mentor.full_name)}`
                          : booking.mentee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.mentee.full_name)}`
                        }
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{user?.id === booking.mentee_id ? booking.mentor.full_name : booking.mentee.full_name}</p>
                        <p className="text-sm text-gray-500">{new Date(booking.start_time).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <button className="w-full mt-2 px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100">
                    Leave Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}