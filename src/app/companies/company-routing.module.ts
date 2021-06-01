import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CompanyListComponent} from './company-list/company-list.component';
import {AuthGuard} from '../auth/auth.guard';

const routes: Routes = [
  {path: '', component: CompanyListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class CompanyRoutingModule {}
