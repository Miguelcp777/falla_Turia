import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { Menu, X, LogOut, Shield } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const { user, checkPermission, signOut } = useAuth()
    const { language, setLanguage, t } = useLanguage()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const FlagES = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-6 h-4 rounded shadow-sm">
            <rect width="750" height="500" fill="#c60b1e" />
            <rect width="750" height="250" y="125" fill="#ffc400" />
        </svg>
    )

    const FlagVA = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-6 h-4 rounded shadow-sm">
            <rect width="750" height="500" fill="#f4b939" />
            <rect width="750" height="55" y="40" fill="#c8102e" />
            <rect width="750" height="55" y="145" fill="#c8102e" />
            <rect width="750" height="55" y="250" fill="#c8102e" />
            <rect width="750" height="55" y="355" fill="#c8102e" />
            <path d="M0,0 h180 v500 h-180 z" fill="#206bc4" />
            <path d="M0,0 v500 l20,0 v-500 z" fill="#c8102e" opacity="0.1" />
            {/* Crown simplified representation or just the blue strip for recognizability at small size */}
            <path d="M20,0 h10 v500 h-10 z" fill="#c8102e" />
        </svg>
    )

    return (
        <nav className="sticky top-0 z-50 w-full bg-background-dark/95 backdrop-blur-md border-b border-surface-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="relative w-14 h-14 min-w-[3.5rem] rounded-full overflow-hidden flex-shrink-0 border-2 border-white/10 shadow-lg bg-white/5">
                                <img src="/escudo.jpg" alt="Falla Turia" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col hidden sm:flex justify-center items-start h-12">
                                <span className="text-white font-display font-bold text-base leading-none tracking-wide group-hover:text-primary transition-colors whitespace-nowrap">
                                    Falla Turia
                                </span>
                                <span className="text-white font-display font-bold text-base leading-none tracking-wide group-hover:text-primary transition-colors whitespace-nowrap">
                                    Plaça de l' Ajuntament
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                {t('nav.home')}
                            </Link>
                            <Link to="/news" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                {t('nav.news')}
                            </Link>
                            <Link to="/agenda" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                {t('nav.agenda')}
                            </Link>
                            <Link to="/lottery" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                {t('nav.lottery')}
                            </Link>
                            <Link to="/representatives" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                {t('nav.representatives')}
                            </Link>
                            <Link to="/gallery" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                {t('nav.gallery')}
                            </Link>

                            {checkPermission(['subscriber', 'author', 'editor', 'admin']) && (
                                <Link to="/suggestions" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    {t('nav.suggestions')}
                                </Link>
                            )}

                            {checkPermission(['admin', 'editor', 'author']) && (
                                <Link to="/admin" className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                    <Shield size={16} />
                                    {t('nav.panel')}
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {/* Language Switcher */}
                        <div className="flex items-center gap-2 bg-surface-dark border border-white/10 rounded-full p-1">
                            <button
                                onClick={() => setLanguage('es')}
                                className={`p-1.5 rounded-full transition-all ${language === 'es' ? 'bg-white/10 ring-1 ring-white/20' : 'opacity-50 hover:opacity-100'}`}
                                aria-label="Español"
                            >
                                <FlagES />
                            </button>
                            <button
                                onClick={() => setLanguage('va')}
                                className={`p-1.5 rounded-full transition-all ${language === 'va' ? 'bg-white/10 ring-1 ring-white/20' : 'opacity-50 hover:opacity-100'}`}
                                aria-label="Valencià"
                            >
                                <FlagVA />
                            </button>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleSignOut}
                                    className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                                    title={t('nav.logout')}
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full text-sm font-bold transition-transform transform hover:scale-105 shadow-lg shadow-primary/20"
                            >
                                {t('nav.access')}
                            </Link>
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-4">
                        {/* Mobile Lang Switcher */}
                        <div className="flex items-center gap-2">
                            <button onClick={() => setLanguage('es')} className={`opacity-${language === 'es' ? '100' : '50'}`}><FlagES /></button>
                            <button onClick={() => setLanguage('va')} className={`opacity-${language === 'va' ? '100' : '50'}`}><FlagVA /></button>
                        </div>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-background-dark border-t border-surface-dark">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.home')}</Link>
                        <Link to="/news" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.news')}</Link>
                        <Link to="/agenda" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.agenda')}</Link>
                        <Link to="/lottery" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.lottery')}</Link>
                        <Link to="/representatives" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.representatives')}</Link>
                        <Link to="/gallery" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.gallery')}</Link>
                        {checkPermission(['subscriber', 'author', 'editor', 'admin']) && (
                            <Link to="/suggestions" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.suggestions_full')}</Link>
                        )}
                        {checkPermission(['admin', 'editor', 'author']) && (
                            <Link to="/admin" className="text-primary hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium font-bold">{t('nav.panel')}</Link>
                        )}

                        <div className="border-t border-gray-700 mt-4 pt-4">
                            {user ? (
                                <button onClick={handleSignOut} className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                                    {t('nav.logout')}
                                </button>
                            ) : (
                                <Link to="/login" className="text-primary hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                    {t('nav.login')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
