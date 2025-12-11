import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://vfponburmjbuqqneigjr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});