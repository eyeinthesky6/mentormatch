import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, DollarSign, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import type { Booking } from '../../types';

export function MentorDashboard() {
  const { user } = useAuthStore();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['mentor-bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          mentee:profiles!bookings_mentee_id_fkey(*)
        `)
        .eq('mentor_id', user?.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as (Booking & { mentee: Profile })[];
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ['mentor-stats', user?.id],
    queryFn: async () => {
      const [
        { count: totalSessions },
        { count: completedSessions },
        { data: earnings }
      ] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact' }).eq('mentor_id', user?.id),
        supabase.from('bookings').select('*', { count: 'exact' }).eq('mentor_id', user?.id).eq('status', 'completed'),
        supabase.from('mentor_profiles').select('hourly_rate').eq('id', user?.id).single()
      ]);

      return {
        totalSessions,
        completedSessions,
        earnings: (completedSessions || 0) * (earnings?.hourly_rate || 0)
      };
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

  const cards = [
    {
      title: 'Total Sessions',
      value: stats?.totalSessions || 0,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Completed Sessions',
      value: stats?.completedSessions || 0,
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      title: 'Total Earnings',
      value: `$${(stats?.earnings || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Average Rating',
      value: '4.9',
      icon: Star,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentor Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <div key={card.title} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            {bookings?.filter(b => b.status === 'confirmed').map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <img
                    src={booking.mentee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.mentee.full_name)}`}
                    alt={booking.mentee.full_name}
                    className="h-10 w-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-medium">{booking.mentee.full_name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.start_time).toLocaleDateString()} at{' '}
                      {new Date(booking.start_time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100">
                    Join
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}