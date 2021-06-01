import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import {Company} from '../company.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs';
import {CompanyService} from '../company.service';
import {AuthService} from '../../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-company-list',
  styleUrls: [ './company-list.component.css'],
  templateUrl: './company-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class CompanyListComponent implements OnInit, OnDestroy {

  isLoading = false;
  companies: Company[] = [];
  dataSource: MatTableDataSource<Company>;
  totalCompanies = 0;
  companiesPerPage = 10;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = [ 'bnr', 'firma' ];
  columnsToDisplay: string[] = [ 'bnr', 'firma', 'str', 'plz', 'ort' ];
  expandedElement: Company | null;
  filterValue: string;

  userIsAuthenticated = false;
  userIsHitUser = false;

  private companySubscription: Subscription;
  private authStatusSubscription: Subscription;
  formImport: FormGroup;

  constructor(public companyService: CompanyService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.companyService.getAll(this.companiesPerPage, this.currentPage);
    this.companySubscription = this.companyService.getCompanyUpdateListener()
      .subscribe((companyData: { companies: Company[], countCompanies: number}) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<Company>(companyData.companies);
        this.totalCompanies = companyData.countCompanies;
      });
    this.userIsAuthenticated = this.authService.getAuthState();
    this.userIsHitUser = this.authService.getUserIsHitUser();
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.formImport = new FormGroup({
      bnr: new FormControl(null, {validators: [
          Validators.required,
          Validators.maxLength(18),
          Validators.minLength(12),
          Validators.pattern('[0-9 ]{12,15}')
        ]}),
    });
  }

  onImportCompany(): void {
    if (this.formImport.invalid) { return; }
    this.isLoading = true;

    const bnr = this.formImport.value.bnr.replace(/\s+/g, '');

    this.companyService.getHitCompany(bnr).subscribe(hitResult => {
      const companyData: Company = {
          ...hitResult.data
      };
      this.companyService.create(companyData).subscribe(result => {
        console.log(result.message);
        this.formImport.reset();
        this.companyService.getAll(this.companiesPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      });
    });
  }

  onDelete(companyId: string): void {
    this.isLoading = true;
    this.companyService.remove(companyId).subscribe(() => {
      this.companyService.getAll(this.companiesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.companiesPerPage = pageData.pageSize;
    this.companyService.getAll(this.companiesPerPage, this.currentPage);
  }

  applyFilter(event: KeyboardEvent): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.companySubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
}
