import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private token: string | null = null;
    public isLoggedIn = signal(false);

    private authChecked = false;

    constructor(private http: HttpClient, private router: Router) { }

    login(token: string) {
        this.token = token;
        this.isLoggedIn.set(true);
    }

    logout() {
        this.http.post('http://localhost:8000/api/trader/logout', {}, {
            withCredentials: true
        }).subscribe({
            next: () => { },
            error: () => { },
            complete: () => {
                this.token = null;
                this.isLoggedIn.set(false);
                this.router.navigate(['/trader/login']); // 🔥 thêm dòng này
            }
        });
    }

    getToken() {
        return this.token;
    }

    isAuthReady() {
        return this.authChecked;
    }

    autoLogin() {
        return this.http.post<any>(
            'http://localhost:8000/api/trader/refresh',
            {},
            { withCredentials: true }
        ).pipe(
            tap(res => {
                this.login(res.access_token);
                this.authChecked = true;
            }),
            catchError(() => {
                this.authChecked = true;
                return of(false);
            })
        );
    }

    forceLogout() {
        this.token = null;
        this.isLoggedIn.set(false);
        this.authChecked = true;
        this.router.navigate(['/trader/login']);
    }
}