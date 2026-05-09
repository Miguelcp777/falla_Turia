import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export const useActivityLogger = () => {
    const location = useLocation()
    const { user, profile } = useAuth()

    useEffect(() => {
        const logPageView = async () => {
            if (!user) return // Only log for authenticated users as requested

            try {
                await supabase.from('activity_logs').insert({
                    user_id: user.id,
                    user_email: user.email,
                    event_type: 'page_view',
                    page_path: location.pathname,
                    metadata: {
                        search: location.search,
                        role: profile?.role
                    }
                })
            } catch (error) {
                console.error('Error logging activity:', error)
            }
        }

        logPageView()
    }, [location.pathname, user]) // Log whenever path or user changes
}

export const logCustomEvent = async (eventType: string, metadata: any = {}) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
        await supabase.from('activity_logs').insert({
            user_id: user.id,
            user_email: user.email,
            event_type: eventType,
            metadata
        })
    } catch (error) {
        console.error('Error logging custom event:', error)
    }
}
