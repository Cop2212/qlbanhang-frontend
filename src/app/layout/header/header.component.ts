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
        const phone = res.phone;

        if (this.isMobile()) {
          this.phoneLink = 'tel:' + phone;
        } else {
          this.phoneLink = 'https://zalo.me/' + phone;
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
    if (this.setting?.facebook) {
      // Trích xuất ID hoặc slug từ link facebook (ví dụ: https://facebook.com/myPage -> myPage)
      const fbLink = this.setting.facebook.replace(/\/$/, ""); // Xóa dấu gạch chéo cuối nếu có
      const parts = fbLink.split("/");
      const pageId = parts[parts.length - 1];
      window.open(`https://m.me/${pageId}`, '_blank');
    } else {
      // Fallback nếu chưa cấu hình facebook link
      window.open('https://m.me', '_blank');
    }
  }

}