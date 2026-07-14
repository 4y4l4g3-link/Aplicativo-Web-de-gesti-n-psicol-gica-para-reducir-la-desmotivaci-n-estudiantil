import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface EvaluacionEstres {
  id?: number;
  usuario_id?: number;
  pregunta_1: number;
  pregunta_2: number;
  pregunta_3: number;
  puntuacion_total?: number;
  nivel?: 'bajo' | 'moderado' | 'alto';
  recomendacion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface EvaluacionResponse {
  mensaje?: string;
  evaluacion?: EvaluacionEstres;
}

@Injectable({
  providedIn: 'root'
})
export class StressService {
  private apiUrl = 'http://127.0.0.1:5000/api/evaluaciones-estres/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtener todas las evaluaciones de estrés del usuario
   */
  getEvaluaciones(): Observable<EvaluacionEstres[]> {
    return this.http.get<EvaluacionEstres[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Obtener evaluación específica
   */
  getEvaluacion(id: number): Observable<EvaluacionEstres> {
    return this.http.get<EvaluacionEstres>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Crear nueva evaluación de estrés
   */
  crearEvaluacion(evaluacion: Omit<EvaluacionEstres, 'id' | 'usuario_id' | 'puntuacion_total' | 'nivel' | 'recomendacion'>): Observable<EvaluacionResponse> {
    return this.http.post<EvaluacionResponse>(this.apiUrl, evaluacion, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
