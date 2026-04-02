import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TraderLinkService {

  constructor(private http: HttpClient) { }

  createLink(productId: number, campaign?: string, platform?: string) {
    return this.http.post('/api/trader/links', {
      product_id: productId,
      campaign: campaign,
      platform: platform
    });
  }
}