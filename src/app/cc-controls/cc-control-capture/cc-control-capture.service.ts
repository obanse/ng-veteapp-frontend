import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Cattle} from '../../cattle/cattle.model';

@Injectable({providedIn: 'root'})
export class CcControlCaptureService {

  private infoSubject = new Subject();
  private messageSource = new BehaviorSubject({ checkEarmarks: 1, checkAge: 1, checkGender: 1, checkBreed: 1,
    checked: false, checkDate: null, lomId: '' });
  currentMessage = this.messageSource.asObservable();

  cattles: Cattle[] = [];
  totalCows = 0;
  tmpTotal = 0;

  constructor() {}

  changeCheckValues(message: {
    checkEarmarks: number,
    checkAge: number,
    checkGender: number,
    checkBreed: number,
    checked: boolean,
    checkDate: Date,
    lomId: string
  }): void {
    this.messageSource.next(message);
  }

  // HELP: https://stackoverflow.com/questions/40313770/how-to-trigger-function-from-one-component-to-another-in-angular2
  newEvent(event): void {
    this.infoSubject.next(event);
  }

  get events$(): Observable<any> {
    return this.infoSubject.asObservable();
  }

  saveCattle(checkResult: { checkEarmarks: number;
                            checkAge: number;
                            checkGender: number;
                            checkBreed: number;
                            checked: boolean;
                            checkDate: Date;
                            lomId: string }) {
    // cattle in array anhand von lom oder lom5 finden
      // wenn nicht gefunden, anlegen und hinzufügen
    // cattle in array speichern/überschreiben
    // counter hochzählen
  }
}
