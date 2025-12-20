import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { UserRole } from '@/lib/supabase'

type ProtectedRouteProps = {
    allowedRoles?: UserRole[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, role, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // If user doesn't have required role, redirect to home or unauthorized page
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
