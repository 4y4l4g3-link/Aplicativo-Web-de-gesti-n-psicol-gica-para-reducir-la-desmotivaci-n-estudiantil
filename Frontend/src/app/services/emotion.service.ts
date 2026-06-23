import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Emocion {
  id?: number;
  usuario_id?: number;
  estado: string;
  intensidad: number;
  notas?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface EmotionResponse {
  mensaje: string;
  emocion: Emocion;
}

@Injectable({
  providedIn: 'root'
})
export class EmotionService {
  private apiUrl = 'https://mente-muy-activa.onrender.com/api/emociones';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtener todas las emociones del usuario autenticado
   */
  getEmociones(): Observable<Emocion[]> {
    return this.http.get<Emocion[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Obtener emoción específica
   */
  getEmocion(id: number): Observable<Emocion> {
    return this.http.get<Emocion>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Crear nueva emoción
   */
  crearEmocion(emocion: Emocion): Observable<EmotionResponse> {
    return this.http.post<EmotionResponse>(this.apiUrl, emocion, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Actualizar emoción
   */
  actualizarEmocion(id: number, emocion: Partial<Emocion>): Observable<EmotionResponse> {
    return this.http.put<EmotionResponse>(`${this.apiUrl}/${id}`, emocion, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Eliminar emoción
   */
  eliminarEmocion(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
