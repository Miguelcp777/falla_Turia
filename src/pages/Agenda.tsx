import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

import { EVENTS, Event } from '@/data/events'

export default function Agenda() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const { t, language } = useLanguage()

    useEffect(() => {
        // Mock loading for effect
        setTimeout(() => {
            setEvents(EVENTS)
            setLoading(false)
        }, 500)
    }, [])

    /* 
    const fetchAgenda = async () => { ... } 
    */

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="p-2 bg-primary/10 rounded-full">
                            <CalendarIcon className="w-5 h-5 text-primary" />
                        </span>
                        <span className="text-primary font-bold tracking-widest text-sm uppercase">{t('agenda.calendar_year')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        {t('agenda.title')}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('agenda.subtitle')}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {events.length > 0 ? (
                            events.map((event) => {
                                const date = new Date(event.event_date)
                                return (
                                    <div key={event.id} className="group flex gap-6 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 p-6 rounded-3xl hover:border-primary/30 transition-all hover:shadow-lg">
                                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="text-2xl font-black">{date.getDate()}</span>
                                            <span className="text-xs font-bold uppercase">{date.toLocaleDateString(language === 'es' ? 'es-ES' : 'ca-ES', { month: 'short' })}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                                {/* @ts-ignore */}
                                                {language === 'es' ? (event.title_es || event.title) : (event.title_va || event.title)}
                                            </h3>
                                            <p className="text-slate-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                                            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-primary" />
                                                    <span>{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-primary" />
                                                    <span>{t('agenda.location')}: {event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-20 bg-surface-dark/50 rounded-3xl border border-white/5">
                                <p className="text-gray-400 text-xl">{t('agenda.empty')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
