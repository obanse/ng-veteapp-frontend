import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';
import {Cow} from './cow.model';

const BACKEND_URL = environment.apiUrl + '/cows/';

@Injectable({providedIn: 'root'})
export class CowsService {

  private cows: Cow[] = [];
  private cowsUpdated = new Subject<{ cows: Cow[], countCows: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCowUpdateListener(): Observable<{ cows: Cow[], countCows: number }> {
    return this.cowsUpdated.asObservable();
  }

  getCow(id: string): Observable<{ _id: string, title: string, content: string, csvPath: string, creator: string }> {
    return this.http.get<{ _id: string, title: string, content: string, csvPath: string, creator: string }>(
      BACKEND_URL + id
    );
  }

  getCows(cowsPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${cowsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, cows: any, countCows: number}>(
      BACKEND_URL + queryParams)
      .pipe(
        map(cowData => {
          return {
            cows: cowData.cows.map(cow => {
              return {
                title: cow.title,
                content: cow.content,
                id: cow._id,
                csvPath: cow.csvPath,
                creator: cow.creator
              };
            }),
            countCows: cowData.countCows
          };
      }))
      .subscribe(transformedCowData => {
        this.cows = transformedCowData.cows;
        this.cowsUpdated.next({
          cows: [...this.cows],
          countCows: transformedCowData.countCows
        });
    });
  }

  addCow(title: string, content: string, csvFile: File): void {
    const cowData = new FormData();
    cowData.append('title', title);
    cowData.append('content', content);
    cowData.append('csvFile', csvFile, title);
    console.log(cowData);
    this.http
      .post<{ message: string, cow: Cow }>(
        BACKEND_URL,
        cowData
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updateCow(id: string, title: string, content: string, csvFile: File | string): void {
    let cowData: Cow | FormData;
    if (typeof(csvFile) === 'object') {
      cowData = new FormData();
      cowData.append('id', id);
      cowData.append('title', title);
      cowData.append('content', content);
      cowData.append('csvFile', csvFile, title);
    } else {
      cowData = {
        id,
        title,
        content,
        csvPath: csvFile,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, cowData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deleteCow(cowId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(BACKEND_URL + cowId);
  }

}
