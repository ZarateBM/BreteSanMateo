import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://syvdeoiudnlmjkcfsjop.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5dmRlb2l1ZG5sbWprY2Zzam9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjMwNDMsImV4cCI6MjA2NjgzOTA0M30.i31YnQeukk5Bb1C8F3CoX2lFeFWgm4Bz4FY8navCqHU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);