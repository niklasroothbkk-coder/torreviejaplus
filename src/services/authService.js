import { supabase } from '../config/supabaseClient';

// Sign Up with Email
export const signUpWithEmail = async (email, password, firstName, lastName, phoneNumber) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
        },
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign In with Email and Password
export const signInWithEmail = async (email, password, keepSignedIn = false) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;
    
    // Store keepSignedIn preference in AsyncStorage
    if (keepSignedIn) {
      // Supabase automatically persists the session
      // The session will persist across app restarts
    } else {
      // For non-persistent sessions, we'll clear the session when app closes
      // This is handled in the App.js useEffect
    }
    
    return { success: true, data, keepSignedIn };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign Out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send Password Reset Magic Link
export const sendPasswordResetLink = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'torreviejaplus://reset-password',
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update Password (called after magic link verification)
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    // First try to get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
      throw sessionError;
    }
    
    if (!session) {
      console.log('⚠️ No active session found');
      return { success: false, error: 'No active session' };
    }
    
    console.log('✅ Session found, expires at:', new Date(session.expires_at * 1000).toLocaleString());
    
    // Session exists, return the user from the session
    if (session.user) {
      console.log('✅ User from session:', session.user.email);
      return { success: true, user: session.user };
    }
    
    console.log('⚠️ Session exists but no user');
    return { success: false, error: 'No user in session' };
  } catch (error) {
    console.log('❌ getCurrentUser error:', error.message);
    return { success: false, error: error.message };
  }
};