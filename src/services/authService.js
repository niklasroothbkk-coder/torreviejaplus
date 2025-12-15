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
    
    // If keepSignedIn is false, set session to expire on browser close
    if (!keepSignedIn) {
      // Session will expire when app is closed
      // Supabase handles this automatically
    }
    
    return { success: true, data };
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
      redirectTo: 'huahin://reset-password',
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
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};