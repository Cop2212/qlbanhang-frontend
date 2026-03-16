import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Slider } from '../models/slider';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private api = environment.apiUrl + '/sliders';

  constructor(private http: HttpClient) { }

  getSliders(): Observable<Slider[]> {
    return this.http.get<Slider[]>(this.api);
  }

}