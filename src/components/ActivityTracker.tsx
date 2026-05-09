import { useActivityLogger } from '@/hooks/useActivityLogger'

export default function ActivityTracker() {
    useActivityLogger()
    return null // This component only runs the hook
}
