import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-termometro-estres',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="estres-container">
      <div class="estres-header">
        <div class="header-content">
          <h2>🌡️ Termómetro de Estrés</h2>
          <p>Mide tu nivel de carga académica en 3 preguntas</p>
        </div>
        <a routerLink="/dashboard" class="btn-back">← Volver</a>
      </div>

      <div class="estres-content">
        <div *ngIf="!mostrarResultados()" class="test-section">
          <div class="pregunta-card">
            <div class="pregunta-numero">{{ preguntaActual + 1 }}/3</div>
            <h3>{{ preguntas[preguntaActual] }}</h3>

            <div class="escala-estres">
              <div 
                *ngFor="let nivel of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                class="nivel-btn"
                [class.selected]="respuestas[preguntaActual] === nivel"
                (click)="seleccionarRespuesta(nivel)"
                [style.backgroundColor]="getColorNivel(nivel)"
              >
                {{ nivel }}
              </div>
            </div>

            <div class="escala-labels">
              <span>Muy bajo</span>
              <span>Muy alto</span>
            </div>

            <div class="pregunta-buttons">
              <button 
                (click)="preguntaAnterior()"
                [disabled]="preguntaActual === 0"
                class="btn-nav"
              >
                ← Anterior
              </button>
              <button 
                (click)="siguientePregunta()"
                [disabled]="respuestas[preguntaActual] === null"
                class="btn-nav btn-siguiente"
              >
                {{ preguntaActual === 2 ? 'Ver Resultado' : 'Siguiente' }} →
              </button>
            </div>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="((preguntaActual + 1) / 3) * 100"></div>
            </div>
            <small>{{ preguntaActual + 1 }} de 3 preguntas</small>
          </div>
        </div>

        <!-- Resultados -->
        <div *ngIf="mostrarResultados()" class="resultado-section">
          <div class="resultado-card" [class]="'resultado-' + getNivelEstres()">
            <div class="resultado-icon">{{ getIconoEstres() }}</div>
            <h2>{{ getTituloResultado() }}</h2>
            <div class="puntaje">
              <span class="score">{{ puntajeTotal }}/30</span>
            </div>

            <div class="descripcion-resultado">
              {{ getDescripcionResultado() }}
            </div>

            <div class="recomendaciones">
              <h3>💡 Recomendaciones Personalizadas</h3>
              <ul>
                <li *ngFor="let rec of getRecomendaciones()">{{ rec }}</li>
              </ul>
            </div>

            <div class="action-buttons">
              <button (click)="resetearTest()" class="btn-reset">
                🔄 Hacer Test Nuevamente
              </button>
              <a routerLink="/dashboard" class="btn-back-resultado">
                ← Volver al Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .estres-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      padding: 40px 20px;
    }

    .estres-header {
      max-width: 900px;
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
      background: #fa709a;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-back:hover {
      background: #fee140;
    }

    .estres-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .test-section {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    .pregunta-card {
      margin-bottom: 30px;
    }

    .pregunta-numero {
      display: inline-block;
      background: #fa709a;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .pregunta-card h3 {
      margin: 0 0 30px 0;
      font-size: 22px;
      color: #333;
      line-height: 1.5;
    }

    .escala-estres {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 8px;
      margin-bottom: 20px;
    }

    .nivel-btn {
      padding: 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      color: white;
      transition: all 0.2s;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .nivel-btn:hover {
      transform: scale(1.1);
    }

    .nivel-btn.selected {
      transform: scale(1.2);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .escala-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      color: #666;
      font-size: 12px;
      font-weight: 600;
    }

    .pregunta-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .btn-nav {
      padding: 12px 30px;
      background: #f0f0f0;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-nav:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    .btn-nav:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-siguiente {
      background: #fa709a;
      color: white;
    }

    .btn-siguiente:hover:not(:disabled) {
      background: #fee140;
    }

    .progress-bar-container {
      margin-top: 30px;
    }

    .progress-bar {
      background: #e0e0e0;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
      height: 100%;
      transition: width 0.3s;
    }

    .progress-bar-container small {
      display: block;
      text-align: center;
      margin-top: 10px;
      color: #666;
      font-size: 12px;
    }

    .resultado-section {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .resultado-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      border-top: 5px solid;
    }

    .resultado-bajo {
      border-top-color: #27ae60;
    }

    .resultado-moderado {
      border-top-color: #f39c12;
    }

    .resultado-alto {
      border-top-color: #e74c3c;
    }

    .resultado-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }

    .resultado-card h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 28px;
    }

    .puntaje {
      margin-bottom: 30px;
    }

    .score {
      font-size: 48px;
      font-weight: 700;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .descripcion-resultado {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      color: #555;
      line-height: 1.8;
      font-size: 16px;
    }

    .recomendaciones {
      text-align: left;
      margin: 30px 0;
    }

    .recomendaciones h3 {
      color: #333;
      margin: 0 0 15px 0;
    }

    .recomendaciones ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .recomendaciones li {
      background: #f0f8ff;
      padding: 12px 15px;
      margin-bottom: 10px;
      border-left: 4px solid #4facfe;
      border-radius: 4px;
      color: #333;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    .btn-reset {
      padding: 12px 30px;
      background: #fa709a;
      color: white;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-reset:hover {
      background: #fee140;
    }

    .btn-back-resultado {
      padding: 12px 30px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.3s;
    }

    .btn-back-resultado:hover {
      background: #764ba2;
    }

    @media (max-width: 768px) {
      .escala-estres {
        grid-template-columns: repeat(5, 1fr);
      }

      .pregunta-buttons {
        flex-direction: column;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn-reset, .btn-back-resultado {
        width: 100%;
      }
    }
  `]
})
export class TermometroEstresComponent {
  preguntas = [
    '¿Cuánto estrés académico sientes en este momento?',
    '¿Cuánta carga de tareas tienes que entregar próximamente?',
    '¿Qué tan preocupado estás por tus calificaciones?'
  ];

  preguntaActual = 0;
  respuestas: (number | null)[] = [null, null, null];
  mostrarResultados = signal(false);
  puntajeTotal = 0;

  seleccionarRespuesta(nivel: number) {
    this.respuestas[this.preguntaActual] = nivel;
  }

  siguientePregunta() {
    if (this.respuestas[this.preguntaActual] !== null) {
      if (this.preguntaActual < 2) {
        this.preguntaActual++;
      } else {
        this.calcularResultados();
      }
    }
  }

  preguntaAnterior() {
    if (this.preguntaActual > 0) {
      this.preguntaActual--;
    }
  }

  calcularResultados() {
    this.puntajeTotal = (this.respuestas as number[]).reduce((a, b) => a + b, 0);
    this.mostrarResultados.set(true);
  }

  getNivelEstres(): string {
    if (this.puntajeTotal <= 10) return 'bajo';
    if (this.puntajeTotal <= 20) return 'moderado';
    return 'alto';
  }

  getTituloResultado(): string {
    const nivel = this.getNivelEstres();
    if (nivel === 'bajo') return '✅ Nivel de Estrés Bajo';
    if (nivel === 'moderado') return '⚠️ Nivel de Estrés Moderado';
    return '🔴 Nivel de Estrés Alto';
  }

  getIconoEstres(): string {
    const nivel = this.getNivelEstres();
    if (nivel === 'bajo') return '😊';
    if (nivel === 'moderado') return '😐';
    return '😟';
  }

  getDescripcionResultado(): string {
    const nivel = this.getNivelEstres();
    if (nivel === 'bajo') {
      return 'Excelente. Tu carga de estrés es manejable. Mantén tus buenos hábitos de estudio y bienestar.';
    }
    if (nivel === 'moderado') {
      return 'Tu estrés es moderado. Es importante que tomes medidas para reducirlo. Considera usar las Cápsulas de Motivación y las Micro-Metas para organizar mejor tus tareas.';
    }
    return 'Tu nivel de estrés es alto. Es crucial que busques apoyo. Te recomendamos usar todas las herramientas disponibles en MenteActiva y considerar hablar con un asesor.';
  }

  getRecomendaciones(): string[] {
    const nivel = this.getNivelEstres();
    
    if (nivel === 'bajo') {
      return [
        '✅ Mantén tu rutina de estudios',
        '✅ Sigue registrando tus emociones en el Diario',
        '✅ Dedica tiempo a actividades recreativas',
        '✅ Duerme adecuadamente cada noche'
      ];
    }
    
    if (nivel === 'moderado') {
      return [
        '🎯 Usa Micro-Metas para dividir proyectos grandes',
        '💡 Escucha una Cápsula de Motivación diariamente',
        '📝 Registra tus emociones en el Diario',
        '🧘 Toma descansos de 5-10 minutos cada hora',
        '🤝 Habla con amigos o familia sobre lo que te preocupa'
      ];
    }
    
    return [
      '🆘 Solicita una sesión de asesoría psicológica',
      '💡 Escucha Cápsulas de Motivación varias veces al día',
      '🎯 Crea Micro-Metas pequeñas y alcanzables',
      '📝 Usa el Diario de Emociones para expresar lo que sientes',
      '🧘 Practica técnicas de respiración y meditación',
      '⏰ Organiza un horario con pausas frecuentes',
      '🤝 Busca apoyo de profesionales o mentores'
    ];
  }

  resetearTest() {
    this.preguntaActual = 0;
    this.respuestas = [null, null, null];
    this.mostrarResultados.set(false);
    this.puntajeTotal = 0;
  }

  getColorNivel(nivel: number): string {
    if (nivel <= 3) return '#27ae60'; // Verde
    if (nivel <= 6) return '#f39c12'; // Naranja
    return '#e74c3c'; // Rojo
  }
}
