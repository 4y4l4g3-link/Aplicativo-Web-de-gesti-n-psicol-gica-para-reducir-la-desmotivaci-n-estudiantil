import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Capsula {
  id: number;
  title: string;
  description: string;
  author: string;
  duration: string;
  content: string;
}

@Component({
  selector: 'app-capsulas-motivacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="capsulas-container">
      <div class="capsulas-header">
        <div class="header-content">
          <h2>💡 Cápsulas de Motivación</h2>
          <p>Recargar tu energía en minutos</p>
        </div>
        <a routerLink="/dashboard" class="btn-back">← Volver</a>
      </div>

      <div class="capsulas-content">
        <div class="capsulas-grid">
          <div 
            *ngFor="let capsula of capsulas"
            class="capsula-card"
            (click)="selectCapsula(capsula)"
          >
            <div class="capsula-header">
              <span class="capsula-icon">🎯</span>
              <span class="duration">{{ capsula.duration }}</span>
            </div>
            <h3>{{ capsula.title }}</h3>
            <p>{{ capsula.description }}</p>
            <div class="capsula-footer">
              <small>Por: {{ capsula.author }}</small>
              <button class="btn-play">▶️ Ver</button>
            </div>
          </div>
        </div>

        <!-- Detail View -->
        <div *ngIf="selectedCapsula()" class="capsula-detail">
          <div class="detail-header">
            <button (click)="selectedCapsula.set(null)" class="btn-close">✕</button>
          </div>
          <div class="detail-content">
            <h2>{{ selectedCapsula()!.title }}</h2>
            <div class="detail-meta">
              <span>⏱️ {{ selectedCapsula()!.duration }}</span>
              <span>✍️ {{ selectedCapsula()!.author }}</span>
            </div>
            <div class="detail-body">
              {{ selectedCapsula()!.content }}
            </div>
            <div class="action-buttons">
              <button class="btn-primary">❤️ Me inspiró</button>
              <button class="btn-secondary">📌 Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .capsulas-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 40px 20px;
    }

    .capsulas-header {
      max-width: 1200px;
      margin: 0 auto 40px;
      background: white;
      padding: 20px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    .header-content h2 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .header-content p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .btn-back {
      background: #f5576c;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-back:hover {
      background: #f093fb;
    }

    .capsulas-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
    }

    .capsulas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .capsula-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
    }

    .capsula-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    }

    .capsula-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .capsula-icon {
      font-size: 32px;
    }

    .duration {
      background: #f5576c;
      color: white;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .capsula-card h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 18px;
    }

    .capsula-card p {
      margin: 0 0 15px 0;
      color: #666;
      font-size: 14px;
      flex-grow: 1;
      line-height: 1.5;
    }

    .capsula-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
    }

    .capsula-footer small {
      color: #999;
      font-size: 12px;
    }

    .btn-play {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .btn-play:hover {
      transform: scale(1.05);
    }

    .capsula-detail {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 1000;
    }

    .detail-header {
      position: relative;
    }

    .btn-close {
      position: absolute;
      top: -10px;
      right: -10px;
      background: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .detail-content {
      background: white;
      border-radius: 10px;
      padding: 40px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .detail-content h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .detail-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }

    .detail-body {
      color: #555;
      line-height: 1.8;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
    }

    .btn-primary, .btn-secondary {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    @media (max-width: 768px) {
      .capsulas-grid {
        grid-template-columns: 1fr;
      }

      .detail-content {
        padding: 30px;
        max-height: 90vh;
      }
    }
  `]
})
export class CapsulasMotivacionComponent {
  selectedCapsula = signal<Capsula | null>(null);

  capsulas: Capsula[] = [
    {
      id: 1,
      title: 'El Poder del Comienzo',
      description: 'Descubre cómo empezar es más importante que terminar.',
      author: 'Dr. Motivación',
      duration: '3 min',
      content: `Muchas veces nos paraliza la idea de que debemos ser perfectos desde el inicio. La verdad es que el comienzo es solo el primer paso. Cada estudiante exitoso comenzó de cero. Lo importante es dar ese primer paso, por pequeño que sea. 

Cuando comienzas, generates momentum. Ese movimiento inicial es lo que te llevará al éxito. No esperes a estar "listos", simplemente empieza. La perfección viene después.

Recuerda: Un viaje de mil millas comienza con un solo paso.`
    },
    {
      id: 2,
      title: 'Fracaso, Tu Mejor Maestro',
      description: 'Aprende a ver los errores como oportunidades de crecimiento.',
      author: 'Psic. Laura',
      duration: '4 min',
      content: `El fracaso no es el fin del camino, es parte del camino. Cada error te enseña algo valioso. Los estudiantes más exitosos son aquellos que más han fallado.

La diferencia no está en no fallar, sino en cómo respondes ante el fracaso. ¿Te rindes o intentas nuevamente? Los ganadores siempre eligen la segunda opción.

Tus errores son datos, no definiciones. Úsalos para mejorar.`
    },
    {
      id: 3,
      title: 'Hoy es Tu Día',
      description: 'Motivación pura para conquistar tus metas diarias.',
      author: 'Coach Juan',
      duration: '2 min',
      content: `Hoy es un nuevo día lleno de posibilidades. Las decisiones que tomes hoy formarán la versión de ti del mañana. 

No es sobre el examen de mañana, es sobre quién quieres ser cuando termines este día. Cada acción cuenta. Cada esfuerzo suma.

Eres más capaz de lo que crees. Es hora de mostrárlo.`
    }
  ];

  selectCapsula(capsula: Capsula) {
    this.selectedCapsula.set(capsula);
  }
}
