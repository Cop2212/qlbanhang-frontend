import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TraderService {

    private base = `${environment.apiUrl}/trader`;

    constructor(private http: HttpClient) { }

    getMe() {
        return this.http.get(`${this.base}/me`);
    }

    updateProfile(data: any) {
        return this.http.post(`${this.base}/profile`, data);
    }

    generateLink(product_id: number) {
        return this.http.post(`${this.base}/links`, { product_id });
    }
}