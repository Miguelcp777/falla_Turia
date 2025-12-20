import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile, UserRole } from '../lib/supabase'

type AuthContextType = {
    session: Session | null
    user: User | null
    profile: Profile | null
    role: UserRole | null
    loading: boolean
    checkPermission: (allowedRoles: UserRole[]) => boolean
    signOut: () => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, metadata?: {
        first_name?: string
        last_name?: string
        address?: string
        phone?: string
    }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setLoading(false)
            }
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function fetchProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
            } else {
                setProfile(data)
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    // Default to 'subscriber' if logged in but no role, or null if not logged in
    const role: UserRole | null = profile?.role ?? (user ? 'subscriber' : null)

    const checkPermission = (allowedRoles: UserRole[]): boolean => {
        if (!role) return false
        return allowedRoles.includes(role)
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
    }

    const signUp = async (email: string, password: string, metadata?: {
        first_name?: string
        last_name?: string
        address?: string
        phone?: string
    }) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata || {}
            }
        })
        if (error) throw error

        // Notify Admin via Edge Function
        try {
            await supabase.functions.invoke('notify-admin', {
                body: { email }
            })
        } catch (err) {
            console.error('Failed to notify admin:', err)
            // Don't block sign up success
        }
    }

    return (
        <AuthContext.Provider value={{ session, user, profile, role, loading, checkPermission, signOut, signIn, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
