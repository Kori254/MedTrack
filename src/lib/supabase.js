import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL = 'https://alpjqxtekdncaevtnpls.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscGpxeHRla2RuY2FldnRucGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODU0MDMsImV4cCI6MjA5NjY2MTQwM30.6CaWs7W8-F9n2sfRcZeHmVtVnLN39lj1TdTeRofRVog';

// SecureStore adapter for Supabase session persistence
const SecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
