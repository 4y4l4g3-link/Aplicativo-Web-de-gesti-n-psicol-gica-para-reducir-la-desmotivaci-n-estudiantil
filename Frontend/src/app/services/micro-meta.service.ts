import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface BackendMicroMeta {
  id?: number;
  usuario_id?: number;
  titulo: string;
  descripcion?: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_progreso' | 'completada';
  progreso: number;
  fecha_vencimiento?: string | null;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface MicroMetaViewModel {
  id: number;
  titulo: string;
  descripcion: string;
  tareas: { id: number; nombre: string; completada: boolean }[];
  completado: number;
  total: number;
  prioridad: 'alta' | 'media' | 'baja';
  fechaLimite: string;
}

export interface CreateMicroMetaPayload {
  titulo: string;
  descripcion?: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_progreso' | 'completada';
  progreso: number;
  fecha_vencimiento?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MicroMetaService {
  private readonly apiUrl = 'http://127.0.0.1:5000/api/micro-metas/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getMetas(): Observable<MicroMetaViewModel[]> {
    return this.http.get<BackendMicroMeta[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((metas) => metas.map((meta) => this.mapToViewModel(meta)))
    );
  }

  crearMeta(meta: CreateMicroMetaPayload): Observable<MicroMetaViewModel> {
    return this.http.post<BackendMicroMeta>(this.apiUrl, meta, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((metaCreada) => this.mapToViewModel(metaCreada))
    );
  }

  private mapToViewModel(meta: BackendMicroMeta): MicroMetaViewModel {
    return {
      id: meta.id ?? Date.now(),
      titulo: meta.titulo,
      descripcion: meta.descripcion ?? '',
      tareas: [],
      completado: 0,
      total: 0,
      prioridad: meta.prioridad ?? 'media',
      fechaLimite: this.formatFecha(meta.fecha_vencimiento)
    };
  }

  private formatFecha(fecha: string | null | undefined): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    return fecha.includes('T') ? fecha.split('T')[0] : fecha;
  }
}
