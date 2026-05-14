# 🧠 MenteActiva
## Aplicativo Web de Gestión Psicológica para Reducir la Desmotivación Estudiantil

### 📋 Descripción
**MenteActiva** es una plataforma web diseñada para apoyar a estudiantes en el manejo del estrés académico y la motivación. Proporciona herramientas interactivas para el bienestar emocional y la organización de tareas.

### 🎯 Características Principales

#### 1. **📔 Diario de Emociones**
- Registra tu estado de ánimo diario
- 6 opciones emocionales diferentes
- Escala de intensidad personalizable (1-10)
- Notas opcionales para contexto
- Historial de registros para análisis de patrones

#### 2. **💡 Cápsulas de Motivación**
- Audios/textos cortos inspiradores
- Reflexiones motivacionales
- Contenido para recargar energía antes de estudiar
- Modal detallado con información completa

#### 3. **✅ Micro-Metas**
- Divide proyectos grandes en tareas pequeñas
- Gestión de tareas con checkpoints
- Sistema de prioridades (Alta/Media/Baja)
- Barra de progreso visual
- Persistencia de datos en localStorage

#### 4. **🌡️ Termómetro de Estrés**
- Test rápido de 3 preguntas
- Evaluación del nivel de carga académica
- Recomendaciones personalizadas
- Scoring (Bajo/Moderado/Alto)

### 🛠️ Stack Tecnológico

**Frontend:**
- Angular 21.2.0
- TypeScript 5.9.2
- Standalone Components
- Angular Router con Guards
- Señales de Angular para estado reactivo
- Axios para peticiones HTTP

**Backend:**
- Python 3.x
- Flask
- Flask-CORS
- NumPy, Pandas, Scikit-learn
- Matplotlib, Pillow

**Storage:**
- localStorage para datos locales
- Backend Flask para datos persistentes (configurable)

### 📦 Instalación

#### Frontend
```bash
cd Frontend
npm install
npm start
```
La aplicación estará disponible en `http://localhost:4200`

#### Backend
```bash
pip install -r requirements.txt
python backend.py
```

### 🔐 Autenticación
Credenciales de prueba:
- Email: `test@email.com`
- Contraseña: `1234`

### 🚀 Despliegue

El proyecto está configurado para despliegue en Azure con SSR (Server-Side Rendering).

### 📝 Estructura del Proyecto

```
.
├── Frontend/              # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/    # Componentes principales
│   │   │   ├── services/ # AuthService, etc.
│   │   │   ├── guards/   # AuthGuard
│   │   │   └── app.routes.ts
│   │   └── main.ts
│   └── package.json
├── backend.py            # API Flask
├── requirements.txt      # Dependencias Python
└── README.md
```

### 👥 Contribuyentes
- Creador: [Tu Nombre]

### 📄 Licencia
Este proyecto es de código abierto bajo licencia MIT.

---

**Nota:** Para usar todas las características, asegurate de que tanto el frontend como el backend estén corriendo.
