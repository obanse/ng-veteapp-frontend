import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './auth/auth.guard';
import {MainGridComponent} from './maingrid/main-grid.component';

const routes: Routes = [
  {path: '', component: MainGridComponent, canActivate: [AuthGuard]},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'companies', loadChildren: () => import('./companies/company.module').then(m => m.CompanyModule)},
  {path: 'cc-controls', loadChildren: () => import('./cc-controls/cc-control.module').then(m => m.CcControlModule)}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
