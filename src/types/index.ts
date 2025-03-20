export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  email: string;
  is_mentor: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface MentorProfile {
  id: string;
  title: string;
  hourly_rate: number;
  years_of_experience: number;
  availability: {
    [key: string]: string[];
  };
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  mentor_id: string;
  mentee_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  mentor?: Profile;
  mentee?: Profile;
}

export interface Review {
  id: string;
  booking_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer_id: string;
  reviewer?: Profile;
  booking?: Booking;
}