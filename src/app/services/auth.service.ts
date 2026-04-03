import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private token: string | null = null;
    public isLoggedIn = signal(false);
    public user = signal<any>(null);

    private authChecked = false;

    constructor(private http: HttpClient, private router: Router) { }

    login(token: string) {
        this.token = token;
        localStorage.setItem('access_token', token);
        this.user.set(null);
        this.isLoggedIn.set(true);
    }

    logout() {
        this.http.post(`${environment.apiUrl}/trader/logout`, {}).subscribe({
            next: () => { },
            error: () => { },
            complete: () => {
                this.token = null;
                this.user.set(null);
                this.isLoggedIn.set(false);
                this.router.navigate(['/trader/login']);
            }
        });
    }

    init() {
        const token = localStorage.getItem('access_token');

        if (token) {
            this.token = token;
            this.isLoggedIn.set(true);
        }
    }

    getToken() {
        if (this.token) return this.token;

        const stored = localStorage.getItem('access_token');
        if (stored) {
            this.token = stored;
        }

        return this.token;
    }

    isAuthReady() {
        return this.authChecked;
    }

    autoLogin() {
        return this.http.post<any>(
            `${environment.apiUrl}/trader/refresh`,
            {},
            { withCredentials: true }
        ).pipe(
            tap(res => {
                this.login(res.access_token);
            }),
            switchMap(() => this.loadUser()),
            tap(() => {
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
        this.user.set(null);
        this.isLoggedIn.set(false);
        this.authChecked = true;
        this.router.navigate(['/trader/login']);
    }

    loadUser() {
        return this.http.get(`${environment.apiUrl}/trader/me`).pipe(
            tap((res: any) => {

                // 🔥 GỘP TẠI ĐÂY
                this.user.set({
                    ...res.user,
                    profile: res.profile,
                    stats: res.stats
                });

            }),
            catchError(() => {
                this.user.set(null);
                return of(null);
            })
        );
    }
}