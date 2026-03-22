import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api = environment.apiUrl + '/products';

  constructor(private http: HttpClient) { }

  getProducts(
    page: number = 1,
    categoryId: number | null = null,
    sort: string = 'default',
    perPage: number = 8
  ): Observable<any> {

    let url = `${this.api}?page=${page}&per_page=${perPage}`;

    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }

    if (sort && sort !== 'default') {
      url += `&sort=${sort}`;
    }

    return this.http.get<any>(url);
  }

  getProductDetail(slug: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${slug}`);
  }

  getFeaturedProducts() {
    return this.http.get(`${this.api}/featured`);
  }

  getBestSeller() {
    return this.http.get(`${this.api}/best-seller`);
  }
}