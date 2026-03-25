import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trader-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, // để dùng formGroup
    RouterModule,         // để dùng routerLink
    CommonModule
  ],
  templateUrl: './trader-login.component.html',
})
export class TraderLoginComponent implements OnInit {

  form!: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // 🔹 email bắt buộc
      password: ['', Validators.required]                  // mật khẩu bắt buộc
    });
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // hiện lỗi nếu submit khi rỗng
      return;
    }

    this.http.post('http://localhost:8000/api/trader/login', this.form.value, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.auth.login(res.access_token);

          this.http.get('http://localhost:8000/api/trader/me')
            .subscribe(() => {
              this.router.navigate(['/trader/dashboard']);
            });
        },
        error: () => alert('Sai tài khoản')
      });
  }
}