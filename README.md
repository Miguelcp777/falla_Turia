# Falla Turia - Plaça de l'Ajuntament

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)

Aplicación web oficial de la Falla Turia - Plaça de l'Ajuntament para la gestión y comunicación con los miembros de la comisión fallera.

## 🎭 Descripción

Plataforma web moderna para la Falla Turia que permite a los miembros de la comisión mantenerse informados sobre noticias, eventos, representantes y participar en actividades como la lotería de Navidad. Incluye un sistema completo de gestión administrativa con roles diferenciados.

## ✨ Características Principales

### Para Usuarios
- 🔥 **Diseño Temático**: Fondo animado de fuego con efectos visuales impresionantes
- 🗞️ **Noticias**: Últimas novedades de la comisión
- 📅 **Agenda**: Calendario dinámico con eventos destacados y sección de histórico
- 🎫 **Lotería**: Información y participación en el sorteo de Navidad
- 👥 **Representantes**: Galería de los representantes oficiales 2026
- 🖼️ **Galería de Fotos**: Visualización de imágenes de la comisión
- 📸 **Noticias Multi-foto**: Carrusel de imágenes en los artículos del blog
- 💬 **Sugerencias**: Buzón para propuestas y sugerencias
- 🌍 **Multiidioma**: Español y Valenciano
- 👤 **Perfil de Usuario**: Visualización del nombre completo en el navbar
- 📝 **Registro Completo**: Formulario con nombre, apellidos, dirección y teléfono
- 🔑 **Recuperación de Contraseña**: Sistema completo de reseteo de contraseña por email
- 🔐 **Autenticación Segura**: Login seguro con Supabase Auth

### Para Administradores
- 📊 **Dashboard Completo**: Panel de control administrativo
- 👤 **Gestión de Usuarios**: Control de roles (Admin, Editor, Author, Subscriber)
- ✏️ **Edición de Perfiles**: Modificación completa de datos de usuario (nombre, apellidos, dirección, teléfono)
- 📝 **Gestión de Contenido**: Creación y edición de noticias y eventos
- 🎰 **Configuración de Lotería**: Administración del sorteo navideño
- 👑 **Gestión de Representantes**: Actualización de información y fotos
- 📸 **Galería Administrativa**: Subida múltiple de imágenes
- 🔐 **Sistema RBAC**: Control de acceso basado en roles
- 🗑️ **Eliminación Completa**: Borrado total de usuarios incluyendo cuenta de autenticación
- 📨 **Integración Webhook**: Sincronización automática de nuevos usuarios con n8n
- 🏢 **Panel Institución**: Gestión de los textos e imágenes de la sección Institución

## 🛠️ Tecnologías

### Frontend
- **React 18.3.1** - Biblioteca de interfaz de usuario
- **TypeScript 5.5.3** - Tipado estático
- **Vite 5.4.0** - Build tool y dev server
- **React Router 6.26.0** - Enrutamiento
- **Tailwind CSS 3.4.9** - Framework de estilos
- **Lucide React** - Iconos

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage
  - Row Level Security (RLS)
  - Edge Functions

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Cuenta de Supabase

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Miguelcp777/falla_Turia.git
cd falla-turia
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 4. Configurar Supabase

#### a) Crear las tablas

Ejecuta los siguientes scripts SQL en el SQL Editor de Supabase:

**Tabla de perfiles:**
```sql
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  role text CHECK (role IN ('subscriber', 'author', 'editor', 'admin')) DEFAULT 'subscriber',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  active boolean DEFAULT true,
  first_name text,
  last_name text,
  address text,
  phone text
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Public profiles view" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and Editors can update profiles" ON public.profiles FOR UPDATE TO authenticated 
  USING (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
```

**Trigger para nuevos usuarios:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, active, first_name, last_name, address, phone)
  VALUES (
    new.id,
    new.email,
    'subscriber',
    true,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Función para eliminar usuarios:**
```sql
CREATE OR REPLACE FUNCTION public.delete_user_fully(target_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  ) THEN
    RAISE EXCEPTION 'Access denied. You must be an Admin or Editor.';
  END IF;
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_user_fully(uuid) TO authenticated;
```

**Otras tablas:**
```sql
-- Ejecuta el archivo gallery_setup.sql proporcionado en /artifacts
-- para crear las tablas de: news, agenda, lottery_config, representatives, gallery_images, suggestions
```

#### b) Configurar Storage

1. Crea un bucket llamado `images` en Storage
2. Configúralo como público o con las políticas de acceso apropiadas

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Build para producción

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`

## 🗂️ Estructura del Proyecto

```
falla-turia/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── auth/         # Componentes de autenticación
│   │   └── layout/       # Componentes de diseño (Navbar, Footer, etc.)
│   ├── context/          # Contextos de React
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── lib/              # Utilidades y configuración
│   │   └── supabase.ts   # Cliente de Supabase
│   ├── pages/            # Páginas/Vistas
│   │   ├── Home.tsx
│   │   ├── News.tsx
│   │   ├── Agenda.tsx
│   │   ├── Lottery.tsx
│   │   ├── Representatives.tsx
│   │   ├── Gallery.tsx
│   │   ├── Suggestions.tsx
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   ├── App.tsx           # Componente raíz
│   ├── main.tsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── public/              # Archivos estáticos
├── .env                 # Variables de entorno (no commitear)
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 👥 Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **Subscriber** | Visualizar contenido, enviar sugerencias |
| **Author** | Subscriber + Crear/editar propio contenido |
| **Editor** | Author + Gestionar contenido, representantes, galería, usuarios |
| **Admin** | Editor + Configuración de lotería, gestión completa de usuarios |

## 🔐 Seguridad

- Autenticación mediante Supabase Auth
- Row Level Security (RLS) en todas las tablas
- Protección de rutas mediante ProtectedRoute
- Validación de roles en el backend
- Políticas de acceso basadas en roles

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno en Vercel
3. Deploya automáticamente

### Netlify

1. Conecta tu repositorio
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configura las variables de entorno
5. **Importante**: El proyecto incluye un archivo `_redirects` en `public/` para manejar el proxy del webhook y el routing SPA. Asegúrate de que se copie al directodio `dist` durante el build (Vite lo hace automáticamente).

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y pertenece a la Falla Turia - Plaça de l'Ajuntament.

## 👨‍💻 Autor

**Miguel CP**
- GitHub: [@Miguelcp777](https://github.com/Miguelcp777)

## 🙏 Agradecimientos

- Comisión Falla Turia - Plaça de l'Ajuntament
- Comunidad de React y Supabase

---

Hecho con ❤️ y 🔥 para las Fallas 2026
