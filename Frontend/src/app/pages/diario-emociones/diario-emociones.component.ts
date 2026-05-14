import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface EmotionEntry {
  date: string;
  emotion: string;
  level: number;
  notes: string;
}

@Component({
  selector: 'app-diario-emociones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="diario-container">
      <div class="diario-header">
        <div class="header-content">
          <h2>📔 Diario de Emociones</h2>
          <p>Registra cómo te sientes hoy</p>
        </div>
        <a routerLink="/dashboard" class="btn-back">← Volver</a>
      </div>

      <div class="diario-content">
        <!-- Form Section -->
        <div class="form-section">
          <h3>¿Cómo te sientes hoy?</h3>
          
          <div class="form-group">
            <label>Estado emocional</label>
            <div class="emotion-selector">
              <button 
                *ngFor="let emotion of emotions"
                [class.selected]="selectedEmotion() === emotion.value"
                (click)="selectedEmotion.set(emotion.value)"
                class="emotion-btn"
              >
                <span class="emotion-icon">{{ emotion.icon }}</span>
                <span>{{ emotion.label }}</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Nivel de intensidad (1-10)</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              [(ngModel)]="emotionLevel"
              class="slider"
            />
            <span class="level-display">{{ emotionLevel }}/10</span>
          </div>

          <div class="form-group">
            <label>Notas (opcional)</label>
            <textarea 
              [(ngModel)]="emotionNotes"
              placeholder="¿Qué sucedió hoy? ¿Qué te hizo sentir así?"
              class="textarea"
            ></textarea>
          </div>

          <button (click)="saveEntry()" class="btn-save">
            💾 Guardar entrada
          </button>
        </div>

        <!-- History Section -->
        <div class="history-section">
          <h3>Historial de emociones</h3>
          
          <div *ngIf="entries().length === 0" class="empty-state">
            <p>No hay registros aún. ¡Comienza a registrar tus emociones!</p>
          </div>

          <div *ngFor="let entry of entries()" class="entry-card">
            <div class="entry-header">
              <span class="entry-emotion">{{ getEmotionIcon(entry.emotion) }} {{ entry.emotion }}</span>
              <span class="entry-date">{{ entry.date }}</span>
            </div>
            <div class="entry-level">
              <div class="level-bar">
                <div class="level-fill" [style.width.%]="entry.level * 10"></div>
              </div>
              <span>Intensidad: {{ entry.level }}/10</span>
            </div>
            <p *ngIf="entry.notes" class="entry-notes">{{ entry.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .diario-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }

    .diario-header {
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
      background: #667eea;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-back:hover {
      background: #764ba2;
    }

    .diario-content {
      max-width: 900px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .form-section, .history-section {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 10px;
      font-weight: 600;
      color: #333;
    }

    .emotion-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .emotion-btn {
      background: #f0f0f0;
      border: 2px solid transparent;
      padding: 15px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: center;
    }

    .emotion-btn:hover {
      border-color: #667eea;
    }

    .emotion-btn.selected {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .emotion-icon {
      font-size: 24px;
    }

    .slider {
      width: 100%;
      cursor: pointer;
    }

    .level-display {
      display: block;
      text-align: center;
      margin-top: 10px;
      font-weight: 600;
      color: #667eea;
    }

    .textarea {
      width: 100%;
      padding: 10px;
      border: 2px solid #e0e0e0;
      border-radius: 5px;
      font-family: Arial, sans-serif;
      resize: vertical;
      min-height: 100px;
    }

    .btn-save {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-save:hover {
      transform: translateY(-2px);
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }

    .entry-card {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      border-left: 4px solid #667eea;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .entry-emotion {
      font-weight: 600;
      color: #333;
    }

    .entry-date {
      color: #999;
      font-size: 12px;
    }

    .entry-level {
      margin-bottom: 10px;
    }

    .level-bar {
      background: #e0e0e0;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 5px;
    }

    .level-fill {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      height: 100%;
      transition: width 0.3s;
    }

    .entry-notes {
      margin: 10px 0 0 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .diario-content {
        grid-template-columns: 1fr;
      }

      .emotion-selector {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class DiarioEmocionesComponent {
  emotions = [
    { value: 'Feliz', icon: '😊', label: 'Feliz' },
    { value: 'Motivado', icon: '🔥', label: 'Motivado' },
    { value: 'Normal', icon: '😐', label: 'Normal' },
    { value: 'Ansioso', icon: '😰', label: 'Ansioso' },
    { value: 'Triste', icon: '😢', label: 'Triste' },
    { value: 'Estresado', icon: '😣', label: 'Estresado' }
  ];

  selectedEmotion = signal('Feliz');
  emotionLevel = 5;
  emotionNotes = '';
  entries = signal<EmotionEntry[]>([]);

  constructor() {
    this.loadEntries();
  }

  saveEntry() {
    const today = new Date().toLocaleDateString('es-ES');
    const entry: EmotionEntry = {
      date: today,
      emotion: this.selectedEmotion(),
      level: this.emotionLevel,
      notes: this.emotionNotes
    };

    const currentEntries = this.entries();
    this.entries.set([entry, ...currentEntries]);
    
    localStorage.setItem('diarioEntries', JSON.stringify(this.entries()));
    
    this.emotionNotes = '';
    this.emotionLevel = 5;
    
    alert('✅ Entrada guardada correctamente');
  }

  loadEntries() {
    const saved = localStorage.getItem('diarioEntries');
    if (saved) {
      this.entries.set(JSON.parse(saved));
    }
  }

  getEmotionIcon(emotion: string): string {
    const found = this.emotions.find(e => e.value === emotion);
    return found?.icon || '😐';
  }
}
