import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingService } from '../../services/setting.service';
import { Setting } from '../../models/setting';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartCount: number = 0;
  setting?: Setting;

  phoneLink: string = '';
  isMenuOpen: boolean = false;
  isLoading: boolean = true;

  constructor(private settingService: SettingService) { }

  ngOnInit(): void {

    this.settingService.getSetting().subscribe({
      next: (res) => {
        this.setting = res;
        // Xóa tất cả khoảng trắng trong số điện thoại để tạo link chuẩn
        const cleanPhone = res.phone.replace(/\s+/g, '');

        if (this.isMobile()) {
          this.phoneLink = 'tel:' + cleanPhone;
        } else {
          this.phoneLink = 'https://zalo.me/' + cleanPhone;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

  }

  isMobile(): boolean {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi mở menu
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  openChat(): void {
    if (this.setting?.messenger_url) {
      let url = this.setting.messenger_url;
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    } else if (this.setting?.facebook) {
      // Fallback: Trích xuất ID hoặc slug từ link facebook cũ
      const fbLink = this.setting.facebook.replace(/\/$/, "");
      const parts = fbLink.split("/");
      const pageId = parts[parts.length - 1];
      window.open(`https://m.me/${pageId}`, '_blank');
    } else {
      window.open('https://m.me', '_blank');
    }
  }

}