import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, concat, of, tap, throwError } from 'rxjs';
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
  private readonly apiUrl = 'https://menteactiva-backend.onrender.com/api/dashboard';
  private readonly storageKey = 'dashboardSummary';
  private readonly summarySubject = new BehaviorSubject<DashboardSummary | null>(this.getStoredSummary());

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getSummary(): Observable<DashboardSummary> {
    console.log('[DashboardService] getSummary start', this.summarySubject.getValue());

    const cachedSummary = this.summarySubject.getValue();

    const request$ = this.http.get<DashboardSummary>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap((data) => {
        console.log('[DashboardService] subscribe next', data);
        this.setSummary(data);
      }),
      catchError((error) => {
        console.error('[DashboardService] subscribe error', error);

        if (cachedSummary) {
          console.log('[DashboardService] using cached summary after error', cachedSummary);
          this.setSummary(cachedSummary);
          return of(cachedSummary);
        }

        return throwError(() => error);
      })
    );

    if (cachedSummary) {
      return concat(of(cachedSummary), request$);
    }

    return request$;
  }

  getCurrentSummary(): DashboardSummary | null {
    return this.summarySubject.getValue();
  }

  private setSummary(summary: DashboardSummary): void {
    this.summarySubject.next(summary);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(summary));
    }
  }

  private getStoredSummary(): DashboardSummary | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const stored = window.localStorage.getItem(this.storageKey);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as DashboardSummary;
    } catch {
      return null;
    }
  }
}
