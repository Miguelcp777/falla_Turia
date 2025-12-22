import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Calendar, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Event = {
    id: string
    title: string
    event_date: string
    location: string
}

const NextEventBanner = () => {
    const { language, t } = useLanguage()
    const [nextEvent, setNextEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
                const now = new Date().toISOString()
                const { data, error } = await supabase
                    .from('agenda')
                    .select('*')
                    .gte('event_date', now)
                    .order('event_date', { ascending: true })
                    .limit(1)
                    .single()

                if (!error && data) {
                    setNextEvent(data)
                }
            } catch (error) {
                console.error('Error fetching next event:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNextEvent()
    }, [])

    if (loading) return <div className="animate-pulse h-24 w-64 bg-white/5 rounded-2xl mx-auto mt-8 mb-12" />
    if (!nextEvent) return null

    const date = new Date(nextEvent.event_date)
    const dateStr = date.toLocaleDateString(language === 'es' ? 'es-ES' : 'ca-ES', { day: 'numeric', month: 'long' })
    const timeStr = date.toLocaleTimeString(language === 'es' ? 'es-ES' : 'ca-ES', { hour: '2-digit', minute: '2-digit' })

    return (
        <div className="flex justify-center mt-8 mb-16 px-4">
            <div className="relative group overflow-hidden bg-background-dark/80 backdrop-blur-md border border-white/10 pr-8 pl-4 py-6 rounded-2xl transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                {/* Red/Pink Accent Bar Left */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-primary to-pink-500" />

                <div className="flex items-center gap-6 pl-4">
                    {/* Icon container */}
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-primary/10 transition-colors">
                        <Calendar size={32} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <div className="text-left">
                        <span className="block text-xs font-bold tracking-widest text-primary uppercase mb-1">
                            {t('home.next_event')}
                        </span>
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                            {nextEvent.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                            <Clock size={16} className="text-primary/70" />
                            <span className="text-gray-300 capitalize">{dateStr}</span>
                            <span className="text-gray-600">•</span>
                            <span>{timeStr}h</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NextEventBanner
