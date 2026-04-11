import { Component, signal, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SettingService } from './services/setting.service';
import { Setting } from './models/setting';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('shop-frontend');

  showScroll = false;
  setting?: Setting;

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.auth.autoLogin().subscribe();

    this.settingService.getSetting().subscribe(res => {
      this.setting = res;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScroll = window.scrollY > 400;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}