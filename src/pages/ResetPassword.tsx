import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Lock, AlertCircle, CheckCircle, KeyRound } from 'lucide-react'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        // Check if the user has a valid session from the password reset link
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setError('Enlace de recuperación inválido o expirado. Por favor, solicita uno nuevo.')
            }
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        // Validate password length
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            setSuccess(true)

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (error: any) {
            setError(error.message || 'Error al actualizar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden bg-background-light dark:bg-background-dark">
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 animate-pulse-slow">
                            <KeyRound className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
                            Establecer Nueva Contraseña
                        </h1>
                        <p className="text-slate-600 dark:text-gray-400">
                            Ingresa tu nueva contraseña
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-2 text-sm">
                                <CheckCircle size={16} />
                                ¡Contraseña actualizada exitosamente!
                            </div>
                            <p className="text-slate-600 dark:text-gray-400 text-sm">
                                Redirigiendo al login...
                            </p>
                            <div className="flex justify-center">
                                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 ml-1">
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-12 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 ml-1">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-12 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary-dark hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <KeyRound size={20} />
                                        Actualizar Contraseña
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center pt-8 border-t border-slate-100 dark:border-white/5">
                        <p className="text-slate-500 dark:text-gray-500 text-sm">
                            ¿Recordaste tu contraseña?
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-primary hover:underline font-bold ml-2"
                            >
                                Volver al Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
