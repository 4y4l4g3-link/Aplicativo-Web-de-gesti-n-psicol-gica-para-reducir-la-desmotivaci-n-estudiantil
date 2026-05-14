import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>🧠 MenteActiva</h1>
          <div class="user-section">
            <span class="user-name">Hola, {{ currentUser?.nombre }}! 👋</span>
            <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="dashboard-title">
          <h2>Tu Panel de Bienestar Estudiantil</h2>
          <p>Elige una opción para comenzar</p>
        </div>

        <div class="menu-grid">
          <a *ngFor="let item of menuItems"
            [routerLink]="item.route"
            class="menu-card"
            [style.borderTopColor]="item.color">
            <div class="card-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <button class="card-button">Ir a {{ item.title }}</button>
          </a>
        </div>
      </main>

      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0;
      font-size: 28px;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-name {
      font-size: 14px;
    }

    .btn-logout {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .dashboard-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .dashboard-title {
      text-align: center;
      margin-bottom: 50px;
    }

    .dashboard-title h2 {
      font-size: 32px;
      margin: 0 0 10px 0;
      color: #333;
    }

    .dashboard-title p {
      color: #666;
      margin: 0;
      font-size: 16px;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      margin-top: 30px;
    }

    .menu-card {
      background: white;
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: all 0.3s;
      border-top: 4px solid;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .menu-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
      font-size: 48px;
      line-height: 1;
    }

    .menu-card h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .menu-card p {
      margin: 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
      flex-grow: 1;
    }

    .card-button {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .card-button:hover {
      background: #764ba2;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
      }

      .user-section {
        flex-direction: column;
        width: 100%;
      }

      .btn-logout {
        width: 100%;
      }

      .menu-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  currentUser: User | null = null;

  menuItems: MenuItem[] = [
    {
      id: 'diario',
      title: 'Diario de Emociones',
      description: 'Registra tu estado de ánimo diario para identificar patrones y mejorar tu enfoque.',
      icon: '😊',
      route: '/diario-emociones',
      color: '#667eea'
    },
    {
      id: 'capsulas',
      title: 'Cápsulas de Motivación',
      description: 'Escucha audios cortos o lee reflexiones para recargar tu energía antes de estudiar.',
      icon: '💡',
      route: '/capsulas-motivacion',
      color: '#f093fb'
    },
    {
      id: 'metas',
      title: 'Micro-Metas',
      description: 'Divide tus trabajos grandes en tareas pequeñas. Cada paso cuenta como una victoria.',
      icon: '✅',
      route: '/micro-metas',
      color: '#4facfe'
    },
    {
      id: 'estres',
      title: 'Termómetro de Estrés',
      description: 'Responde 3 preguntas rápidas para medir tu nivel de carga académica y recibir tips.',
      icon: '🌡️',
      route: '/termometro-estres',
      color: '#fa709a'
    }
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
