import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { BarChart3, Users, Clock, Eye, TrendingUp, Activity, RefreshCw, List } from 'lucide-react'

type LogEntry = {
    id: string
    user_id: string
    user_email: string
    event_type: string
    page_path: string | null
    metadata: any
    created_at: string
}

type SubTab = 'analytics' | 'logs'

const PAGE_LABELS: Record<string, string> = {
    '/': 'Inicio',
    '/institution': 'Institución',
    '/news': 'Noticias',
    '/representatives': 'Representantes',
    '/agenda': 'Agenda',
    '/lottery': 'Lotería',
    '/gallery': 'Galería',
    '/clothing': 'Ropa',
    '/suggestions': 'Buzón',
    '/admin': 'Panel Admin',
    '/login': 'Login',
}

export default function ActivityAnalytics() {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [subTab, setSubTab] = useState<SubTab>('analytics')
    const [days, setDays] = useState(30)

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const since = new Date()
            since.setDate(since.getDate() - days)
            const { data, error } = await supabase
                .from('activity_logs')
                .select('*')
                .gte('created_at', since.toISOString())
                .order('created_at', { ascending: true })
                .limit(5000)
            if (error) throw error
            setLogs(data || [])
        } catch (e) {
            console.error('Error fetching logs:', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchLogs() }, [days])

    // ── Computed analytics ──
    const analytics = useMemo(() => {
        if (!logs.length) return null

        const pageViews = logs.filter(l => l.event_type === 'page_view')
        const logins = logs.filter(l => l.event_type === 'login')
        const logouts = logs.filter(l => l.event_type === 'logout')

        // Visits per day
        const dailyMap: Record<string, { views: number; users: Set<string> }> = {}
        pageViews.forEach(l => {
            const day = l.created_at.slice(0, 10)
            if (!dailyMap[day]) dailyMap[day] = { views: 0, users: new Set() }
            dailyMap[day].views++
            dailyMap[day].users.add(l.user_id)
        })
        const dailyStats = Object.entries(dailyMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, s]) => ({ date, views: s.views, uniqueUsers: s.users.size }))

        // Top pages
        const pageMap: Record<string, number> = {}
        pageViews.forEach(l => {
            const p = l.page_path || 'unknown'
            pageMap[p] = (pageMap[p] || 0) + 1
        })
        const topPages = Object.entries(pageMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([path, count]) => ({ path, label: PAGE_LABELS[path] || path, count }))

        // Session durations (login→logout pairs per user)
        const sessionDurations: number[] = []
        const loginsByUser: Record<string, string[]> = {}
        logins.forEach(l => {
            if (!loginsByUser[l.user_id]) loginsByUser[l.user_id] = []
            loginsByUser[l.user_id].push(l.created_at)
        })
        logouts.forEach(l => {
            const userLogins = loginsByUser[l.user_id]
            if (userLogins && userLogins.length) {
                const loginTime = userLogins.shift()!
                const dur = (new Date(l.created_at).getTime() - new Date(loginTime).getTime()) / 60000
                if (dur > 0 && dur < 480) sessionDurations.push(dur)
            }
        })
        const avgSession = sessionDurations.length
            ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
            : 0

        // Time per section (estimate from consecutive page_views per user)
        const sectionTime: Record<string, number[]> = {}
        const userPageViews: Record<string, LogEntry[]> = {}
        pageViews.forEach(l => {
            if (!userPageViews[l.user_id]) userPageViews[l.user_id] = []
            userPageViews[l.user_id].push(l)
        })
        Object.values(userPageViews).forEach(views => {
            for (let i = 0; i < views.length - 1; i++) {
                const curr = views[i]
                const next = views[i + 1]
                const dur = (new Date(next.created_at).getTime() - new Date(curr.created_at).getTime()) / 1000
                if (dur > 0 && dur < 1800) {
                    const p = curr.page_path || 'unknown'
                    if (!sectionTime[p]) sectionTime[p] = []
                    sectionTime[p].push(dur)
                }
            }
        })
        const sectionAvg = Object.entries(sectionTime)
            .map(([path, times]) => ({
                path,
                label: PAGE_LABELS[path] || path,
                avgSeconds: times.reduce((a, b) => a + b, 0) / times.length,
                visits: times.length
            }))
            .sort((a, b) => b.avgSeconds - a.avgSeconds)
            .slice(0, 10)

        // Unique users total
        const uniqueUsers = new Set(logs.map(l => l.user_id)).size

        // Most active users
        const userActivity: Record<string, { email: string; count: number }> = {}
        pageViews.forEach(l => {
            if (!userActivity[l.user_id]) userActivity[l.user_id] = { email: l.user_email, count: 0 }
            userActivity[l.user_id].count++
        })
        const topUsers = Object.values(userActivity).sort((a, b) => b.count - a.count).slice(0, 8)

        return {
            totalViews: pageViews.length,
            totalLogins: logins.length,
            uniqueUsers,
            avgSession,
            dailyStats,
            topPages,
            sectionAvg,
            topUsers,
        }
    }, [logs])

    const maxDaily = analytics ? Math.max(...analytics.dailyStats.map(d => d.views), 1) : 1
    const maxPage = analytics ? Math.max(...analytics.topPages.map(p => p.count), 1) : 1

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${Math.round(seconds)}s`
        return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
        )
    }

    return (
        <div>
            {/* Header + Sub-tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
                    <Activity className="text-primary" size={28} />
                    Actividad de Usuarios
                </h2>
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 transition-colors">
                        <button onClick={() => setSubTab('analytics')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === 'analytics' ? 'bg-primary text-white shadow' : 'text-slate-500 dark:text-gray-400 hover:text-primary'}`}>
                            <BarChart3 size={14} className="inline mr-1.5" />Análisis
                        </button>
                        <button onClick={() => setSubTab('logs')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === 'logs' ? 'bg-primary text-white shadow' : 'text-slate-500 dark:text-gray-400 hover:text-primary'}`}>
                            <List size={14} className="inline mr-1.5" />Registros
                        </button>
                    </div>
                    <select value={days} onChange={e => setDays(Number(e.target.value))} className="bg-gray-100 dark:bg-white/5 border-0 text-slate-700 dark:text-gray-300 text-xs font-bold rounded-xl px-3 py-2 transition-colors">
                        <option value={7}>7 días</option>
                        <option value={14}>14 días</option>
                        <option value={30}>30 días</option>
                        <option value={90}>90 días</option>
                    </select>
                    <button onClick={fetchLogs} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:text-primary transition-all" title="Refrescar">
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {subTab === 'analytics' && analytics && (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: Eye, label: 'Visitas totales', value: analytics.totalViews.toLocaleString(), color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { icon: Users, label: 'Usuarios únicos', value: analytics.uniqueUsers.toString(), color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            { icon: TrendingUp, label: 'Sesiones', value: analytics.totalLogins.toLocaleString(), color: 'text-orange-500', bg: 'bg-orange-500/10' },
                            { icon: Clock, label: 'Sesión promedio', value: analytics.avgSession > 0 ? `${Math.round(analytics.avgSession)} min` : '—', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        ].map((kpi, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl p-5 transition-colors">
                                <div className={`${kpi.bg} ${kpi.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                                    <kpi.icon size={20} />
                                </div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">{kpi.value}</p>
                                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-1">{kpi.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Daily Chart */}
                    <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl p-6 mb-6 transition-colors">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Visitas por día</h3>
                        <div className="flex items-end gap-[3px] h-40">
                            {analytics.dailyStats.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative min-w-0">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                        {d.date.slice(5)} · {d.views} visitas · {d.uniqueUsers} usuarios
                                    </div>
                                    <div
                                        className="w-full bg-gradient-to-t from-primary to-orange-400 rounded-t-sm transition-all duration-300 group-hover:from-primary-dark group-hover:to-primary min-h-[2px]"
                                        style={{ height: `${(d.views / maxDaily) * 100}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-slate-400 dark:text-gray-500">
                            <span>{analytics.dailyStats[0]?.date.slice(5)}</span>
                            <span>{analytics.dailyStats[analytics.dailyStats.length - 1]?.date.slice(5)}</span>
                        </div>
                    </div>

                    {/* Two columns: Top Pages + Time per Section */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Top Pages */}
                        <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl p-6 transition-colors">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Páginas más visitadas</h3>
                            <div className="space-y-3">
                                {analytics.topPages.map((p, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-bold text-slate-800 dark:text-white transition-colors">{p.label}</span>
                                            <span className="text-slate-500 dark:text-gray-400 font-mono">{p.count}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all" style={{ width: `${(p.count / maxPage) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Time per Section */}
                        <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl p-6 transition-colors">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Tiempo promedio por sección</h3>
                            {analytics.sectionAvg.length > 0 ? (
                                <div className="space-y-3">
                                    {analytics.sectionAvg.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors">
                                            <span className="text-xs font-bold text-slate-800 dark:text-white transition-colors">{s.label}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-slate-400 dark:text-gray-500">{s.visits} visitas</span>
                                                <span className="text-xs font-mono font-bold text-primary">{formatDuration(s.avgSeconds)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 dark:text-gray-500 py-8 text-center">Se necesitan más datos para calcular tiempos.</p>
                            )}
                        </div>
                    </div>

                    {/* Top Users */}
                    <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl p-6 transition-colors">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Usuarios más activos</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {analytics.topUsers.map((u, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/5 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate transition-colors">{u.email?.split('@')[0]}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-gray-500">{u.count} visitas</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {subTab === 'analytics' && !analytics && (
                <div className="text-center py-20 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-200 dark:border-white/5 transition-colors">
                    <p className="text-slate-500 dark:text-gray-400">No hay datos de actividad aún.</p>
                </div>
            )}

            {subTab === 'logs' && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/10 text-slate-500 dark:text-gray-400 text-sm font-bold transition-colors">
                                <th className="py-4 px-4">Usuario</th>
                                <th className="py-4 px-4">Evento</th>
                                <th className="py-4 px-4">Página</th>
                                <th className="py-4 px-4 text-right">Fecha/Hora</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {[...logs].reverse().slice(0, 200).map((log) => (
                                <tr key={log.id} className="text-slate-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm transition-colors">{log.user_email}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${log.event_type === 'login' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            log.event_type === 'logout' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                            }`}>
                                            {log.event_type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">{log.page_path ? (PAGE_LABELS[log.page_path] || log.page_path) : '—'}</td>
                                    <td className="py-3 px-4 text-right text-xs">
                                        <div>{new Date(log.created_at).toLocaleDateString()}</div>
                                        <div className="text-gray-500 font-medium">{new Date(log.created_at).toLocaleTimeString()}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-200 dark:border-white/5 mt-4 transition-colors">
                            <p className="text-slate-500 dark:text-gray-400">No hay registros de actividad aún.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
