import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularMaterialModule} from './angular-material.module';
import {HeaderComponent} from './header/header.component';
import {CompanyModule} from './companies/company.module';
import {ErrorComponent} from './error/error.component';

import {AuthInterceptor} from './auth/auth-interceptor';
import {ErrorInterceptor} from './error-interceptor';
import {MainGridModule} from './maingrid/main-grid.module';
import {CcControlModule} from './cc-controls/cc-control.module';

import {LOCALE_ID, NgModule} from '@angular/core';
import '@angular/common/locales/global/de';
import localDe from '@angular/common/locales/de';
import {registerLocaleData} from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HeaderComponent
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CompanyModule,
    CcControlModule,
    HttpClientModule,
    MainGridModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'de'},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ],
  bootstrap: [AppComponent],
  // entryComponents: [ErrorComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localDe);
  }
}
