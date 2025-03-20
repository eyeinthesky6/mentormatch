/*
  # Initial Schema Setup for MentorMatch

  1. New Tables
    - `profiles`
      - User profiles for both mentors and mentees
      - Stores user details and preferences
    
    - `mentor_profiles`
      - Extended profile information for mentors
      - Includes expertise, hourly rate, availability
    
    - `bookings`
      - Scheduling information for mentorship sessions
      - Tracks status, timing, and participants
    
    - `reviews`
      - Feedback and ratings for mentorship sessions
    
    - `categories`
      - Areas of expertise/topics for mentorship
    
  2. Security
    - Enable RLS on all tables
    - Policies for authenticated access
    - Admin-specific policies
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  email text NOT NULL,
  is_mentor boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mentor_profiles table
CREATE TABLE mentor_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id),
  title text NOT NULL,
  hourly_rate integer NOT NULL,
  years_of_experience integer NOT NULL,
  availability jsonb DEFAULT '{"monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create mentor_categories junction table
CREATE TABLE mentor_categories (
  mentor_id uuid REFERENCES mentor_profiles(id),
  category_id uuid REFERENCES categories(id),
  PRIMARY KEY (mentor_id, category_id)
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES profiles(id) NOT NULL,
  mentee_id uuid REFERENCES profiles(id) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  reviewer_id uuid REFERENCES profiles(id) NOT NULL,
  UNIQUE(booking_id, reviewer_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Mentor profiles policies
CREATE POLICY "Mentor profiles are viewable by everyone"
  ON mentor_profiles FOR SELECT
  USING (true);

CREATE POLICY "Mentors can update own profile"
  ON mentor_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = mentor_id OR
    auth.uid() = mentee_id
  );

CREATE POLICY "Mentees can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (
    auth.uid() = mentee_id AND
    EXISTS (
      SELECT 1 FROM mentor_profiles
      WHERE id = mentor_id
    )
  );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for completed bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id = booking_id
      AND status = 'completed'
      AND (mentor_id = auth.uid() OR mentee_id = auth.uid())
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();