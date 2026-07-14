import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';

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
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard-shell">
      <aside class="sidebar" [class.sidebar-open]="isMenuOpen">
        <div class="sidebar-header">
          <div class="brand">
            <span class="brand-icon">🧠</span>
            <div>
              <h1>MenteActiva</h1>
              <p>Bienestar estudiantil</p>
            </div>
          </div>
          <button class="sidebar-close" type="button" (click)="toggleMenu()">✕</button>
        </div>

        <nav class="sidebar-nav">
          <a
            *ngFor="let item of menuItems"
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-item"
            (click)="closeMenuOnMobile()"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.title }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-card">
            <p class="greeting">Hola, {{ currentUser?.nombre }}! 👋</p>
            <span class="user-role">Tu espacio de bienestar</span>
          </div>
          <button class="btn-logout" type="button" (click)="logout()">Cerrar Sesión</button>
        </div>
      </aside>

      <div class="mobile-overlay" *ngIf="isMenuOpen" (click)="toggleMenu()"></div>

      <div class="main-content">
        <header class="topbar">
          <button class="menu-toggle" type="button" (click)="toggleMenu()">☰</button>
          <div class="topbar-user">
            <span>Hola, {{ currentUser?.nombre }}! 👋</span>
          </div>
        </header>

        <main class="dashboard-main">
          <section class="welcome-card">
            <div>
              <p class="eyebrow">Panel principal</p>
              <h2>Tu espacio para cuidar tu bienestar</h2>
              <p>Elige una opción para comenzar y mantener tu energía en equilibrio</p>
            </div>
          </section>

          <section class="summary-grid" *ngIf="summary; else loadingSummary">
            <article class="summary-card">
              <div class="summary-icon">😊</div>
              <div>
                <h3>{{ summary.emociones }}</h3>
                <p>Emociones registradas</p>
              </div>
            </article>
            <article class="summary-card">
              <div class="summary-icon">🎯</div>
              <div>
                <h3>{{ summary.micro_metas }}</h3>
                <p>Micro-metas activas</p>
              </div>
            </article>
            <article class="summary-card">
              <div class="summary-icon">✅</div>
              <div>
                <h3>{{ summary.micro_metas_completadas }}</h3>
                <p>Completadas</p>
              </div>
            </article>
            <article class="summary-card">
              <div class="summary-icon">💡</div>
              <div>
                <h3>{{ summary.capsulas }}</h3>
                <p>Cápsulas disponibles</p>
              </div>
            </article>
            <article class="summary-card stress-card">
              <div class="summary-icon">🌡️</div>
              <div>
                <h3>{{ summary.ultimo_nivel_estres }}</h3>
                <p>Último nivel de estrés</p>
              </div>
            </article>
          </section>

          <ng-template #loadingSummary>
            <section class="summary-grid">
              <article class="summary-card" *ngFor="let _ of [1,2,3,4,5]">
                <div class="summary-icon">⏳</div>
                <div>
                  <h3>Cargando...</h3>
                  <p>Actualizando indicadores</p>
                </div>
              </article>
            </section>
          </ng-template>

          <div class="menu-grid">
            <a
              *ngFor="let item of menuItems"
              [routerLink]="item.route"
              class="menu-card"
              [style.borderTopColor]="item.color"
            >
              <div class="card-icon">{{ item.icon }}</div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <span class="card-button">Ir a {{ item.title }}</span>
            </a>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f5f7fb;
      color: #1f2937;
    }

    .dashboard-shell {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
    }

    .sidebar {
      width: 280px;
      min-width: 280px;
      background: linear-gradient(180deg, #4f46e5 0%, #4338ca 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px 18px;
      box-shadow: 8px 0 30px rgba(79, 70, 229, 0.2);
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 10;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      font-size: 28px;
      background: rgba(255, 255, 255, 0.18);
      border-radius: 14px;
      padding: 10px;
    }

    .brand h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    .brand p {
      margin: 2px 0 0;
      font-size: 12px;
      opacity: 0.8;
    }

    .sidebar-close,
    .menu-toggle {
      display: none;
      border: none;
      background: rgba(255, 255, 255, 0.16);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 24px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      color: white;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .nav-item:hover,
    .nav-item.active {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(3px);
    }

    .nav-icon {
      font-size: 20px;
    }

    .sidebar-footer {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .user-card {
      background: rgba(255, 255, 255, 0.16);
      border-radius: 14px;
      padding: 12px;
    }

    .greeting {
      margin: 0 0 4px;
      font-weight: 700;
    }

    .user-role {
      font-size: 12px;
      opacity: 0.85;
    }

    .btn-logout {
      border: none;
      background: white;
      color: #4338ca;
      border-radius: 10px;
      padding: 10px 12px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .btn-logout:hover {
      transform: translateY(-1px);
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    }

    .topbar-user {
      color: #334155;
      font-weight: 600;
    }

    .dashboard-main {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .welcome-card {
      background: white;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: 12px;
      font-weight: 700;
      color: #6366f1;
      margin: 0 0 8px;
    }

    .welcome-card h2 {
      margin: 0 0 8px;
      font-size: 26px;
      color: #111827;
    }

    .welcome-card p {
      margin: 0;
      color: #64748b;
      line-height: 1.6;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }

    .summary-card {
      background: white;
      border-radius: 16px;
      padding: 18px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .summary-icon {
      font-size: 28px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: #eef2ff;
    }

    .summary-card h3 {
      margin: 0 0 4px;
      font-size: 20px;
      color: #111827;
    }

    .summary-card p {
      margin: 0;
      color: #64748b;
      font-size: 13px;
    }

    .stress-card .summary-icon {
      background: #fce7f3;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 18px;
    }

    .menu-card {
      background: white;
      border-radius: 16px;
      padding: 22px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      border-top: 4px solid transparent;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .menu-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
    }

    .card-icon {
      font-size: 36px;
      line-height: 1;
    }

    .menu-card h3 {
      margin: 0;
      font-size: 18px;
      color: #111827;
    }

    .menu-card p {
      margin: 0;
      color: #64748b;
      line-height: 1.5;
      flex: 1;
    }

    .card-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      background: #4338ca;
      color: white;
      padding: 9px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
    }

    .mobile-overlay {
      display: none;
    }

    @media (max-width: 900px) {
      .sidebar {
        position: fixed;
        left: -100%;
        top: 0;
        height: 100vh;
        width: 85vw;
        max-width: 320px;
        transition: left 0.25s ease;
      }

      .sidebar.sidebar-open {
        left: 0;
      }

      .sidebar-close,
      .menu-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .mobile-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.45);
        z-index: 9;
      }

      .main-content {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .dashboard-main {
        padding: 16px;
      }

      .topbar {
        padding: 14px 16px;
      }

      .welcome-card {
        padding: 18px;
      }

      .welcome-card h2 {
        font-size: 22px;
      }

      .summary-grid,
      .menu-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  isMenuOpen = false;
  summary: DashboardSummary | null = null;

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: () => {
        this.summary = {
          emociones: 0,
          micro_metas: 0,
          micro_metas_completadas: 0,
          capsulas: 0,
          ultimo_nivel_estres: 'Sin registros'
        };
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenuOnMobile() {
    if (window.innerWidth <= 900) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
