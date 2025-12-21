import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface ClothingItem {
    id: string
    name: string
    description: string
    price: number
    image_url: string
    sizes: string[]
}

export default function ClothingItemCard({ item }: { item: ClothingItem }) {
    const { addToCart } = useCart()
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [added, setAdded] = useState(false)

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Por favor selecciona una talla')
            return
        }

        addToCart({
            itemId: item.id,
            name: item.name,
            price: item.price,
            size: selectedSize,
            image_url: item.image_url,
            quantity: 1
        })

        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300">
            {/* Image Container with "En Flama" Effect */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60" />

                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center gap-2">
                        <ShoppingBag size={48} className="text-white/20" />
                        <span className="text-gray-500 text-sm font-medium">Sin imagen</span>
                    </div>
                )}

                {/* Price Tag with Fire Effect */}
                <div className="absolute bottom-4 right-4 z-20">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                        <div className="relative bg-black px-4 py-2 rounded-lg border border-white/10 flex items-center gap-1 font-bold text-white shadow-xl">
                            <span className="text-lg">{item.price}€</span>
                        </div>
                    </div>
                </div>

                {/* Flama Badge (Optional/Decorative based on uploaded image reference) */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                        Especial Fallas
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 font-display">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px]">{item.description}</p>

                <div className="space-y-4">
                    {/* Sizes */}
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Talla</label>
                        <div className="flex flex-wrap gap-2">
                            {item.sizes && item.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all border ${selectedSize === size
                                        ? 'bg-white text-black border-white scale-110 shadow-lg'
                                        : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action */}
                    <button
                        onClick={handleAddToCart}
                        disabled={added}
                        className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${added
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 hover:shadow-primary/40'
                            }`}
                    >
                        {added ? (
                            <>
                                <Check size={20} />
                                ¡Añadido!
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={20} />
                                Añadir al Carrito
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
