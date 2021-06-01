import {NgModule} from '@angular/core';
import {AngularMaterialModule} from '../angular-material.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MainGridComponent} from './main-grid.component';

@NgModule({
  declarations: [
    MainGridComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    RouterModule
  ]
})
export class MainGridModule {}
