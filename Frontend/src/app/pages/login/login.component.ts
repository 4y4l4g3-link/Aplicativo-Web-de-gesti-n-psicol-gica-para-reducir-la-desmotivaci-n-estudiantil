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