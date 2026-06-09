import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface MicroMeta {
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

export interface MetaResponse {
  mensaje: string;
  meta: MicroMeta;
}

@Injectable({
  providedIn: 'root'
})
export class MicroMetaService {
  private apiUrl = 'http://localhost:5000/api/micro-metas';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtener todas las micro-metas del usuario
   */
  getMetas(): Observable<MicroMeta[]> {
    return this.http.get<MicroMeta[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Obtener micro-meta específica
   */
  getMeta(id: number): Observable<MicroMeta> {
    return this.http.get<MicroMeta>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Crear nueva micro-meta
   */
  crearMeta(meta: MicroMeta): Observable<MetaResponse> {
    return this.http.post<MetaResponse>(this.apiUrl, meta, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Actualizar micro-meta
   */
  actualizarMeta(id: number, meta: Partial<MicroMeta>): Observable<MetaResponse> {
    return this.http.put<MetaResponse>(`${this.apiUrl}/${id}`, meta, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Eliminar micro-meta
   */
  eliminarMeta(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
