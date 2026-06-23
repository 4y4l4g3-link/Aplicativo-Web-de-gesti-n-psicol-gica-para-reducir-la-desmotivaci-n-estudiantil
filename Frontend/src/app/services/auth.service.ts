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
  private apiUrl = 'https://mente-muy-activa.onrender.com/api/auth';
  private isAuthenticated = signal(false);
  private currentUser = signal<User | null>(null);
  private authSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Solo ejecutar en cliente, no en servidor
    if (typeof window !== 'undefined') {
      this.loadAuthState();
    }
  }

  private loadAuthState() {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      this.isAuthenticated.set(true);
      this.currentUser.set(JSON.parse(user));
      this.authSubject.next(true);
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
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.usuario));
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.authSubject.next(false);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isLoggedIn() {
    return this.isAuthenticated();
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.currentUser();
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
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Obtener headers con autenticación
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
