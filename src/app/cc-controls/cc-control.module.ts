import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularMaterialModule} from '../angular-material.module';
import {ReactiveFormsModule} from '@angular/forms';

import {CcControlListComponent} from './cc-control-list/cc-control-list.component';
import {CcControlRoutingModule} from './cc-control-routing.module';
import {CcControlCreateComponent} from './cc-control-create/cc-control-create.component';
import {CcControlCaptureComponent} from './cc-control-capture/cc-control-capture.component';
import {CcControlCaptureSheetComponent} from './cc-control-capture/cc-control-capture-sheet/cc-control-capture-sheet-component';

@NgModule({
  declarations: [
    CcControlListComponent,
    CcControlCreateComponent,
    CcControlCaptureComponent,
    CcControlCaptureSheetComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    CcControlRoutingModule
  ]
})
export class CcControlModule {}
