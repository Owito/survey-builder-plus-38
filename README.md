# Sistema de Encuestas Web

Sistema de encuestas web desarrollado como proyecto académico para el curso Desarrollo de Software en Equipo (TSP) del Politécnico Grancolombiano.

## 📋 Descripción

Este sistema permite la creación, aplicación y análisis de encuestas personalizadas dentro de instituciones u organizaciones, aplicando buenas prácticas de ingeniería de software y metodologías ágiles (TSP + SCRUM).

## 🚀 Características Principales

- **Autenticación de usuarios**: Registro e inicio de sesión seguro mediante Lovable Cloud (Supabase)
- **Gestión de encuestas**: Crear, editar, eliminar y publicar encuestas
- **Tipos de preguntas**: 
  - Texto libre
  - Opción múltiple
  - Escala de 1 a 5
- **Respuestas de usuarios**: Sistema para responder encuestas publicadas
- **Reportes y análisis**: Visualización de resultados y exportación a CSV
- **Control de acceso**: Roles de administrador y usuario estándar
- **Diseño responsive**: Adaptable a dispositivos móviles y escritorio

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 con Vite
- **Estilos**: TailwindCSS + shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **Base de datos**: PostgreSQL (mediante Supabase)
- **Autenticación**: Supabase Auth
- **Lenguaje**: JavaScript (JSX)
- **Routing**: React Router v6
- **Gestión de estado**: React Context API

## 📦 Instalación

### Requisitos previos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
cd sistema-encuestas-web
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:

El proyecto utiliza Lovable Cloud, por lo que las variables de entorno ya están configuradas automáticamente en el archivo `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

5. Abrir en el navegador:
```
http://localhost:8080
```

## 🗄️ Estructura de la Base de Datos

El proyecto utiliza las siguientes tablas en Supabase:

### profiles
- `id` (UUID, PK): ID del usuario
- `email` (TEXT): Email del usuario
- `role` (TEXT): Rol del usuario ('admin' | 'user')
- `created_at` (TIMESTAMP): Fecha de creación

### surveys
- `id` (UUID, PK): ID de la encuesta
- `title` (TEXT): Título de la encuesta
- `description` (TEXT): Descripción de la encuesta
- `created_by` (UUID, FK): ID del creador
- `is_published` (BOOLEAN): Estado de publicación
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de actualización

### questions
- `id` (UUID, PK): ID de la pregunta
- `survey_id` (UUID, FK): ID de la encuesta
- `question_text` (TEXT): Texto de la pregunta
- `question_type` (TEXT): Tipo ('text' | 'multiple' | 'scale')
- `options` (TEXT[]): Opciones para preguntas de tipo múltiple
- `order_number` (INTEGER): Orden de la pregunta
- `created_at` (TIMESTAMP): Fecha de creación

### responses
- `id` (UUID, PK): ID de la respuesta
- `survey_id` (UUID, FK): ID de la encuesta
- `question_id` (UUID, FK): ID de la pregunta
- `user_id` (UUID, FK): ID del usuario
- `answer_text` (TEXT): Texto de la respuesta
- `created_at` (TIMESTAMP): Fecha de creación

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Barra de navegación
│   ├── ProtectedRoute.jsx  # Protección de rutas
│   ├── SurveyCard.jsx  # Tarjeta de encuesta
│   ├── QuestionForm.jsx    # Formulario de pregunta
│   └── QuestionList.jsx    # Lista de preguntas
├── pages/              # Páginas de la aplicación
│   ├── Index.tsx       # Página de inicio
│   ├── Auth.jsx        # Autenticación (login/registro)
│   ├── Dashboard.jsx   # Panel principal
│   ├── CreateSurvey.jsx    # Crear encuesta
│   ├── EditSurvey.jsx  # Editar encuesta
│   ├── TakeSurvey.jsx  # Responder encuesta
│   └── Reports.jsx     # Ver resultados
├── context/            # Contextos de React
│   └── AuthContext.jsx # Contexto de autenticación
├── integrations/       # Integraciones externas
│   └── supabase/       # Cliente de Supabase
└── components/ui/      # Componentes de shadcn/ui
```

## 🎨 Diseño del Sistema

El sistema utiliza una paleta de colores institucional del Politécnico Grancolombiano:

- **Azul oscuro**: `#0A1128` (primario)
- **Amarillo**: `#FFFB00` (acento/secundario)
- **Gris claro**: `#F8F9FA` (fondo)

## 👥 Flujo de Usuario

1. **Registro/Login**: El usuario se registra o inicia sesión
2. **Dashboard**: Ve encuestas creadas y encuestas disponibles
3. **Crear Encuesta**: El administrador crea encuestas con preguntas personalizadas
4. **Publicar**: El administrador publica la encuesta para que esté disponible
5. **Responder**: Los usuarios responden las encuestas publicadas
6. **Ver Resultados**: El creador ve los resultados y puede exportarlos a CSV

## 🔐 Seguridad

- **Row Level Security (RLS)**: Todas las tablas tienen políticas RLS configuradas
- **Autenticación segura**: Sistema de autenticación mediante Supabase Auth
- **Validación de permisos**: Verificación de permisos en el frontend y backend
- **Protección de rutas**: Rutas protegidas para usuarios autenticados

## 📊 Funcionalidades Principales

### Para Administradores
- Crear encuestas con múltiples tipos de preguntas
- Editar encuestas existentes
- Publicar/despublicar encuestas
- Ver resultados en formato tabla
- Exportar resultados a CSV
- Ver estadísticas (promedio de respuestas en escalas)

### Para Usuarios
- Responder encuestas publicadas
- Ver historial de respuestas propias
- Interfaz intuitiva y responsive

## 🚧 Extensiones Futuras

El sistema está diseñado de manera modular para facilitar las siguientes extensiones:

- **Gráficos y visualizaciones**: Integrar Chart.js o Recharts para gráficos interactivos
- **Roles avanzados**: Añadir roles como "moderador" con permisos específicos
- **Notificaciones**: Sistema de notificaciones por email cuando se publica una encuesta
- **Plantillas**: Crear plantillas de encuestas predefinidas
- **Preguntas condicionales**: Lógica de salto basada en respuestas
- **Análisis avanzado**: Reportes estadísticos más detallados
- **Múltiples idiomas**: Soporte multiidioma (i18n)

## 📝 Scripts Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de la build de producción
npm run lint         # Ejecutar linter
```

## 🤝 Contribuciones

Este es un proyecto académico. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte del curso de Desarrollo de Software en Equipo del Politécnico Grancolombiano y tiene fines educativos.

## 👨‍💻 Autores

Proyecto desarrollado por estudiantes de Ingeniería de Software del Politécnico Grancolombiano.

## 📞 Soporte

Para preguntas o soporte relacionado con este proyecto académico, contactar al instructor del curso TSP.

---

**Politécnico Grancolombiano - 2024**  
*Ingeniería de Software - Desarrollo de Software en Equipo (TSP)*
