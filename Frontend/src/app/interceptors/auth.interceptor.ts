import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
  const isApiUrl = req.url.includes('http://localhost:5000') || req.url.includes('http://127.0.0.1:5000');

  if (token && isApiUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};