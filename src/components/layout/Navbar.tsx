import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'
import { Menu, X, LogOut, Shield, User, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const { user, profile, checkPermission, signOut } = useAuth()
    const { language, setLanguage, t } = useLanguage()
    const { items, setIsOpen: setIsCartOpen } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    const isActive = (path: string) => location.pathname === path
    const navLinkClass = (path: string) => `px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isActive(path)
        ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105'
        : 'text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]'
        }`

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
                                <span className="font-display font-black text-xl leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-primary to-primary-dark drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] filter transition-all whitespace-nowrap uppercase">
                                    Falla Turia
                                </span>
                                <span className="font-display font-bold text-xs leading-none tracking-[0.15em] text-gray-300 group-hover:text-white transition-colors whitespace-nowrap uppercase mt-1">
                                    Plaça de l' Ajuntament
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-2">
                            <Link to="/" className={navLinkClass('/')}>
                                {t('nav.home')}
                            </Link>
                            <Link to="/institution" className={navLinkClass('/institution')}>
                                {t('nav.institution')}
                            </Link>
                            <Link to="/news" className={navLinkClass('/news')}>
                                {t('nav.news')}
                            </Link>
                            <Link to="/agenda" className={navLinkClass('/agenda')}>
                                {t('nav.agenda')}
                            </Link>
                            <Link to="/lottery" className={navLinkClass('/lottery')}>
                                {t('nav.lottery')}
                            </Link>
                            <Link to="/representatives" className={navLinkClass('/representatives')}>
                                {t('nav.representatives')}
                            </Link>
                            <Link to="/gallery" className={navLinkClass('/gallery')}>
                                {t('nav.gallery')}
                            </Link>
                            <Link to="/clothing" className={navLinkClass('/clothing')}>
                                {t('nav.clothing')}
                            </Link>

                            {checkPermission(['subscriber', 'author', 'editor', 'admin']) && (
                                <Link to="/suggestions" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    {t('nav.suggestions')}
                                </Link>
                            )}

                            {checkPermission(['admin', 'editor', 'author']) && (
                                <Link to="/admin" className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center gap-2">
                                    <Shield size={16} />
                                    {t('nav.panel')}
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {/* Cart */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-gray-300 hover:text-primary transition-colors"
                        >
                            <ShoppingBag size={20} />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-background-dark">
                                    {items.length}
                                </span>
                            )}
                        </button>

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
                                <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                                    <User size={16} className="text-primary" />
                                    <span className="text-sm font-medium text-white">
                                        {profile?.first_name && profile?.last_name
                                            ? `${profile.first_name} ${profile.last_name}`
                                            : user.email
                                        }
                                    </span>
                                </div>
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
                                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
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
                            className="text-gray-300 hover:text-primary relative"
                        >
                            <ShoppingBag size={24} />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-background-dark">
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
                <div className="md:hidden bg-background-dark border-t border-surface-dark">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.home')}</Link>
                        <Link to="/institution" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.institution')}</Link>
                        <Link to="/news" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.news')}</Link>
                        <Link to="/agenda" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.agenda')}</Link>
                        <Link to="/lottery" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.lottery')}</Link>
                        <Link to="/representatives" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.representatives')}</Link>
                        <Link to="/gallery" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.gallery')}</Link>
                        <Link to="/clothing" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.clothing')}</Link>
                        {checkPermission(['subscriber', 'author', 'editor', 'admin']) && (
                            <Link to="/suggestions" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{t('nav.suggestions_full')}</Link>
                        )}
                        {checkPermission(['admin', 'editor', 'author']) && (
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="text-primary hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium font-bold">{t('nav.panel')}</Link>
                        )}

                        <div className="border-t border-gray-700 mt-4 pt-4">
                            {user ? (
                                <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                                    {t('nav.logout')}
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="text-primary hover:text-white block px-3 py-2 rounded-md text-base font-medium">
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
