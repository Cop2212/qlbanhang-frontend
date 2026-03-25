import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TraderAuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) { }

    canActivate(): Observable<boolean> {

        if (this.auth.isLoggedIn()) {
            return of(true);
        }

        if (!this.auth.isAuthReady()) {
            return this.auth.autoLogin().pipe(
                map(() => {
                    if (this.auth.isLoggedIn()) return true;

                    this.router.navigate(['/trader/login']);
                    return false;
                })
            );
        }

        this.router.navigate(['/trader/login']);
        return of(false);
    }
}