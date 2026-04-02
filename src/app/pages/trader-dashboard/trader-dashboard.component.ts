import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { TraderService } from '../../services/trader.service';

@Component({
    selector: 'app-trader-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './trader-dashboard.component.html',
    styleUrls: ['./trader-dashboard.component.scss']
})
export class TraderDashboardComponent implements OnInit {

    baseUrl = window.location.origin;

    form: any;

    constructor(
        public auth: AuthService,
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder,
        private traderService: TraderService,
    ) {

        // 🔥 auto redirect nếu logout
        effect(() => {
            if (!this.auth.isLoggedIn()) {
                this.router.navigate(['/trader/login']);
            }
        });

    }

    ngOnInit() {

        this.form = this.fb.group({
            bank_name: ['', Validators.required],
            bank_number: ['', Validators.required],
            bank_owner: ['', Validators.required],
            phone: ['', Validators.required],
        });

        const user = this.auth.user();

        if (user?.profile) {
            this.form.patchValue(user.profile);
        }
    }

    submit() {
        if (this.form.invalid) return;

        this.traderService.updateProfile(this.form.value)
            .subscribe(() => {
                alert('Lưu thành công');
                this.auth.loadUser().subscribe();
            });
    }

    logout() {
        this.auth.logout();
    }

    copyRef() {
        const user = this.auth.user();

        const link = `http://localhost:4200?ref=${user?.ref_code}`;

        navigator.clipboard.writeText(link);
        alert('Đã copy link!');
    }

    goChangePassword() {
        this.router.navigate(['/trader/change-password']);
    }

    getRefLink() {
        const user = this.auth.user();
        return `${this.baseUrl}?ref=${user?.ref_code}`;
    }
}