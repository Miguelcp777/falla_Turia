import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

type ProtectedRouteProps = {
    allowedRoles?: ('anon' | 'standard' | 'admin')[]
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

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
