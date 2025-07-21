import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile, AuthUser } from '../utils/supabase'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, addressData?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  }) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  signInWithProvider: (provider: 'google' | 'github' | 'apple') => Promise<{ error: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  getProfile: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setUser({
          id: session.user.id,
          email: session.user.email!,
          profile
        })
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setUser({
            id: session.user.id,
            email: session.user.email!,
            profile
          })
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const signUp = async (email: string, password: string, fullName: string, addressData?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      // If signup successful, create profile manually (in case trigger fails)
      if (!error && data.user) {
        try {
          // Create profile record manually
          const profileData = {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            address_line_1: addressData?.addressLine1,
            address_line_2: addressData?.addressLine2,
            city: addressData?.city,
            postal_code: addressData?.postalCode,
            country: addressData?.country
          }

          const { error: profileError } = await supabase
            .from('profiles')
            .insert(profileData)

          if (profileError) {
            console.log('Profile creation error (might be normal if trigger worked):', profileError)
          }
        } catch (profileErr) {
          console.log('Profile creation failed, but signup succeeded:', profileErr)
        }
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const signInWithProvider = async (provider: 'google' | 'github' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (!error) {
        // Refresh user data
        const profile = await fetchProfile(user.id)
        setUser({ ...user, profile })
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const getProfile = async (): Promise<Profile | null> => {
    if (!user) return null
    return await fetchProfile(user.id)
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithProvider,
    updateProfile,
    getProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 