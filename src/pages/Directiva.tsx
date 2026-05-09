import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Shield, User } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type DirectivaMember = {
    id: string
    name: string
    position: string
    level: number
    sort_order: number
    photo_url: string | null
}

export default function Directiva() {
    const { } = useLanguage()
    const [members, setMembers] = useState<DirectivaMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDirectiva = async () => {
            try {
                const { data, error } = await supabase
                    .from('directiva')
                    .select('*')
                    .order('level', { ascending: true })
                    .order('sort_order', { ascending: true })

                if (error) throw error
                setMembers(data || [])
            } catch (error) {
                console.error('Error fetching directiva:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDirectiva()
    }, [])

    const renderLevel = (level: number, title?: string) => {
        const levelMembers = members.filter(m => m.level === level)
        if (levelMembers.length === 0) return null

        return (
            <div className="mb-12 w-full">
                {title && (
                    <h3 className="text-center text-slate-500 dark:text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
                        {title}
                    </h3>
                )}
                <div className={`flex flex-wrap justify-center gap-6 md:gap-10`}>
                    {levelMembers.map((member) => (
                        <div key={member.id} className="group flex flex-col items-center animate-fade-in">
                            <div className="relative mb-4">
                                {/* Photo / Placeholder */}
                                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 ${level === 1 ? 'border-primary shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-slate-200 dark:border-white/10'} bg-white dark:bg-slate-800 transition-all duration-500 group-hover:scale-110`}>
                                    {member.photo_url ? (
                                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <User size={level === 1 ? 64 : 48} />
                                        </div>
                                    )}
                                </div>
                                {level === 1 && (
                                    <div className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
                                        <Shield size={16} />
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-slate-900 dark:text-white font-black text-sm md:text-base mb-1 transition-colors duration-500">
                                    {member.name || 'Puesto Vacante'}
                                </p>
                                <p className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-wider">
                                    {member.position}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Connecting Line (subtle) */}
                {level < 4 && members.some(m => m.level === level + 1) && (
                    <div className="flex justify-center mt-8">
                        <div className="w-px h-8 bg-gradient-to-b from-slate-200 dark:from-white/10 to-transparent"></div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="relative pt-32 pb-20 px-4 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                        <Users size={20} />
                        <span className="text-sm font-black uppercase tracking-widest">Nuestra Directiva</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 transition-colors duration-500">
                        Órganos de <span className="text-primary italic">Gobierno</span>
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed transition-colors duration-500">
                        Las personas que dedican su esfuerzo y pasión para que la Falla Turia siga siendo un referente de nuestra fiesta.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        {renderLevel(1, "Presidencia")}
                        {renderLevel(2, "Vicepresidencias")}
                        {renderLevel(3, "Secretaría y Tesorería")}
                        {renderLevel(4, "Vocalías y Otros Cargos")}
                    </div>
                )}
            </div>
        </div>
    )
}
