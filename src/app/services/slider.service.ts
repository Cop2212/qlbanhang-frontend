import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Slider } from '../models/slider';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private api = 'http://localhost:8000/api/sliders';

  constructor(private http: HttpClient) { }

  getSliders(): Observable<Slider[]> {
    return this.http.get<Slider[]>(this.api);
  }

}