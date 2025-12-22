import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ChevronLeft, ChevronRight, Clock, Flame } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

function NewsCarousel({ images, title }: { images: string[], title: string }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const next = () => setCurrentIndex((prev) => (prev + 1) % images.length)
    const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)

    return (
        <div className="relative w-full h-full group">
            <img
                src={images[currentIndex]}
                alt={`${title} - ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prev() }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); next() }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                        <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

type NewsItem = {
    id: string
    title: string
    content: string
    image_url: string | null
    images?: string[] // Optional array of images
    published_at: string
}

// Mock Data for fallback
const NEWS_ITEMS_MOCK: NewsItem[] = [
    { id: '1', title: 'Gran Ofrenda de Flores 2024', content: 'Un día emocionante para nuestra comisión...', published_at: '2024-03-19', image_url: 'https://images.unsplash.com/photo-1561586035-c8e9ee2e7424?w=800&q=80' },
    { id: '2', title: 'Concurso de Paellas', content: 'Gran participación en el concurso anual...', published_at: '2024-03-16', image_url: 'https://images.unsplash.com/photo-1533174072545-c8e9ee2e7424?w=800&q=80' },
]

export default function News() {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const { t } = useLanguage()

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('published_at', { ascending: false })

            if (error) throw error
            setNews(data || [])
        } catch (error) {
            console.error('Error fetching news:', error)
            // Fallback content in case of error (optional)
        } finally {
            setLoading(false)
        }
    }

    const displayNews = news.length > 0 ? news : NEWS_ITEMS_MOCK
    // If news is empty, we show mock data for demonstration purposes or just empty state.
    // However, if fetching works but returns empty, we might want to respect that.
    // For now, let's show mock data if empty just so the page isn't blank during development without DB data.
    const hasNews = displayNews.length > 0

    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="p-2 bg-primary/10 rounded-full">
                            <Flame className="w-5 h-5 text-primary" />
                        </span>
                        <span className="text-primary font-bold tracking-widest text-sm uppercase">{t('news.blog_official')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        {t('news.title')}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('news.subtitle')}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayNews.map((item) => (
                            <article
                                key={item.id}
                                className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <Flame className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        {t('news.label_news')}
                                    </div>
                                </div>

                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <Clock size={16} />
                                        <span>{new Date(item.published_at).toLocaleDateString()}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
                                        {item.content}
                                    </p>

                                    <button
                                        onClick={() => setSelectedNews(item)}
                                        className="text-primary font-bold text-sm flex items-center gap-2 group/btn hover:underline active:scale-95 transition-transform"
                                    >
                                        {t('news.read_more')}
                                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && !hasNews && (
                    <div className="text-center py-20 bg-surface-dark/50 rounded-3xl border border-white/5">
                        <p className="text-gray-400 text-xl">{t('news.empty')}</p>
                    </div>
                )}
            </div>

            {/* Modal for Full News */}
            {selectedNews && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedNews(null)}>
                    <div
                        className="bg-white dark:bg-surface-dark w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedNews(null)}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>

                        <div className="relative h-64 md:h-96 w-full bg-gray-200 dark:bg-gray-800">
                            {selectedNews.images && selectedNews.images.length > 0 ? (
                                <NewsCarousel images={selectedNews.images} title={selectedNews.title} />
                            ) : selectedNews.image_url ? (
                                <img
                                    src={selectedNews.image_url}
                                    alt={selectedNews.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Flame className="w-20 h-20 text-gray-300 dark:text-gray-600" />
                                </div>
                            )}

                            {!selectedNews.images?.length && (
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-24">
                                    <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                                        <Clock size={16} />
                                        <span>{new Date(selectedNews.published_at).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                                        {selectedNews.title}
                                    </h2>
                                </div>
                            )}
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                                {selectedNews.content}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
