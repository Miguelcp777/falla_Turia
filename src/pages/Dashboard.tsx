import React, { useState, useEffect } from 'react'
import { supabase, Profile, UserRole } from '@/lib/supabase'
import { Flame, Calendar, Newspaper, Plus, Upload, Clover, Save, Users, Shield, CheckCircle, XCircle, Trash2, Edit2, X, Crown, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type Tab = 'news' | 'agenda' | 'lottery' | 'users' | 'representatives' | 'gallery'

export default function Dashboard() {
    const { role } = useAuth()
    const [activeTab, setActiveTab] = useState<Tab>('news')
    const [loading, setLoading] = useState(false)

    // News Form 
    const [newsList, setNewsList] = useState<any[]>([])
    const [editingNewsId, setEditingNewsId] = useState<string | null>(null)
    const [newsTitle, setNewsTitle] = useState('')
    const [newsContent, setNewsContent] = useState('')
    const [newsImageFile, setNewsImageFile] = useState<File | null>(null)
    const [newsImageUrl, setNewsImageUrl] = useState('') // For preview or manual URL

    // Agenda Form
    const [agendaList, setAgendaList] = useState<any[]>([])
    const [editingAgendaId, setEditingAgendaId] = useState<string | null>(null)
    const [agendaTitle, setAgendaTitle] = useState('')
    const [agendaDesc, setAgendaDesc] = useState('')
    const [agendaDate, setAgendaDate] = useState('')
    const [agendaLoc, setAgendaLoc] = useState('')

    // Lottery Form
    const [lotteryId, setLotteryId] = useState<string | null>(null)
    const [lotteryNumber, setLotteryNumber] = useState('')
    const [lotteryPrice, setLotteryPrice] = useState('23')
    const [lotteryDonation, setLotteryDonation] = useState('3')
    const [drawName, setDrawName] = useState('')
    const [drawDate, setDrawDate] = useState('')
    const [deadlineDate, setDeadlineDate] = useState('')

    // Users Management
    const [allUsers, setAllUsers] = useState<Profile[]>([])

    // Representatives Form
    const [repsList, setRepsList] = useState<any[]>([])

    // Gallery Management
    const [galleryList, setGalleryList] = useState<any[]>([])
    const [galleryUploadTitle, setGalleryUploadTitle] = useState('')
    const [galleryUploadFiles, setGalleryUploadFiles] = useState<File[]>([])

    useEffect(() => {
        if (activeTab === 'lottery') {
            fetchLotteryConfig()
        } else if (activeTab === 'users' && (role === 'admin' || role === 'editor')) {
            fetchUsers()
        } else if (activeTab === 'news') {
            fetchNews()
        } else if (activeTab === 'agenda') {
            fetchAgenda()
        } else if (activeTab === 'representatives') {
            fetchRepresentatives()
        } else if (activeTab === 'gallery') {
            fetchGallery()
        }
    }, [activeTab, role])

    const fetchNews = async () => {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setNewsList(data)
    }

    const fetchAgenda = async () => {
        const { data, error } = await supabase
            .from('agenda')
            .select('*')
            .order('event_date', { ascending: true })
        if (data) setAgendaList(data)
    }

    const fetchRepresentatives = async () => {
        const { data } = await supabase
            .from('representatives')
            .select('*')
            // fixed order for display
            .order('role', { ascending: true })

        if (data) {
            // Sort manually to custom order if needed, otherwise rely on query
            // Custom sort: FM, FMI, Presi, PresiInf
            const order = ['fallera_mayor', 'fallera_mayor_infantil', 'presidente', 'presidente_infantil']
            const sorted = data.sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role))
            setRepsList(sorted)
        }
    }

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching users:', error)
            return
        }
        if (data) setAllUsers(data)
    }

    const fetchGallery = async () => {
        const { data } = await supabase
            .from('gallery_images')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setGalleryList(data)
    }

    const fetchLotteryConfig = async () => {
        const { data, error } = await supabase
            .from('lottery_config')
            .select('*')
            .single()

        if (error) {
            console.warn('Error fetching lottery config:', error)
            return
        }

        if (data) {
            setLotteryId(data.id)
            setLotteryNumber(data.ticket_number)
            setLotteryPrice(data.price.toString())
            setLotteryDonation(data.donation.toString())
            setDrawName(data.draw_name || '')
            setDrawDate(data.draw_date ? new Date(data.draw_date).toISOString().slice(0, 16) : '')
            setDeadlineDate(data.deadline_date ? new Date(data.deadline_date).toISOString().slice(0, 16) : '')
        }
    }

    const handleImageUpload = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file)

        if (uploadError) {
            throw uploadError
        }

        const { data } = supabase.storage.from('images').getPublicUrl(filePath)
        return data.publicUrl
    }

    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let finalImageUrl = newsImageUrl

            if (newsImageFile) {
                finalImageUrl = await handleImageUpload(newsImageFile)
            }

            if (editingNewsId) {
                const { error } = await supabase.from('news').update({
                    title: newsTitle,
                    content: newsContent,
                    image_url: finalImageUrl,
                }).eq('id', editingNewsId)
                if (error) throw error
                alert('Noticia actualizada!')
            } else {
                const { error } = await supabase.from('news').insert({
                    title: newsTitle,
                    content: newsContent,
                    image_url: finalImageUrl,
                })
                if (error) throw error
                alert('Noticia creada!')
            }

            setNewsTitle('')
            setNewsContent('')
            setNewsImageFile(null)
            setNewsImageUrl('')
            setEditingNewsId(null)
            fetchNews()
        } catch (error: any) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteNews = async (id: string) => {
        if (!confirm('¿Seguro que quieres borrar esta noticia?')) return
        try {
            const { error } = await supabase.from('news').delete().eq('id', id)
            if (error) throw error
            fetchNews()
        } catch (error: any) {
            alert('Error: ' + error.message)
        }
    }

    const startEditNews = (news: any) => {
        setEditingNewsId(news.id)
        setNewsTitle(news.title)
        setNewsContent(news.content)
        setNewsImageUrl(news.image_url)
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCreateAgenda = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (editingAgendaId) {
                const { error } = await supabase.from('agenda').update({
                    title: agendaTitle,
                    description: agendaDesc,
                    event_date: new Date(agendaDate).toISOString(),
                    location: agendaLoc
                }).eq('id', editingAgendaId)
                if (error) throw error
                alert('Evento actualizado!')
            } else {
                const { error } = await supabase.from('agenda').insert({
                    title: agendaTitle,
                    description: agendaDesc,
                    event_date: new Date(agendaDate).toISOString(),
                    location: agendaLoc
                })
                if (error) throw error
                alert('Evento creado!')
            }

            setAgendaTitle('')
            setAgendaDesc('')
            setAgendaDate('')
            setAgendaLoc('')
            setEditingAgendaId(null)
            fetchAgenda()
        } catch (error: any) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAgenda = async (id: string) => {
        if (!confirm('¿Seguro que quieres borrar este evento?')) return
        try {
            const { error } = await supabase.from('agenda').delete().eq('id', id)
            if (error) throw error
            fetchAgenda()
        } catch (error: any) {
            alert('Error: ' + error.message)
        }
    }

    const startEditAgenda = (agenda: any) => {
        setEditingAgendaId(agenda.id)
        setAgendaTitle(agenda.title)
        setAgendaDesc(agenda.description)
        setAgendaDate(agenda.event_date.slice(0, 16))
        setAgendaLoc(agenda.location)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleUpdateLottery = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const updates = {
                ticket_number: lotteryNumber,
                price: parseFloat(lotteryPrice),
                donation: parseFloat(lotteryDonation),
                draw_name: drawName,
                draw_date: drawDate ? new Date(drawDate).toISOString() : null,
                deadline_date: deadlineDate ? new Date(deadlineDate).toISOString() : null
            }

            let error

            if (lotteryId) {
                const { error: updateError } = await supabase
                    .from('lottery_config')
                    .update(updates)
                    .eq('id', lotteryId)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('lottery_config')
                    .insert(updates)
                error = insertError
            }

            if (error) throw error
            alert('Configuración de Lotería actualizada!')
            await fetchLotteryConfig() // Refresh
        } catch (error: any) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateRole = async (userId: string, newRole: UserRole) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)

            if (error) throw error

            // Optimistic update
            setAllUsers(allUsers.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ))
        } catch (error: any) {
            alert('Error actualizando rol: ' + error.message)
        }
    }

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ active: !currentStatus })
                .eq('id', userId)

            if (error) throw error

            // Optimistic update
            setAllUsers(allUsers.map(user =>
                user.id === userId ? { ...user, active: !currentStatus } : user
            ))
        } catch (error: any) {
            alert('Error actualizando estado: ' + error.message)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción borrará su perfil y su cuenta de acceso permanentemente.')) return
        try {
            // Call the RPC function to delete from auth.users (cascade deletes profile)
            const { error } = await supabase.rpc('delete_user_fully', { target_user_id: userId })

            if (error) throw error

            setAllUsers(allUsers.filter(user => user.id !== userId))
            alert('Usuario y cuenta eliminados correctamente')
        } catch (error: any) {
            console.error('Delete error:', error)
            alert('Error eliminando usuario: ' + error.message)
        }
    }

    const handleUpdateRepresentative = async (e: React.FormEvent, repId: string, name: string, description: string, imageFile: File | null, currentImageUrl: string) => {
        e.preventDefault()
        setLoading(true)
        try {
            let finalImageUrl = currentImageUrl

            if (imageFile) {
                finalImageUrl = await handleImageUpload(imageFile)
            }

            const { error } = await supabase
                .from('representatives')
                .update({
                    name,
                    description,
                    image_url: finalImageUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', repId)

            if (error) throw error

            alert('Representante actualizado correctamente')
            fetchRepresentatives()
        } catch (error: any) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGalleryUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (galleryUploadFiles.length === 0) return

        setLoading(true)
        let successCount = 0
        let errorCount = 0

        // Use a loop to process all files
        // We could do Promise.all but serial is safer for rate limits/errors feedback
        for (const file of galleryUploadFiles) {
            try {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `gallery/${fileName}`

                // Upload to 'images' bucket
                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath)

                // Insert metadata
                // If user provided a title, we reuse it for all (maybe append index? or just same title). 
                // Let's use same title for simplicity or empty if multiple files.
                const { error: dbError } = await supabase.from('gallery_images').insert({
                    title: galleryUploadTitle ? (galleryUploadFiles.length > 1 ? `${galleryUploadTitle} (${successCount + 1})` : galleryUploadTitle) : null,
                    image_url: urlData.publicUrl
                })

                if (dbError) throw dbError
                successCount++
            } catch (error: any) {
                console.error('Error uploading file:', file.name, error)
                errorCount++
            }
        }

        setLoading(false)
        alert(`Subida completada: ${successCount} fotos subidas.${errorCount > 0 ? ` ${errorCount} fallos.` : ''}`)
        setGalleryUploadTitle('')
        setGalleryUploadFiles([])
        fetchGallery()
    }

    const handleDeleteGalleryImage = async (id: string, imageUrl: string) => {
        if (!confirm('¿Eliminar esta foto de la galería?')) return
        try {
            // Delete from Storage first
            // URL format might vary so we trust the path derived from logical structure if possible
            // But 'images' bucket public URL structure is: .../storage/v1/object/public/images/gallery/filename.jpg
            // We need to extract relative path "gallery/filename.jpg"
            const urlObj = new URL(imageUrl)
            const pathParts = urlObj.pathname.split('/images/') // split by bucket name
            if (pathParts[1]) {
                await supabase.storage.from('images').remove([pathParts[1]]) // This captures everything after /images/ e.g. "gallery/filename.jpg"
            }

            const { error } = await supabase.from('gallery_images').delete().eq('id', id)
            if (error) throw error
            fetchGallery()
        } catch (error: any) {
            alert('Error eliminando foto: ' + error.message)
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
                        <p className="text-gray-400">Administra las noticias, eventos y configuración de la falla.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
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
                    <button
                        onClick={() => setActiveTab('lottery')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'lottery'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-surface-dark text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Clover size={20} />
                        Lotería
                    </button>
                    {(role === 'admin' || role === 'editor') && (
                        <button
                            onClick={() => setActiveTab('gallery')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'gallery'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-surface-dark text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <ImageIcon size={20} />
                            Galería
                        </button>
                    )}
                    {(role === 'admin' || role === 'editor') && (
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'users'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-surface-dark text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Users size={20} />
                            Usuarios
                        </button>
                    )}
                    {(role === 'admin' || role === 'editor') && (
                        <button
                            onClick={() => setActiveTab('representatives')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'representatives'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-surface-dark text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Crown size={20} />
                            Representantes
                        </button>
                    )}
                </div>

                <div className="bg-surface-dark border border-white/5 rounded-3xl p-8 shadow-xl">
                    {activeTab === 'news' && (
                        <>
                            <form onSubmit={handleCreateNews} className="space-y-6 max-w-2xl">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    {editingNewsId ? 'Editar Noticia' : 'Nueva Noticia'}
                                </h2>

                                {editingNewsId && (
                                    <div className="mb-4 p-3 bg-blue-500/20 text-blue-300 rounded-lg flex items-center justify-between">
                                        <span>Editando noticia existente</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingNewsId(null)
                                                setNewsTitle('')
                                                setNewsContent('')
                                                setNewsImageUrl('')
                                            }}
                                            className="text-sm hover:underline"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}

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
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Imagen Destacada</label>
                                    <div className="space-y-4">
                                        <div className={`border-2 border-dashed border-white/10 rounded-xl p-8 text-center transition-colors ${newsImageFile ? 'bg-primary/5 border-primary/30' : 'hover:bg-white/5'}`}>
                                            <input
                                                type="file"
                                                id="news-image-upload"
                                                accept="image/*"
                                                onChange={e => {
                                                    if (e.target.files?.[0]) {
                                                        setNewsImageFile(e.target.files[0])
                                                        // Reset URL if file is chosen
                                                        setNewsImageUrl('')
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <label htmlFor="news-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                                <Upload className={`w-8 h-8 ${newsImageFile ? 'text-primary' : 'text-gray-400'}`} />
                                                <span className="text-sm font-medium text-gray-300">
                                                    {newsImageFile ? newsImageFile.name : 'Haz clic para subir una imagen'}
                                                </span>
                                            </label>
                                        </div>
                                        <div className="text-center text-xs text-gray-500">O ingresa una URL manualmente</div>
                                        <input
                                            type="url"
                                            value={newsImageUrl}
                                            onChange={e => {
                                                setNewsImageUrl(e.target.value)
                                                setNewsImageFile(null)
                                            }}
                                            className="w-full bg-background-dark border border-white/10 rounded-xl py-2 px-4 text-white text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                                >
                                    {editingNewsId ? <Save size={20} /> : <Plus size={20} />}
                                    {loading ? 'Guardando...' : editingNewsId ? 'Actualizar Noticia' : 'Publicar Noticia'}
                                </button>
                            </form>

                            {/* News List */}
                            <div className="mt-12 pt-12 border-t border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6">Noticias Publicadas</h3>
                                <div className="space-y-4">
                                    {newsList.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-background-dark rounded-xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                                                ) : (
                                                    <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
                                                        <Newspaper size={24} className="text-gray-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-white">{item.title}</h4>
                                                    <p className="text-sm text-gray-400 truncate max-w-xs">{item.content}</p>
                                                </div>
                                            </div>
                                            {(role === 'admin' || role === 'editor') && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => startEditNews(item)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteNews(item.id)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'agenda' && (
                        <>
                            <form onSubmit={handleCreateAgenda} className="space-y-6 max-w-2xl">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    {editingAgendaId ? 'Editar Evento' : 'Nuevo Evento'}
                                </h2>

                                {editingAgendaId && (
                                    <div className="mb-4 p-3 bg-blue-500/20 text-blue-300 rounded-lg flex items-center justify-between">
                                        <span>Editando evento existente</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingAgendaId(null)
                                                setAgendaTitle('')
                                                setAgendaDesc('')
                                                setAgendaDate('')
                                                setAgendaLoc('')
                                            }}
                                            className="text-sm hover:underline"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}

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
                                    {editingAgendaId ? <Save size={20} /> : <Plus size={20} />}
                                    {loading ? 'Guardando...' : editingAgendaId ? 'Actualizar Evento' : 'Crear Evento'}
                                </button>
                            </form>

                            {/* Agenda List */}
                            <div className="mt-12 pt-12 border-t border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6">Agenda de Eventos</h3>
                                <div className="space-y-4">
                                    {agendaList.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-background-dark rounded-xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-white/5 rounded-lg flex flex-col items-center justify-center border border-white/10">
                                                    <span className="text-xs text-gray-400 uppercase">{new Date(item.event_date).toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="text-2xl font-bold text-white">{new Date(item.event_date).getDate()}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{item.title}</h4>
                                                    <p className="text-sm text-gray-400">{item.location}</p>
                                                </div>
                                            </div>
                                            {(role === 'admin' || role === 'editor') && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => startEditAgenda(item)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAgenda(item.id)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'lottery' && (
                        <form onSubmit={handleUpdateLottery} className="space-y-6 max-w-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Configuración de Lotería</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Nombre del Sorteo</label>
                                <input
                                    type="text"
                                    value={drawName}
                                    onChange={e => setDrawName(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Ej: Sorteo de Navidad"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Número de la Falla</label>
                                <input
                                    type="text"
                                    required
                                    value={lotteryNumber}
                                    onChange={e => setLotteryNumber(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xl tracking-widest"
                                    placeholder="00000"
                                    maxLength={5}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Precio Total (€)</label>
                                    <input
                                        type="number"
                                        required
                                        value={lotteryPrice}
                                        onChange={e => setLotteryPrice(e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Donativo Incluido (€)</label>
                                    <input
                                        type="number"
                                        required
                                        value={lotteryDonation}
                                        onChange={e => setLotteryDonation(e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Fecha del Sorteo</label>
                                    <input
                                        type="datetime-local"
                                        value={drawDate}
                                        onChange={e => setDrawDate(e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Fecha Límite Pago/Devolución</label>
                                    <input
                                        type="datetime-local"
                                        value={deadlineDate}
                                        onChange={e => setDeadlineDate(e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                            >
                                <Save size={20} />
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'users' && (role === 'admin' || role === 'editor') && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Gestión de Usuarios</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400 text-sm uppercase">
                                            <th className="py-4 px-4">Usuario</th>
                                            <th className="py-4 px-4">Rol</th>
                                            <th className="py-4 px-4">Estado</th>
                                            <th className="py-4 px-4">Registrado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {allUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="text-white font-medium">{user.email}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{user.id.slice(0, 8)}...</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Shield size={16} className="text-primary" />
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                                                            className="bg-background-dark border border-white/10 rounded-lg py-1 px-3 text-sm text-white focus:ring-1 focus:ring-primary focus:outline-none"
                                                        >
                                                            <option value="admin">Admin</option>
                                                            <option value="editor">Editor</option>
                                                            <option value="author">Autor</option>
                                                            <option value="subscriber">Suscriptor</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleToggleActive(user.id, user.active !== false)}
                                                            title={user.active !== false ? "Desactivar usuario" : "Activar usuario"}
                                                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${user.active !== false
                                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                                }`}
                                                        >
                                                            {user.active !== false ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            title="Eliminar usuario"
                                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-gray-400 text-sm">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'representatives' && (role === 'admin' || role === 'editor') && (
                        <div className="space-y-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Nuestros Representantes 2026</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {repsList.map((rep) => (
                                    <RepresentativeCard
                                        key={rep.id}
                                        rep={rep}
                                        onUpdate={handleUpdateRepresentative}
                                        loading={loading}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (role === 'admin' || role === 'editor') && (
                        <div className="space-y-12">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-bold text-white mb-6">Subir Fotos</h2>
                                <form onSubmit={handleGalleryUpload} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Imágenes (Selecciona una o varias)</label>
                                        <div className={`border-2 border-dashed border-white/10 rounded-xl p-8 text-center transition-colors ${galleryUploadFiles.length > 0 ? 'bg-primary/5 border-primary/30' : 'hover:bg-white/5'}`}>
                                            <input
                                                type="file"
                                                id="gallery-upload"
                                                accept="image/*"
                                                multiple
                                                required
                                                onChange={e => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        setGalleryUploadFiles(Array.from(e.target.files))
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                                <Upload className={`w-8 h-8 ${galleryUploadFiles.length > 0 ? 'text-primary' : 'text-gray-400'}`} />
                                                <span className="text-sm font-medium text-gray-300">
                                                    {galleryUploadFiles.length > 0
                                                        ? `${galleryUploadFiles.length} archivos seleccionados`
                                                        : 'Haz clic para seleccionar fotos'}
                                                </span>
                                                {galleryUploadFiles.length > 0 && (
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {galleryUploadFiles.map(f => f.name).join(', ').slice(0, 50)}...
                                                    </span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Título (Opcional - Se aplicará a todas)</label>
                                        <input
                                            type="text"
                                            value={galleryUploadTitle}
                                            onChange={e => setGalleryUploadTitle(e.target.value)}
                                            className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder="Descripción..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || galleryUploadFiles.length === 0}
                                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                                    >
                                        <Upload size={20} />
                                        {loading ? `Subiendo ${galleryUploadFiles.length} fotos...` : 'Subir Fotos'}
                                    </button>
                                </form>
                            </div>

                            <div className="pt-12 border-t border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6">Fotos en Galería ({galleryList.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {galleryList.map(img => (
                                        <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50">
                                            <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                                {img.title && <p className="text-white text-sm font-medium text-center mb-2">{img.title}</p>}
                                                <button
                                                    onClick={() => handleDeleteGalleryImage(img.id, img.image_url)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Eliminar foto"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

function RepresentativeCard({ rep, onUpdate, loading }: { rep: any, onUpdate: any, loading: boolean }) {
    const [name, setName] = useState(rep.name || '')
    const [desc, setDesc] = useState(rep.description || '')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState(rep.image_url || '')

    // Reset local state when rep changes (though key usually handles this)
    useEffect(() => {
        setName(rep.name || '')
        setDesc(rep.description || '')
        setPreviewUrl(rep.image_url || '')
    }, [rep])

    const getRoleName = (role: string) => {
        switch (role) {
            case 'fallera_mayor': return 'Fallera Mayor'
            case 'fallera_mayor_infantil': return 'Fallera Mayor Infantil'
            case 'presidente': return 'Presidente'
            case 'presidente_infantil': return 'Presidente Infantil'
            default: return role
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        onUpdate(e, rep.id, name, desc, imageFile, previewUrl)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-background-dark/50 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Crown size={20} />
                {getRoleName(rep.role)}
            </h3>

            <div className="space-y-4">
                {/* Image Upload Area */}
                <div className="flex gap-4">
                    <div className={`relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 group`}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <Users size={24} />
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                            <Upload size={20} className="text-white" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setImageFile(e.target.files[0])
                                        setPreviewUrl(URL.createObjectURL(e.target.files[0]))
                                    }
                                }}
                            />
                        </label>
                    </div>

                    <div className="flex-1 space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-background-dark border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-primary focus:outline-none"
                                placeholder="Nombre..."
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Descripción / Saluda</label>
                    <textarea
                        rows={3}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full bg-background-dark border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-primary focus:outline-none"
                        placeholder="Escribe unas palabras..."
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold px-4 py-2 rounded-lg transition-all text-sm disabled:opacity-50"
                    >
                        <Save size={16} />
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    )
}
