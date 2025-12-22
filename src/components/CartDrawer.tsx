import { X, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
    const { items, removeFromCart, total, isOpen, setIsOpen, checkout, clearCart } = useCart()

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-surface-dark border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="text-primary" />
                        Tu Pedido
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Tu carrito está vacío</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-4 text-primary hover:underline"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-background-dark p-4 rounded-xl border border-white/5">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                ) : (
                                    <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center">
                                        <ShoppingBag size={20} className="text-gray-600" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white truncate">{item.name}</h3>
                                    <p className="text-sm text-gray-400">Talla: <span className="text-white font-medium">{item.size}</span></p>
                                    <p className="text-primary font-bold mt-1">{item.price}€ x {item.quantity}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors h-fit"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-surface-dark/50 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-6 text-lg">
                            <span className="text-gray-400">Total</span>
                            <span className="font-bold text-white text-2xl">{total}€</span>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => checkout().catch(err => alert(err.message))}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                            >
                                Confirmar Pedido
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full py-3 text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                Varciar carrito
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
