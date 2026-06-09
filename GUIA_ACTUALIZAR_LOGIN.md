# 📝 GUÍA: Actualizar login.component.ts para conectarse a Flask

## 🎯 Cambios necesarios en el componente de Login

Tu componente de login actual **NO NECESITA CAMBIAR ESTRUCTURALMENTE**. Solo necesitas actualizar el método `onLogin()`.

### ✨ ANTES (Simulación local)

```typescript
onLogin() {
  this.errorMessage.set('');
  
  if (!this.email || !this.password) {
    this.errorMessage.set('Por favor completa todos los campos');
    return;
  }

  this.isLoading.set(true);

  setTimeout(() => {
    const success = this.authService.login(this.email, this.password);
    
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set('Email o contraseña inválidos');
    }
    
    this.isLoading.set(false);
  }, 500);
}
```

### 🚀 DESPUÉS (Conectado a Flask)

```typescript
onLogin() {
  this.errorMessage.set('');
  
  if (!this.email || !this.password) {
    this.errorMessage.set('Por favor completa todos los campos');
    return;
  }

  this.isLoading.set(true);

  // Llamar al servicio de autenticación (ahora conectado a Flask)
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      // Login exitoso
      this.router.navigate(['/dashboard']);
      this.isLoading.set(false);
    },
    error: (error) => {
      // Manejo de errores
      if (error.status === 401) {
        this.errorMessage.set('Email o contraseña inválidos');
      } else if (error.status === 403) {
        this.errorMessage.set('Usuario inactivo');
      } else {
        this.errorMessage.set('Error en la conexión. Intenta nuevamente.');
      }
      this.isLoading.set(false);
    }
  });
}
```

---

## 📋 Cambios adicionales necesarios

### 1. Agregar HttpClient al módulo

En `main.ts` o `app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
```

### 2. Crear un Interceptor para autenticación

Archivo: `Frontend/src/app/interceptors/auth.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener token del localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  // Si existe token y la URL es de la API, agregar Authorization header
  if (token && req.url.includes('http://localhost:5000')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

### 3. Actualizar el login.component.ts completo

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <h1>🧠 MenteActiva</h1>
          <p>Gesión Psicológica Estudiantil</p>
        </div>
        
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              placeholder="tu@email.com"
              required
              [disabled]="isLoading()"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
              [disabled]="isLoading()"
            />
          </div>

          <button type="submit" class="btn-login" [disabled]="isLoading()">
            {{ isLoading() ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <div *ngIf="errorMessage()" class="error-message">
            {{ errorMessage() }}
          </div>
        </form>

        <div class="footer-login">
          <p>Cuenta de prueba: test@email.com | password: 1234</p>
          <p style="font-size: 11px; margin-top: 10px;">Admin: admin@menteactiva.com | password: admin123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos iguales que antes */
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }

    .logo-section {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo-section h1 {
      font-size: 32px;
      margin: 0;
      color: #333;
    }

    .logo-section p {
      color: #666;
      margin: 10px 0 0 0;
      font-size: 14px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .form-group input {
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 5px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .btn-login {
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-message {
      color: #e74c3c;
      background: #fadbd8;
      padding: 10px;
      border-radius: 5px;
      font-size: 14px;
      text-align: center;
    }

    .footer-login {
      text-align: center;
      margin-top: 20px;
      color: #999;
      font-size: 12px;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.errorMessage.set('');
    
    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);

    // ✅ NUEVO: Llamar a la API Flask
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Login exitoso - navegar al dashboard
        this.router.navigate(['/dashboard']);
        this.isLoading.set(false);
      },
      error: (error) => {
        // Manejar errores de la API
        if (error.status === 401) {
          this.errorMessage.set('Email o contraseña inválidos');
        } else if (error.status === 403) {
          this.errorMessage.set('Usuario inactivo');
        } else if (error.status === 0) {
          this.errorMessage.set('No se puede conectar al servidor. ¿Está Flask ejecutándose en puerto 5000?');
        } else {
          this.errorMessage.set('Error en la conexión. Intenta nuevamente.');
        }
        this.isLoading.set(false);
      }
    });
  }
}
```

---

## 🔍 Cambios en otros componentes

### Dashboard Component
```typescript
// En lugar de:
// const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

// Hacer:
this.currentUser = this.authService.getCurrentUser();
```

### Diario de Emociones
```typescript
import { EmotionService } from '../../services/emotion.service';

// En ngOnInit:
this.emotionService.getEmociones().subscribe({
  next: (emociones) => {
    this.emociones = emociones;
  },
  error: (error) => console.error('Error al cargar emociones:', error)
});

// Para guardar:
this.emotionService.crearEmocion({
  estado: this.selectedEmocion,
  intensidad: this.intensidad,
  notas: this.notas
}).subscribe({
  next: (response) => {
    this.emociones.push(response.emocion);
    // Limpiar formulario
  },
  error: (error) => console.error('Error:', error)
});
```

### Micro-Metas
```typescript
import { MicroMetaService } from '../../services/micro-meta.service';

// En ngOnInit:
this.metaService.getMetas().subscribe({
  next: (metas) => {
    this.metas = metas;
  }
});

// Para crear meta:
this.metaService.crearMeta({
  titulo: this.titulo,
  descripcion: this.descripcion,
  prioridad: this.prioridad,
  estado: 'pendiente',
  progreso: 0
}).subscribe({
  next: (response) => {
    this.metas.push(response.meta);
  }
});
```

### Termómetro de Estrés
```typescript
import { StressService } from '../../services/stress.service';

// Para guardar evaluación:
this.stressService.crearEvaluacion({
  pregunta_1: this.p1,
  pregunta_2: this.p2,
  pregunta_3: this.p3
}).subscribe({
  next: (response) => {
    this.resultadoEvaluacion = response.evaluacion;
    this.mostrarResultado = true;
  }
});
```

### Cápsulas de Motivación
```typescript
import { CapsulasService } from '../../services/capsulas.service';

// En ngOnInit:
this.capsulasService.getCapsulas().subscribe({
  next: (capsulas) => {
    this.capsulas = capsulas;
  }
});
```

---

## ⚠️ Importante: CORS

El backend Flask está configurado para aceptar solicitudes desde `http://localhost:4200` (Angular).

Si tienes problemas de CORS, verifica en el backend:
```python
CORS_ORIGINS = ['http://localhost:4200', 'http://localhost:3000']
```

---

## 🧪 Prueba rápida

1. **Iniciar backend:**
   ```bash
   python backend.py
   ```
   Debería ver: `Running on http://127.0.0.1:5000`

2. **Iniciar frontend:**
   ```bash
   cd Frontend
   npm start
   ```
   Debería estar en `http://localhost:4200`

3. **Probar login con:**
   - Email: `test@email.com`
   - Password: `1234`

✅ **Si ves el dashboard**, ¡todo está funcionando!

