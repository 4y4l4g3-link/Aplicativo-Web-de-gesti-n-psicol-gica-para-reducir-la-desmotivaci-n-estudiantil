import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener token del localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  // Si existe token y la URL es de la API, agregar Authorization header
  if (token && req.url.includes('http://localhost:5000')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};