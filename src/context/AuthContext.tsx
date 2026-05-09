import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile, UserRole } from '../lib/supabase'

export type RolePermissions = {
    can_manage_agenda: boolean
    can_manage_gallery: boolean
    can_manage_news: boolean
    can_manage_clothing: boolean
    can_manage_lottery: boolean
    can_manage_actas: boolean
    can_manage_roles: boolean
}

type AuthContextType = {
    session: Session | null
    user: User | null
    profile: Profile | null
    role: UserRole | null
    permissions: RolePermissions | null
    loading: boolean
    checkPermission: (allowedRoles: UserRole[]) => boolean
    hasPermission: (permission: keyof RolePermissions) => boolean
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
    const [permissions, setPermissions] = useState<RolePermissions | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user)
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
                fetchProfile(session.user)
            } else {
                setProfile(null)
                setPermissions(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function fetchProfile(currentUser: User) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
            }

            let finalRole: UserRole = data?.role ?? 'subscriber'

            // Enforce fallaturia@gmail.com is always admin
            if (currentUser.email === 'fallaturia@gmail.com') {
                finalRole = 'admin'
                if (data && data.role !== 'admin') {
                    // Try to auto-correct in the background without blocking
                    supabase.from('profiles').update({ role: 'admin' }).eq('id', currentUser.id).then()
                }
            }

            if (data) {
                setProfile({ ...data, role: finalRole })
            } else {
                setProfile(null) // Handle edge case if profile missing
            }

            // Fetch permissions
            const { data: permData } = await supabase
                .from('role_permissions')
                .select('*')
                .eq('role', finalRole)
                .single()

            if (permData) {
                setPermissions(permData)
            } else if (finalRole === 'admin') {
                // Failsafe in case the table hasn't been created yet
                setPermissions({
                    can_manage_agenda: true,
                    can_manage_gallery: true,
                    can_manage_news: true,
                    can_manage_clothing: true,
                    can_manage_lottery: true,
                    can_manage_actas: true,
                    can_manage_roles: true
                })
            } else {
                setPermissions(null)
            }

        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const role: UserRole | null = profile?.role ?? (user ? 'subscriber' : null)

    const checkPermission = (allowedRoles: UserRole[]): boolean => {
        if (!role) return false
        return allowedRoles.includes(role)
    }

    const hasPermission = (permission: keyof RolePermissions): boolean => {
        if (role === 'admin' || user?.email === 'fallaturia@gmail.com') return true
        if (!permissions) return false
        return permissions[permission] === true
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
        }

        // Trigger n8n webhook
        try {
            await fetch('/api/webhook-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    ...metadata,
                    created_at: new Date().toISOString()
                })
            })
        } catch (err) {
            console.error('Failed to trigger n8n webhook:', err)
        }
    }

    return (
        <AuthContext.Provider value={{ session, user, profile, role, permissions, loading, checkPermission, hasPermission, signOut, signIn, signUp }}>
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
