import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('shop-frontend');

  private isRefreshing = false;

  constructor(
    public auth: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.auth.autoLogin().subscribe();
  }

  autoLogin() {
    if (this.isRefreshing) return;
    this.isRefreshing = true;

    this.http.post<any>('http://localhost:8000/api/trader/refresh', {}, {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        this.auth.login(res.access_token);
        this.isRefreshing = false;
      },
      error: () => {
        this.isRefreshing = false;
      }
    });
  }
}