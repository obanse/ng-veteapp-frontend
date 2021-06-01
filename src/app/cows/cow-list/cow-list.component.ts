import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Subscription} from 'rxjs';

import {Cow} from '../cow.model';
import {CowsService} from '../cows.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-cow-list',
  templateUrl: './cow-list.component.html',
  styleUrls: [ './cow-list.component.css' ]
})
export class CowListComponent implements OnInit, OnDestroy {

  isLoading = false;

  cows: Cow[] = [];
  totalCows = 0;
  cowsPerPage = 10;
  currentPage = 1;
  pageSizeOpts: number[] = [ 5, 10, 25, 50, 100 ];
  userIsAuthenticated = false;
  userId: string;
  private cowsSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(public cowsService: CowsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.cowsService.getCows(this.cowsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.cowsSubscription = this.cowsService.getCowUpdateListener()
      .subscribe((cowData: { cows: Cow[], countCows: number }) => {
        this.isLoading = false;
        this.cows = cowData.cows;
        this.totalCows = cowData.countCows;
      });
    this.userIsAuthenticated = this.authService.getAuthState();
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
    });
  }

  onDelete(cowId: string): void {
    this.isLoading = true;
    this.cowsService.deleteCow(cowId).subscribe(() => {
      this.cowsService.getCows(this.cowsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.cowsPerPage = pageData.pageSize;
    this.cowsService.getCows(this.cowsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.cowsSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
}

