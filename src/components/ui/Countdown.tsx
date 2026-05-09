import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useSiteConfig } from '@/context/SiteConfigContext'

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

const Countdown = () => {
    const { t } = useLanguage()
    const { plantaDate } = useSiteConfig()
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        if (!plantaDate) return

        const targetDate = new Date(plantaDate)

        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [plantaDate])

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center p-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl min-w-[80px] sm:min-w-[100px] transition-colors duration-500">
            <span className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white mb-1">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm text-primary uppercase font-bold tracking-wider">
                {label}
            </span>
        </div>
    )

    return (
        <div className="flex flex-col items-center justify-center animate-fade-in-up mt-8 mb-12">
            <h3 className="text-slate-800 dark:text-white font-display text-xl mb-6 tracking-wide font-light opacity-90 transition-colors duration-500">
                {t('home.countdown_title')}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
                <TimeUnit value={timeLeft.days} label={t('home.days')} />
                <TimeUnit value={timeLeft.hours} label={t('home.hours')} />
                <TimeUnit value={timeLeft.minutes} label={t('home.minutes')} />
                <TimeUnit value={timeLeft.seconds} label={t('home.seconds')} />
            </div>
        </div>
    )
}

export default Countdown

