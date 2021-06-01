import {NgModule} from '@angular/core';
import {AngularMaterialModule} from '../angular-material.module';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {CowCreateComponent} from './cow-create/cow-create.component';
import {CowListComponent} from './cow-list/cow-list.component';


@NgModule({
  declarations: [
    CowCreateComponent,
    CowListComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class CowsModule {}
