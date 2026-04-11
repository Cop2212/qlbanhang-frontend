import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingService } from '../../services/setting.service';
import { Setting } from '../../models/setting';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  setting?: Setting;
  contactForm: FormGroup;
  mapUrl: SafeResourceUrl | null = null;

  constructor(
    private settingService: SettingService,
    private fb: FormBuilder,
    private http: HttpClient,
    private titleService: Title,
    private sanitizer: DomSanitizer
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^(03|05|07|08|09)\d{8}$/)]],
      email: ['', [Validators.email]],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.settingService.getSetting().subscribe(res => {
      this.setting = res;
      // Set Browser Title
      if (res.site_name) {
        this.titleService.setTitle(`Liên hệ | ${res.site_name}`);
      }

      // Generate Dynamic Map URL
      if (res.address) {
        const encodedAddress = encodeURIComponent(res.address);
        const url = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    });
  }

  submit() {
    if (this.contactForm.valid) {
      this.http.post(`${environment.apiUrl}/consultations`, this.contactForm.value)
        .subscribe(() => {
          alert('Gửi thông tin thành công!');
          this.contactForm.reset();
        });
    }
  }

}