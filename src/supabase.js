import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dtglibkzbhrfkwdgkbgz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0Z2xpYmt6YmhyZmt3ZGdrYmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjgxNzUsImV4cCI6MjA5MDMwNDE3NX0.XRXefA-UtFatDqfVCWy22pEx2fHPPhaC3RL_Ou59-rk'

export const supabase = createClient(supabaseUrl, supabaseKey)