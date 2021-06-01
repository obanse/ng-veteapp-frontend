import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';

import {AuthService} from '../../auth/auth.service';
import {CowsService} from '../cows.service';
import {Cow} from '../cow.model';
import {mimeType} from './mime-type.validator';

@Component({
  selector: 'app-cow-create',
  templateUrl: './cow-create.component.html',
  styleUrls: [ './cow-create.component.css' ]
})
export class CowCreateComponent implements OnInit, OnDestroy {
  cow: Cow;
  isLoading = false;
  form: FormGroup;
  csvFile: string;
  private mode = 'create';
  private cowId: string;
  private authStatusSubscription: Subscription;

  constructor(
    public cowsService: CowsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(() => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      csvFile: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('cowId')) {
        this.mode = 'edit';
        this.cowId = paramMap.get('cowId');
        this.isLoading = true;
        this.cowsService.getCow(this.cowId).subscribe(cowData => {
          this.isLoading = false;
          this.cow = {
            id: cowData._id,
            title: cowData.title,
            content: cowData.content,
            csvPath: cowData.csvPath,
            creator: cowData.creator
          };
          this.form.setValue({
            title: this.cow.title,
            content: this.cow.content,
            csvFile: this.cow.csvPath
          });
        });
      } else {
        this.mode = 'create';
        this.cowId = null;
      }
    });
  }

  onSaveCow(): void {
    if (this.form.invalid) { return; }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.cowsService.addCow(
        this.form.value.title,
        this.form.value.content,
        this.form.value.csvFile
      );
    } else {
      this.cowsService.updateCow(
        this.cowId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.csvFile
      );
    }
    this.form.reset();
  }

  onFilePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ csvFile: file });
    this.form.get('csvFile').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.csvFile = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
