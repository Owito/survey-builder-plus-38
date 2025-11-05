# Sistema de Encuestas Web

Sistema de encuestas web desarrollado como proyecto académico para el curso Desarrollo de Software en Equipo (TSP) del Politécnico Grancolombiano.

## 📋 Descripción

Este sistema permite la creación, aplicación y análisis de encuestas personalizadas dentro de instituciones u organizaciones, aplicando buenas prácticas de ingeniería de software y metodologías ágiles (TSP + SCRUM).

## 🚀 Características Principales

- **Autenticación de usuarios**: Registro e inicio de sesión seguro mediante Lovable Cloud (Supabase)
- **Sistema de roles**: Tres tipos de usuarios con permisos diferenciados:
  - **Administrador**: Acceso completo, vista de todos los usuarios y estadísticas
  - **Encuestador**: Creación, edición y gestión de encuestas propias
  - **Usuario Respondiente**: Responder encuestas publicadas
- **Gestión de encuestas**: Crear, editar, eliminar y publicar encuestas
- **Tipos de preguntas**: 
  - Texto libre
  - Opción múltiple
  - Escala de 1 a 5
- **Respuestas de usuarios**: Sistema para responder encuestas publicadas
- **Reportes y análisis**: Visualización de resultados y exportación a CSV
- **Control de acceso por rol**: Rutas protegidas según el rol del usuario
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
- `full_name` (TEXT): Nombre completo del usuario
- `created_at` (TIMESTAMP): Fecha de creación

### user_roles (Tabla de seguridad para roles)
- `id` (UUID, PK): ID del registro
- `user_id` (UUID, FK): Referencia al usuario
- `role` (app_role ENUM): Rol del usuario ('administrador' | 'encuestador' | 'respondiente')
- `created_at` (TIMESTAMP): Fecha de asignación del rol

**Nota de seguridad**: Los roles se almacenan en una tabla separada con políticas RLS y funciones SECURITY DEFINER para prevenir ataques de escalada de privilegios.

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
│   ├── ProtectedRoute.jsx  # Protección de rutas básica
│   ├── RoleProtectedRoute.jsx  # Protección de rutas por rol
│   ├── SurveyCard.jsx  # Tarjeta de encuesta
│   ├── QuestionForm.jsx    # Formulario de pregunta
│   └── QuestionList.jsx    # Lista de preguntas
├── pages/              # Páginas de la aplicación
│   ├── Index.tsx       # Página de inicio
│   ├── Auth.jsx        # Autenticación (login/registro con selección de rol)
│   ├── Dashboard.jsx   # Panel principal
│   ├── AdminDashboard.jsx  # Panel de administrador
│   ├── SurveyorDashboard.jsx  # Panel de encuestador
│   ├── RespondentDashboard.jsx  # Panel de respondiente
│   ├── CreateSurvey.jsx    # Crear encuesta
│   ├── EditSurvey.jsx  # Editar encuesta
│   ├── TakeSurvey.jsx  # Responder encuesta
│   └── Reports.jsx     # Ver resultados
├── context/            # Contextos de React
│   └── AuthContext.jsx # Contexto de autenticación con gestión de roles
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

### Registro
1. El usuario completa el formulario de registro con:
   - Nombre completo
   - Email
   - Selección de rol (Administrador, Encuestador o Usuario Respondiente)
   - Contraseña

### Inicio de Sesión y Redirección
- **Administrador** → `/admin/dashboard` (Panel de administración)
- **Encuestador** → `/surveys/dashboard` (Panel de encuestador)
- **Usuario Respondiente** → `/encuestas` (Encuestas disponibles)

### Flujo por Rol

#### Administrador
1. Accede al panel de administración con estadísticas generales
2. Ve lista de usuarios registrados con sus roles
3. Acceso completo a todas las funcionalidades del sistema

#### Encuestador
1. Accede a su panel de encuestas
2. Crea encuestas con preguntas personalizadas
3. Edita y publica sus encuestas
4. Ve resultados y exporta a CSV

#### Usuario Respondiente
1. Ve encuestas publicadas disponibles
2. Responde encuestas
3. Ve indicador de encuestas ya respondidas

## 🔐 Seguridad

- **Row Level Security (RLS)**: Todas las tablas tienen políticas RLS configuradas
- **Autenticación segura**: Sistema de autenticación mediante Supabase Auth
- **Gestión de roles segura**: Roles almacenados en tabla separada (`user_roles`) con:
  - Enum type `app_role` para validación a nivel de base de datos
  - Función `has_role()` con SECURITY DEFINER para evitar recursión en RLS
  - Políticas RLS que previenen escalada de privilegios
- **Validación de permisos**: Verificación de permisos en frontend y backend
- **Protección de rutas por rol**: Componente `RoleProtectedRoute` valida roles antes de renderizar
- **Prevención de ataques**: Arquitectura diseñada para prevenir:
  - Escalada de privilegios
  - Manipulación de roles del lado del cliente
  - Acceso no autorizado a recursos

## 📊 Funcionalidades Principales

### Para Administradores
- **Panel de administración** con estadísticas del sistema:
  - Total de usuarios registrados
  - Total de encuestas creadas
  - Total de respuestas recibidas
- **Vista de usuarios**: Lista de todos los usuarios con sus roles y fechas de registro
- **Acceso completo**: Todas las funcionalidades de encuestadores
- **Supervisión**: Monitoreo completo del sistema

### Para Encuestadores
- **Panel de encuestador** con sus encuestas creadas
- Crear encuestas con múltiples tipos de preguntas:
  - Texto libre
  - Opción múltiple
  - Escala de 1 a 5
- Editar encuestas existentes
- Publicar/despublicar encuestas
- Ver resultados en formato tabla
- Exportar resultados a CSV
- Ver estadísticas (promedio de respuestas en escalas)

### Para Usuarios Respondientes
- **Panel de encuestas** con listado de encuestas disponibles
- Responder encuestas publicadas
- Indicador visual de encuestas ya respondidas
- Ver historial de respuestas propias
- Interfaz intuitiva y responsive

## 🔑 Gestión de Roles

El sistema implementa un robusto sistema de roles con tres niveles de acceso:

### Arquitectura de Roles

#### 1. Enum Type (Base de Datos)
```sql
CREATE TYPE app_role AS ENUM ('administrador', 'encuestador', 'respondiente');
```

#### 2. Tabla user_roles
- Almacena roles separados de la tabla `profiles` por seguridad
- Constraint único por usuario y rol
- Referencia a `auth.users` con `ON DELETE CASCADE`

#### 3. Función SECURITY DEFINER
```sql
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
```
- Previene recursión infinita en RLS
- Ejecuta con privilegios elevados de forma segura
- Valida roles sin exponer lógica al cliente

#### 4. Políticas RLS
- Los usuarios solo pueden ver su propio rol
- Los administradores pueden ver todos los roles
- Validación automática en cada query

### Flujo de Asignación de Roles

1. **Registro**: Usuario selecciona rol en formulario
2. **Metadata**: Rol se envía en `user_metadata` de Supabase Auth
3. **Trigger**: `handle_new_user()` automáticamente:
   - Crea perfil en tabla `profiles`
   - Inserta rol en tabla `user_roles`
4. **Login**: Sistema carga rol desde `user_roles`
5. **Redirección**: Router envía a dashboard según rol

### Protección de Rutas

#### Componente RoleProtectedRoute
```jsx
<RoleProtectedRoute allowedRoles={['administrador', 'encuestador']}>
  <CreateSurvey />
</RoleProtectedRoute>
```

#### Validaciones
- Verifica autenticación primero
- Valida rol contra lista de permitidos
- Redirige automáticamente según rol si no autorizado

### Cómo Extender el Sistema de Roles

#### Agregar un Nuevo Rol
1. **Actualizar Enum**:
```sql
ALTER TYPE app_role ADD VALUE 'nuevo_rol';
```

2. **Actualizar AuthContext.jsx**:
- Agregar lógica de redirección en `signIn()`
- Agregar caso en switch de roles

3. **Crear Dashboard Específico**:
- Nuevo componente (ej: `NuevoRolDashboard.jsx`)
- Agregar ruta en `App.tsx`

4. **Actualizar RoleProtectedRoute**:
- Agregar nuevo rol a `allowedRoles` donde aplique

5. **Actualizar Formulario de Registro**:
- Agregar opción en `<Select>` de `Auth.jsx`

#### Modificar Permisos Existentes
- **Frontend**: Editar array `allowedRoles` en rutas de `App.tsx`
- **Backend**: Actualizar políticas RLS en Supabase
- **Validación**: Usar función `has_role()` en nuevas políticas

### Mejores Prácticas de Seguridad

✅ **SÍ hacer**:
- Almacenar roles en tabla separada
- Usar funciones SECURITY DEFINER para validaciones
- Validar roles tanto en frontend como backend
- Usar RLS en todas las tablas sensibles

❌ **NO hacer**:
- Almacenar roles en localStorage o sessionStorage
- Confiar solo en validaciones de frontend
- Usar el campo `role` de la tabla `profiles` para decisiones de seguridad
- Hardcodear credenciales o roles en el código

## 🚧 Extensiones Futuras

El sistema está diseñado de manera modular para facilitar las siguientes extensiones:

- **Gráficos y visualizaciones**: Integrar Chart.js o Recharts para gráficos interactivos
- **Roles con permisos granulares**: Sistema de permisos específicos por funcionalidad
- **Notificaciones**: Sistema de notificaciones por email cuando se publica una encuesta
- **Plantillas**: Crear plantillas de encuestas predefinidas
- **Preguntas condicionales**: Lógica de salto basada en respuestas
- **Análisis avanzado**: Reportes estadísticos más detallados
- **Múltiples idiomas**: Soporte multiidioma (i18n)
- **Auditoría**: Registro de acciones por usuario para compliance

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

**Politécnico Grancolombiano - 2025**  
*Ingeniería de Software - Desarrollo de Software en Equipo (TSP)*
