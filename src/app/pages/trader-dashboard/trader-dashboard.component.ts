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
    templateUrl: './trader-dashboard.component.html'
})
export class TraderDashboardComponent implements OnInit {

    profile: any;
    user: any;
    stats: any;

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

        this.loadDashboard();
    }

    loadDashboard() {
        this.traderService.getMe()
            .subscribe((res: any) => {
                this.user = res.user;
                this.profile = res.profile;
                this.stats = res.stats;

                if (this.profile) {
                    this.form.patchValue(this.profile);
                }
            });
    }

    submit() {
        if (this.form.invalid) return;

        this.traderService.updateProfile(this.form.value)
            .subscribe(() => {
                alert('Lưu thành công');
                this.loadDashboard();
            });
    }

    logout() {
        this.auth.logout();
    }

    copyRef() {
        const link = `http://localhost:4200?ref=${this.user?.ref_code}`;
        navigator.clipboard.writeText(link);
        alert('Đã copy link!');
    }
    
    goChangePassword() {
        this.router.navigate(['/trader/change-password']);
    }
}