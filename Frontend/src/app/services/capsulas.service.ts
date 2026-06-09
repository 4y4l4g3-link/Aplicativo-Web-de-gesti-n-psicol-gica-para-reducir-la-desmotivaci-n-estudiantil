import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Capsula {
  id: number;
  titulo: string;
  contenido: string;
  tipo: 'texto' | 'audio' | 'video';
  duracion_segundos?: number;
  autor?: string;
  archivo_url?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CapsulasService {
  private apiUrl = 'http://localhost:5000/api/capsulas-motivacion';

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las cápsulas de motivación (público)
   */
  getCapsulas(): Observable<Capsula[]> {
    return this.http.get<Capsula[]>(this.apiUrl);
  }

  /**
   * Obtener cápsula específica
   */
  getCapsula(id: number): Observable<Capsula> {
    return this.http.get<Capsula>(`${this.apiUrl}/${id}`);
  }
}
