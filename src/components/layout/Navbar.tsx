import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'
import { Menu, X, LogOut, Shield, User, ShoppingBag, Sun, Moon } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const { user, profile, checkPermission, hasPermission, signOut } = useAuth()
    const { language, setLanguage, t } = useLanguage()
    const { theme, toggleTheme } = useTheme()

    const canAccessAdmin = hasPermission('can_manage_news') || 
                           hasPermission('can_manage_agenda') || 
                           hasPermission('can_manage_lottery') || 
                           hasPermission('can_manage_gallery') || 
                           hasPermission('can_manage_clothing') || 
                           hasPermission('can_manage_roles') || 
                           hasPermission('can_manage_actas')

    const { items, setIsOpen: setIsCartOpen } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    const isActive = (path: string) => location.pathname === path
    const navLinkClass = (path: string) => `px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-300 whitespace-nowrap ${isActive(path)
        ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105'
        : 'text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-primary/5 dark:hover:bg-white/10'
        }`

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const FlagES = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-5 h-3.5 rounded shadow-sm">
            <rect width="750" height="500" fill="#c60b1e" />
            <rect width="750" height="250" y="125" fill="#ffc400" />
        </svg>
    )

    const FlagVA = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-5 h-3.5 rounded shadow-sm">
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
        <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-surface-dark transition-colors duration-500">
            <div className="w-full px-3 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - compact */}
                    <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="relative w-10 h-10 min-w-[2.5rem] rounded-full overflow-hidden flex-shrink-0 border-2 border-white/10 shadow-lg bg-white/5">
                            <img src="/escudo.jpg" alt="Falla Turia" className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden lg:flex flex-col justify-center items-start">
                            <span className="font-display font-black text-base leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary-dark via-primary to-orange-500 dark:from-orange-400 dark:via-primary dark:to-primary-dark whitespace-nowrap uppercase">
                                 Falla Turia
                             </span>
                             <span className="font-display font-bold text-[10px] leading-none tracking-[0.1em] text-slate-500 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white transition-colors whitespace-nowrap uppercase mt-0.5">
                                 Plaça de l' Ajuntament
                             </span>
                        </div>
                    </Link>

                    {/* Navigation Links - centered */}
                    <div className="hidden md:flex items-center gap-2 mx-2 flex-shrink min-w-0">
                        <Link to="/" className={navLinkClass('/')}>
                            {t('nav.home')}
                        </Link>
                        <Link to="/institution" className={navLinkClass('/institution')}>
                            {t('nav.institution')}
                        </Link>
                        <Link to="/news" className={navLinkClass('/news')}>
                            {t('nav.news')}
                        </Link>
                        <Link to="/representatives" className={navLinkClass('/representatives')}>
                            {t('nav.representatives')}
                        </Link>

                        {checkPermission(['subscriber', 'author', 'editor', 'admin', 'directivo/a']) && (
                            <>
                                <Link to="/agenda" className={navLinkClass('/agenda')}>
                                    {t('nav.agenda')}
                                </Link>
                                <Link to="/lottery" className={navLinkClass('/lottery')}>
                                    {t('nav.lottery')}
                                </Link>
                                <Link to="/gallery" className={navLinkClass('/gallery')}>
                                    {t('nav.gallery')}
                                </Link>
                                <Link to="/clothing" className={navLinkClass('/clothing')}>
                                    {t('nav.clothing')}
                                </Link>
                                <Link to="/suggestions" className={navLinkClass('/suggestions')}>
                                    {t('nav.suggestions')}
                                </Link>
                                <Link to="/directiva" className={navLinkClass('/directiva')}>
                                    {t('nav.directiva')}
                                </Link>
                            </>
                        )}

                        {canAccessAdmin && (
                            <Link to="/admin" className="bg-primary/10 text-primary hover:bg-primary/20 p-2 rounded-lg text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center" title={t('nav.panel')}>
                                <Shield size={16} />
                            </Link>
                        )}
                    </div>

                    {/* Right Controls - compact */}
                    <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                        {/* Cart */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-1.5 text-slate-500 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                            <ShoppingBag size={18} />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-background-dark">
                                    {items.length}
                                </span>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-500 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-all"
                            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} className="text-primary" />}
                        </button>

                        {/* Language Flags - icon only */}
                        <button
                            onClick={() => setLanguage('es')}
                            className={`p-1.5 rounded-lg transition-all ${language === 'es' ? 'bg-primary/15 ring-2 ring-primary/40' : 'opacity-50 hover:opacity-100'}`}
                            title="Español"
                        >
                            <FlagES />
                        </button>
                        <button
                            onClick={() => setLanguage('va')}
                            className={`p-1.5 rounded-lg transition-all ${language === 'va' ? 'bg-primary/15 ring-2 ring-primary/40' : 'opacity-50 hover:opacity-100'}`}
                            title="Valencià"
                        >
                            <FlagVA />
                        </button>

                        {/* Divider */}
                        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                        {user ? (
                            <div className="flex items-center gap-1.5">
                                <div className="hidden xl:flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full px-2.5 py-1.5 transition-colors duration-500">
                                    <User size={14} className="text-primary flex-shrink-0" />
                                    <span className="text-xs font-medium text-slate-800 dark:text-white transition-colors duration-500 max-w-[100px] truncate">
                                        {profile?.first_name || user.email?.split('@')[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="p-1.5 rounded-lg text-slate-500 dark:text-gray-300 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                    title={t('nav.logout')}
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
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

                        {/* Mobile Cart */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="text-slate-500 dark:text-gray-300 hover:text-primary dark:hover:text-white relative transition-colors duration-500"
                        >
                            <ShoppingBag size={24} />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-background-dark transition-colors duration-500">
                                    {items.length}
                                </span>
                            )}
                        </button>

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
                <div className="md:hidden bg-white dark:bg-background-dark border-t border-gray-100 dark:border-surface-dark transition-colors duration-500">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.home')}</Link>
                        <Link to="/institution" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.institution')}</Link>
                        <Link to="/news" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.news')}</Link>
                        <Link to="/representatives" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.representatives')}</Link>
                        
                        {checkPermission(['subscriber', 'author', 'editor', 'admin', 'directivo/a']) && (
                            <>
                                <Link to="/agenda" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.agenda')}</Link>
                                <Link to="/lottery" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.lottery')}</Link>
                                <Link to="/gallery" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.gallery')}</Link>
                                <Link to="/clothing" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.clothing')}</Link>
                                <Link to="/suggestions" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.suggestions_full')}</Link>
                                <Link to="/directiva" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">{t('nav.directiva')}</Link>
                            </>
                        )}
                        
                        {canAccessAdmin && (
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="text-primary hover:text-red-600 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium font-bold transition-colors">{t('nav.panel')}</Link>
                        )}
                        
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4">
                            {user ? (
                                <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors">
                                    {t('nav.logout')}
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="text-primary hover:text-red-600 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium transition-colors">
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
