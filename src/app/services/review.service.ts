import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    private api = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // lấy review theo product
    getReviews(productId: number, page: number = 1) {
        return this.http.get(
            `${this.api}/products/${productId}/reviews?page=${page}`
        );
    }

    // gửi review
    createReview(data: any): Observable<any> {
        return this.http.post(`${this.api}/reviews`, data);
    }

}