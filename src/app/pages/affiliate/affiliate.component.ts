import { Component, effect } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-affiliate',
  standalone: true, // ✅ BẮT BUỘC
  imports: [
    RouterModule // nếu có routerLink trong HTML
  ],
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.scss'], // ⚠️ sửa lại số nhiều
})
export class AffiliateComponent {
  constructor(private auth: AuthService, private router: Router) {

    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.router.navigate(['/trader/dashboard']);
      }
    });

  }
}