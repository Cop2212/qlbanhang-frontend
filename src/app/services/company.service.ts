import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    private api = environment.apiUrl + '/company';

    constructor(private http: HttpClient) { }

    getCompany() {
        return this.http.get(this.api);
    }

}