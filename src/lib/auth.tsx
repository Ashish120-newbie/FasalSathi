import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile, UserRole } from './db-types';

export interface FarmerProfileData {
  display_name: string;
  mobile: string;
  state: string;
  district: string;
  village?: string;
  crops: string[];
  land_size_acres: number;
  preferred_language: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, profileData: FarmerProfileData) => Promise<{ error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: string | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<Profile, 'display_name' | 'mobile' | 'state' | 'district' | 'village' | 'crops' | 'land_size_acres' | 'preferred_language'>>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, display_name, phone, state, district, village, crops, land_size_acres, preferred_language, mobile, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();
    if (!error && data) {
      setProfile(data as Profile);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile]);

  const signUpWithEmail = useCallback(async (email: string, password: string, profileData: FarmerProfileData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: profileData.display_name,
          mobile: profileData.mobile,
        },
      },
    });
    if (error) return { error: error.message };
    const userId = data.user?.id;
    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        display_name: profileData.display_name,
        mobile: profileData.mobile,
        state: profileData.state,
        district: profileData.district,
        village: profileData.village ?? null,
        crops: profileData.crops,
        land_size_acres: profileData.land_size_acres,
        preferred_language: profileData.preferred_language,
      });
    }
    return { error: null };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }, []);

  const signInWithPhone = useCallback(async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    return { error: error ? error.message : null };
  }, []);

  const verifyOtp = useCallback(async (phone: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    return { error: error ? error.message : null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
  }, [session, fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Pick<Profile, 'display_name' | 'mobile' | 'state' | 'district' | 'village' | 'crops' | 'land_size_acres' | 'preferred_language'>>) => {
    if (!session?.user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: updates.display_name,
        mobile: updates.mobile,
        state: updates.state,
        district: updates.district,
        village: updates.village,
        crops: updates.crops,
        land_size_acres: updates.land_size_acres,
        preferred_language: updates.preferred_language,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);
    if (error) return { error: error.message };
    await fetchProfile(session.user.id);
    return { error: null };
  }, [session, fetchProfile]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithPhone,
    verifyOtp,
    signOut,
    refreshProfile,
    updateProfile,
  }), [session, profile, loading, signUpWithEmail, signInWithEmail, signInWithPhone, verifyOtp, signOut, refreshProfile, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useUserRole(): UserRole | null {
  const { profile } = useAuth();
  return profile?.role ?? null;
}
