import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Flame, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function Login() {
    const { signIn } = useAuth()
    const { t } = useLanguage()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await signIn(email, password)
            navigate('/')
        } catch (error) {
            setError(t('login.error_auth'))
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
                            <Flame className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">{t('login.title')}</h1>
                        <p className="text-slate-600 dark:text-gray-400">{t('login.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 ml-1">{t('login.email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-12 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
                                    placeholder="ejemplo@fallaturia.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 ml-1">{t('login.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-12 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    required
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
                                    {t('login.submit')} <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-slate-100 dark:border-white/5">
                        <p className="text-slate-500 dark:text-gray-500 text-sm">
                            {t('login.no_account')} <a href="#" className="text-primary hover:underline font-bold">{t('login.contact')}</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
