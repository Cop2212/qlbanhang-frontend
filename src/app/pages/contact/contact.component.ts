import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingService } from '../../services/setting.service';
import { ConsultationService } from '../../services/consultation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  setting: any;
  contactForm!: FormGroup;

  constructor(
    private settingService: SettingService,
    private fb: FormBuilder,
    private consultationService: ConsultationService
  ) { }

  ngOnInit(): void {

    // Lấy setting
    this.settingService.getSetting().subscribe((res: any) => {
      this.setting = res;
    });

    // Regex chuẩn số điện thoại VN
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.contactForm.value,
      product_id: 0, // hoặc optional nếu contact chung
      ref_code: localStorage.getItem('ref_code'),
      trader_id: localStorage.getItem('trader_id'),
      utm_source: localStorage.getItem('utm_source'),
      utm_medium: localStorage.getItem('utm_medium'),
      utm_campaign: localStorage.getItem('utm_campaign'),
    };

    this.consultationService.sendConsultation(payload)
      .subscribe({
        next: () => {
          alert('Gửi liên hệ thành công!');
          this.contactForm.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Gửi thất bại!');
        }
      });
  }
}