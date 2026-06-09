# 🏗️ ARQUITECTURA DEL SISTEMA - MenteActiva

## 📊 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR WEB (localhost:4200)              │
│                        Angular Application                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   LOGIN      │  │  DASHBOARD   │  │  COMPONENTES │              │
│  │ COMPONENT    │  │  COMPONENT   │  │   VARIOS     │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                  │                  │                      │
│  ┌──────────────────────────────────────────────────┐              │
│  │       SERVICIOS ANGULAR (ActualizADOS)          │              │
│  ├──────────────────────────────────────────────────┤              │
│  │ - auth.service.ts         (Autenticación)       │              │
│  │ - emotion.service.ts      (Emociones)           │              │
│  │ - micro-meta.service.ts   (Metas)               │              │
│  │ - stress.service.ts       (Estrés)              │              │
│  │ - capsulas.service.ts     (Motivación)          │              │
│  └───────────────┬──────────────────────────────────┘              │
│                  │                                                  │
│        ┌─────────────────────┐                                      │
│        │ HttpClient          │                                      │
│        │ + authInterceptor   │                                      │
│        │ (Agrega JWT token)  │                                      │
│        └──────────┬──────────┘                                      │
│                   │                                                  │
└───────────────────┼──────────────────────────────────────────────────┘
                    │ HTTP/REST (Puerto 5000)
                    │ Authorization: Bearer <JWT_TOKEN>
                    │
┌───────────────────┼──────────────────────────────────────────────────┐
│                   ▼                                                   │
│         FLASK API (localhost:5000)                                   │
│         backend.py                                                   │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────┐            │
│  │  RUTAS / ENDPOINTS                                  │            │
│  ├─────────────────────────────────────────────────────┤            │
│  │ POST   /api/auth/login          ✅ Autenticación   │            │
│  │ POST   /api/auth/register       ✅ Registro        │            │
│  │ GET    /api/auth/me             ✅ Usuario actual  │            │
│  │                                                     │            │
│  │ GET    /api/usuarios            ✅ Admin - Listar  │            │
│  │ POST   /api/usuarios            ✅ Admin - Crear   │            │
│  │ PUT    /api/usuarios/<id>       ✅ Admin - Actualizar│          │
│  │ DELETE /api/usuarios/<id>       ✅ Admin - Eliminar│            │
│  │                                                     │            │
│  │ GET    /api/emociones           ✅ Diario         │            │
│  │ POST   /api/emociones           ✅ Nueva emoción  │            │
│  │ PUT    /api/emociones/<id>      ✅ Actualizar     │            │
│  │ DELETE /api/emociones/<id>      ✅ Eliminar       │            │
│  │                                                     │            │
│  │ GET    /api/micro-metas         ✅ Metas          │            │
│  │ POST   /api/micro-metas         ✅ Nueva meta     │            │
│  │ PUT    /api/micro-metas/<id>    ✅ Actualizar     │            │
│  │ DELETE /api/micro-metas/<id>    ✅ Eliminar       │            │
│  │                                                     │            │
│  │ GET    /api/evaluaciones-estres ✅ Evaluaciones   │            │
│  │ POST   /api/evaluaciones-estres ✅ Nueva eval.    │            │
│  │                                                     │            │
│  │ GET    /api/capsulas-motivacion ✅ Cápsulas (pub) │            │
│  └────────────────┬────────────────────────────────────┘            │
│                   │                                                  │
│  ┌────────────────▼────────────────┐                                │
│  │  AUTENTICACIÓN & AUTORIZACIÓN   │                                │
│  ├─────────────────────────────────┤                                │
│  │ JWT Token Verification          │                                │
│  │ Rol-based Access Control (RBAC) │                                │
│  │ - administrador                 │                                │
│  │ - estudiante                    │                                │
│  └────────────────┬────────────────┘                                │
│                   │                                                  │
│  ┌────────────────▼────────────────┐                                │
│  │  SQLAlchemy ORM                 │                                │
│  │  (Object-Relational Mapping)    │                                │
│  └────────────────┬────────────────┘                                │
│                   │                                                  │
└───────────────────┼──────────────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│  SQLITE DATABASE: menteactiva.db                                      │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  TABLE: usuarios                                                    │
│  ┌─────────────────────────────────────┐                           │
│  │ id (PK)     | email      | nombre   │                           │
│  │ password_h  | rol        | activo   │                           │
│  │ fecha_crean | fecha_actua            │                           │
│  └─────────────────────────────────────┘                           │
│                                                                       │
│  TABLE: emociones                                                   │
│  ┌─────────────────────────────────────┐                           │
│  │ id (PK)     | usuario_id (FK)       │                           │
│  │ estado      | intensidad (1-10)     │                           │
│  │ notas       | fecha_creacion        │                           │
│  └─────────────────────────────────────┘                           │
│                                                                       │
│  TABLE: micro_metas                                                 │
│  ┌─────────────────────────────────────┐                           │
│  │ id (PK)     | usuario_id (FK)       │                           │
│  │ titulo      | descripcion           │                           │
│  │ prioridad   | estado                │                           │
│  │ progreso    | fecha_vencimiento     │                           │
│  └─────────────────────────────────────┘                           │
│                                                                       │
│  TABLE: evaluaciones_estres                                         │
│  ┌─────────────────────────────────────┐                           │
│  │ id (PK)     | usuario_id (FK)       │                           │
│  │ pregunta_1-3 (1-10)                 │                           │
│  │ puntuacion  | nivel                 │                           │
│  │ recomendacion | fecha_creacion      │                           │
│  └─────────────────────────────────────┘                           │
│                                                                       │
│  TABLE: capsulas_motivacion                                         │
│  ┌─────────────────────────────────────┐                           │
│  │ id (PK)     | titulo                │                           │
│  │ contenido   | tipo (texto/audio)    │                           │
│  │ autor       | archivo_url           │                           │
│  └─────────────────────────────────────┘                           │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE AUTENTICACIÓN

```
┌─────────────────────┐
│  Usuario ingresa    │
│  email + password   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ AuthService.login(email, password)  │
│ POST /api/auth/login                │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Backend valida credenciales         │
│  Busca usuario en BD                 │
│  Verifica contraseña (bcrypt)        │
└──────────┬───────────────────────────┘
           │
        ✅ OK
           │
           ▼
┌──────────────────────────────────────┐
│  Genera JWT token                    │
│  Payload: {usuario_id, exp, iat}     │
│  Signed con SECRET_KEY               │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Respuesta al cliente:               │
│  {                                   │
│    "usuario": {...},                 │
│    "token": "eyJ0eXAi...",           │
│    "mensaje": "Sesión iniciada"      │
│  }                                   │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Frontend guarda en localStorage:    │
│  - authToken: "eyJ0eXAi..."          │
│  - currentUser: {...}                │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  httpInterceptor agrega a cada       │
│  petición:                           │
│  Authorization: Bearer eyJ0eXAi...   │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Backend valida token en cada        │
│  petición:                           │
│  - Verifica firma                    │
│  - Comprueba expiración              │
│  - Busca usuario_id                  │
└──────────┬───────────────────────────┘
           │
        ✅ Válido
           │
           ▼
    ✅ Acceso Permitido
       Ejecuta endpoint
```

---

## 🔐 SEGURIDAD EN CAPAS

```
┌─────────────────────────────────────────┐
│ CAPA 1: Cliente (Frontend)              │
│ - HTTPS (en producción)                 │
│ - Token en localStorage                 │
│ - Validación de formularios             │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ CAPA 2: Transporte (HTTP)               │
│ - CORS configurado                      │
│ - Accept solo POST/GET/PUT/DELETE       │
│ - Content-Type validado                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ CAPA 3: Autenticación (JWT)             │
│ - Token firmado                         │
│ - Expiración de 30 días                 │
│ - Validación en cada petición           │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ CAPA 4: Autorización (RBAC)             │
│ - Admin vs Estudiante                   │
│ - Permisos por rol                      │
│ - Restricción de usuarios               │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ CAPA 5: Base de Datos                   │
│ - Contraseñas hasheadas (werkzeug)      │
│ - Relaciones FK                         │
│ - Índices en campos importantes         │
│ - Validaciones en modelos               │
└─────────────────────────────────────────┘
```

---

## 🔗 RELACIONES EN LA BASE DE DATOS

```
usuarios (1) ──────→ (∞) emociones
       │
       ├──────→ (∞) micro_metas
       │
       └──────→ (∞) evaluaciones_estres


Ejemplo de relación:

┌──────────────┐
│   usuarios   │
├──────────────┤
│ id: 1        │  ◄── usuario_id en emociones
│ email: ...   │  ◄── usuario_id en micro_metas
│ nombre: ...  │  ◄── usuario_id en evaluaciones_estres
└──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│  emociones   │  │ micro_metas  │  │ evaluaciones_... │
├──────────────┤  ├──────────────┤  ├──────────────────┤
│ usuario_id:1 │  │ usuario_id:1 │  │ usuario_id: 1    │
│ estado:feliz │  │ titulo:...   │  │ pregunta_1: 8    │
│ intensidad:8 │  │ progreso:50  │  │ pregunta_2: 7    │
└──────────────┘  └──────────────┘  └──────────────────┘
```

---

## 📱 COMPONENTES ANGULAR - CAMBIOS NECESARIOS

```
login.component.ts
├─ Cambio: Usar Observable en lugar de Promise
├─ Método: onLogin() → Observable subscription
└─ Beneficio: Manejo async automático

dashboard.component.ts
├─ Cambio: Obtener usuario del servicio (no localStorage)
├─ Método: getCurrentUser() del AuthService
└─ Beneficio: Usuario siempre sincronizado

diario-emociones.component.ts
├─ Cambio: Inyectar EmotionService
├─ ngOnInit: Llamar getEmociones() en lugar de localStorage
├─ guardar(): Usar crearEmocion() de EmotionService
└─ Beneficio: Datos sincronizados con servidor

micro-metas.component.ts
├─ Cambio: Inyectar MicroMetaService
├─ ngOnInit: Llamar getMetas() en lugar de localStorage
├─ guardar(): Usar crearMeta() de MicroMetaService
├─ actualizar(): Usar actualizarMeta()
└─ Beneficio: Persistencia en servidor

termometro-estres.component.ts
├─ Cambio: Inyectar StressService
├─ Guardar: Usar crearEvaluacion()
├─ Nivel automático: Backend calcula basado en respuestas
└─ Beneficio: Lógica en servidor (más segura)

capsulas-motivacion.component.ts
├─ Cambio: Inyectar CapsulasService
├─ ngOnInit: Llamar getCapsulas() de API
├─ Nota: NO necesita autenticación (público)
└─ Beneficio: Contenido siempre actualizado
```

---

## 🚀 FLUJO DE DATOS PARA CREAR UNA EMOCIÓN

```
Usuario en UI
    │
    ▼
Selecciona emoción + intensidad + notas
    │
    ▼
diario-emociones.component.ts
│
├─ this.emotionService.crearEmocion({
│   estado: 'feliz',
│   intensidad: 8,
│   notas: 'Buen día'
│ })
│
    ▼
emotion.service.ts
│
├─ http.post('/api/emociones', emocion, {
│   headers: authService.getAuthHeaders()
│ })
│
    ▼
httpInterceptor
│
├─ Agrega Authorization: Bearer <TOKEN>
│
    ▼
Flask Backend: POST /api/emociones
│
├─ @token_required verifica JWT
├─ Extrae usuario_id del token
├─ Valida intensidad (1-10)
├─ Crea objeto Emocion en SQLAlchemy
├─ Guarda en menteactiva.db
│
    ▼
Respuesta al cliente:
│
├─ {
│   "mensaje": "Emoción registrada",
│   "emocion": {
│     "id": 1,
│     "estado": "feliz",
│     "intensidad": 8,
│     "notas": "Buen día",
│     "fecha_creacion": "2024-06-09T..."
│   }
│ }
│
    ▼
Frontend recibe respuesta
│
├─ Agrega emoción al array en memoria
├─ UI se actualiza automáticamente
├─ Limpia formulario
│
    ▼
✅ Emoción guardada en servidor y visible en UI
```

---

## 📊 TIPOS DE DATOS

```typescript
// Emoción
{
  id: number,
  usuario_id: number,
  estado: 'muy_feliz' | 'feliz' | 'neutral' | 'triste' | 'muy_triste' | 'ansioso',
  intensidad: number (1-10),
  notas: string,
  fecha_creacion: string (ISO 8601)
}

// MicroMeta
{
  id: number,
  usuario_id: number,
  titulo: string,
  descripcion: string,
  prioridad: 'alta' | 'media' | 'baja',
  estado: 'pendiente' | 'en_progreso' | 'completada',
  progreso: number (0-100),
  fecha_vencimiento: string | null
}

// Evaluación Estrés
{
  id: number,
  usuario_id: number,
  pregunta_1: number (1-10),
  pregunta_2: number (1-10),
  pregunta_3: number (1-10),
  puntuacion_total: number (3-30),
  nivel: 'bajo' | 'moderado' | 'alto',
  recomendacion: string
}

// Usuario
{
  id: number,
  email: string,
  nombre: string,
  rol: 'administrador' | 'estudiante',
  activo: boolean,
  fecha_creacion: string
}
```

---

## 🎯 MAPEO DE REQUISITOS ACADÉMICOS

```
┌─────────────────────────────────────────────────────────────┐
│ REQUISITO ACADÉMICO → IMPLEMENTACIÓN                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Base de datos SQLite                                     │
│    └─ ✅ menteactiva.db (SQLAlchemy + models.py)           │
│                                                             │
│ 2. Tabla usuarios                                           │
│    └─ ✅ class Usuario(db.Model)                           │
│                                                             │
│ 3. Tabla emociones                                          │
│    └─ ✅ class Emocion(db.Model)                           │
│                                                             │
│ 4. Tabla micro_metas                                        │
│    └─ ✅ class MicroMeta(db.Model)                         │
│                                                             │
│ 5. Tabla evaluaciones_estres                                │
│    └─ ✅ class EvaluacionEstres(db.Model)                  │
│                                                             │
│ 6. POST /login                                              │
│    └─ ✅ @app.route('/api/auth/login', methods=['POST'])   │
│                                                             │
│ 7. POST /register                                           │
│    └─ ✅ @app.route('/api/auth/register', methods=['POST']) │
│                                                             │
│ 8. GET /usuarios                                            │
│    └─ ✅ @app.route('/api/usuarios', methods=['GET'])      │
│                                                             │
│ 9. GET /usuarios/<id>                                       │
│    └─ ✅ @app.route('/api/usuarios/<id>', methods=['GET']) │
│                                                             │
│ 10. POST /usuarios                                          │
│     └─ ✅ @app.route('/api/usuarios', methods=['POST'])    │
│                                                             │
│ 11. PUT /usuarios/<id>                                      │
│     └─ ✅ @app.route('/api/usuarios/<id>', methods=['PUT']) │
│                                                             │
│ 12. DELETE /usuarios/<id>                                   │
│     └─ ✅ @app.route('/api/usuarios/<id>', methods=['DELETE']) │
│                                                             │
│ 13. Roles (admin, estudiante)                               │
│     └─ ✅ rol field en Usuario model + @admin_required     │
│                                                             │
│ 14. CRUD emociones                                          │
│     └─ ✅ GET/POST/PUT/DELETE /api/emociones              │
│                                                             │
│ 15. CRUD micro-metas                                        │
│     └─ ✅ GET/POST/PUT/DELETE /api/micro-metas            │
│                                                             │
│ 16. CRUD evaluaciones                                       │
│     └─ ✅ GET/POST /api/evaluaciones-estres               │
│                                                             │
│ 17. Compatibilidad Frontend                                 │
│     └─ ✅ Servicios Angular + HttpClient                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

¡Tu arquitectura está **lista para una aplicación profesional**! 🎉

