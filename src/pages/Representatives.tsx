import { useState, useEffect } from 'react'
import { Crown, Loader, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import FireBackground from '@/components/layout/FireBackground'
import { useLanguage } from '@/context/LanguageContext'

export default function Representatives() {
    const { t } = useLanguage()
    const [reps, setReps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReps()
    }, [])

    const fetchReps = async () => {
        try {
            const { data } = await supabase
                .from('representatives')
                .select('*')

            if (data) {
                const order = ['fallera_mayor', 'fallera_mayor_infantil', 'presidente', 'presidente_infantil']
                const sorted = data.sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role))
                setReps(sorted)
            }
        } catch (error) {
            console.error('Error fetching representatives:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen">
            <FireBackground />

            {/* Content */}
            <div className="relative z-10 pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-full mb-6 border border-secondary/20 backdrop-blur-sm">
                            <Crown className="w-8 h-8 text-secondary" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                            {t('representatives.title')}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                            {t('representatives.subtitle')}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader className="w-12 h-12 text-secondary animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                            {reps.map((rep, index) => (
                                <div
                                    key={rep.id}
                                    className={`group relative ${index % 2 !== 0 ? 'md:mt-16' : ''}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative bg-surface-dark border border-white/10 rounded-[2.5rem] p-8 md:p-10 overflow-hidden hover:border-secondary/30 transition-all duration-500 h-full">
                                        {/* Decorative elements */}
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Crown size={120} />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-8 shadow-2xl border border-white/5 bg-black/50">
                                                {rep.image_url ? (
                                                    <img
                                                        src={rep.image_url}
                                                        alt={rep.name}
                                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
                                                        <Crown size={64} className="opacity-20" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-center md:text-left">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold uppercase tracking-wider mb-4">
                                                    <Sparkles size={14} />
                                                    {t(`representatives.roles.${rep.role}`)}
                                                </div>

                                                <h3 className="text-3xl font-display font-bold text-white mb-4">
                                                    {rep.name || t('representatives.empty_name')}
                                                </h3>

                                                <p className="text-gray-400 leading-relaxed">
                                                    {rep.description || t('representatives.empty_desc')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
