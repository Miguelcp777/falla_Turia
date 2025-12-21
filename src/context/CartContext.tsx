import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

export interface CartItem {
    id: string
    itemId: string
    name: string
    price: number
    size: string
    image_url?: string
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addToCart: (item: Omit<CartItem, 'id'>) => void
    removeFromCart: (clientId: string) => void
    clearCart: () => void
    checkout: () => Promise<void>
    total: number
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('clothing_cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart', e)
            }
        }
    }, [])

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem('clothing_cart', JSON.stringify(items))
    }, [items])

    const addToCart = (newItem: Omit<CartItem, 'id'>) => {
        setItems(prev => {
            // Check if item with same ID and Size exists
            const existing = prev.find(i => i.itemId === newItem.itemId && i.size === newItem.size)
            if (existing) {
                return prev.map(i =>
                    (i.itemId === newItem.itemId && i.size === newItem.size)
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                )
            }
            return [...prev, { ...newItem, id: Math.random().toString(36).substr(2, 9) }]
        })
        setIsOpen(true)
    }

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id))
    }

    const clearCart = () => {
        setItems([])
        localStorage.removeItem('clothing_cart')
    }

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    const checkout = async () => {
        if (!user) throw new Error('Debes iniciar sesión para realizar el pedido')
        if (items.length === 0) throw new Error('El carrito está vacío')

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('clothing_orders')
                .insert({
                    user_id: user.id,
                    total_amount: total,
                    status: 'pending'
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                item_id: item.itemId, // DB ID
                quantity: item.quantity,
                size: item.size,
                unit_price: item.price
            }))

            const { error: itemsError } = await supabase
                .from('clothing_order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            clearCart()
            setIsOpen(false)
            alert('¡Pedido realizado con éxito! Contactaremos contigo pronto')
        } catch (error: any) {
            console.error('Checkout error:', error)
            throw error
        }
    }

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, checkout, total, isOpen, setIsOpen }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
