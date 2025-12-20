import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type Language = 'es' | 'va';



export const translations = {
    es: {
        nav: {
            home: 'Inicio',
            news: 'Noticias',
            agenda: 'Agenda',
            lottery: 'Lotería',
            suggestions: 'Buzón',
            suggestions_full: 'Buzón de Sugerencias',
            admin: 'Admin',
            panel: 'Panel Admin',
            login: 'Iniciar Sesión',
            logout: 'Cerrar Sesión',
            access: 'Acceso Falleros'
        },
        home: {
            title: 'Pasión, Fuego, Fiesta y Tradición',
            subtitle: 'Falla Turia Plaça de l\'Ajuntament',
            cta: 'Únete a la fiesta',
            events_title: 'Próximos Eventos',
            events_cta: 'Ver agenda completa',
            news_title: 'Últimas Noticias',
            news_read_more: 'Leer más',
            countdown_title: 'Cuenta atrás para La Plantà',
            days: 'Días',
            hours: 'Horas',
            minutes: 'Minutos',
            seconds: 'Segundos',
            next_event: 'Próximo Acto',
            no_events: 'No hay eventos próximos'
        },
        lottery: {
            title: 'Lotería de Navidad',
            subtitle: '¡Que la suerte nos acompañe! Reserva ya tus décimos para el sorteo de Navidad 2024.',
            header_label: 'Sorteo 2024',
            number_label: 'Número de la Falla',
            price_label: 'Precio del décimo',
            price_sub: '(3€ donativo)',
            availability: 'Disponible en el Casal y online',
            form_title: 'Reserva tus Décimos',
            form_number: 'Número (Opcional)',
            form_number_placeholder: 'Por defecto',
            form_number_help: 'Si lo dejas vacío, se asignará el número de la falla.',
            form_quantity: 'Cantidad de Décimos',
            form_total: 'Total a pagar',
            form_submit: 'Solicitar Reserva',
            form_processing: 'Procesando...',
            alert_success: '¡Reserva solicitada!',
            alert_tickets: 'Décimos'
        },
        suggestions: {
            title: 'Buzón del Fallero',
            subtitle: '¿Tienes alguna idea para mejorar la falla? ¿Alguna propuesta para la semana fallera? Cuéntanoslo, tu opinión construye nuestra fiesta.',
            category: 'Participación',
            your_proposals: 'Tus Propuestas',
            empty_proposals: 'Aún no has enviado ninguna sugerencia.',
            example_proposal: 'Mascletà manual para los infantiles...',
            status_sent: 'Enviado',
            success_title: '¡Recibido!',
            success_msg: 'Gracias por tu aportación.',
            new_proposal: 'Nueva Propuesta',
            placeholder: 'Escribe aquí tu sugerencia o idea...',
            submit: 'Enviar Propuesta',
            sending: 'Enviando...'
        },
        login: {
            title: 'Acceso Falleros',
            subtitle: 'Gestiona tu cuenta, reservas y participación en la falla.',
            email: 'Correo Electrónico',
            password: 'Contraseña',
            submit: 'Entrar',
            loading: 'Cargando...',
            no_account: '¿No tienes cuenta?',
            contact: 'Contacta con secretaría',
            error_auth: 'Error al iniciar sesión. Verifica tus credenciales.'
        },
        agenda: {
            title: 'Agenda Fallera',
            subtitle: 'No te pierdas nada. Consulta todos los eventos y actos programados.',
            location: 'Lugar',
            calendar_year: 'Calendario 2025-2026',
            empty: 'No hay eventos próximos.'
        },
        news: {
            title: 'Noticias y Actualidad',
            subtitle: 'Entérate de las últimas novedades de nuestra comisión.',
            read_more: 'Leer completa',
            blog_official: 'Blog Oficial',
            label_news: 'NOTICIA',
            empty: 'No hay noticias publicadas todavía.'
        }
    },
    va: {
        nav: {
            home: 'Inici',
            news: 'Notícies',
            agenda: 'Agenda',
            lottery: 'Loteria',
            suggestions: 'Bústia',
            suggestions_full: 'Bústia de Sugeriments',
            admin: 'Admin',
            panel: 'Panell Admin',
            login: 'Iniciar Sessió',
            logout: 'Tancar Sessió',
            access: 'Accés Fallers'
        },
        home: {
            title: 'Passió, Foc, Festa i Tradició',
            subtitle: 'Falla Turia Plaça de l\'Ajuntament',
            cta: 'Uneix-te a la festa',
            events_title: 'Pròxims Esdeveniments',
            events_cta: 'Veure agenda completa',
            news_title: 'Últimes Notícies',
            news_read_more: 'Llegir més',
            countdown_title: 'Compte enrere per a La Plantà',
            days: 'Dies',
            hours: 'Hores',
            minutes: 'Minuts',
            seconds: 'Segons',
            next_event: 'Pròxim Acte',
            no_events: 'No hi ha esdeveniments pròxims'
        },
        lottery: {
            title: 'Loteria de Nadal',
            subtitle: 'Que la sort ens acompanye! Reserva ja els teus dècims per al sorteig de Nadal 2024.',
            header_label: 'Sorteig 2024',
            number_label: 'Número de la Falla',
            price_label: 'Preu del dècim',
            price_sub: '(3€ donatiu)',
            availability: 'Disponible al Casal i online',
            form_title: 'Reserva els teus Dècims',
            form_number: 'Número (Opcional)',
            form_number_placeholder: 'Per defecte',
            form_number_help: 'Si ho deixes buit, s\'assignarà el número de la falla.',
            form_quantity: 'Quantitat de Dècims',
            form_total: 'Total a pagar',
            form_submit: 'Sol·licitar Reserva',
            form_processing: 'Processant...',
            alert_success: 'Reserva sol·licitada!',
            alert_tickets: 'Dècims'
        },
        suggestions: {
            title: 'Bústia del Faller',
            subtitle: 'Tens alguna idea per millorar la falla? Alguna proposta per a la setmana fallera? Conta\'ns-ho, la teua opinió construeix la nostra festa.',
            category: 'Participació',
            your_proposals: 'Les teues Propostes',
            empty_proposals: 'Encara no has enviat cap suggeriment.',
            example_proposal: 'Mascletà manual per als infantils...',
            status_sent: 'Enviat',
            success_title: 'Rebut!',
            success_msg: 'Gràcies per la teua aportació.',
            new_proposal: 'Nova Proposta',
            placeholder: 'Escriu ací el teu suggeriment o idea...',
            submit: 'Enviar Proposta',
            sending: 'Enviant...'
        },
        login: {
            title: 'Accés Fallers',
            subtitle: 'Gestiona el teu compte, reserves i participació en la falla.',
            email: 'Correu Electrònic',
            password: 'Contrasenya',
            submit: 'Entrar',
            loading: 'Carregant...',
            no_account: 'No tens compte?',
            contact: 'Contacta amb secretaria',
            error_auth: 'Error en iniciar sessió. Verifica les teues credencials.'
        },
        agenda: {
            title: 'Agenda Fallera',
            subtitle: 'No et perdes res. Consulta tots els esdeveniments i actes programats.',
            location: 'Lloc',
            calendar_year: 'Calendari 2025-2026',
            empty: 'No hi ha esdeveniments pròxims.'
        },
        news: {
            title: 'Notícies i Actualitat',
            subtitle: 'Assabenta\'t de les últimes novetats de la nostra comissió.',
            read_more: 'Llegir completa',
            blog_official: 'Blog Oficial',
            label_news: 'NOTÍCIA',
            empty: 'Encara no hi ha notícies publicades.'
        }
    }
};

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved === 'es' || saved === 'va') ? saved : 'es';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
    }, [language]);

    const t = (path: string): string => {
        const keys = path.split('.');
        let current: any = translations[language];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation missing for key: ${path} in language: ${language}`);
                return path;
            }
            current = current[key];
        }

        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
