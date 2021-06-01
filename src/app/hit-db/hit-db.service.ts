import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';

const BACKEND_URL = environment.apiUrl + '/hit/';

@Injectable({providedIn: 'root'})
export class HitDbService {
  constructor(private http: HttpClient) {}

  getCompany(bnrId: string): Observable<{ message: string, data: any }> {
    return this.http.get<any>(BACKEND_URL + 'BCFORBP/' + bnrId);
  }

  getBestreg(dateFrom: string, dateTo: string, bnr: string): Observable<any> {
    const from = formatDate(dateFrom, 'ddMMyyyy', 'en');
    const to = formatDate(dateTo, 'ddMMyyyy', 'en');

    const queryParams = `?bnr=${bnr}&dateFrom=${from}&dateTo=${to}`;

    return this.http.get(BACKEND_URL + 'BESTREG' + queryParams);
  }
}
