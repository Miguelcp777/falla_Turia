import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Trash2, Plus, User } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type DirectivaMember = {
    id: string
    name: string
    position: string
    level: number
    sort_order: number
    photo_url: string | null
}

export default function DirectivaManager() {
    const { t } = useLanguage()
    const [members, setMembers] = useState<DirectivaMember[]>([])
    const [loading, setLoading] = useState(true)

    const fetchDirectiva = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('directiva')
                .select('*')
                .order('level', { ascending: true })
                .order('sort_order', { ascending: true })

            if (error) throw error
            setMembers(data || [])
        } catch (error: any) {
            console.error('Error fetching directiva:', error)
            if (error.code === 'PGRST116' || error.message?.includes('relation "public.directiva" does not exist')) {
                alert('La tabla de la directiva no existe en la base de datos. Por favor, ejecuta el archivo setup_directiva.sql en tu panel de Supabase.')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDirectiva()
    }, [])

    const handleUpdate = async (id: string, updates: Partial<DirectivaMember>) => {
        try {
            const { error } = await supabase
                .from('directiva')
                .update(updates)
                .eq('id', id)

            if (error) throw error
            setMembers(members.map(m => m.id === id ? { ...m, ...updates } : m))
        } catch (error) {
            console.error('Error updating member:', error)
            alert('Error al actualizar')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que quieres eliminar este cargo?')) return
        try {
            const { error } = await supabase
                .from('directiva')
                .delete()
                .eq('id', id)

            if (error) throw error
            setMembers(members.filter(m => m.id !== id))
        } catch (error) {
            console.error('Error deleting member:', error)
        }
    }

    const handleAdd = async () => {
        const newMember = {
            name: '',
            position: 'Nuevo Cargo',
            level: 4,
            sort_order: members.length
        }
        try {
            const { data, error } = await supabase
                .from('directiva')
                .insert([newMember])
                .select()

            if (error) throw error
            if (data) setMembers([...members, data[0]])
        } catch (error: any) {
            console.error('Error adding member:', error)
            alert('Error al añadir cargo: ' + (error.message || 'Desconocido'))
        }
    }

    if (loading) return <div className="flex justify-center py-10"><div className="animate-spin h-8 w-8 border-b-2 border-primary"></div></div>

    return (
        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-3xl p-8 transition-colors duration-500">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <Users className="text-primary" size={28} />
                    {t('directiva.title')}
                </h2>
                <button 
                    onClick={handleAdd}
                    className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-dark transition-all"
                >
                    <Plus size={18} />
                    Añadir Cargo
                </button>
            </div>

            <div className="space-y-4">
                {members.map((member) => (
                    <div key={member.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 group transition-all">
                        <div className="md:col-span-1 flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                <User size={24} />
                            </div>
                        </div>
                        
                        <div className="md:col-span-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 mb-1 block">{t('directiva.form_name')}</label>
                            <input 
                                type="text"
                                value={member.name}
                                onChange={(e) => handleUpdate(member.id, { name: e.target.value })}
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Nombre completo"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 mb-1 block">{t('directiva.form_position')}</label>
                            <input 
                                type="text"
                                value={member.position}
                                onChange={(e) => handleUpdate(member.id, { position: e.target.value })}
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 mb-1 block">Nivel</label>
                            <select 
                                value={member.level}
                                onChange={(e) => handleUpdate(member.id, { level: Number(e.target.value) })}
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                            >
                                <option value={1}>1 - Presidencia</option>
                                <option value={2}>2 - Vicepresidencias</option>
                                <option value={3}>3 - Secretaría/Tesoreria</option>
                                <option value={4}>4 - Vocalías</option>
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 mb-1 block">Orden</label>
                            <input 
                                type="number"
                                value={member.sort_order}
                                onChange={(e) => handleUpdate(member.id, { sort_order: Number(e.target.value) })}
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button 
                                onClick={() => handleDelete(member.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {members.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-3xl mt-8">
                    <p className="text-slate-500 dark:text-gray-400 font-bold">No hay miembros configurados.</p>
                </div>
            )}
        </div>
    )
}
