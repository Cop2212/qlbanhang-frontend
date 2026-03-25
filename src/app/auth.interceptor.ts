import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const auth = inject(AuthService);
    const token = auth.getToken();

    const isAuthApi = req.url.includes('/trader');

    let headers: any = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return next(req.clone({
        setHeaders: headers,
        withCredentials: isAuthApi
    })).pipe(
        catchError((error: HttpErrorResponse) => {

            // ✅ chỉ logout khi đã login rồi mà vẫn 401
            if (error.status === 401 && token) {
                auth.forceLogout();
            }

            return throwError(() => error);
        })
    );
};