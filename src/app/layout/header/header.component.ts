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

  constructor(private settingService: SettingService) { }

  ngOnInit(): void {

    this.settingService.getSetting().subscribe(res => {
      this.setting = res;

      const phone = res.phone;

      if (this.isMobile()) {
        this.phoneLink = 'tel:' + phone;
      } else {
        this.phoneLink = 'https://zalo.me/' + phone;
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
    if ((window as any).Tawk_API) {
      (window as any).Tawk_API.maximize();
    }
  }

}