import { useEffect, useState } from 'react'
import { Image as ImageIcon, Loader, X, ZoomIn } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import FireBackground from '@/components/layout/FireBackground'
import { useLanguage } from '@/context/LanguageContext'

export default function Gallery() {
    const { t } = useLanguage()
    const [images, setImages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    useEffect(() => {
        fetchGallery()
    }, [])

    const fetchGallery = async () => {
        try {
            const { data } = await supabase
                .from('gallery_images')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) setImages(data)
        } catch (error) {
            console.error('Error fetching gallery:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen">
            <FireBackground />

            {/* Content */}
            <div className="relative z-10 pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 border border-primary/20 backdrop-blur-sm">
                            <ImageIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                            {t('gallery.title')}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                            {t('gallery.subtitle')}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader className="w-12 h-12 text-primary animate-spin" />
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-20 bg-surface-dark/50 rounded-3xl border border-white/5">
                            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">{t('gallery.empty')}</p>
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {images.map((img) => (
                                <div
                                    key={img.id}
                                    className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in border border-white/10 bg-surface-dark shadow-xl"
                                    onClick={() => setSelectedImage(img.image_url)}
                                >
                                    <img
                                        src={img.image_url}
                                        alt={img.title || 'Gallery Image'}
                                        className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <ZoomIn className="text-white w-10 h-10 opacity-80" />
                                    </div>
                                    {img.title && (
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-white font-medium text-sm truncate">{img.title}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full size"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}
