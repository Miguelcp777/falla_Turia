import React, { useState, useEffect } from 'react'
import { Clover, Ticket, DollarSign, AlertCircle, Calendar, Clock } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'

export default function Lottery() {
    const { t } = useLanguage()
    const [tickets, setTickets] = useState(1)
    const [customNumber, setCustomNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Dynamic Config
    const [fallaNumber, setFallaNumber] = useState('04231')
    const [price, setPrice] = useState(23)
    const [donation, setDonation] = useState(3)
    const [drawName, setDrawName] = useState('Sorteo de Navidad')
    const [drawDate, setDrawDate] = useState<string | null>(null)
    const [deadlineDate, setDeadlineDate] = useState<string | null>(null)

    useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase.from('lottery_config').select('*').single()
            if (data) {
                setFallaNumber(data.ticket_number)
                setPrice(data.price)
                setDonation(data.donation)
                setDrawName(data.draw_name || 'Sorteo de Navidad')
                setDrawDate(data.draw_date)
                setDeadlineDate(data.deadline_date)
            }
        }
        fetchConfig()
    }, [])

    const handleReserve = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Mock submission
        setTimeout(() => {
            alert(`${t('lottery.alert_success')} \n${t('lottery.alert_tickets')}: ${tickets}`)
            setLoading(false)
            setCustomNumber('')
            setTickets(1)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 5000)
        }, 1500)
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background-light dark:bg-background-dark">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="p-2 bg-primary/10 rounded-full">
                            <Clover className="w-6 h-6 text-primary" />
                        </span>
                        <span className="text-primary font-bold tracking-widest text-sm uppercase">{drawName}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        {t('lottery.title')}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('lottery.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                    {/* Info Card */}
                    <div className="bg-surface-dark border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-700"></div>

                        <div className="relative z-10 text-center">
                            <h3 className="text-gray-400 font-bold uppercase text-sm tracking-wider mb-2">{t('lottery.number_label')}</h3>
                            <div className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 font-mono bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                                {fallaNumber}
                            </div>

                            <div className="flex items-center justify-center gap-4 text-white/80 bg-white/5 py-4 rounded-2xl border border-white/5 mb-6">
                                <DollarSign className="text-primary" />
                                <div className="text-left">
                                    <p className="text-xs text-gray-400 uppercase font-bold">{t('lottery.price_label')}</p>
                                    <p className="text-xl font-bold">{price}€ <span className="text-sm font-normal text-gray-500">({donation}€ donativo)</span></p>
                                </div>
                            </div>

                            {(drawDate || deadlineDate) && (
                                <div className="grid grid-cols-1 gap-4 text-left border-t border-white/10 pt-6">
                                    {drawDate && (
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <Calendar className="text-primary w-5 h-5" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold">Fecha del Sorteo</p>
                                                <p className="font-bold">{new Date(drawDate).toLocaleDateString()} - {new Date(drawDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    )}
                                    {deadlineDate && (
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <Clock className="text-red-400 w-5 h-5" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold text-red-400">Fecha Límite Pago</p>
                                                <p className="font-bold text-red-300">{new Date(deadlineDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
                                <Ticket size={16} />
                                <span>{t('lottery.availability')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Ticket className="text-primary" />
                            {t('lottery.form_title')}
                        </h3>

                        {success && (
                            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-2">
                                <AlertCircle size={20} />
                                <span className="font-bold">{t('lottery.alert_success')}</span>
                            </div>
                        )}

                        <form onSubmit={handleReserve} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('lottery.form_number')}
                                </label>
                                <input
                                    type="text"
                                    value={customNumber}
                                    onChange={(e) => setCustomNumber(e.target.value)}
                                    placeholder={t('lottery.form_number_placeholder')}
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                                />
                                <p className="text-xs text-gray-500 mt-2">{t('lottery.form_number_help')}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('lottery.form_quantity')}
                                </label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setTickets(Math.max(1, tickets - 1))}
                                        className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
                                    >
                                        -
                                    </button>
                                    <span className="flex-1 text-center text-2xl font-black text-slate-900 dark:text-white">{tickets}</span>
                                    <button
                                        type="button"
                                        onClick={() => setTickets(tickets + 1)}
                                        className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-500 font-bold">{t('lottery.form_total')}</span>
                                    <span className="text-3xl font-black text-primary">{tickets * price}€</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? t('lottery.form_processing') : t('lottery.form_submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
