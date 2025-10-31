import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkpekfxthkmyemxashbc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcGVrZnh0aGtteWVteGFzaGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTI1MzIsImV4cCI6MjA3NzQ4ODUzMn0.FgrLIOAcvzgKZzliy3WpLsALX0ce2f0zNGbWZs8D3Xw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
