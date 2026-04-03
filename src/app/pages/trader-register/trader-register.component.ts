import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-trader-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './trader-register.component.html',
  styleUrls: ['./trader-register.component.scss']
})
export class TraderRegisterComponent implements OnInit {

  form!: any;
  showPassword = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/)
        ]
      ],
      confirm_password: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  register() {
    if (this.form.invalid) return;

    this.http.post(`${environment.apiUrl}/trader/register`, this.form.value)
      .subscribe({
        next: (res: any) => {
          alert('Đăng ký thành công!');

          // ⚡ Nếu backend không trả token, chuyển sang login
          this.router.navigate(['/trader/login']);
        },
        error: (err) => {
          console.log(err);
          alert(err.error?.message || 'Email đã tồn tại');
        }
      });
  }

  passwordMatchValidator(formGroup: any) {
    return formGroup.get('password')?.value === formGroup.get('confirm_password')?.value
      ? null
      : { notMatch: true };
  }
}