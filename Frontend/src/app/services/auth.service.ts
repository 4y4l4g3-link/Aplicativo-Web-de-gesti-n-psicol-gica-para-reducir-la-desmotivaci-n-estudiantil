import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: string | number;
  email: string;
  nombre: string;
  rol: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: User;
  token: string;
}

export interface RegisterResponse {
  mensaje: string;
  usuario: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'https://menteactiva-backend.onrender.com/api/auth';
  private readonly tokenKey = 'authToken';
  private readonly userKey = 'currentUser';
  private isAuthenticated = signal(false);
  private currentUser = signal<User | null>(null);
  private authSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      this.restoreSessionFromStorage();
    }
  }

  private restoreSessionFromStorage(): void {
    if (typeof window === 'undefined') return;

    const token = window.localStorage.getItem(this.tokenKey);
    const storedUser = window.localStorage.getItem(this.userKey);

    if (token) {
      this.isAuthenticated.set(true);
      this.authSubject.next(true);

      if (storedUser) {
        try {
          this.currentUser.set(JSON.parse(storedUser));
        } catch {
          this.currentUser.set(null);
        }
      }
    } else {
      this.isAuthenticated.set(false);
      this.currentUser.set(null);
      this.authSubject.next(false);
    }
  }

  /**
   * Registrar nuevo usuario
   * @param email Email del usuario
   * @param nombre Nombre del usuario
   * @param password Contraseña
   */
  register(email: string, nombre: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      email,
      nombre,
      password
    }).pipe(
      tap(response => {
        this.saveAuth(response);
      })
    );
  }

  /**
   * Iniciar sesión - CONECTADO A BACKEND FLASK
   * @param email Email del usuario
   * @param password Contraseña
   */
  login(email: string, password: string): Observable<LoginResponse> {

  console.log('API URL:', `${this.apiUrl}/login`);

  return this.http.post<LoginResponse>(
    `${this.apiUrl}/login`,
    {
      email,
      password
    }
    ).pipe(
      tap(response => {
        this.saveAuth(response);
      })
    );
  }

  /**
   * Guardar autenticación
   */
  private saveAuth(response: LoginResponse | RegisterResponse): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.tokenKey, response.token);
      window.localStorage.setItem(this.userKey, JSON.stringify(response.usuario));
    }

    this.isAuthenticated.set(true);
    this.currentUser.set(response.usuario);
    this.authSubject.next(true);
  }

  /**
   * Cerrar sesión
   */
  logout() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.tokenKey);
      window.localStorage.removeItem(this.userKey);
    }
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.authSubject.next(false);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isLoggedIn() {
    if (this.isAuthenticated()) {
      return true;
    }

    return this.getToken() !== null;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    if (this.currentUser()) {
      return this.currentUser();
    }

    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = window.localStorage.getItem(this.userKey);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }

  /**
   * Observable para cambios de autenticación
   */
  getAuthObservable() {
    return this.authSubject.asObservable();
  }

  /**
   * Obtener token JWT
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  /**
   * Obtener headers con autenticación
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }
}
