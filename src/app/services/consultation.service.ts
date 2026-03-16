import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConsultationService {

    private api = environment.apiUrl + '/consultations';

    constructor(private http: HttpClient) { }

    sendConsultation(data: any): Observable<any> {
        return this.http.post(this.api, data);
    }
}