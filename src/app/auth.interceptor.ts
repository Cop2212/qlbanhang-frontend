import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const auth = inject(AuthService);
    const token = auth.getToken();

    let headers: any = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const isRefreshApi = req.url.includes('/refresh') || req.url.includes('/logout');

    return next(req.clone({
        setHeaders: headers,
        withCredentials: true
    })).pipe(
        catchError((error: HttpErrorResponse) => {

            if (error.status === 401 && token) {
                auth.forceLogout();
            }

            return throwError(() => error);
        })
    );
};