import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Cattle} from '../../cattle/cattle.model';
import {CattleService} from '../../cattle/cattle.service';
import {MatInput} from '@angular/material/input';
import {CcControlCaptureSheetComponent} from './cc-control-capture-sheet/cc-control-capture-sheet-component';
import {CcControlCaptureService} from './cc-control-capture.service';

@Component({
  selector:    'app-cc-control-capture',
  templateUrl: './cc-control-capture.component.html',
  styleUrls:  ['./cc-control-capture.component.css']
})
export class CcControlCaptureComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet,
              private cattleService: CattleService,
              private captureService: CcControlCaptureService
  ) {}

  isLoading = false;

  formControl = new FormControl();
  formGroup: FormGroup;

  cccId: string;
  cattles: Cattle[] = [];
  totalCows = 0;
  tmpTotal = 0;

  @ViewChild('inputLom5') inputLom5: MatInput;
  filteredOptions: Observable<Cattle[]>;

  message: { checkEarmarks: number,
    checkAge: number,
    checkGender: number,
    checkBreed: number,
    checked: boolean,
    checkDate: Date,
    lomId: string
  };

  private cattleSubscription: Subscription;

  getMessage(): string {
    return JSON.stringify(this.message);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe(params => {
      this.cccId = params.get('cccId');
      this.cattleService.getCattlesByCcControl(this.cccId);
    });
    this.cattleSubscription = this.cattleService.getCattleUpdateListener()
      .subscribe(cattleData => {
          this.isLoading = false;
          this.cattles = cattleData.cattles;
          this.totalCows = this.cattles.length;
          console.log(this.cattles);
      });
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filter(value);
      })
    );
    this.formGroup = new FormGroup({
      myControl: this.formControl
    });
    this.captureService.currentMessage.subscribe(message => this.message = message);
    this.captureService.events$.forEach(event => {
      if (event === 'savedCheck') {
        this.inputLom5.value = '';
      }
    });
  }

  ngAfterViewInit(): void {
    // FIX: https://blog.angular-university.io/angular-debugging/
    setTimeout(() => {
      this.inputLom5.focus();
    });
  }

  onCattleEntered(inputLom5: MatInput): void {
    console.log(inputLom5.value);
    this.openBottomSheet();
  }

  onCattlePicked(inputLom5: MatInput): void {
    // use this for sharing data: https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/
    console.log(inputLom5.value);
    this.message.lomId = inputLom5.value;
    this.captureService.changeCheckValues(this.message);
    this.openBottomSheet();
  }

  private openBottomSheet(): void {
    this.bottomSheet.open(CcControlCaptureSheetComponent);
  }

  private _filter(value: string): Cattle[] {
    const tmpCattles: Cattle[] = this.cattles.filter(cattle => {
      return cattle.lom5.toString().indexOf(value) === 0 && !cattle.checked;
    });
    return (tmpCattles.length <= 5 && value.length > 2) ? tmpCattles : [];
  }

  ngOnDestroy(): void {
    this.cattleSubscription.unsubscribe();
  }
}
