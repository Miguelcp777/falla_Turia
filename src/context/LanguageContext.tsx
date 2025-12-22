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
            panel: 'Panel de Gestión',
            login: 'Iniciar Sesión',
            logout: 'Cerrar Sesión',
            access: 'Acceso Falleros',
            representatives: 'Representantes',
            gallery: 'Galería',
            clothing: 'Ropa'
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
        },
        representatives: {
            title: 'Nuestros Representantes',
            subtitle: 'Conoce a las máximas figuras que representarán a nuestra comisión durante este ejercicio fallero.',
            honor_roll: 'Cuadro de Honor',
            cta: 'Conócelos',
            roles: {
                fallera_mayor: 'Fallera Mayor',
                fallera_mayor_infantil: 'Fallera Mayor Infantil',
                presidente: 'Presidente',
                presidente_infantil: 'Presidente Infantil'
            },
            empty_name: 'Próximamente...',
            empty_desc: 'Estamos preparando la presentación de nuestro representante.',
            home_subtitle: 'Conoce a las máximas figuras de nuestra comisión. El orgullo y la tradición de la Falla Turia representados en ellos.'
        },
        gallery: {
            title: 'Galería de Fotos',
            subtitle: 'Momentos inolvidables de nuestra falla.',
            empty: 'No hay fotos en la galería todavía.',
            upload: 'Subir Foto',
            delete: 'Eliminar',
            title_label: 'Título (Opcional)',
            uploading: 'Subiendo...',
            success_upload: 'Foto subida correctamente',
            item_count: 'Fotos'
        },
        dashboard: {
            title: 'Panel de Gestión',
            subtitle: 'Administra las noticias, eventos y configuración de la falla.',
            tabs: {
                news: 'Noticias',
                agenda: 'Agenda',
                lottery: 'Lotería',
                gallery: 'Galería',
                users: 'Usuarios',
                representatives: 'Representantes',
                clothing: 'Ropa'
            },
            news: {
                title_new: 'Nueva Noticia',
                title_edit: 'Editar Noticia',
                editing_alert: 'Editando noticia existente',
                cancel: 'Cancelar',
                label_title: 'Título',
                label_content: 'Contenido',
                placeholder_title: 'Ej: Crónica de la Presentación 2025',
                placeholder_content: 'Escribe el contenido de la noticia...',
                label_image: 'Imagen',
                upload_drag: 'Arrastra una imagen o haz clic para subir',
                or_url: 'O usa una URL externa (opcional)',
                placeholder_url: 'https://...',
                submit_create: 'Publicar Noticia',
                submit_update: 'Actualizar Noticia',
                alert_created: 'Noticia creada!',
                alert_updated: 'Noticia actualizada!',
                confirm_delete: '¿Seguro que quieres borrar esta noticia?'
            },
            agenda: {
                title_new: 'Nuevo Evento',
                title_edit: 'Editar Evento',
                label_title: 'Título',
                label_desc: 'Descripción',
                label_date: 'Fecha y Hora',
                label_location: 'Ubicación',
                submit_create: 'Crear Evento',
                submit_update: 'Actualizar Evento',
                alert_created: 'Evento creado!',
                alert_updated: 'Evento actualizado!',
                confirm_delete: '¿Seguro que quieres borrar este evento?',
                restore_success: 'Eventos restaurados correctamente',
                restore_error: 'Error: ',
                restore_btn: 'Restaurar Eventos Ejemplo'
            },
            gallery: {
                header_upload: 'Subir Fotos',
                submit_upload: 'Subir Fotos',
                submit_uploading: 'Subiendo',
                header_list: 'Fotos en Galería',
                label_drag_drop: 'Imágenes (Selecciona una o varias)',
                title_optional: 'Título (Opcional - Se aplicará a todas)'
            },
            lottery: {
                title: 'Configuración Lotería',
                label_number: 'Número',
                label_price: 'Precio',
                label_donation: 'Donativo',
                label_draw: 'Nombre Sorteo',
                label_draw_date: 'Fecha Sorteo',
                label_deadline: 'Fecha Límite',
                submit: 'Guardar Configuración',
                alert_updated: 'Configuración de Lotería actualizada!'
            },
            users: {
                title: 'Gestión de Usuarios',
                role_label: 'Rol',
                status_label: 'Estado',
                confirm_delete: '¿Estás seguro de que quieres eliminar este usuario? Esta acción borrará su perfil y su cuenta de acceso permanentemente.',
                alert_deleted: 'Usuario y cuenta eliminados correctamente'
            },
            representatives: {
                title: 'Gestión de Representantes',
                submit: 'Actualizar Representante'
            },
            clothing: {
                title_products: 'Gestión de Productos',
                title_orders: 'Pedidos',
                tab_products: 'Productos',
                tab_orders: 'Pedidos',
                form_name: 'Nombre',
                form_desc: 'Descripción',
                form_price: 'Precio',
                form_sizes: 'Tallas (separadas por coma)',
                form_image: 'Imagen',
                form_display_order: 'Orden',
                form_active: 'Activo',
                submit_create: 'Crear Prenda',
                submit_update: 'Actualizar Prenda',
                alert_created: 'Prenda creada',
                alert_updated: 'Prenda actualizada',
                confirm_delete: '¿Eliminar esta prenda?',
                status_pending: 'Pendiente',
                status_delivered: 'Entregado',
                status_paid: 'Pagado',
                status_cancelled: 'Cancelado',
                status_hidden: 'Oculto',
                order_id: 'Pedido',
                no_orders: 'No hay pedidos registrados',
                size_label: 'Talla'
            },
            common: {
                loading: 'Cargando...',
                error: 'Error',
                image_replace: 'Subir nueva imagen (reemplaza la actual)',
                file_selected: 'Archivo seleccionado'
            }
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
            access: 'Accés Fallers',
            representatives: 'Representants',
            gallery: 'Galeria',
            clothing: 'Indumentària'
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
        },
        representatives: {
            title: 'Nostres Representants',
            subtitle: 'Coneix les màximes figures que representaran a la nostra comissió durant aquest exercici faller.',
            honor_roll: 'Quadre d\'Honor',
            cta: 'Coneix-los',
            roles: {
                fallera_mayor: 'Fallera Major',
                fallera_mayor_infantil: 'Fallera Major Infantil',
                presidente: 'President',
                presidente_infantil: 'President Infantil'
            },
            empty_name: 'Pròximament...',
            empty_desc: 'Estem preparant la presentació del nostre representant.',
            home_subtitle: 'Coneix les màximes figures de la nostra comissió. L\'orgull i la tradició de la Falla Turia representats en ells.'
        },
        gallery: {
            title: 'Galeria de Fotos',
            subtitle: 'Moments inoblidables de la nostra falla.',
            empty: 'Encara no hi ha fotos a la galeria.',
            upload: 'Pujar Foto',
            delete: 'Eliminar',
            title_label: 'Títol (Opcional)',
            uploading: 'Pujant...',
            success_upload: 'Foto pujada correctament',
            item_count: 'Fotos'
        },
        dashboard: {
            title: 'Panell de Gestió',
            subtitle: 'Administra les notícies, esdeveniments i configuració de la falla.',
            tabs: {
                news: 'Notícies',
                agenda: 'Agenda',
                lottery: 'Loteria',
                gallery: 'Galeria',
                users: 'Usuaris',
                representatives: 'Representants',
                clothing: 'Indumentària'
            },
            news: {
                title_new: 'Nova Notícia',
                title_edit: 'Editar Notícia',
                editing_alert: 'Editant notícia existent',
                cancel: 'Cancel·lar',
                label_title: 'Títol',
                label_content: 'Contingut',
                placeholder_title: 'Ex: Crònica de la Presentació 2025',
                placeholder_content: 'Escriu el contingut de la notícia...',
                label_image: 'Imatge',
                upload_drag: 'Arrossega una imatge o fes clic per pujar',
                or_url: 'O utilitza una URL externa (opcional)',
                placeholder_url: 'https://...',
                submit_create: 'Publicar Notícia',
                submit_update: 'Actualitzar Notícia',
                alert_created: 'Notícia creada!',
                alert_updated: 'Notícia actualitzada!',
                confirm_delete: 'Segur que vols esborrar aquesta notícia?'
            },
            agenda: {
                title_new: 'Nou Esdeveniment',
                title_edit: 'Editar Esdeveniment',
                label_title: 'Títol',
                label_desc: 'Descripció',
                label_date: 'Data i Hora',
                label_location: 'Ubicació',
                submit_create: 'Crear Esdeveniment',
                submit_update: 'Actualitzar Esdeveniment',
                alert_created: 'Esdeveniment creat!',
                alert_updated: 'Esdeveniment actualitzat!',
                confirm_delete: 'Segur que vols esborrar aquest esdeveniment?',
                restore_success: 'Esdeveniments restaurats correctament',
                restore_error: 'Error: ',
                restore_btn: 'Restaurar Esdeveniments Exemple'
            },
            gallery: {
                header_upload: 'Pujar Fotos',
                submit_upload: 'Pujar Fotos',
                submit_uploading: 'Pujant',
                header_list: 'Fotos en la Galeria',
                label_drag_drop: 'Imatges (Selecciona una o diverses)',
                title_optional: 'Títol (Opcional - S\'aplicarà a totes)'
            },
            lottery: {
                title: 'Configuració Loteria',
                label_number: 'Número',
                label_price: 'Preu',
                label_donation: 'Donatiu',
                label_draw: 'Nom Sorteig',
                label_draw_date: 'Data Sorteig',
                label_deadline: 'Data Límit',
                submit: 'Guardar Configuració',
                alert_updated: 'Configuració de Loteria actualitzada!'
            },
            users: {
                title: 'Gestió d\'Usuaris',
                role_label: 'Rol',
                status_label: 'Estat',
                confirm_delete: 'Estàs segur que vols eliminar aquest usuari? Aquesta acció esborrarà el seu perfil i el seu compte d\'accés permanentment.',
                alert_deleted: 'Usuari i compte eliminats correctament'
            },
            representatives: {
                title: 'Gestió de Representants',
                submit: 'Actualitzar Representant'
            },
            clothing: {
                title_products: 'Gestió de Productes',
                title_orders: 'Comandes',
                tab_products: 'Productes',
                tab_orders: 'Comandes',
                form_name: 'Nom',
                form_desc: 'Descripció',
                form_price: 'Preu',
                form_sizes: 'Talles (separadas per coma)',
                form_image: 'Imatge',
                form_display_order: 'Ordre',
                form_active: 'Actiu',
                submit_create: 'Crear Peça',
                submit_update: 'Actualitzar Peça',
                alert_created: 'Peça creada',
                alert_updated: 'Peça actualitzada',
                confirm_delete: 'Eliminar aquesta peça?',
                status_pending: 'Pendent',
                status_delivered: 'Lliurat',
                status_paid: 'Pagat',
                status_cancelled: 'Cancel·lat',
                status_hidden: 'Ocult',
                order_id: 'Comanda',
                no_orders: 'No hi ha comandes registrades',
                size_label: 'Talla'
            },
            common: {
                loading: 'Carregant...',
                error: 'Error',
                image_replace: 'Pujar nova imatge (reemplaça l\'actual)',
                file_selected: 'Arxiu seleccionat'
            }
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
        return (saved === 'es' || saved === 'va') ? saved : 'va';
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
