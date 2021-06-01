import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {AngularMaterialModule} from '../angular-material.module';
import {CompanyListComponent} from './company-list/company-list.component';
import {CompanyRoutingModule} from './company-routing.module';

@NgModule({
  declarations: [
    CompanyListComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    CompanyRoutingModule
  ]
})
export class CompanyModule {}
