import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface MicroMeta {
  id: number;
  titulo: string;
  descripcion: string;
  tareas: { id: number; nombre: string; completada: boolean }[];
  completado: number;
  total: number;
  prioridad: 'alta' | 'media' | 'baja';
  fechaLimite: string;
}

@Component({
  selector: 'app-micro-metas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="metas-container">
      <div class="metas-header">
        <div class="header-content">
          <h2>✅ Micro-Metas</h2>
          <p>Divide grandes proyectos en pequeñas victorias</p>
        </div>
        <a routerLink="/dashboard" class="btn-back">← Volver</a>
      </div>

      <div class="metas-content">
        <!-- Form to add new meta -->
        <div class="form-section">
          <h3>Crear Nueva Meta</h3>
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="nuevoTitulo"
              placeholder="Título de la meta (ej: Proyecto de Historia)"
              class="input"
            />
          </div>
          <div class="form-group">
            <textarea 
              [(ngModel)]="nuevoDescripcion"
              placeholder="Descripción de la meta"
              class="textarea"
            ></textarea>
          </div>
          <div class="form-row">
            <select [(ngModel)]="nuevaPrioridad" class="select">
              <option value="alta">🔴 Alta Prioridad</option>
              <option value="media">🟡 Media Prioridad</option>
              <option value="baja">🟢 Baja Prioridad</option>
            </select>
            <input 
              type="date" 
              [(ngModel)]="nuevaFecha"
              class="input"
            />
          </div>
          <button (click)="agregarMeta()" class="btn-agregar">➕ Agregar Meta</button>
        </div>

        <!-- Metas List -->
        <div class="metas-list">
          <h3>Mis Metas</h3>
          
          <div *ngIf="metas().length === 0" class="empty-state">
            <p>No hay metas aún. ¡Crea tu primera meta!</p>
          </div>

          <div *ngFor="let meta of metas()" class="meta-card" [class]="'priority-' + meta.prioridad">
            <div class="meta-header">
              <div>
                <h4>{{ meta.titulo }}</h4>
                <p>{{ meta.descripcion }}</p>
              </div>
              <button (click)="eliminarMeta(meta.id)" class="btn-delete">🗑️</button>
            </div>

            <div class="progress-section">
              <div class="progress-info">
                <span>{{ meta.completado }}/{{ meta.total }} tareas completadas</span>
                <span class="fecha">📅 {{ meta.fechaLimite }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="(meta.completado / meta.total) * 100"></div>
              </div>
            </div>

            <div class="tareas-section">
              <div class="tareas-header">
                <span>📋 Tareas</span>
                <button (click)="toggleTareas(meta.id)" class="btn-toggle">
                  {{ metasExpandidas[meta.id] ? '▼' : '▶' }}
                </button>
              </div>

              <div *ngIf="metasExpandidas[meta.id]" class="tareas-list">
                <div *ngFor="let tarea of meta.tareas" class="tarea-item">
                  <input 
                    type="checkbox" 
                    [checked]="tarea.completada"
                    (change)="toggleTarea(meta.id, tarea.id)"
                    class="checkbox"
                  />
                  <span [class.completada]="tarea.completada">{{ tarea.nombre }}</span>
                </div>

                <div class="add-tarea">
                  <input 
                    type="text" 
                    [(ngModel)]="nuevaTareaInput[meta.id]"
                    placeholder="Añadir nueva tarea..."
                    class="input-tarea"
                  />
                  <button (click)="agregarTarea(meta.id)" class="btn-add-tarea">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .metas-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      padding: 40px 20px;
    }

    .metas-header {
      max-width: 1000px;
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
      background: #4facfe;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-back:hover {
      background: #00f2fe;
    }

    .metas-content {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 30px;
    }

    .form-section {
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }

    .form-section h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .input, .textarea, .select {
      width: 100%;
      padding: 10px;
      border: 2px solid #e0e0e0;
      border-radius: 5px;
      font-size: 14px;
      font-family: Arial, sans-serif;
    }

    .textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .btn-agregar {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-agregar:hover {
      transform: translateY(-2px);
    }

    .metas-list {
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    .metas-list h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }

    .meta-card {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 15px;
      border-left: 5px solid #4facfe;
    }

    .meta-card.priority-alta {
      border-left-color: #e74c3c;
      background: #fff5f5;
    }

    .meta-card.priority-media {
      border-left-color: #f39c12;
      background: #fffaf0;
    }

    .meta-card.priority-baja {
      border-left-color: #27ae60;
      background: #f0fdf4;
    }

    .meta-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .meta-header h4 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .meta-header p {
      margin: 0;
      color: #666;
      font-size: 13px;
    }

    .btn-delete {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      transition: transform 0.2s;
    }

    .btn-delete:hover {
      transform: scale(1.2);
    }

    .progress-section {
      margin-bottom: 15px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
      color: #666;
    }

    .fecha {
      color: #999;
    }

    .progress-bar {
      background: #e0e0e0;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      height: 100%;
      transition: width 0.3s;
    }

    .tareas-section {
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
    }

    .tareas-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .btn-toggle {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #666;
    }

    .tareas-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tarea-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .tarea-item span {
      color: #333;
      font-size: 14px;
    }

    .tarea-item span.completada {
      text-decoration: line-through;
      color: #999;
    }

    .add-tarea {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      border-top: 1px solid #e0e0e0;
      padding-top: 10px;
    }

    .input-tarea {
      flex: 1;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 13px;
    }

    .btn-add-tarea {
      background: #4facfe;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-add-tarea:hover {
      background: #00f2fe;
    }

    @media (max-width: 768px) {
      .metas-content {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MetasComponent {
  metas = signal<MicroMeta[]>([]);
  nuevoTitulo = '';
  nuevoDescripcion = '';
  nuevaPrioridad: 'alta' | 'media' | 'baja' = 'media';
  nuevaFecha = '';
  nuevaTareaInput: { [key: number]: string } = {};
  metasExpandidas: { [key: number]: boolean } = {};

  constructor() {
    this.cargarMetas();
  }

  agregarMeta() {
    if (!this.nuevoTitulo.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    const nuevaMeta: MicroMeta = {
      id: Date.now(),
      titulo: this.nuevoTitulo,
      descripcion: this.nuevoDescripcion,
      tareas: [],
      completado: 0,
      total: 0,
      prioridad: this.nuevaPrioridad,
      fechaLimite: this.nuevaFecha || 'Sin fecha'
    };

    this.metas.set([...this.metas(), nuevaMeta]);
    this.metasExpandidas[nuevaMeta.id] = true;
    this.guardarMetas();

    this.nuevoTitulo = '';
    this.nuevoDescripcion = '';
    this.nuevaPrioridad = 'media';
    this.nuevaFecha = '';
  }

  eliminarMeta(id: number) {
    this.metas.set(this.metas().filter(m => m.id !== id));
    this.guardarMetas();
  }

  toggleTareas(id: number) {
    this.metasExpandidas[id] = !this.metasExpandidas[id];
  }

  agregarTarea(metaId: number) {
    const nombreTarea = this.nuevaTareaInput[metaId]?.trim();
    if (!nombreTarea) return;

    const metas = this.metas();
    const metaIndex = metas.findIndex(m => m.id === metaId);

    if (metaIndex !== -1) {
      const nuevaTarea = {
        id: Date.now(),
        nombre: nombreTarea,
        completada: false
      };

      metas[metaIndex].tareas.push(nuevaTarea);
      metas[metaIndex].total = metas[metaIndex].tareas.length;
      this.metas.set([...metas]);
      this.nuevaTareaInput[metaId] = '';
      this.guardarMetas();
    }
  }

  toggleTarea(metaId: number, tareaId: number) {
    const metas = this.metas();
    const metaIndex = metas.findIndex(m => m.id === metaId);

    if (metaIndex !== -1) {
      const tarea = metas[metaIndex].tareas.find(t => t.id === tareaId);
      if (tarea) {
        tarea.completada = !tarea.completada;
        metas[metaIndex].completado = metas[metaIndex].tareas.filter(t => t.completada).length;
        this.metas.set([...metas]);
        this.guardarMetas();
      }
    }
  }

  guardarMetas() {
    localStorage.setItem('micrometas', JSON.stringify(this.metas()));
  }

  cargarMetas() {
    const saved = localStorage.getItem('micrometas');
    if (saved) {
      const metasData = JSON.parse(saved) as MicroMeta[];
      this.metas.set(metasData);
      metasData.forEach(m => this.metasExpandidas[m.id] = false);
    }
  }
}
