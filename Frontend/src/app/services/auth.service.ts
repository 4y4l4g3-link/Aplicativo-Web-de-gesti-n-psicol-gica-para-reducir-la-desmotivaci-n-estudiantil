import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = signal(false);
  private currentUser = signal<User | null>(null);
  private authSubject = new BehaviorSubject<boolean>(false);

  constructor() {
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

  login(email: string, password: string) {
    // Simulación de login - en producción conectarías con tu backend
    if (email && password.length >= 4) {
      const user: User = {
        id: '1',
        email: email,
        nombre: email.split('@')[0],
        rol: 'estudiante'
      };
      
      const token = 'fake-jwt-token-' + Date.now();
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      this.isAuthenticated.set(true);
      this.currentUser.set(user);
      this.authSubject.next(true);
      
      return true;
    }
    return false;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.authSubject.next(false);
  }

  isLoggedIn() {
    return this.isAuthenticated();
  }

  getCurrentUser() {
    return this.currentUser();
  }

  getAuthObservable() {
    return this.authSubject.asObservable();
  }
}
