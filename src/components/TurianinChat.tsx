import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, MessageCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

const WELCOME_MESSAGE: Message = {
    role: 'assistant',
    content: '¡Hola! Soc en Turianin 🦇🔥, la mascota de la Falla Turia Plaça de l\'Ajuntament! Estic ací per ajudar-te amb qualsevol dubte sobre la falla, les actes, els esdeveniments i molt més. ¡Pregunta\'m el que vulgues! ✨'
}

export default function TurianinChat() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    // Pulse animation for the button
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 1000)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    if (!user) return null

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMessage: Message = { role: 'user', content: input.trim() }
        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInput('')
        setLoading(true)

        try {
            const history = newMessages.slice(0, -1).map(m => ({
                role: m.role,
                content: m.content
            }))

            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    conversationHistory: history
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Error')

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.reply
            }])
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '¡Aïna! Sembla que tinc un problemeta tècnic 🦇😅 Intenta-ho de nou en un moment, ¡gràcies per la paciència!'
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-[360px] max-h-[600px] flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-out ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-90 translate-y-8 pointer-events-none'
                    }`}
                style={{
                    background: 'linear-gradient(145deg, rgba(15,10,25,0.97) 0%, rgba(25,8,35,0.97) 100%)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    backdropFilter: 'blur(20px)'
                }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10"
                    style={{ background: 'linear-gradient(135deg, rgba(139,0,0,0.8) 0%, rgba(80,0,80,0.8) 100%)' }}>
                    <img
                        src="/turianin-logo.png"
                        alt="Turianin"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-red-400/50"
                    />
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-sm">Turianin 🦇</h3>
                        <p className="text-red-300 text-xs">Falla Turia · Plaça de l'Ajuntament</p>
                    </div>
                    <div className="flex items-center gap-2 mr-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs">En línia</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
                    style={{ maxHeight: '420px' }}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {msg.role === 'assistant' && (
                                <img
                                    src="/turianin-logo.png"
                                    alt="Turianin"
                                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1"
                                />
                            )}
                            <div
                                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-red-600 to-red-800 text-white rounded-tr-sm'
                                    : 'bg-white/10 text-gray-100 rounded-tl-sm border border-white/10'
                                    }`}
                                style={{ wordBreak: 'break-word' }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-2 items-center">
                            <img src="/turianin-logo.png" alt="Turianin" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                                <div className="flex gap-1 items-center">
                                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-white/10">
                    <div className="flex gap-2 items-center bg-white/5 rounded-2xl px-3 py-2 border border-white/10 focus-within:border-red-500/50 transition-colors">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Pregunta a Turianin..."
                            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="p-1.5 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-red-500 hover:to-red-700 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>
                    <p className="text-center text-gray-600 text-[10px] mt-1.5">Turianin · Falla Turia IA 🦇</p>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 active:scale-95 flex items-center justify-center overflow-hidden group ${isAnimating ? 'scale-110' : 'scale-100'
                    }`}
                style={{
                    background: 'linear-gradient(135deg, #8b0000 0%, #500050 100%)',
                    boxShadow: isOpen
                        ? '0 0 0 4px rgba(239,68,68,0.4), 0 10px 30px rgba(139,0,0,0.6)'
                        : '0 0 20px rgba(239,68,68,0.4), 0 10px 30px rgba(0,0,0,0.5)'
                }}
                title="Parla amb Turianin"
            >
                {isOpen ? (
                    <X size={24} className="text-white" />
                ) : (
                    <img
                        src="/turianin-logo.png"
                        alt="Turianin"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                )}

                {/* Notification dot */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse" />
                )}
            </button>
        </>
    )
}
