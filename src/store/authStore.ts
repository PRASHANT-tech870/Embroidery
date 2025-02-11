import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      set({ 
        user: { 
          id: data.user?.id ?? '', 
          email: data.user?.email ?? '', 
          full_name: data.user?.user_metadata?.full_name ?? '',
          phone_number: data.user?.user_metadata?.phone_number ?? ''
        } 
      });
    } else {
      set({ user: null });
    }
  },

  signUp: async (email, password, fullName, phoneNumber) => { // ✅ Added phoneNumber parameter
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone_number: phoneNumber } }, // ✅ Passing phoneNumber
    });

    if (error) throw error;

    if (data?.user) {
      await supabase.from('users').insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          phone_number: phoneNumber, // ✅ No more error
        },
      ]);
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (data?.user) {
      set({ 
        user: { 
          id: data.user?.id ?? '', 
          email: data.user?.email ?? '', 
          full_name: data.user?.user_metadata?.full_name ?? '',
          phone_number: data.user?.user_metadata?.phone_number ?? '' // ✅ Added phone_number
        } 
      });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  updatePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },
}));
