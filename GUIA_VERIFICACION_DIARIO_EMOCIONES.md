# Guía de Verificación - Diario de Emociones

## Resumen de Cambios Realizados

Se corrigió la integración entre **DiarioEmocionesComponent** (Angular) y **EmotionService** (Backend Flask) para resolver el error "Cannot read properties of undefined (reading 'fecha_creacion')".

### Problemas Solucionados:
- ✅ Formato inconsistente de respuesta del backend
- ✅ Falta de recarga de historial después de guardar
- ✅ Error al acceder a propiedades undefined
- ✅ Emociones que no aparecían inmediatamente en la UI

---

## Instrucciones de Verificación

### PASO 1: Iniciar los servicios

**Terminal 1 - Backend:**
```bash
cd Backend
python run.py
# O si está en otro directorio:
python -m flask run --host=127.0.0.1 --port=5000
```

Deberías ver: `Running on http://127.0.0.1:5000/`

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm start
# O
ng serve
```

Deberías ver: `Local: http://localhost:4200`

---

### PASO 2: Abrir la aplicación en el navegador

1. Ve a `http://localhost:4200`
2. **Abre la Consola de Desarrollador** (F12 o Ctrl+Shift+I)
3. Selecciona la pestaña **"Console"** para ver los logs

---

### PASO 3: Navegar al Diario de Emociones

1. Si no estás autenticado, inicia sesión con:
   - Email: `test@email.com` (o el que registraste)
   - Contraseña: tu contraseña

2. Haz clic en **"📔 Diario de Emociones"** en el dashboard

3. Deberías ver:
   - Formulario para registrar emociones
   - Historial de emociones anteriores (si las hay)

---

### PASO 4: Registrar una nueva emoción

1. **Selecciona un estado emocional** (ej: "Motivado")
2. **Ajusta el nivel de intensidad** (1-10)
3. **(Opcional)** Agrega notas
4. Haz clic en **"💾 Guardar entrada"**

---

### PASO 5: Verificar los logs en la Consola

Deberías ver en orden:

```
Respuesta backend: {
  mensaje: "Emoción creada correctamente",
  emocion: {
    id: 1,
    usuario_id: 1,
    estado: "Motivado",
    intensidad: 7,
    notas: "...",
    fecha_creacion: "2026-07-12T10:30:00.000Z",
    fecha_actualizacion: "2026-07-12T10:30:00.000Z"
  }
}

Emoción recibida: {id: 1, usuario_id: 1, estado: "Motivado", ...}

Entrada mapeada: {
  date: "12/7/2026",
  emotion: "Motivado",
  level: 7,
  notes: "..."
}

Recargando historial...
```

---

### PASO 6: Verificar la UI

**Deberías ver:**
- ✅ **Alert**: "✅ Entrada guardada correctamente"
- ✅ **Historial actualizado**: La nueva emoción aparece al TOP del historial
- ✅ **Formulario limpio**: Se resetea a valores por defecto
- ✅ **Sin errores**: Ningún error en la consola del navegador

**La nueva emoción debe aparecer INMEDIATAMENTE sin necesidad de recargar la página**

---

### PASO 7: Recargar la página (verificación de persistencia)

1. Presiona F5 o recarga la página
2. Vuelve al Diario de Emociones
3. **Verifica**: La emoción que guardaste sigue ahí (persistida en BD)

---

### PASO 8: Ver logs del backend (terminal)

En la terminal donde corre Flask deberías ver:
```
POST /api/emociones/ 201 [...]
```

---

## ✅ Resultado Esperado

| Aspecto | Antes | Después |
|---------|-------|---------|
| Error de `undefined` | ❌ Sí | ✅ No |
| Emociones aparecen inmediato | ❌ No | ✅ Sí |
| Historial se recarga | ❌ No | ✅ Sí |
| Persistencia en BD | ✅ Sí | ✅ Sí (igual) |
| Logs en consola | ❌ No | ✅ Sí |

---

## Solución de Problemas

### Si ves: `Cannot read properties of undefined (reading 'fecha_creacion')`
- ❌ El backend NO devolvió el formato correcto
- ✅ Verifica que el archivo `Backend/app/controllers/emotion_controller.py` tenga el cambio

### Si no ves logs en consola
- Verifica que la Consola de Desarrollador esté abierta (F12)
- Comprueba que los logs no estén filtrados (revisa los filtros de console)

### Si aparece: `POST /api/emociones/ 500`
- Error en el backend
- Revisa los logs de Flask en la terminal

### Si las emociones no persisten después de recargar
- Problema en la BD
- Verifica que SQLite esté funcionando correctamente

---

## Archivos Modificados

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `Backend/app/controllers/emotion_controller.py` | 15-20 | Formato respuesta POST |
| `Frontend/src/app/pages/diario-emociones/diario-emociones.component.ts` | 333-378 | Método saveEntry() |

---

## Próximos Pasos (Opcional)

Los logs de depuración (`console.log`) pueden ser removidos después de verificar que todo funciona:
- Línea: `console.log('Respuesta backend:', response);`
- Línea: `console.log('Emoción recibida:', response.emocion);`
- Línea: `console.log('Entrada mapeada:', nuevaEntrada);`
- Línea: `console.log('Recargando historial...');`

Para mantenerlos: son útiles para debugging futuro, especialmente en producción con límite de logs.
