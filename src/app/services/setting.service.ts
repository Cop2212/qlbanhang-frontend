import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private api = environment.apiUrl + '/settings';

  constructor(private http: HttpClient) { }

  getSetting(): Observable<Setting> {
    return this.http.get<Setting>(this.api);
  }

}