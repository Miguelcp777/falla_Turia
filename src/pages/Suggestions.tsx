import React, { useState } from 'react'
import { MessageSquare, Send, CheckCircle, Lightbulb } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function Suggestions() {
    const { t } = useLanguage()
    const [suggestion, setSuggestion] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!suggestion.trim()) return

        setLoading(true)
        // Mock submission
        setTimeout(() => {
            setSuccess(true)
            setSuggestion('')
            setLoading(false)
            setTimeout(() => setSuccess(false), 3000)
        }, 1500)
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background-light dark:bg-background-dark">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="p-2 bg-primary/10 rounded-full">
                            <Lightbulb className="w-5 h-5 text-primary" />
                        </span>
                        <span className="text-primary font-bold tracking-widest text-sm uppercase">{t('suggestions.category')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        {t('suggestions.title')}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('suggestions.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-surface-dark border border-white/5 rounded-3xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <MessageSquare size={18} className="text-primary" />
                                {t('suggestions.your_proposals')}
                            </h3>
                            <div className="space-y-4">
                                <p className="text-gray-400 text-sm italic">
                                    {t('suggestions.empty_proposals')}
                                </p>
                                {/* Example of sent item */}
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-primary">12 MAR</span>
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{t('suggestions.status_sent')}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm line-clamp-2">{t('suggestions.example_proposal')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-2">
                        {success ? (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center animate-fade-in-up">
                                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('suggestions.success_title')}</h3>
                                <p className="text-gray-400">{t('suggestions.success_msg')}</p>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                    {t('suggestions.new_proposal')}
                                </h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <textarea
                                            value={suggestion}
                                            onChange={(e) => setSuggestion(e.target.value)}
                                            placeholder={t('suggestions.placeholder')}
                                            rows={6}
                                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !suggestion.trim()}
                                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <span>{t('suggestions.sending')}</span>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                {t('suggestions.submit')}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
