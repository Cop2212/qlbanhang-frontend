import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private api = 'http://localhost:8000/api/settings';

  constructor(private http: HttpClient) { }

  getSetting(): Observable<Setting> {
    return this.http.get<Setting>(this.api);
  }

}