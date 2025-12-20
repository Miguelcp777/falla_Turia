import { Link } from 'react-router-dom'
import { Calendar as CalendarIcon, Newspaper, ArrowRight, Flame, Clock } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import Countdown from '@/components/ui/Countdown'
import { EVENTS } from '@/data/events'

export default function Home() {
    const { t, language } = useLanguage()

    return (
        <div className="min-h-[calc(100vh-80px)] relative overflow-hidden">
            {/* Background Shield */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 blur-[60px] animate-pulse-slow">
                    <img src="/escudo.jpg" alt="Escudo Fondo" className="w-full h-full object-contain rounded-full" />
                </div>
            </div>



            {/* Hero Section */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-8 animate-fire-flicker">
                    <img src="/escudo.jpg" alt="Escudo" className="w-5 h-5 object-contain rounded-full" />
                    <span className="text-sm font-bold text-red-200 tracking-wide uppercase">Falles 2026</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white tracking-tighter mb-8 leading-tight">
                    {t('home.title')}
                </h1>

                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                    {t('home.subtitle')}
                </p>

                <Countdown />

                {/* Next Event Teaser */}
                <div className="max-w-md mx-auto mb-12 transform hover:scale-105 transition-transform duration-300">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-red-600"></div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/20 rounded-xl">
                                <CalendarIcon className="w-8 h-8 text-red-300" />
                            </div>
                            <div className="text-left">
                                <span className="text-xs font-bold text-red-300 uppercase tracking-wider mb-1 block">
                                    {t('home.next_event')}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {(() => {
                                        // Logic to find next event
                                        const now = new Date()
                                        // We use require here to avoid top-level import issues if circular, but standard import is better. 
                                        // Ideally passed as prop or imported at top.
                                        // Let's assume standard import at top.
                                        const nextEvent = EVENTS.find(e => new Date(e.event_date) > now)
                                        if (!nextEvent) return t('home.no_events')
                                        // @ts-ignore
                                        return language === 'es' ? (nextEvent.title_es || nextEvent.title) : (nextEvent.title_va || nextEvent.title)
                                    })()}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {(() => {
                                            const now = new Date()
                                            const nextEvent = EVENTS.find(e => new Date(e.event_date) > now)
                                            if (!nextEvent) return '-'
                                            const date = new Date(nextEvent.event_date)
                                            return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'ca-ES', { day: 'numeric', month: 'long' })
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-red-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all transform hover:scale-105"
                    >
                        <Flame className="w-5 h-5" />
                        <span>{t('home.cta')}</span>
                    </Link>
                    <Link
                        to="/agenda"
                        className="flex items-center justify-center gap-2 bg-white/5 text-white backdrop-blur-md border border-white/10 font-bold text-lg px-8 py-4 rounded-full hover:bg-white/10 transition-all hover:border-primary/50"
                    >
                        <span>{t('home.events_cta')}</span>
                    </Link>
                </div>
            </div>

            {/* Quick Links Section */}
            <div className="relative z-10 bg-surface-dark border-t border-white/5 py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Link to="/news" className="group bg-background-dark border border-white/5 p-8 rounded-3xl hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                    <Newspaper className="w-8 h-8 text-primary" />
                                </div>
                                <ArrowRight className="text-gray-500 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-white mb-2">{t('home.news_title')}</h3>
                            <p className="text-gray-400 text-sm">{t('home.news_read_more')}</p>
                        </Link>

                        <Link to="/agenda" className="group bg-background-dark border border-white/5 p-8 rounded-3xl hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                    <CalendarIcon className="w-8 h-8 text-primary" />
                                </div>
                                <ArrowRight className="text-gray-500 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-white mb-2">{t('home.events_title')}</h3>
                            <p className="text-gray-400 text-sm">{t('home.events_cta')}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
