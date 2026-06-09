# 📋 GUÍA DE MIGRACIÓN: localStorage → SQLite + Flask

## 🎯 Cambios Realizados en el Backend

### 📦 Archivos Creados/Modificados

#### 1. **`requirements.txt`** ✅
**Cambio:** Actualizado con librerías de base de datos y JWT

**Antes:**
```
flask
flask-cors
pillow
werkzeug
```

**Después:**
```
flask==2.3.3
flask-cors==4.0.0
flask-sqlalchemy==3.0.5
python-dotenv==1.0.0
pyjwt==2.8.0
```

**Propósito:**
- `flask-sqlalchemy`: ORM para manejar SQLite
- `pyjwt`: Generar y verificar tokens JWT para autenticación real
- `python-dotenv`: Cargar variables de entorno

---

#### 2. **`config.py`** ✨ NUEVO
**Propósito:** Centralizar la configuración de la aplicación

**Contenido clave:**
```python
SQLALCHEMY_DATABASE_URI = 'sqlite:///menteactiva.db'  # Base de datos SQLite
SECRET_KEY = 'tu-clave-secreta'                      # Para encriptar tokens
JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)        # Duración del token
UPLOAD_FOLDER = './uploads'                           # Carpeta para archivos
```

**Por qué:** Separar configuración del código hace la app más flexible y segura.

---

#### 3. **`models.py`** ✨ NUEVO
**Propósito:** Definir la estructura de la base de datos SQLite

**Tablas creadas:**

```
📊 USUARIOS
├─ id (PK)
├─ email (único)
├─ nombre
├─ password_hash (encriptada)
├─ rol: 'administrador' | 'estudiante'
├─ activo: true/false
├─ fecha_creacion
└─ fecha_actualizacion

📊 EMOCIONES (Diario)
├─ id (PK)
├─ usuario_id (FK → usuarios)
├─ estado: 'muy_feliz', 'feliz', 'neutral', 'triste', 'muy_triste', 'ansioso'
├─ intensidad: 1-10
├─ notas: texto opcional
├─ fecha_creacion
└─ fecha_actualizacion

📊 MICRO_METAS
├─ id (PK)
├─ usuario_id (FK → usuarios)
├─ titulo
├─ descripcion
├─ prioridad: 'alta' | 'media' | 'baja'
├─ estado: 'pendiente' | 'en_progreso' | 'completada'
├─ progreso: 0-100
├─ fecha_vencimiento
├─ fecha_creacion
└─ fecha_actualizacion

📊 EVALUACIONES_ESTRES
├─ id (PK)
├─ usuario_id (FK → usuarios)
├─ pregunta_1: 1-10
├─ pregunta_2: 1-10
├─ pregunta_3: 1-10
├─ puntuacion_total: suma
├─ nivel: 'bajo' | 'moderado' | 'alto'
├─ recomendacion: texto
├─ fecha_creacion
└─ fecha_actualizacion

📊 CAPSULAS_MOTIVACION
├─ id (PK)
├─ titulo
├─ contenido
├─ tipo: 'texto' | 'audio' | 'video'
├─ duracion_segundos
├─ autor
├─ archivo_url
├─ fecha_creacion
└─ fecha_actualizacion
```

---

#### 4. **`backend.py`** ♻️ MODIFICADO (fue renovado completamente)
**Antes:** 18 líneas simples

**Después:** Backend profesional con:

**A. AUTENTICACIÓN REAL**
```
POST   /api/auth/register          - Registrar usuario nuevo
POST   /api/auth/login             - Iniciar sesión
GET    /api/auth/me                - Obtener datos del usuario actual
```

**B. GESTIÓN DE USUARIOS (ADMIN)**
```
GET    /api/usuarios               - Listar todos los usuarios
GET    /api/usuarios/<id>          - Obtener usuario específico
POST   /api/usuarios               - Crear usuario (admin)
PUT    /api/usuarios/<id>          - Actualizar usuario (admin)
DELETE /api/usuarios/<id>          - Eliminar usuario (admin)
```

**C. DIARIO DE EMOCIONES**
```
GET    /api/emociones              - Listar emociones del usuario
POST   /api/emociones              - Guardar nueva emoción
GET    /api/emociones/<id>         - Obtener emoción específica
PUT    /api/emociones/<id>         - Actualizar emoción
DELETE /api/emociones/<id>         - Eliminar emoción
```

**D. MICRO-METAS**
```
GET    /api/micro-metas            - Listar metas del usuario
POST   /api/micro-metas            - Crear nueva meta
GET    /api/micro-metas/<id>       - Obtener meta específica
PUT    /api/micro-metas/<id>       - Actualizar meta
DELETE /api/micro-metas/<id>       - Eliminar meta
```

**E. EVALUACIONES DE ESTRÉS**
```
GET    /api/evaluaciones-estres    - Listar evaluaciones
POST   /api/evaluaciones-estres    - Crear evaluación
GET    /api/evaluaciones-estres/<id> - Obtener evaluación
```

**F. CÁPSULAS DE MOTIVACIÓN**
```
GET    /api/capsulas-motivacion    - Listar cápsulas (público)
GET    /api/capsulas-motivacion/<id> - Obtener cápsula
```

---

## 🔄 Cambios Necesarios en el Frontend Angular

### 📝 Estrategia de Migración

Tu Frontend Angular **NO NECESITA REHACER NINGUNA PANTALLA**. Solo necesitas actualizar los servicios para conectarlos con la API Flask.

### 1️⃣ **`auth.service.ts`** - MODIFICAR

**Cambio:** De simulación a llamadas reales

**Antes (Simulación):**
```typescript
login(email: string, password: string) {
  // Simulación - solo guarda en localStorage
  const token = 'fake-jwt-token-' + Date.now();
  localStorage.setItem('authToken', token);
}
```

**Después (Real):**
```typescript
import { HttpClient } from '@angular/common/http';

login(email: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(
    'http://localhost:5000/api/auth/login',
    { email, password }
  ).pipe(
    tap(response => {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.usuario));
    })
  );
}
```

**Métodos a agregar:**
```typescript
register(email: string, nombre: string, password: string): Observable<LoginResponse>
logout(): void
getCurrentUser(): Usuario
```

### 2️⃣ **`diario-emociones.component.ts`** - MODIFICAR

**Crear nuevo servicio:** `emotion.service.ts`

```typescript
export class EmotionService {
  private apiUrl = 'http://localhost:5000/api/emociones';

  constructor(private http: HttpClient) {}

  getEmociones(): Observable<Emocion[]> {
    return this.http.get<Emocion[]>(this.apiUrl, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      })
    });
  }

  crearEmocion(emocion: Emocion): Observable<Emocion> {
    return this.http.post<Emocion>(this.apiUrl, emocion, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      })
    });
  }

  actualizarEmocion(id: number, emocion: Emocion): Observable<Emocion>
  eliminarEmocion(id: number): Observable<void>
}
```

**En el componente:**
```typescript
// En lugar de:
// this.emociones = JSON.parse(localStorage.getItem('emociones') || '[]');

// Hacer:
this.emotionService.getEmociones().subscribe(
  emociones => this.emociones = emociones
);
```

### 3️⃣ **`micro-metas.component.ts`** - MODIFICAR

**Crear nuevo servicio:** `micro-meta.service.ts`

```typescript
export class MicroMetaService {
  private apiUrl = 'http://localhost:5000/api/micro-metas';

  // Métodos CRUD
  getMetas(): Observable<MicroMeta[]>
  crearMeta(meta: MicroMeta): Observable<MicroMeta>
  actualizarMeta(id: number, meta: MicroMeta): Observable<MicroMeta>
  eliminarMeta(id: number): Observable<void>
}
```

### 4️⃣ **`termometro-estres.component.ts`** - MODIFICAR

**Crear nuevo servicio:** `stress.service.ts`

```typescript
export class StressService {
  private apiUrl = 'http://localhost:5000/api/evaluaciones-estres';

  crearEvaluacion(evaluacion: EvaluacionEstres): Observable<EvaluacionEstres>
  getEvaluaciones(): Observable<EvaluacionEstres[]>
}
```

### 5️⃣ **`capsulas-motivacion.component.ts`** - MODIFICAR

**Crear nuevo servicio:** `capsulas.service.ts`

```typescript
export class CapsulasService {
  private apiUrl = 'http://localhost:5000/api/capsulas-motivacion';

  getCapsulas(): Observable<Capsula[]>
  getCapsula(id: number): Observable<Capsula>
}
```

### 6️⃣ **`app.config.ts`** o `main.ts`** - AGREGAR HTTPINTERCEPTOR

Para agregar automáticamente el token a todas las peticiones:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};

// En provideHttpClient:
provideHttpClient(withInterceptors([authInterceptor]))
```

---

## 🚀 Pasos para Instalar y Probar

### 1. Instalar dependencias del backend
```bash
cd "c:\Users\yeremi\Videos\Aplicativo Web de gestión psicológica para reducir la desmotivación estudiantil"
python -m pip install -r requirements.txt
```

### 2. Ejecutar backend
```bash
python backend.py
```

**Output esperado:**
```
 * Serving Flask app 'backend'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

**Base de datos:** Se creará automáticamente `menteactiva.db`

### 3. Crear usuarios de prueba

El backend crea automáticamente dos usuarios:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@menteactiva.com` | `admin123` | Administrador |
| `test@email.com` | `1234` | Estudiante |

### 4. Probar endpoints con Postman o cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@email.com",
    "password": "1234"
  }'
```

**Respuesta:**
```json
{
  "mensaje": "Sesión iniciada",
  "usuario": {
    "id": 2,
    "email": "test@email.com",
    "nombre": "Estudiante Test",
    "rol": "estudiante"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 📋 Resumen de Cambios

| Archivo | Cambio | Propósito |
|---------|--------|----------|
| `requirements.txt` | ✅ Actualizado | Agregar librerías de BD y JWT |
| `config.py` | ✨ Nuevo | Configuración centralizada |
| `models.py` | ✨ Nuevo | Estructura de BD con SQLAlchemy |
| `backend.py` | ♻️ Renovado | Backend profesional con 20+ endpoints |
| `auth.service.ts` | 📝 Modificar | Conectar a API Flask |
| `emotion.service.ts` | ✨ Nuevo | Diario de emociones desde API |
| `micro-meta.service.ts` | ✨ Nuevo | Micro-metas desde API |
| `stress.service.ts` | ✨ Nuevo | Evaluaciones de estrés desde API |
| `capsulas.service.ts` | ✨ Nuevo | Cápsulas de motivación desde API |

---

## ✅ Requisitos Académicos - Cumplimiento

- ✅ **Base de datos SQLite:** `menteactiva.db`
- ✅ **Tablas creadas:** usuarios, emociones, micro_metas, evaluaciones_estres
- ✅ **Autenticación real:** POST /login, POST /register con JWT
- ✅ **Gestión administrativa:** GET/POST/PUT/DELETE /usuarios
- ✅ **Roles:** 'administrador', 'estudiante'
- ✅ **Endpoints CRUD:** 5+ para emociones, micro-metas, estrés
- ✅ **Compatibilidad:** Frontend Angular existente sin cambios estructurales
- ✅ **Migración gradual:** Los datos se migran a medida que el usuario usa la app

---

## 🔐 Seguridad

✅ Contraseñas hasheadas con werkzeug  
✅ Autenticación con JWT (30 días validez)  
✅ Validación de permisos por rol  
✅ CORS configurado  
✅ Validaciones de entrada en todos los endpoints  

