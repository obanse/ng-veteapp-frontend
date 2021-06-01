import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CcControlListComponent} from './cc-control-list/cc-control-list.component';
import {AuthGuard} from '../auth/auth.guard';
import {CcControlCreateComponent} from './cc-control-create/cc-control-create.component';
import {CcControlCaptureComponent} from './cc-control-capture/cc-control-capture.component';

const routes: Routes = [
  {path: '', component: CcControlListComponent},
  {path: 'create', component: CcControlCreateComponent, canActivate: [AuthGuard]},
  {path: 'capture/:cccId', component: CcControlCaptureComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class CcControlRoutingModule {}
