export type Event = {
    id: string
    title?: string
    title_es?: string
    title_va?: string
    description: string
    event_date: string
    location: string
}

export const EVENTS: Event[] = [
    { id: '1', title_es: 'Merienda de Infantiles', title_va: 'Berenar d\'Infantils', description: '', event_date: '2025-06-13T18:00:00', location: 'Casal Faller' },
    { id: '2', title_es: 'Besamanos', title_va: 'Besamans', description: '', event_date: '2025-06-15T11:00:00', location: 'Basílica' },
    { id: '3', title_es: 'San Juan', title_va: 'Sant Joan', description: '', event_date: '2025-06-28T21:00:00', location: 'Plaça' },
    { id: '4', title_es: 'Corpus', title_va: 'Corpus', description: '', event_date: '2025-06-29T11:00:00', location: 'Centre' },
    { id: '5', title_es: 'Demana', title_va: 'Demanà', description: '', event_date: '2025-07-05T20:00:00', location: 'Casal Faller' },
    { id: '6', title_es: 'Quinto y Tapa a la Mexicana', title_va: 'Quinto i Tapa a la Mexicana', description: '', event_date: '2025-07-12T19:00:00', location: 'Casal Faller' },
    { id: '7', title_es: 'Misa de San Roque', title_va: 'Missa de Sant Roc', description: '', event_date: '2025-08-16T12:00:00', location: 'Església' },
    { id: '8', title_es: 'Interfallas', title_va: 'Interfalles', description: '', event_date: '2025-09-20T10:00:00', location: 'Poliesportiu' },
    { id: '9', title_es: 'Penja', title_va: 'Penjà', description: '', event_date: '2025-09-28T18:00:00', location: 'Casal Faller' },
    { id: '10', title_es: 'Nit de Albaes', title_va: 'Nit d\'Albaes', description: '', event_date: '2025-10-08T22:00:00', location: 'Carrers' },
    { id: '11', title_es: 'Proclamación', title_va: 'Proclamació', description: '', event_date: '2025-10-18T20:00:00', location: 'Casal Faller' },
    { id: '12', title_es: 'Presentación', title_va: 'Presentació', description: '', event_date: '2026-01-24T18:00:00', location: 'Auditori' },
]
