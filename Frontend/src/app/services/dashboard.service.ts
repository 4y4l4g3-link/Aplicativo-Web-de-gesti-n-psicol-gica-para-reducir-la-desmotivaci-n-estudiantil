import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface DashboardSummary {
  emociones: number;
  micro_metas: number;
  micro_metas_completadas: number;
  capsulas: number;
  ultimo_nivel_estres: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = 'http://127.0.0.1:5000/api/dashboard';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getSummary(): Observable<DashboardSummary> {
    // Usa los headers del AuthService (que protege el acceso a localStorage
    // en contexto de servidor/SSR, evitando el ReferenceError que dejaba el
    // dashboard congelado en "Cargando...").
    return this.http.get<DashboardSummary>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
