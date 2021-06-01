import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  private authListenerSubscription: Subscription;

  mobileQuery: MediaQueryList;
  private readonly mobileQueryListener: () => void;

  constructor(private authService: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getAuthState();
    this.authListenerSubscription = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

}
