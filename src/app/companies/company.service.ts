import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

import {HitDbService} from '../hit-db/hit-db.service';

import {environment} from '../../environments/environment';
import {Company} from './company.model';

const BACKEND_URL = environment.apiUrl + '/companies/';

@Injectable({providedIn: 'root'})
export class CompanyService {

  private companies: Company[] = [];
  private companiesUpdated = new Subject<{ companies: Company[], countCompanies: number}>();
  private cccFilter = '';

  constructor(private http: HttpClient, private router: Router, private hitDbService: HitDbService) {}

  getCompanyUpdateListener(): Observable<{ companies: Company[], countCompanies: number}> {
    return this.companiesUpdated.asObservable();
  }

  get(bnr: string): Observable<{ _id: string, bnr: string, firma: string, plz: string
            ort: string, ortsteil: string, str: string, telefon: string  }> {
    return this.http
      .get<{
        _id: string,
        bnr: string,
        firma: string,
        plz: string,
        ort: string,
        ortsteil: string,
        str: string,
        telefon: string
      }>(BACKEND_URL + bnr);
  }

  getById(bnrId: string): Observable<{ _id: string, bnr: string, firma: string, plz: string
    ort: string, ortsteil: string, str: string, telefon: string  }> {
    return this.http
      .get<{
        _id: string,
        bnr: string,
        firma: string,
        plz: string,
        ort: string,
        ortsteil: string,
        str: string,
        telefon: string
      }>(BACKEND_URL + '/getById/' + bnrId);
  }

  getAll(companiesPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${companiesPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, companies: any, countCompanies: number}>(
        BACKEND_URL + queryParams)
      .pipe(
        map(companyData => {
          return {
            companies: companyData.companies.map(company => {
              return {
                ...company
              };
            }),
            countCompanies: companyData.countCompanies
          };
      }))
      .subscribe(transformedData => {
        this.companies = transformedData.companies;
        this.companiesUpdated.next({
          companies: [...this.companies],
          countCompanies: transformedData.countCompanies
        });
      });
  }

  add(bnr: string, firma: string, str: string, plz: string, ort: string): void {
    const companyData: Company = { bnr, firma, str, plz, ort, ortsteil: '', telefon: '' };
    this.http
      .post<{ message: string, company: Company }>(
        BACKEND_URL,
        companyData
      )
      .subscribe(() => {
        this.router.navigate(['/companies']);
      });
  }

  create(companyData: Company): Observable<{ message: string, company: Company, companyId: string }> {
    return this.http
      .post<{ message: string, company: Company, companyId: string }>(
        BACKEND_URL,
        companyData
      );
  }

  update(id: string, bnr: string, name: string, street: string, plz: string, city: string): void {
    const companyData = new FormData();
    companyData.append('id', id);
    companyData.append('bnr', bnr);
    companyData.append('name', name);
    companyData.append('street', street);
    companyData.append('plz', plz);
    companyData.append('city', city);
    this.http
      .put(BACKEND_URL + id, companyData)
      .subscribe(() => {
        this.router.navigate(['/companies']);
      });
  }

  remove(companyId: string): Observable<any> {
    return this.http.delete(BACKEND_URL + companyId);
  }

  getHitCompany(bnrId: string): Observable<{ message: string, data: Company }> {
    return this.hitDbService.getCompany(bnrId);
  }

  setFilter(bnr: string): void {
    this.cccFilter = bnr;
  }

  getFilter(): string {
    return this.cccFilter;
  }
}
