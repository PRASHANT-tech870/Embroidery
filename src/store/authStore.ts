import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  address?: string;
  profile_picture?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.getUser();
      console.log("Fetching Auth User:", data, "Error:", error);

      if (error || !data?.user) {
        set({ user: null, loading: false });
        return;
      }

      await get().fetchProfile(); // Fetch full profile after auth

    } catch (err: any) {
      console.error("Fetch User Error:", err.message);
      set({ error: err.message, loading: false });
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });

    const user = get().user;
    if (!user) {
      set({ error: 'User not logged in', loading: false });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, phone_number, address, profile_picture')
        .eq('id', user.id)
        .single();

      console.log("Profile Fetch Data:", data, "Error:", error);

      if (error) throw new Error('Failed to fetch profile.');

      set({
        user: {
          ...user,
          full_name: data.full_name ?? '',
          phone_number: data.phone_number ?? '',
          address: data.address ?? '',
          profile_picture: data.profile_picture ?? '',
        },
      });

    } catch (err: any) {
      console.error("Fetch Profile Error:", err.message);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, fullName, phoneNumber) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone_number: phoneNumber } },
      });

      if (error) throw error;

      console.log("User Signed Up:", data);

      if (data?.user) {
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            phone_number: phoneNumber,
          },
        ]);

        if (insertError) throw insertError;

        set({
          user: {
            id: data.user.id,
            email: data.user.email ?? '',
            full_name: fullName,
            phone_number: phoneNumber,
          },
        });
      }
    } catch (err: any) {
      console.error("Sign Up Error:", err.message);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      console.log("User Logged In:", data);

      if (data?.user) {
        await get().fetchProfile();
      }
    } catch (err: any) {
      console.error("Sign In Error:", err.message);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });

    try {
      await supabase.auth.signOut();
      console.log("User Signed Out");
      set({ user: null });
    } catch (err: any) {
      console.error("Sign Out Error:", err.message);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updatePassword: async (newPassword) => {
    set({ loading: true, error: null });

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      console.log("Password Updated Successfully");
    } catch (err: any) {
      console.error("Update Password Error:", err.message);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
