import { useState, useEffect, Fragment, FormEvent } from 'react'
import { supabase, Profile, UserRole } from '@/lib/supabase'
import { Flame, Calendar, Newspaper, Plus, Upload, Clover, Save, Users, Shield, CheckCircle, XCircle, Trash2, Edit2 as Edit, X, Crown, Image as ImageIcon, ShoppingBag, AlertCircle, MapPin, Loader2, RefreshCw } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

type Tab = 'news' | 'agenda' | 'lottery' | 'users' | 'representatives' | 'gallery' | 'clothing'

export default function Dashboard() {
    const { role } = useAuth()
    const { t } = useLanguage()
    const [activeTab, setActiveTab] = useState<Tab>('news')
    const [loading, setLoading] = useState(false)

    // News Form 
    const [newsList, setNewsList] = useState<any[]>([])
    const [editingNewsId, setEditingNewsId] = useState<string | null>(null)
    const [newsTitle, setNewsTitle] = useState('')
    const [newsContent, setNewsContent] = useState('')
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
    const [editingUserId, setEditingUserId] = useState<string | null>(null)
    const [editingUserData, setEditingUserData] = useState<Partial<Profile>>({})

    // Clothing & Orders
    const [clothingItems, setClothingItems] = useState<any[]>([])
    const [clothingOrders, setClothingOrders] = useState<any[]>([])
    const [clothingSubTab, setClothingSubTab] = useState<'products' | 'orders'>('products')

    // Clothing Form
    const [editingClothingId, setEditingClothingId] = useState<string | null>(null)
    const [clothingForm, setClothingForm] = useState({
        name: '',
        description: '',
        price: '',
        sizes: '', // comma separated
        image_url: '',
        display_order: 0,
        active: true
    })
    const [clothingImageFile, setClothingImageFile] = useState<File | null>(null)

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
        } else if (activeTab === 'clothing') {
            fetchClothingItems()
            fetchOrders()
        }
    }, [activeTab, role])

    const fetchNews = async () => {
        const { data } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setNewsList(data)
    }

    const fetchAgenda = async () => {
        const { data } = await supabase
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

    const fetchClothingItems = async () => {
        const { data } = await supabase
            .from('clothing_items')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false })
        if (data) setClothingItems(data)
    }

    const fetchOrders = async () => {
        const { data } = await supabase
            .from('clothing_orders')
            .select(`
                *,
                profiles (first_name, last_name, email, phone),
                clothing_order_items (
                    *,
                    clothing_items (name)
                )
            `)
            .order('created_at', { ascending: false })
        if (data) setClothingOrders(data)
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

    const [newsImageFiles, setNewsImageFiles] = useState<File[]>([])

    const handleCreateNews = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Upload multiple images
            const uploadedUrls: string[] = []

            if (newsImageFiles.length > 0) {
                for (const file of newsImageFiles) {
                    try {
                        const url = await handleImageUpload(file)
                        uploadedUrls.push(url)
                    } catch (err: any) {
                        console.error('Error uploading file:', file.name, err)
                    }
                }
            } else if (newsImageUrl) {
                // If manual URL provided (fallback or single)
                uploadedUrls.push(newsImageUrl)
            }

            // Keep first image as main thumbnail for compatibility
            let finalMainImageUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : newsImageUrl

            // In edit mode, we might want to preserve existing images if no new ones are added?
            // For simplicity: if new files are selected, they replace the old ones (or we could append).
            // Let's assume replacement or addition.
            // If editing, and we didn't select new files, keep old ones?
            // This is complex without a full gallery manager.
            // Simple approach: Input accepts new files. If provided, they BECOME the images.
            // If explicit URLs are needed, we rely on the main "newsImageUrl" input for a single one, 
            // or we could assume the user re-uploads.
            // Let's stick to: New files = New images. 
            // If editing and no new files, keep existing (need to fetch them).

            // To properly support "adding" to existing, we'd need to read `news.images` first.
            // But `editingNewsId` logic below is a bit simple. 
            // Let's rely on `newsImageFiles` for NEW uploads. 

            // Allow storing JSON array of URLs in 'images' column
            // We need to modify the payload.

            // const payload: any = {
            //     title: newsTitle,
            //     content: newsContent,
            //     image_url: finalMainImageUrl,
            //     images: uploadedUrls.length > 0 ? uploadedUrls : undefined 
            // }

            // Important: If we are editing, we probably want to KEEP existing images if we didn't upload new ones.
            // But we don't have them in state easily here without fetching/passing them.
            // Let's update `startEditNews` to load them.

            if (editingNewsId) {
                // If we uploaded new files, use them. If not, payload.images might be empty?
                // If `newsImageFiles` is empty, we don't want to overwrite `images` with empty list?
                // Or maybe we do if we cleared it?
                // Let's say: if uploadedUrls has items, we update images.

                const updatePayload: any = {
                    title: newsTitle,
                    content: newsContent,
                    image_url: finalMainImageUrl
                }

                if (uploadedUrls.length > 0) {
                    updatePayload.images = uploadedUrls
                }

                const { error } = await supabase.from('news').update(updatePayload).eq('id', editingNewsId)
                if (error) throw error
                alert('Noticia actualizada!')
            } else {
                // Insert
                const insertPayload = {
                    title: newsTitle,
                    content: newsContent,
                    image_url: finalMainImageUrl,
                    images: uploadedUrls
                }
                const { error } = await supabase.from('news').insert(insertPayload)
                if (error) throw error
                alert('Noticia creada!')
            }

            setNewsTitle('')
            setNewsContent('')
            // setNewsImageFile(null) removed
            setNewsImageFiles([])
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

    const handleCreateAgenda = async (e: FormEvent) => {
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

    const handleUpdateLottery = async (e: FormEvent) => {
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

    const handleEditUser = (user: Profile) => {
        setEditingUserId(user.id)
        setEditingUserData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            address: user.address || '',
            phone: user.phone || ''
        })
    }

    const handleCancelEdit = () => {
        setEditingUserId(null)
        setEditingUserData({})
    }

    const handleSaveUserProfile = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: editingUserData.first_name,
                    last_name: editingUserData.last_name,
                    address: editingUserData.address,
                    phone: editingUserData.phone
                })
                .eq('id', userId)

            if (error) throw error

            // Optimistic update
            setAllUsers(allUsers.map(user =>
                user.id === userId ? { ...user, ...editingUserData } : user
            ))
            setEditingUserId(null)
            setEditingUserData({})
            alert('Perfil actualizado correctamente')
        } catch (error: any) {
            alert('Error actualizando perfil: ' + error.message)
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
            alert(t('dashboard.representatives.update_success'))
            fetchRepresentatives()
        } catch (error: any) {
            console.error('Error updating representative:', error)
            alert(t('dashboard.common.error') + (error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const handleGalleryUpload = async (e: FormEvent) => {
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


    const handleCreateClothing = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            let finalImageUrl = clothingForm.image_url
            if (clothingImageFile) {
                finalImageUrl = await handleImageUpload(clothingImageFile)
            }

            const itemData = {
                name: clothingForm.name,
                description: clothingForm.description,
                price: parseFloat(clothingForm.price),
                sizes: clothingForm.sizes.split(',').map(s => s.trim().toUpperCase()).filter(s => s),
                image_url: finalImageUrl,
                display_order: clothingForm.display_order || 0,
                active: clothingForm.active
            }

            if (editingClothingId) {
                const { error } = await supabase.from('clothing_items').update(itemData).eq('id', editingClothingId)
                if (error) throw error
                alert('Prenda actualizada')
            } else {
                const { error } = await supabase.from('clothing_items').insert(itemData)
                if (error) throw error
                alert('Prenda creada')
            }

            setClothingForm({ name: '', description: '', price: '', sizes: '', image_url: '', display_order: 0, active: true })
            setClothingImageFile(null)
            setEditingClothingId(null)
            fetchClothingItems()
        } catch (error: any) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClothing = async (id: string) => {
        if (!confirm('¿Eliminar esta prenda?')) return
        const { error } = await supabase.from('clothing_items').delete().eq('id', id)
        if (error) alert('Error: ' + error.message)
        else fetchClothingItems()
    }

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase.from('clothing_orders').update({ status: newStatus }).eq('id', orderId)
        if (error) alert('Error: ' + error.message)
        else fetchOrders()
    }

    const handleRestoreEvents = async () => {
        if (!confirm(t('dashboard.agenda.restore_confirm'))) return
        setLoading(true)
        try {
            const { EVENTS } = await import('@/data/events')
            const eventsToInsert = EVENTS.map(e => ({
                title: (e.title_es || e.title || 'Evento'),
                description: e.description || '',
                event_date: e.event_date,
                location: e.location
            }))

            const { error } = await supabase.from('agenda').insert(eventsToInsert)
            if (error) throw error
            alert(t('dashboard.agenda.restore_success'))
            fetchAgenda()
        } catch (e: any) {
            console.error('Error restoring events:', e)
            alert(t('dashboard.agenda.restore_error') + e.message)
        } finally {
            setLoading(false)
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
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500 mb-2">
                            {t('dashboard.title')}
                        </h1>
                        <p className="text-gray-400">
                            {t('dashboard.subtitle')}
                        </p>    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${activeTab === 'news'
                            ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105'
                            : 'bg-surface-dark/50 backdrop-blur-sm border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                            }`}
                    >
                        <Newspaper size={20} />
                        {t('dashboard.tabs.news')}
                    </button>
                    <button
                        onClick={() => setActiveTab('agenda')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${activeTab === 'agenda'
                            ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105'
                            : 'bg-surface-dark/50 backdrop-blur-sm border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                            }`}
                    >
                        <Calendar size={20} />
                        {t('dashboard.tabs.agenda')}
                    </button>
                    <button
                        onClick={() => setActiveTab('lottery')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${activeTab === 'lottery'
                            ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105'
                            : 'bg-surface-dark/50 backdrop-blur-sm border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                            }`}
                    >
                        <Clover size={20} />
                        {t('dashboard.tabs.lottery')}
                    </button>
                    {(role === 'admin' || role === 'editor') && (
                        <button
                            onClick={() => setActiveTab('gallery')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${activeTab === 'gallery'
                                ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105'
                                : 'bg-surface-dark/50 backdrop-blur-sm border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                }`}
                        >
                            <ImageIcon size={20} />
                            {t('dashboard.tabs.gallery')}
                        </button>
                    )}
                    {(role === 'admin' || role === 'editor') && (
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${activeTab === 'users'
                                ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105'
                                : 'bg-surface-dark/50 backdrop-blur-sm border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                }`}
                        >
                            <Users size={20} />
                            {t('dashboard.tabs.users')}
                        </button>
                    )}
                    {(role === 'admin' || role === 'editor') && (
                        <button
                            onClick={() => setActiveTab('representatives')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${activeTab === 'representatives'
                                ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105'
                                : 'bg-surface-dark/50 backdrop-blur-sm border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                }`}
                        >
                            <Crown size={20} />
                            {t('dashboard.tabs.representatives')}
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('clothing')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${activeTab === 'clothing'
                            ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105'
                            : 'bg-surface-dark/50 backdrop-blur-sm border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                            }`}
                    >
                        <ShoppingBag size={20} />
                        {t('dashboard.tabs.clothing')}
                    </button>
                </div>

                <div className="bg-surface-dark border border-white/5 rounded-3xl p-8 shadow-xl">
                    {activeTab === 'news' && (
                        <>
                            <form onSubmit={handleCreateNews} className="space-y-6 max-w-2xl">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    {editingNewsId ? t('dashboard.news.title_edit') : t('dashboard.news.title_new')}
                                </h2>

                                {editingNewsId && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-lg mb-6 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <AlertCircle size={20} />
                                            {t('dashboard.news.editing_alert')}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingNewsId(null)
                                                setNewsTitle('')
                                                setNewsContent('')
                                                setNewsImageUrl('')
                                                setNewsImageFiles([])
                                            }}
                                            className="text-sm underline hover:text-yellow-400"
                                        >
                                            {t('dashboard.news.cancel')}
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">{t('dashboard.news.label_title')}</label>
                                        <input
                                            type="text"
                                            value={newsTitle}
                                            onChange={(e) => setNewsTitle(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                            placeholder={t('dashboard.news.placeholder_title')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">{t('dashboard.news.label_content')}</label>
                                        <textarea
                                            value={newsContent}
                                            onChange={(e) => setNewsContent(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors h-32"
                                            placeholder={t('dashboard.news.placeholder_content')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">{t('dashboard.news.label_image')}</label>
                                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center transition-colors hover:bg-white/5">
                                            <p className="text-gray-400 text-sm mb-2">{t('dashboard.news.upload_drag')}</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files) setNewsImageFiles(Array.from(e.target.files))
                                                }}
                                                className="hidden"
                                                id="news-image"
                                                multiple
                                            />
                                            <label
                                                htmlFor="news-image"
                                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors text-sm"
                                            >
                                                {loading ? t('dashboard.common.loading') : t('dashboard.common.file_selected')}
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500 mb-1">{t('dashboard.news.or_url')}</p>
                                            <input
                                                type="url"
                                                value={newsImageUrl}
                                                onChange={(e) => setNewsImageUrl(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                                                placeholder={t('dashboard.news.placeholder_url')}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCreateNews}
                                        disabled={loading || !newsTitle || !newsContent}
                                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {loading ? t('dashboard.common.loading') : (editingNewsId ? t('dashboard.news.submit_update') : t('dashboard.news.submit_create'))}
                                    </button>
                                </div>
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
                                                        <Edit size={18} />
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
                            <form onSubmit={handleCreateAgenda} className="space-y-6 max-w-2xl bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    {editingAgendaId ? t('dashboard.agenda.title_edit') : t('dashboard.agenda.title_new')}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.agenda.label_title')}</label>
                                        <input
                                            type="text"
                                            required
                                            value={agendaTitle}
                                            onChange={e => setAgendaTitle(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                            placeholder="Ex: Sopar de Germanor"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.agenda.label_desc')}</label>
                                        <textarea
                                            rows={3}
                                            value={agendaDesc}
                                            onChange={e => setAgendaDesc(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                            placeholder="Detalles de l'esdeveniment..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.agenda.label_date')}</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={agendaDate}
                                            onChange={e => setAgendaDate(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.agenda.label_location')}</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input
                                                type="text"
                                                value={agendaLoc}
                                                onChange={e => setAgendaLoc(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 pl-10 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                                placeholder="Casal Falla Turia"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    {editingAgendaId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingAgendaId(null)
                                                setAgendaTitle('')
                                                setAgendaDesc('')
                                                setAgendaDate('')
                                                setAgendaLoc('')
                                            }}
                                            className="px-6 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all font-medium"
                                        >
                                            {t('dashboard.news.cancel')}
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary-dark hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {editingAgendaId ? <Save size={20} /> : <Plus size={20} />}
                                        {loading ? t('dashboard.common.loading') : editingAgendaId ? t('dashboard.agenda.submit_update') : t('dashboard.agenda.submit_create')}
                                    </button>
                                </div>
                            </form>
                            {/* Agenda List */}
                            <div className="mt-12 pt-12 border-t border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white">Agenda de Eventos</h3>
                                    <button
                                        onClick={handleRestoreEvents}
                                        disabled={loading}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6 transition-colors"
                                    >
                                        <RefreshCw size={20} />
                                        {t('dashboard.agenda.restore_btn')}
                                    </button>
                                </div>
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
                                                        <Edit size={18} />
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
                        <form onSubmit={handleUpdateLottery} className="space-y-6 max-w-2xl bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Clover className="text-primary" />
                                {t('dashboard.lottery.title')}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.lottery.label_number')}</label>
                                    <input
                                        type="text"
                                        value={lotteryNumber}
                                        onChange={e => setLotteryNumber(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="Ex: 12345"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.lottery.label_price')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={lotteryPrice}
                                            onChange={e => setLotteryPrice(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 pl-8 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.lottery.label_donation')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={lotteryDonation}
                                            onChange={e => setLotteryDonation(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 pl-8 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.lottery.label_draw_name')}</label>
                                    <input
                                        type="text"
                                        value={drawName}
                                        onChange={e => setDrawName(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="Nadal 2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.lottery.label_draw_date')}</label>
                                    <input
                                        type="datetime-local"
                                        value={drawDate}
                                        onChange={e => setDrawDate(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.lottery.label_deadline')}</label>
                                    <input
                                        type="datetime-local"
                                        value={deadlineDate}
                                        onChange={e => setDeadlineDate(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary-dark hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    {loading ? t('dashboard.common.loading') : t('dashboard.lottery.submit_save')}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'users' && (role === 'admin' || role === 'editor') && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">{t('dashboard.users.title')}</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5">
                                        <tr className="border-b border-white/10 text-gray-400 text-sm uppercase">
                                            <th className="py-4 px-4">{t('dashboard.users.col_user')}</th>
                                            <th className="py-4 px-4">{t('dashboard.users.col_name')}</th>
                                            <th className="py-4 px-4">{t('dashboard.users.col_role')}</th>
                                            <th className="py-4 px-4">{t('dashboard.users.col_status')}</th>
                                            <th className="py-4 px-4">{t('dashboard.users.col_actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {allUsers.map((user) => (
                                            <Fragment key={user.id}>
                                                <tr className="hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="text-white font-medium">{user.email}</div>
                                                        <div className="text-xs text-gray-500 font-mono">{user.id.slice(0, 8)}...</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="text-white">
                                                            {user.first_name && user.last_name
                                                                ? `${user.first_name} ${user.last_name} `
                                                                : <span className="text-gray-500 italic">{t('dashboard.users.no_data')}</span>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <Shield size={16} className="text-primary" />
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                                                                className="bg-background-dark border border-white/10 rounded-lg py-1 px-3 text-sm text-white focus:ring-1 focus:ring-primary focus:outline-none"
                                                            >
                                                                <option value="admin">{t('dashboard.users.role_admin')}</option>
                                                                <option value="editor">{t('dashboard.users.role_editor')}</option>
                                                                <option value="author">{t('dashboard.users.role_author')}</option>
                                                                <option value="subscriber">{t('dashboard.users.role_subscriber')}</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleToggleActive(user.id, user.active !== false)}
                                                                title={user.active !== false ? t('dashboard.users.deactivate') : t('dashboard.users.activate')}
                                                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${user.active !== false
                                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                                    } `}
                                                            >
                                                                {user.active !== false ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleEditUser(user)}
                                                                title={t('dashboard.users.edit_profile')}
                                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                title={t('dashboard.users.delete_user')}
                                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expandable edit row */}
                                                {editingUserId === user.id && (
                                                    <tr className="bg-white/5">
                                                        <td colSpan={5} className="p-6">
                                                            <div className="bg-surface-dark border border-white/10 rounded-xl p-6">
                                                                <h3 className="text-lg font-bold text-white mb-4">{t('dashboard.users.edit_user_profile')}</h3>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.users.label_first_name')}</label>
                                                                        <input
                                                                            type="text"
                                                                            value={editingUserData.first_name || ''}
                                                                            onChange={(e) => setEditingUserData({ ...editingUserData, first_name: e.target.value })}
                                                                            className="w-full bg-background-dark border border-white/10 rounded-lg py-2 px-3 text-white focus:ring-1 focus:ring-primary focus:outline-none"
                                                                            placeholder={t('dashboard.users.placeholder_first_name')}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.users.label_last_name')}</label>
                                                                        <input
                                                                            type="text"
                                                                            value={editingUserData.last_name || ''}
                                                                            onChange={(e) => setEditingUserData({ ...editingUserData, last_name: e.target.value })}
                                                                            className="w-full bg-background-dark border border-white/10 rounded-lg py-2 px-3 text-white focus:ring-1 focus:ring-primary focus:outline-none"
                                                                            placeholder={t('dashboard.users.placeholder_last_name')}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.users.label_address')}</label>
                                                                        <input
                                                                            type="text"
                                                                            value={editingUserData.address || ''}
                                                                            onChange={(e) => setEditingUserData({ ...editingUserData, address: e.target.value })}
                                                                            className="w-full bg-background-dark border border-white/10 rounded-lg py-2 px-3 text-white focus:ring-1 focus:ring-primary focus:outline-none"
                                                                            placeholder={t('dashboard.users.placeholder_address')}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.users.label_phone')}</label>
                                                                        <input
                                                                            type="tel"
                                                                            value={editingUserData.phone || ''}
                                                                            onChange={(e) => setEditingUserData({ ...editingUserData, phone: e.target.value })}
                                                                            className="w-full bg-background-dark border border-white/10 rounded-lg py-2 px-3 text-white focus:ring-1 focus:ring-primary focus:outline-none"
                                                                            placeholder={t('dashboard.users.placeholder_phone')}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-3 mt-6">
                                                                    <button
                                                                        onClick={() => handleSaveUserProfile(user.id)}
                                                                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2 rounded-lg transition-all"
                                                                    >
                                                                        <Save size={16} />
                                                                        {t('dashboard.users.save_changes')}
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancelEdit}
                                                                        className="flex items-center gap-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 font-bold px-6 py-2 rounded-lg transition-all"
                                                                    >
                                                                        <X size={16} />
                                                                        {t('dashboard.users.cancel')}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'representatives' && (role === 'admin' || role === 'editor') && (
                        <div className="space-y-12">
                            {/* Gallery logic already translated in previous step but checking context */}
                            <h2 className="text-2xl font-bold text-white mb-6">{t('dashboard.representatives.title')}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {repsList.map((rep) => (
                                    <RepresentativeCard
                                        key={rep.id}
                                        rep={rep}
                                        onUpdate={handleUpdateRepresentative}
                                        loading={loading}
                                        t={t}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (role === 'admin' || role === 'editor') && (
                        <div className="space-y-12">
                            <div className="max-w-2xl">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Upload size={24} className="text-primary" />
                                    {t('dashboard.gallery.header_upload')}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">{t('dashboard.gallery.label_drag_drop')}</label>
                                        <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-white/5">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={e => setGalleryUploadFiles(e.target.files ? Array.from(e.target.files) : [])}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <ImageIcon size={40} className="mx-auto text-gray-500 mb-2" />
                                            <p className="text-gray-300 font-medium">
                                                {galleryUploadFiles.length > 0
                                                    ? `${galleryUploadFiles.length} ${t('common.file_selected')}`
                                                    : t('dashboard.news.upload_drag')}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">{t('dashboard.gallery.title_optional')}</label>
                                        <input
                                            type="text"
                                            value={galleryUploadTitle}
                                            onChange={e => setGalleryUploadTitle(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                            placeholder={t('dashboard.news.placeholder_title')}
                                        />
                                    </div>

                                    <button
                                        onClick={handleGalleryUpload}
                                        disabled={loading || galleryUploadFiles.length === 0}
                                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" />
                                                {t('dashboard.gallery.submit_uploading')} {galleryUploadFiles.length} fotos...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={20} />
                                                {t('dashboard.gallery.submit_upload')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-white/10">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <ImageIcon size={24} className="text-primary" />
                                    {t('dashboard.gallery.header_list')}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {galleryList.map(img => (
                                        <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50">
                                            <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                                {img.title && <p className="text-white text-sm font-medium text-center mb-2">{img.title}</p>}
                                                <button
                                                    onClick={() => handleDeleteGalleryImage(img.id, img.image_url)}
                                                    className="p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                                                    title={t('gallery.delete')}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    )}

                    {activeTab === 'clothing' && (
                        <div>
                            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                                <button
                                    onClick={() => setClothingSubTab('products')}
                                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${clothingSubTab === 'products' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {t('dashboard.clothing.tab_products')}
                                </button>
                                <button
                                    onClick={() => setClothingSubTab('orders')}
                                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${clothingSubTab === 'orders' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {t('dashboard.clothing.tab_orders')}
                                </button>
                            </div>

                            {clothingSubTab === 'products' ? (
                                <>
                                    <form onSubmit={handleCreateClothing} className="space-y-6 max-w-2xl mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                                        <h3 className="text-xl font-bold text-white mb-4">
                                            {editingClothingId ? t('dashboard.clothing.title_edit') : t('dashboard.clothing.title_new')}
                                        </h3>
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.clothing.label_name')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={clothingForm.name}
                                                onChange={e => setClothingForm({ ...clothingForm, name: e.target.value })}
                                                placeholder="Nombre de la prenda"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                            />
                                        </div>
                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.clothing.label_desc')}</label>
                                            <textarea
                                                value={clothingForm.description}
                                                onChange={e => setClothingForm({ ...clothingForm, description: e.target.value })}
                                                placeholder="Descripción"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-1">
                                                <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.clothing.label_price')}</label>
                                                <input
                                                    type="number"
                                                    required
                                                    step="0.01"
                                                    value={clothingForm.price}
                                                    onChange={e => setClothingForm({ ...clothingForm, price: e.target.value })}
                                                    placeholder="0.00"
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.clothing.label_order')}</label>
                                                <input
                                                    type="number"
                                                    value={clothingForm.display_order || 0}
                                                    onChange={e => setClothingForm({ ...clothingForm, display_order: parseInt(e.target.value) || 0 })}
                                                    placeholder="0"
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="col-span-1 flex items-end">
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-4 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={clothingForm.active}
                                                        onChange={e => setClothingForm({ ...clothingForm, active: e.target.checked })}
                                                        className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-black/50"
                                                    />
                                                    {t('dashboard.clothing.label_active')}
                                                </label>
                                            </div>
                                            <div className="col-span-3">
                                                <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.clothing.label_sizes')}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={clothingForm.sizes}
                                                    onChange={e => setClothingForm({ ...clothingForm, sizes: e.target.value })}
                                                    placeholder="S, M, L..."
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                                />
                                            </div>
                                        </div>
                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.clothing.label_image')}</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setClothingImageFile(e.target.files?.[0] || null)}
                                                className="block w-full text-sm text-gray-400
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-white/10 file:text-white
                                                    hover:file:bg-white/20
                                                    cursor-pointer"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary-dark hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {editingClothingId ? <Save size={20} /> : <Plus size={20} />}
                                            {loading ? t('dashboard.common.loading') : editingClothingId ? t('dashboard.clothing.submit_update') : t('dashboard.clothing.submit_create')}
                                        </button>
                                        {editingClothingId && (
                                            <div className="mt-4 mb-4 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <AlertCircle size={18} />
                                                    {t('dashboard.clothing.alert_editing')}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingClothingId(null)
                                                        setClothingForm({ name: '', description: '', price: '', sizes: '', image_url: '', display_order: 0, active: true })
                                                        setClothingImageFile(null)
                                                    }}
                                                    className="text-sm underline hover:text-blue-200"
                                                >
                                                    {t('dashboard.news.cancel')}
                                                </button>
                                            </div>
                                        )}
                                    </form>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {clothingItems.map(item => (
                                            <div key={item.id} className={`bg-background-dark border ${item.active ? 'border-white/10' : 'border-red-500/30'} rounded-xl p-4 flex gap-4 opacity-${item.active ? '100' : '75'}`}>
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-white/5" />
                                                ) : (
                                                    <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center">
                                                        <ShoppingBag className="text-gray-600" size={24} />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-white font-bold">{item.name}</h4>
                                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Ord: {item.display_order}</span>
                                                    </div>
                                                    <p className="text-primary font-bold">{item.price}€</p>
                                                    <p className="text-xs text-gray-400">{item.sizes?.join(', ')}</p>
                                                    {!item.active && <p className="text-xs text-red-400 font-bold mt-1">{t('dashboard.clothing.status_hidden')}</p>}
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingClothingId(item.id)
                                                                setClothingForm({
                                                                    name: item.name,
                                                                    description: item.description || '',
                                                                    price: item.price,
                                                                    sizes: item.sizes?.join(', ') || '',
                                                                    image_url: item.image_url,
                                                                    display_order: item.display_order || 0,
                                                                    active: item.active !== false // default to true if undefined
                                                                })
                                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                                            }}
                                                            className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClothing(item.id)}
                                                            className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    {clothingOrders.map(order => (
                                        <div key={order.id} className="bg-background-dark border border-white/10 rounded-xl p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-white mb-1">
                                                        {t('dashboard.clothing.order_id')} #{order.id.slice(0, 8)}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm">
                                                        {new Date(order.created_at).toLocaleString()}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
                                                        <Users size={14} />
                                                        {order.profiles?.first_name} {order.profiles?.last_name} ({order.profiles?.email})
                                                        {order.profiles?.phone && ` - 📞 ${order.profiles.phone} `}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-primary">{order.total_amount}€</p>
                                                    <select
                                                        value={order.status}
                                                        onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        className={`mt-2 text-sm font-bold bg-transparent border rounded px-2 py-1 ${order.status === 'delivered' ? 'text-green-400 border-green-400' :
                                                            order.status === 'paid' ? 'text-blue-400 border-blue-400' :
                                                                'text-orange-400 border-orange-400'
                                                            }`}
                                                    >
                                                        <option value="pending" className="bg-background-dark text-gray-300">{t('dashboard.clothing.status_pending')}</option>
                                                        <option value="paid" className="bg-background-dark text-gray-300">{t('dashboard.clothing.status_paid')}</option>
                                                        <option value="delivered" className="bg-background-dark text-gray-300">{t('dashboard.clothing.status_delivered')}</option>
                                                        <option value="cancelled" className="bg-background-dark text-gray-300">{t('dashboard.clothing.status_cancelled')}</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="bg-black/20 rounded-lg p-4">
                                                {order.clothing_order_items?.map((item: any) => (
                                                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="bg-white/10 w-8 h-8 rounded flex items-center justify-center text-xs text-center font-bold">
                                                                {item.quantity}x
                                                            </div>
                                                            <div>
                                                                <p className="text-white text-sm font-medium">{item.clothing_items?.name}</p>
                                                                <p className="text-xs text-gray-500">{t('dashboard.clothing.size_label')}: {item.size}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-white font-medium">{item.unit_price}€</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {clothingOrders.length === 0 && (
                                        <p className="text-center text-gray-500 py-12">{t('dashboard.clothing.no_orders')}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

function RepresentativeCard({ rep, onUpdate, loading, t }: { rep: any, onUpdate: any, loading: boolean, t: any }) {
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
            case 'fallera_mayor': return t('representatives.roles.fallera_mayor')
            case 'fallera_mayor_infantil': return t('representatives.roles.fallera_mayor_infantil')
            case 'presidente': return t('representatives.roles.presidente')
            case 'presidente_infantil': return t('representatives.roles.presidente_infantil')
            default: return role
        }
    }

    const handleSubmit = (e: FormEvent) => {
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
                    <div className={`relative w - 24 h - 24 rounded - xl overflow - hidden bg - white / 5 border border - white / 10 flex - shrink - 0 group`}>
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
                            <label className="block text-xs font-medium text-gray-400 mb-1">{t('dashboard.representatives.label_name', 'Nombre Completo')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-primary focus:outline-none"
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
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-primary focus:outline-none"
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
                        {t('dashboard.representatives.submit_update', 'Guardar')}
                    </button>
                </div>
            </div>
        </form>
    )
}
