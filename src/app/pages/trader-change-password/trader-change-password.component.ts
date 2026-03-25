import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-trader-change-password',
  standalone: true, // 🔥 BẮT BUỘC
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './trader-change-password.component.html',
  styleUrls: ['./trader-change-password.component.scss'],
})
export class TraderChangePassword {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) { }

  form: any;
  showPassword = false;
  showConfirm = false;
  isSubmitting = false;


  ngOnInit() {
    this.form = this.fb.group({
      old_password: ['', Validators.required],
      password: [   // ✅ sửa từ ppassword → password
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/)
        ]
      ],
      password_confirmation: ['', Validators.required]
    }, {
      validators: this.passwordMatch
    });
  }

  submit() {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;

    this.http.post(`${environment.apiUrl}/trader/change-password`, this.form.value)
      .subscribe({
        next: () => {
          alert('Đổi mật khẩu thành công');
          this.isSubmitting = false;
          this.auth.logout();
          this.router.navigate(['/trader/login']);
        },
        error: () => {
          alert('Sai mật khẩu cũ');
          this.isSubmitting = false;
        }
      });
  }

  passwordMatch(group: any) {
    return group.get('password')?.value === group.get('password_confirmation')?.value
      ? null
      : { notMatch: true };
  }
}
