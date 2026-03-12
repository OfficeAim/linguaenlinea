import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ollnssdpdevcumwxbkuw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbG5zc2RwZGV2Y3Vtd3hia3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDM3NjcsImV4cCI6MjA4ODM3OTc2N30.VdN_lTH-O5x-9we9-bxlYKK8twGBhTt8ARSFf4A_Cto';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
