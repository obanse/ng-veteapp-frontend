import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CcControl} from '../cc-control.model';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {CcControlService} from '../cc-control.service';
import {AuthService} from '../../auth/auth.service';
import {CattleService} from '../../cattle/cattle.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-cc-control-list',
  templateUrl: './cc-control-list.component.html',
  styleUrls: ['./cc-control-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class CcControlListComponent implements OnInit, OnDestroy {

  isLoading = false;
  ccControls: CcControl[] = [];
  dataSource: MatTableDataSource<CcControl>;
  totalCcControls = 0;
  ccControlsPerPage = 10;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['firma', 'dateFrom', 'options'];
  columnsToDisplay: string[] = ['dateFrom', 'dateTo'];
  expandedElement: CcControl | null;
  filterValue = '';

  userIsAuthenticated = false;
  userIsHitUser = false;

  private ccControlSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(public cattleService: CattleService,
              public ccControlService: CcControlService,
              // private dp: DatePipe,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.ccControlService.getAll(this.ccControlsPerPage, this.currentPage);
    this.ccControlSubscription = this.ccControlService.getCcControlUpdateListener()
      .subscribe((ccControlData: {ccControls: CcControl[], countCcControls: number}) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<CcControl>(ccControlData.ccControls);
        this.totalCcControls = ccControlData.countCcControls;
        this.applyFilter(this.ccControlService.getFilter());
        this.ccControlService.setFilter('');
      });
    this.userIsAuthenticated = this.authService.getAuthState();
    this.userIsHitUser = this.authService.getUserIsHitUser();
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userIsHitUser = this.authService.getUserIsHitUser();
      });
  }

  onFetchBestreg(cccId: string, dateFrom: string, dateTo: string, bnrId: string): void {
    this.isLoading = true;
    if (!dateTo) { dateTo = dateFrom; }
    // Bestandregister holen vom HIT
    this.ccControlService.fetchBestreg(cccId, dateFrom, dateTo, bnrId);
  }

  onDelete(ccControlId: string): void {
    this.isLoading = true;
    this.cattleService.removeAllByCccId(ccControlId).subscribe(() => {
      this.ccControlService.remove(ccControlId).subscribe(() => {
        this.ccControlService.getAll(this.ccControlsPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      });
    });
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.ccControlsPerPage = pageData.pageSize;
    this.ccControlService.getAll(this.ccControlsPerPage, this.currentPage);
  }

  applyFilter(event: KeyboardEvent | string): void {
    if (typeof event === 'string') {
      this.filterValue = event;
    } else {
      this.filterValue = (event.target as HTMLInputElement).value;
    }
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.ccControlSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }

  onStartControl(cccId: string): void {
    this.ccControlService.setStart(cccId);
  }

  onFinishControl(cccId: string): void {
    this.ccControlService.setFinish(cccId);
  }

  onTest(): void {
    alert('not yet implemented');
  }
}
