import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'

type Event = {
    id: string
    title: string
    description: string
    event_date: string
    location: string
    created_at?: string
}

export default function Agenda() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const { t, language } = useLanguage()

    useEffect(() => {
        fetchAgenda()
    }, [])

    const fetchAgenda = async () => {
        try {
            const { data, error } = await supabase
                .from('agenda')
                .select('*')
                .order('event_date', { ascending: true })

            if (error) throw error
            if (data) setEvents(data)
        } catch (error) {
            console.error('Error fetching agenda:', error)
        } finally {
            setLoading(false)
        }
    }

    const now = new Date()
    const upcomingEvents = events.filter(e => new Date(e.event_date) >= now)
    const pastEvents = events.filter(e => new Date(e.event_date) < now)

    // Sort upcoming events by date asc (nearest first)
    const sortedUpcoming = upcomingEvents.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())

    // The very next event
    const nextEvent = sortedUpcoming[0]
    // The rest of upcoming events
    const otherUpcomingEvents = sortedUpcoming.slice(1)

    // Combine remaining upcoming + past events (if we want to show past?) 
    // Usually agenda shows upcoming. User said "rest". Let's show other upcoming first.
    // If we want to show history, that might be a separate section?
    // Let's stick to upcoming for the "Agenda" feel, or maybe list all others below.
    // User said "appear prominently the next event ... and then the rest".
    // I will show "Other Upcoming" and maybe "Past" at the bottom or just list all others.
    // Let's list ALL others (remaining upcoming) for now to keep it clean.

    const displayList = otherUpcomingEvents

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
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Next Event Hero */}
                        {nextEvent ? (
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark shadow-2xl text-white transform hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
                                    <CalendarIcon size={300} />
                                </div>
                                <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
                                        <span className="text-3xl md:text-4xl font-black">{new Date(nextEvent.event_date).getDate()}</span>
                                        <span className="text-sm md:text-base font-bold uppercase">{new Date(nextEvent.event_date).toLocaleDateString(language === 'es' ? 'es-ES' : 'ca-ES', { month: 'short' })}</span>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 animate-pulse">
                                            PRÓXIMO EVENTO
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{nextEvent.title}</h2>
                                        <p className="text-white/90 text-lg mb-6 line-clamp-3">{nextEvent.description}</p>

                                        <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm md:text-base font-medium">
                                            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg">
                                                <Clock size={20} />
                                                <span>{new Date(nextEvent.event_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg">
                                                <MapPin size={20} />
                                                <span>{nextEvent.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-surface-dark/50 rounded-3xl border border-white/5">
                                <p className="text-gray-400 text-xl">{t('agenda.empty')}</p>
                            </div>
                        )}

                        {/* Other Events List */}
                        {displayList.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pl-2 border-l-4 border-primary">
                                    Próximamente
                                </h3>
                                <div className="grid gap-6">
                                    {displayList.map((event) => {
                                        const date = new Date(event.event_date)
                                        return (
                                            <div key={event.id} className="group flex flex-col md:flex-row gap-6 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 p-6 rounded-3xl hover:border-primary/30 transition-all hover:shadow-lg">
                                                <div className="flex-shrink-0 flex flex-row md:flex-col items-center justify-center w-full md:w-20 h-16 md:h-20 bg-primary/10 rounded-2xl border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors gap-2 md:gap-0">
                                                    <span className="text-2xl font-black">{date.getDate()}</span>
                                                    <span className="text-xs font-bold uppercase">{date.toLocaleDateString(language === 'es' ? 'es-ES' : 'ca-ES', { month: 'short' })}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                                        {event.title}
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
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Past Events */}
                        {pastEvents.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-500 mb-6 pl-2 border-l-4 border-gray-300 dark:border-gray-700">
                                    Eventos Realizados
                                </h3>
                                <div className="grid gap-4 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
                                    {pastEvents
                                        .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
                                        .map((event) => {
                                            const date = new Date(event.event_date)
                                            return (
                                                <div key={event.id} className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 border border-transparent p-4 rounded-xl">
                                                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-lg">
                                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{date.getDate()}</span>
                                                        <span className="text-[10px] font-bold uppercase text-gray-500">{date.toLocaleDateString(language === 'es' ? 'es-ES' : 'ca-ES', { month: 'short' })}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-base font-bold text-gray-600 dark:text-gray-300 truncate">
                                                                {event.title}
                                                            </h3>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                                Realizado
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <span>{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h</span>
                                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                            <span className="truncate">{event.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
