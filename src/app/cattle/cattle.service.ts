import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

import {environment} from '../../environments/environment';
import {Cattle} from './cattle.model';

const BACKEND_URL = environment.apiUrl + '/cattles/';

@Injectable({ providedIn: 'root' })
export class CattleService {

  private cattlesUpdated = new Subject<{ cattles: Cattle[], countCattles: number }>();
  private cattles: Cattle[] = [];

  constructor(private http: HttpClient) {}

  getCattleUpdateListener(): Observable<{ cattles: Cattle[], countCattles: number }> {
    return this.cattlesUpdated.asObservable();
  }

  getCattles(): Observable<any> {
    return this.http.get<{message: string, cattles: any, countCattles: number}>(BACKEND_URL);
  }

  getCattlesByCcControl(cccId: string): void {
    this.http.get<{message: string, cattles: any, countCattles: number}>(
      BACKEND_URL + 'get/' + cccId)
      .subscribe(cattleData => {
        this.cattles = cattleData.cattles;
        this.cattlesUpdated.next({
          cattles: [...this.cattles],
          countCattles: cattleData.countCattles
        });
      });
  }

  saveBestreg(cccId: string, bestreg: any): Observable<{ message: string, cattlesToSave: number }> {
    const cattles: Cattle[] = bestreg.hitInventory.map(cattle => {
      return {
        lom: cattle.LOM,
        lom5: cattle.LOM5,
        cccId,
        dateGeb: cattle.GEB_DATR,
        gender: cattle.GESCHL_X,
        breed: cattle.RASSE_X,
        omCcc: 0,
        ageCcc: 0,
        genderCcc: 0,
        breedCcc: 0,
        checked: false
      };
    });

    return this.http.post<{ message: string, cattlesToSave: number }>(BACKEND_URL, cattles);
  }

  removeAllByCccId(ccControlId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(BACKEND_URL + ccControlId);
  }
}
