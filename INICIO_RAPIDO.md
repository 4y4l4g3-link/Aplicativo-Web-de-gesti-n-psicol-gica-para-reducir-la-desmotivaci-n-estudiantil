# ⚡ INICIO RÁPIDO

## 1️⃣ Instalación (Primera vez)

```bash
# Navega al directorio del proyecto
cd "c:\Users\yeremi\Videos\Aplicativo Web de gestión psicológica para reducir la desmotivación estudiantil"

# Activa el entorno virtual
.venv\Scripts\activate

# Instala las dependencias
pip install -r requirements.txt
```

## 2️⃣ Ejecutar Backend

```bash
# En una terminal
python backend.py

# Deberías ver:
# * Running on http://127.0.0.1:5000
```

## 3️⃣ Ejecutar Frontend (en otra terminal)

```bash
# Navega a la carpeta Frontend
cd Frontend

# Inicia Angular
npm start

# Deberías ver:
# ✔ Compiled successfully.
# ⠙ Building...
# √ Compiled successfully.
```

## 4️⃣ Acceder a la aplicación

Abre tu navegador en: **http://localhost:4200**

## 5️⃣ Login

Usa estas credenciales:

| Email | Contraseña | Tipo |
|-------|-----------|------|
| `test@email.com` | `1234` | Estudiante |
| `admin@menteactiva.com` | `admin123` | Admin |

---

## 📝 Cambios que completaste

✅ **Backend:**
- `config.py` - Configuración
- `models.py` - Modelos de BD
- `backend.py` - API completa (renovada)
- `requirements.txt` - Dependencias actualizadas

✅ **Frontend Angular:**
- `auth.service.ts` - Actualizado
- `emotion.service.ts` - Nuevo
- `micro-meta.service.ts` - Nuevo
- `stress.service.ts` - Nuevo
- `capsulas.service.ts` - Nuevo

✅ **Documentación:**
- `GUIA_MIGRACION.md`
- `GUIA_ACTUALIZAR_LOGIN.md`
- `RESUMEN_EJECUTIVO.md`
- `INICIO_RAPIDO.md` (este archivo)

---

## 🔍 Comandos útiles

### Ver la base de datos con SQLite
```bash
# Instala sqlite3 si no lo tienes
pip install sqlite3

# O usa una interfaz gráfica:
# https://sqlitebrowser.org/
```

### Detener el backend
```
Presiona: CTRL + C
```

### Detener el frontend
```
Presiona: CTRL + C en la terminal de Angular
```

### Limpiar la base de datos
```bash
# Elimina el archivo y vuelve a ejecutar backend.py
del menteactiva.db
python backend.py
```

---

## ✅ Si todo funciona:

1. Ves el login en `http://localhost:4200` ✅
2. Puedes iniciar sesión ✅
3. Ves el dashboard ✅
4. Puedes crear emociones ✅
5. Puedes crear metas ✅
6. Puedes hacer test de estrés ✅

¡**Felicitaciones! Tu aplicación está lista.** 🎉

