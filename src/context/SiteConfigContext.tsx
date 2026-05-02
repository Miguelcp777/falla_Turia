import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

interface SiteConfig {
    currentYear: number
    plantaDate: string
}

interface SiteConfigContextType extends SiteConfig {
    loading: boolean
    updateSiteConfig: (year: number, plantaDate: string) => Promise<void>
    refreshConfig: () => Promise<void>
}

const SiteConfigContext = createContext<SiteConfigContextType>({
    currentYear: new Date().getFullYear(),
    plantaDate: '',
    loading: true,
    updateSiteConfig: async () => {},
    refreshConfig: async () => {}
})

export const useSiteConfig = () => useContext(SiteConfigContext)

export function SiteConfigProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<SiteConfig>({
        currentYear: new Date().getFullYear(),
        plantaDate: new Date().toISOString()
    })
    const [loading, setLoading] = useState(true)

    const fetchConfig = async () => {
        try {
            const { data, error } = await supabase
                .from('site_config')
                .select('*')
                .single()

            if (error) {
                console.error('Error fetching site config:', error)
                return
            }

            if (data) {
                setConfig({
                    currentYear: data.current_year,
                    plantaDate: data.planta_date
                })
            }
        } catch (err) {
            console.error('Error fetching site config:', err)
        } finally {
            setLoading(false)
        }
    }

    const updateSiteConfig = async (year: number, plantaDate: string) => {
        const { error } = await supabase
            .from('site_config')
            .update({
                current_year: year,
                planta_date: plantaDate,
                updated_at: new Date().toISOString()
            })
            .not('id', 'is', null) // Update all rows (there's only one)

        if (error) throw error

        setConfig({ currentYear: year, plantaDate })
    }

    useEffect(() => {
        fetchConfig()
    }, [])

    return (
        <SiteConfigContext.Provider value={{
            ...config,
            loading,
            updateSiteConfig,
            refreshConfig: fetchConfig
        }}>
            {children}
        </SiteConfigContext.Provider>
    )
}
