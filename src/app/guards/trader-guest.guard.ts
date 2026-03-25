import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class TraderGuestGuard implements CanActivate {
    constructor(private router: Router, private auth: AuthService) { }

    canActivate(): boolean {


        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/trader/dashboard']);
            return false;
        }

        return true;
    }
}