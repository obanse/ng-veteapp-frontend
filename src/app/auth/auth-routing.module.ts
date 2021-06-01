import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

const routes: Routes =[
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'update/:userId', component: RegisterComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class AuthRoutingModule {}
