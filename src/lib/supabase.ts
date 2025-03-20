
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to send welcome email after user signs up
export const sendWelcomeEmail = async (email) => {
    try {
        await supabase
            .from('emails')
            .insert([{ email, subject: 'Welcome to MentorMatch!', message: 'Thank you for joining MentorMatch. Stay tuned for updates!' }]);
    } catch (error) {
        console.error('Failed to send email:', error.message);
    }
};
