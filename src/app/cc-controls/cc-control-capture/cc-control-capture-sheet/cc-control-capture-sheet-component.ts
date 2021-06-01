import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {CcControlCaptureService} from '../cc-control-capture.service';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-cc-control-capture-sheet',
  templateUrl: './cc-control-capture-sheet-component.html',
  styleUrls: ['./cc-control-capture-sheet-component.css']
})
export class CcControlCaptureSheetComponent implements OnInit, AfterViewInit {

  @ViewChild('okButton') okButton: MatButton;

  message: {
    checkEarmarks: number,
    checkAge: number,
    checkGender: number,
    checkBreed: number,
    checked: boolean,
    checkDate: Date,
    lomId: string
  };

  constructor(
    private bottomSheet: MatBottomSheetRef<CcControlCaptureSheetComponent>,
    private captureService: CcControlCaptureService
  ) {}

  ngOnInit(): void {
    this.captureService.currentMessage.subscribe(message => this.message = message);
  }

  ngAfterViewInit(): void {
    // FIX: https://blog.angular-university.io/angular-debugging/
    setTimeout(() => {
      this.okButton.focus();
    });
  }

  // TODO: remove!
  getMessage(): string {
    return JSON.stringify(this.message);
  }

  getEarmarkText(): string {
    switch (this.message.checkEarmarks) {
      case 1: return 'Zwei';
      case 2: return 'Eine';
      case 3: return 'Keine';
      default: return 'nicht prüfbar';
    }
  }

  getAgeText(): string {
    switch (this.message.checkAge) {
      case 1: return 'OK';
      case 2: return 'jünger';
      case 3: return 'älter';
      default: return 'nicht prüfbar';
    }
  }

  getGenderText(): string {
    switch (this.message.checkGender) {
      case 1: return 'OK';
      case 2: return 'männlich';
      case 3: return 'weiblich';
      default: return 'nicht prüfbar';
    }
  }

  getBreedText(): string {
    switch (this.message.checkBreed) {
      case 1: return 'plausibel';
      case 2: return 'nicht plausibel';
      default: return 'nicht prüfbar';
    }
  }

  onSavedCheck(): void {
    this.message.checked = true;
    this.message.checkDate = new Date();
    this.captureService.changeCheckValues(this.message);
    this.captureService.saveCattle(this.message);
    this.captureService.newEvent('savedCheck');
    this.bottomSheet.dismiss();
  }

  toggleEarmarkCheck(): void  { (this.message.checkEarmarks < 3)  ? this.message.checkEarmarks++  : this.message.checkEarmarks = 0; }
  toggleAgeCheck(): void      { (this.message.checkAge < 3)       ? this.message.checkAge++       : this.message.checkAge = 0; }
  toggleGenderCheck(): void   { (this.message.checkGender < 3)    ? this.message.checkGender++    : this.message.checkGender = 0; }
  toggleBreedCheck(): void    { (this.message.checkBreed < 2)     ? this.message.checkBreed++     : this.message.checkBreed = 0; }

}
