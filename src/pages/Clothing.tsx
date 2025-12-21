import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Flame, ShoppingBag } from 'lucide-react'
import ClothingItemCard from '@/components/ClothingItemCard'
import CartDrawer from '@/components/CartDrawer'
import { useCart } from '@/context/CartContext'

export default function Clothing() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { setIsOpen, items: cartItems } = useCart()

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from('clothing_items')
                .select('*')
                .eq('active', true)
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) {
                console.log('Fetched clothing items:', data.map(i => ({ id: i.id, order: i.display_order, date: i.created_at })))
                setItems(data)
            }
        } catch (error) {
            console.error('Error fetching clothing:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative">
            <CartDrawer />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Flame className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-primary font-bold tracking-wider uppercase text-sm">Tienda Oficial</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Precios <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">"En Flama"</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl text-lg">
                            Equípate para estas fallas con nuestra colección exclusiva. Ropa de calidad con el escudo bordado.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-3 bg-surface-dark border border-white/10 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all group"
                    >
                        <div className="relative">
                            <ShoppingBag className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-surface-dark">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>
                        <div className="text-left">
                            <div className="text-xs text-gray-400 uppercase font-bold">Tu Pedido</div>
                            <div className="text-white font-bold">{cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0)}€</div>
                        </div>
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {items.map(item => (
                            <ClothingItemCard key={item.id} item={item} />
                        ))}
                    </div>
                )}

                {!loading && items.length === 0 && (
                    <div className="text-center py-20 bg-surface-dark/50 rounded-3xl border border-white/5">
                        <Flame className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No hay artículos disponibles</h3>
                        <p className="text-gray-400">Vuelve pronto para ver nuestra colección.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
