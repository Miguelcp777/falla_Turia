import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Flame, Calendar, Newspaper, Plus } from 'lucide-react'

type Tab = 'news' | 'agenda'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<Tab>('news')
    const [loading, setLoading] = useState(false)

    // News Form 
    const [newsTitle, setNewsTitle] = useState('')
    const [newsContent, setNewsContent] = useState('')
    const [newsImage, setNewsImage] = useState('')

    // Agenda Form
    const [agendaTitle, setAgendaTitle] = useState('')
    const [agendaDesc, setAgendaDesc] = useState('')
    const [agendaDate, setAgendaDate] = useState('')
    const [agendaLoc, setAgendaLoc] = useState('')

    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('news').insert({
            title: newsTitle,
            content: newsContent,
            image_url: newsImage,
        })
        setLoading(false)
        if (error) alert('Error: ' + error.message)
        else {
            alert('Noticia creada!')
            setNewsTitle('')
            setNewsContent('')
            setNewsImage('')
        }
    }

    const handleCreateAgenda = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('agenda').insert({
            title: agendaTitle,
            description: agendaDesc,
            event_date: new Date(agendaDate).toISOString(),
            location: agendaLoc
        })
        setLoading(false)
        if (error) alert('Error: ' + error.message)
        else {
            alert('Evento creado!')
            setAgendaTitle('')
            setAgendaDesc('')
            setAgendaDate('')
            setAgendaLoc('')
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Flame className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white">Panel de Gestión</h1>
                        <p className="text-gray-400">Administra las noticias y eventos de la falla.</p>
                    </div>
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'news'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-surface-dark text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Newspaper size={20} />
                        Noticias
                    </button>
                    <button
                        onClick={() => setActiveTab('agenda')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'agenda'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-surface-dark text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Calendar size={20} />
                        Agenda
                    </button>
                </div>

                <div className="bg-surface-dark border border-white/5 rounded-3xl p-8 shadow-xl">
                    {activeTab === 'news' ? (
                        <form onSubmit={handleCreateNews} className="space-y-6 max-w-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Nueva Noticia</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={newsTitle}
                                    onChange={e => setNewsTitle(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Ej: Crónica de la Presentación 2025"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Contenido</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={newsContent}
                                    onChange={e => setNewsContent(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Escribe el cuerpo de la noticia..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">URL Imagen (Opcional)</label>
                                <input
                                    type="url"
                                    value={newsImage}
                                    onChange={e => setNewsImage(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="https://..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                            >
                                <Plus size={20} />
                                {loading ? 'Publicando...' : 'Publicar Noticia'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateAgenda} className="space-y-6 max-w-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Nuevo Evento</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={agendaTitle}
                                    onChange={e => setAgendaTitle(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Ej: Cena de Sobaquillo"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={agendaDate}
                                        onChange={e => setAgendaDate(e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Ubicación</label>
                                    <input
                                        type="text"
                                        value={agendaLoc}
                                        onChange={e => setAgendaLoc(e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Ej: Casal Fallero"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Descripción (Opcional)</label>
                                <textarea
                                    rows={4}
                                    value={agendaDesc}
                                    onChange={e => setAgendaDesc(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Detalles del evento..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                            >
                                <Plus size={20} />
                                {loading ? 'Guardando...' : 'Crear Evento'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
