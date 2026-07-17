import { createClient } from '@supabase/supabase-js';
import config from './config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

// Initialize the Supabase client with the service role key to bypass RLS in the backend
export const supabase = createClient(supabaseUrl, supabaseKey);
