import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

import {CcControl} from './cc-control.model';
import {CompanyService} from '../companies/company.service';
import {Company} from '../companies/company.model';
import {HitDbService} from '../hit-db/hit-db.service';
import {CattleService} from '../cattle/cattle.service';

const BACKEND_URL = environment.apiUrl + '/cc-controls/';

@Injectable({providedIn: 'root'})
export class CcControlService {

  private ccControls: CcControl[] = [];
  private ccControlsUpdated = new Subject<{ccControls: CcControl[], countCcControls: number}>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private companyService: CompanyService,
    private hitDbService: HitDbService,
    private cattleService: CattleService
  ) {}

  getCcControlUpdateListener(): Observable<{ccControls: CcControl[], countCcControls: number}> {
    return this.ccControlsUpdated.asObservable();
  }

  add(bnr, dateFrom: any, dateTo: any): void {
    let ccControlData: CcControl;
    console.log(dateFrom);
    this.companyService.get(bnr).subscribe(company => {
      if (company) {
        // Fall 1: Betrieb in Datenbank gefunden
        ccControlData = { bnrId: company._id, firma: company.firma, dateFrom, dateTo,
          hasInventory: false, isStarted: false, isFinished: false };
        this.http.post<{ message: string, ccControl: CcControl }>(BACKEND_URL, ccControlData)
          .subscribe(() => {
            this.router.navigate(['/cc-controls']);
          });
      } else {
        // Fall 2: Betrieb nicht in Datenbank gefunden
        this.companyService.getHitCompany(bnr).subscribe(hitResult => {
          const comp: Company = { ...hitResult.data };
          this.companyService.create(comp).subscribe(companyResult => {
            ccControlData = { bnrId: companyResult.companyId, firma: companyResult.company.firma, dateFrom, dateTo,
              hasInventory: false, isStarted: false, isFinished: false };
            this.http.post(BACKEND_URL, ccControlData).subscribe(() => {
              this.router.navigate((['/cc-controls']));
            });
          });
        });
      }
    });
  }

  getAll(ccControlsPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${ccControlsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, ccControls: any, countCcControls: number}>(
      BACKEND_URL + queryParams)
      .pipe(
        map(ccControlData => {
          return {
            ccControls: ccControlData.ccControls.map(ccControl => {
              return {
                id: ccControl._id,
                bnrId: ccControl.bnrId,
                firma: ccControl.firma,
                dateFrom: ccControl.dateFrom,
                dateTo: ccControl.dateTo,
                hasInventory: ccControl.hasInventory,
                isStarted: ccControl.isStarted,
                isFinished: ccControl.isFinished
              };
            }),
            countCcControls: ccControlData.countCcControls
          };
      }))
      .subscribe(transformedData => {
        this.ccControls = transformedData.ccControls;
        this.ccControlsUpdated.next({
          ccControls: [...this.ccControls],
          countCcControls: transformedData.countCcControls
        });
      });
  }

  get(ccControlId: string): Observable<{ message: string, ccControl: { _id: string, bnrId: string, firma: string,
      dateFrom: string, dateTo: string, hasInventory: boolean, isStarted: boolean, isFinished: boolean } }> {
    return this.http
      .get<{
        message: string,
        ccControl: {
          _id: string,
          bnrId: string,
          firma: string,
          dateFrom: string,
          dateTo: string,
          hasInventory: boolean,
          isStarted: boolean,
          isFinished: boolean
        }
      }>(BACKEND_URL + ccControlId);
  }

  update(cccId: string, bnr: string, dateFrom: any, dateTo: any): void {
    const ccControlData = new FormData();
    ccControlData.append('id', cccId);
    ccControlData.append('bnr', bnr);
    ccControlData.append('dateFrom', dateFrom);
    ccControlData.append('dateTo', dateTo);
    this.http
      .put(BACKEND_URL + cccId, ccControlData)
      .subscribe(() => {
        this.router.navigate(['/cc-controls']);
      });
  }

  remove(ccControlId: string): Observable<{ message: string }> {
    return this.http.delete<{message: string}>(BACKEND_URL + ccControlId);
  }

  getFilter(): string {
    return this.companyService.getFilter();
  }

  setFilter(value: string): void {
    this.companyService.setFilter(value);
  }

  setStart(cccId: string): void {
    let ccControlData: CcControl;
    this.get(cccId).subscribe(getResult => {
      ccControlData = {
        ...getResult.ccControl,
        isStarted: true
      };
      this.http
        .put(BACKEND_URL + cccId, ccControlData)
        .subscribe(result => {
          console.log(result);
          this.router.navigate([`/cc-controls/capture/${cccId}`]);
        });
    });
  }

  setFinish(cccId: string): void {
    let ccControlData: CcControl;
    this.get(cccId).subscribe(getResult => {
      ccControlData = {
        ...getResult.ccControl,
        isFinished: true
      };
      this.http
        .put(BACKEND_URL + cccId, ccControlData)
        .subscribe(result => {
          console.log(result);
          this.getAll(10, 1);
        });
    });
  }

  private setHasInventory(cccId: string): any {
    let ccControlData: CcControl;
    this.get(cccId).subscribe(getResult => {
      ccControlData = {
        ...getResult.ccControl,
        hasInventory: true
      };
      return this.http.put(BACKEND_URL + cccId, ccControlData).subscribe(result => {
        console.log(result);
        this.getAll(10, 1);
      });
    });
  }

  fetchBestreg(cccId: string, dateFrom: string, dateTo: string, bnrId: string): void {
    this.companyService.getById(bnrId).subscribe(companyData => {
      // const bnr = companyData.bnr;
      this.hitDbService.getBestreg(dateFrom, dateTo, companyData.bnr).subscribe(bestreg => {
        // Bestandsregister speichern, in Collection 'cattles' mit Verweis auf 'cccId'
        this.cattleService.saveBestreg(cccId, bestreg).subscribe(result => {
          console.log(result.message + ` (${result.cattlesToSave})`);
          // CC-Kontrolle mit Information ueber Bestandsregister informieren
          this.setHasInventory(cccId);
        });
      });
    });
  }
}
