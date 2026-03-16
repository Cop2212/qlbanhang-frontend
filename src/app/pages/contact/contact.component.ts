import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingService } from '../../services/setting.service';
import { ConsultationService } from '../../services/consultation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

    this.consultationService.sendConsultation(this.contactForm.value)
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