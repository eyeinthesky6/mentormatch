import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, DollarSign, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalMentors },
        { count: totalBookings },
        { count: totalRevenue }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('mentor_profiles').select('*', { count: 'exact' }),
        supabase.from('bookings').select('*', { count: 'exact' }),
        supabase.from('bookings').select('*', { count: 'exact' }).eq('status', 'completed')
      ]);

      return {
        users: totalUsers,
        mentors: totalMentors,
        bookings: totalBookings,
        revenue: totalRevenue * 100 // Assuming average booking value of $100
      };
    }
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
      title: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Mentors',
      value: stats?.mentors || 0,
      icon: Star,
      color: 'bg-green-500'
    },
    {
      title: 'Total Bookings',
      value: stats?.bookings || 0,
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

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

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            {/* Add user list here */}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
            {/* Add bookings list here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

export { AdminDashboard }